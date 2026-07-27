import io
import requests
import librosa
import numpy as np
import pandas as pd
import streamlit as st
import matplotlib.pyplot as plt
import seaborn as sns

API_URL = "http://127.0.0.1:8000/predict"

st.set_page_config(
    page_title="Music Genre Classifier",
    page_icon="🎵",
    layout="wide"
)

st.title("🎵 Music Genre Classification Dashboard")
st.markdown("Upload an audio file to send it to the ML backend API for genre prediction.")

uploaded_file = st.file_uploader("Choose an audio file (.wav, .mp3)", type=["wav", "mp3"])

if uploaded_file is not None:
    bytes_data = uploaded_file.getvalue()

    col1, col2 = st.columns([1, 1])

    with col1:
        st.subheader("🎧 Audio Player")
        st.audio(bytes_data, format=f"audio/{uploaded_file.type.split('/')[-1]}")

        with st.spinner("Sending audio to Backend API for prediction..."):
            try:
                files = {"file": (uploaded_file.name, bytes_data, uploaded_file.type)}
                response = requests.post(API_URL, files=files)

                if response.status_code == 200:
                    result = response.json()
                    predicted_genre = result["prediction"]
                    probabilities = result["probabilities"]

                    st.success(f"**Predicted Genre:** `{predicted_genre.upper()}`")
                else:
                    st.error(f"API Error: {response.json().get('detail', 'Unknown error')}")
                    st.stop()

            except requests.exceptions.ConnectionError:
                st.error("Could not connect to FastAPI server. Ensure `main.py` is running on http://127.0.0.1:8000.")
                st.stop()

    with col2:
        st.subheader("📊 Waveform Plot")
        # Load audio stream into memory for local waveform rendering
        audio_stream = io.BytesIO(bytes_data)
        y, sr = librosa.load(audio_stream, duration=30)
        
        fig, ax = plt.subplots(figsize=(8, 3))
        librosa.display.waveshow(y, sr=sr, ax=ax, color='teal')
        ax.set_title("Audio Waveform")
        st.pyplot(fig)

    st.markdown("---")

    # Genre Confidence Breakdown Chart
    st.subheader("📈 Prediction Probabilities")
    prob_df = pd.DataFrame(list(probabilities.items()), columns=['Genre', 'Probability'])
    prob_df = prob_df.sort_values(by='Probability', ascending=False)

    fig_bar, ax_bar = plt.subplots(figsize=(10, 4))
    sns.barplot(x='Probability', y='Genre', data=prob_df, palette='magma', ax=ax_bar)
    ax_bar.set_title("Genre Confidence Levels")
    st.pyplot(fig_bar)