import os
import joblib
import librosa
import numpy as np
import tempfile
from fastapi import FastAPI, UploadFile, File, HTTPException
from pydantic import BaseModel
from typing import Dict

app = FastAPI(title="Music Genre Classifier API")

# Load model and scaler at startup
try:
    model = joblib.load("music_genre_model.pkl")
    scaler = joblib.load("scaler.pkl")
except Exception as e:
    raise RuntimeError(f"Could not load model files: {e}")


def extract_features_from_audio(file_path: str):
    """Extract GTZAN-compatible audio features using librosa."""
    y, sr = librosa.load(file_path, duration=30)

    chroma_stft = librosa.feature.chroma_stft(y=y, sr=sr)
    rms = librosa.feature.rms(y=y)
    spectral_centroid = librosa.feature.spectral_centroid(y=y, sr=sr)
    spectral_bandwidth = librosa.feature.spectral_bandwidth(y=y, sr=sr)
    rolloff = librosa.feature.spectral_rolloff(y=y, sr=sr)
    zero_crossing_rate = librosa.feature.zero_crossing_rate(y)

    harmony, perceptr = librosa.effects.harmonic(y), librosa.effects.percussive(y)
    tempo, _ = librosa.beat.beat_track(y=y, sr=sr)

    mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=20)

    features = [
        np.mean(chroma_stft), np.var(chroma_stft),
        np.mean(rms), np.var(rms),
        np.mean(spectral_centroid), np.var(spectral_centroid),
        np.mean(spectral_bandwidth), np.var(spectral_bandwidth),
        np.mean(rolloff), np.var(rolloff),
        np.mean(zero_crossing_rate), np.var(zero_crossing_rate),
        np.mean(harmony), np.var(harmony),
        np.mean(perceptr), np.var(perceptr),
        float(tempo)
    ]

    for i in range(20):
        features.append(np.mean(mfccs[i]))
        features.append(np.var(mfccs[i]))

    return np.array(features).reshape(1, -1)


@app.get("/")
def root():
    return {"status": "API is running"}


@app.post("/predict")
async def predict_genre(file: UploadFile = File(...)):
    if not file.filename.endswith(('.wav', '.mp3')):
        raise HTTPException(status_code=400, detail="Only .wav and .mp3 files are supported.")

    # Write uploaded stream to temporary file on disk for librosa processing
    suffix = os.path.splitext(file.filename)[1]
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        content = await file.read()
        tmp.write(content)
        tmp_path = tmp.name

    try:
        features = extract_features_from_audio(tmp_path)
        features_scaled = scaler.transform(features)

        prediction = model.predict(features_scaled)[0]
        probabilities = model.predict_proba(features_scaled)[0]
        classes = model.classes_

        prob_dict = {cls: float(prob) for cls, prob in zip(classes, probabilities)}

        return {
            "prediction": str(prediction),
            "probabilities": prob_dict
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing audio: {str(e)}")

    finally:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)