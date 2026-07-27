# 🎵 Day 13: Full-Stack Audio Music Genre Classifier

A full-stack machine learning application that predicts the genre of audio tracks in real-time. Built as part of the **30-Day Machine Learning Projects Challenge**, this project decouples model inference into a dedicated **FastAPI REST API** backend and uses **Streamlit** for an interactive web dashboard.

**Author:** Muhiadin Said Hassan
**Series:** 30 Days 30 Machine Learning Projects Challenge

---

## Table of Contents

- [Overview & Architecture](#-overview--architecture)
- [How It Works](#-how-it-works)
- [Project Structure](#project-structure)
- [Getting Started](#-getting-started)
- [API Reference](#-api-reference)
- [Features](#-features)
- [Known Limitations & Future Improvements](#known-limitations--future-improvements)
- [Author](#-author)

---

## 🌟 Overview & Architecture

Unlike simple monolithic scripts, this project is structured following modern software engineering practices, separating concerns across three independent layers:

1. **Decoupled System Design** — the frontend UI and backend inference engine run as separate processes communicating over HTTP. This means the model can be redeployed, scaled, or swapped independently of the UI, and the same backend could serve other clients (a mobile app, a batch job) without any changes.
2. **Real-Time Audio Analysis** — uses `librosa` to parse uploaded `.wav` or `.mp3` files, extract spectral and temporal audio characteristics (e.g. MFCCs, spectral centroid, zero-crossing rate, tempo), and standardize them into the same feature representation the model was trained on.
3. **Automated ML Pipeline** — a single training script fetches the GTZAN dataset, trains a **Random Forest Classifier**, fits a **StandardScaler** on the extracted features, and exports both as versioned artifacts (`music_genre_model.pkl`, `scaler.pkl`) ready for the API to load at startup.

### Why a Random Forest here?

Audio feature vectors extracted by `librosa` (MFCC means/variances, spectral features, tempo) are tabular and moderately high-dimensional but not enormous in row count for a GTZAN-sized dataset. A Random Forest handles this well: it's robust to differing feature scales, resistant to overfitting on a relatively small dataset (1,000 tracks across 10 genres), and — unlike a deep audio model — trains in seconds on CPU with no GPU dependency, which keeps the whole pipeline reproducible on any machine.

## 🔬 How It Works

**Training pipeline (`train_and_export.py`):**
1. Downloads/loads the GTZAN dataset (10 genres × 100 thirty-second clips).
2. Extracts audio features per clip using `librosa` (MFCCs, chroma, spectral contrast, tempo, zero-crossing rate, etc.).
3. Splits data into train/test sets and fits a `StandardScaler` on the training features.
4. Trains a `RandomForestClassifier` on the scaled features.
5. Serializes both the fitted scaler and the trained model to `backend/scaler.pkl` and `backend/music_genre_model.pkl` using `joblib`.

**Inference pipeline (`backend/main.py` → FastAPI):**
1. Loads `music_genre_model.pkl` and `scaler.pkl` once at server startup.
2. Accepts an uploaded audio file via a REST endpoint.
3. Runs the same `librosa` feature extraction used during training, so the feature vector matches the training distribution exactly.
4. Scales the feature vector with the saved `scaler.pkl` (never re-fit at inference time — this would silently corrupt predictions).
5. Runs `model.predict()` / `model.predict_proba()` and returns the predicted genre with confidence scores as JSON.

**Frontend (`frontend/app.py` → Streamlit):**
1. Provides a file upload widget for `.wav`/`.mp3` files.
2. Sends the uploaded file to the FastAPI backend's prediction endpoint.
3. Renders the predicted genre and per-class confidence scores, typically as a bar chart.

## Project Structure

```text
Day_13/
│
├── backend/                        # API & Inference Engine
│   ├── main.py                     # FastAPI server & route handlers
│   ├── music_genre_model.pkl       # Serialized Random Forest Classifier
│   └── scaler.pkl                  # Serialized StandardScaler object
│
├── frontend/                       # Client Dashboard
│   └── app.py                      # Streamlit interactive UI & visualizer
│
├── Day_13.ipynb                    # Exploratory Data Analysis (EDA) Notebook
├── train_and_export.py             # ML pipeline execution & artifact generator
└── README.md                       # Project documentation
```

## 🚀 Getting Started

### 1. Prerequisites & Installation

Ensure you have Python 3.11+ installed. Install all required dependencies by running:

```powershell
py -m pip install fastapi uvicorn streamlit scikit-learn pandas numpy joblib librosa soundfile
```

> **Note:** `librosa` depends on `soundfile`/`libsndfile` under the hood for audio decoding. If you hit an import error related to `libsndfile` on Windows, reinstalling `soundfile` (`py -m pip install --force-reinstall soundfile`) usually resolves it.

### 2. Train and Export Model Artifacts

Run the training pipeline script to download the GTZAN dataset, train the classifier, and export `music_genre_model.pkl` and `scaler.pkl` directly into the `backend/` folder:

```powershell
py train_and_export.py
```

This step only needs to be run once (or whenever you want to retrain on updated data) — the backend loads the saved artifacts on every subsequent startup instead of retraining.

### 3. Launch the FastAPI Backend Server

Open a terminal window and start the Uvicorn server:

```powershell
cd backend
py -m uvicorn main:app --reload --port 8000
```

The API will be available at `http://127.0.0.1:8000`. You can inspect the interactive Swagger API documentation at `http://127.0.0.1:8000/docs`.

### 4. Launch the Streamlit Frontend Interface

Open a **second** terminal window (keep the backend running in the first) and run the user interface:

```powershell
cd frontend
py -m streamlit run app.py
```

The Streamlit web interface will open automatically in your browser at `http://localhost:8501`.

## 📡 API Reference

While the exact route names depend on your `backend/main.py` implementation, the typical contract for this kind of service is:

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` or `/health` | Confirms the API is running and model artifacts loaded successfully |
| `POST` | `/predict` | Accepts an uploaded audio file (`.wav`/`.mp3`), returns predicted genre + confidence scores |

**Example response shape:**
```json
{
  "predicted_genre": "jazz",
  "confidence": 0.82,
  "genre_probabilities": {
    "blues": 0.04,
    "classical": 0.02,
    "country": 0.01,
    "disco": 0.01,
    "hiphop": 0.02,
    "jazz": 0.82,
    "metal": 0.01,
    "pop": 0.03,
    "reggae": 0.02,
    "rock": 0.02
  }
}
```

## 🔍 Features

- **Automated Feature Scaling** — standardizes audio feature arrays using a pre-trained `StandardScaler`, ensuring inference-time features match the distribution the model was trained on.
- **Genre Inference** — classifies audio input into 10 GTZAN music genres (blues, classical, country, disco, hiphop, jazz, metal, pop, reggae, rock).
- **Interactive UI** — upload audio files to receive real-time model predictions and per-genre confidence scores.
- **Decoupled Architecture** — backend and frontend can be deployed, scaled, or replaced independently.

## Known Limitations & Future Improvements

- **Dataset size and scope** — GTZAN contains only 100 clips per genre (1,000 total), which limits generalization to audio outside its recording conditions/era. Expect lower real-world accuracy on modern production audio than on GTZAN's own test split.
- **No confidence threshold / "unknown" handling** — the model will always return its most confident genre, even for audio that doesn't clearly belong to any of the 10 classes (e.g. spoken word, ambient noise). Consider adding a confidence floor below which the API returns "uncertain" instead of forcing a genre.
- **Synchronous audio processing** — feature extraction with `librosa` runs synchronously in the request path, which can make `/predict` slow for longer audio files. For production use, consider trimming/sampling a fixed-length window (e.g. the first 30 seconds) rather than processing the full file.
- **No authentication or rate limiting** — as with any locally-run FastAPI service, add an API key or rate limiting before exposing this beyond local development.
- **Model versioning** — there's currently no version tag on the saved `.pkl` artifacts; if you retrain with a different feature set, older artifacts could silently become incompatible with a newer `main.py`. Consider embedding a feature-schema version in the saved model metadata.

## 👨‍💻 Author

**Muhiadin Said Hassan**
Developed as part of the 30-Day Machine Learning Projects Challenge.

- **GitHub:** https://github.com/MUHIYADIN2025
- **Email:** muhidiin090448@gmail.com