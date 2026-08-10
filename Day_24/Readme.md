# 🎬 Day 24: IMDB Movie Review Sentiment Analysis System

![Python](https://img.shields.io/badge/Python-3.8%2B-blue?logo=python&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-2.x-black?logo=flask&logoColor=white)
![Scikit-Learn](https://img.shields.io/badge/scikit--learn-F7931E?logo=scikit-learn&logoColor=white)
![JavaScript](https://img.shields.io/badge/Frontend-HTML5%20%7C%20CSS3%20%7C%20JS-orange)

An end-to-end Machine Learning web application that classifies IMDB movie
reviews as **Positive** or **Negative**. The system features a decoupled
architecture with a Python ML pipeline, a Flask REST API backend, and a
modern responsive frontend.

---

## 📐 System Architecture

```
┌──────────────────┐        HTTP POST         ┌───────────────────────┐
│                  │   (/predict Request)     │                       │
│   Web Frontend   │ ────────────────────────>│   Flask REST Backend  │
│   (index.html)   │                           │       (app.py)       │
│                  │ <────────────────────────│                       │
└──────────────────┘      JSON Response        └───────────┬───────────┘
                                                             │
                                                 Preprocess & Predict
                                                             │
                                                 ┌───────────▼───────────┐
                                                 │  Serialized Artifacts  │
                                                 │  - Model (.pkl)        │
                                                 │  - Vectorizer (.pkl)   │
                                                 └────────────────────────┘
```

---

## ✨ Features

- **Text Preprocessing**: Automated cleaning pipeline using HTML tag
  removal, punctuation filtering, lowercasing, stop-word removal, and
  Porter Stemming (via NLTK).
- **Feature Extraction**: TF-IDF (Term Frequency–Inverse Document
  Frequency) vectorization with 5,000 max features.
- **Classification Model**: Logistic Regression binary classifier.
- **REST API Server**: Lightweight Flask API with Cross-Origin Resource
  Sharing (CORS) support.
- **Interactive Web Interface**: Clean UI built with asynchronous `fetch`
  calls for real-time inference without reloading the page.

---

## 📁 Repository Structure

```text
Day_24/
│
├── train_and_export.py     # Model training and artifact serialization script
├── app.py                  # Flask API server for real-time inference
├── index.html               # Interactive frontend UI
├── IMDB Dataset.csv         # Dataset (50,000 movie reviews)
├── sentiment_model.pkl       # Exported Logistic Regression model artifact
├── tfidf_vectorizer.pkl       # Exported TF-IDF Vectorizer artifact
└── README.md                 # Project documentation
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites

Ensure you have Python 3.8+ installed on your system.

### 2. Install Dependencies

Install the required Python packages:

```bash
pip install pandas scikit-learn nltk flask flask-cors joblib
```

Download the required NLTK resources:

```bash
python -c "import nltk; nltk.download('punkt'); nltk.download('punkt_tab'); nltk.download('stopwords')"
```

### 3. Training & Artifact Export

If you do not have the pre-trained `.pkl` files, or want to retrain the
model, execute the training script:

```bash
python train_and_export.py
```

This generates `sentiment_model.pkl` and `tfidf_vectorizer.pkl` in the
current directory.

### 4. Running the Backend Server

Start the Flask REST API on port 5000:

```bash
python app.py
```

Leave this terminal window running. You should see:

```
* Running on http://127.0.0.1:5000/ (Press CTRL+C to quit)
```

### 5. Launching the Frontend

Open `index.html` in your web browser (or serve it via a local development
server on port 3000/8080). Type or paste any movie review into the text box
and click **Analyze Sentiment**.

---

## 📡 API Reference

### `POST /predict`

Analyzes input text and returns the predicted sentiment along with class
probabilities.

**Request Body (JSON)**
```json
{
  "review": "The Martian was a visual masterpiece with an incredible performance by Matt Damon."
}
```

**Success Response (200 OK)**
```json
{
  "review": "The Martian was a visual masterpiece with an incredible performance by Matt Damon.",
  "sentiment": "positive",
  "probabilities": {
    "negative": 0.0412,
    "positive": 0.9588
  }
}
```

**Error Response (400 Bad Request)**
```json
{
  "error": "Empty review input."
}
```

---

## 🛠️ Troubleshooting

| Issue | Cause | Solution |
|---|---|---|
| Unable to connect to the backend server | Flask server (`app.py`) is not running or running on a different port. | Run `python app.py` and ensure the API URL in `index.html` matches `http://127.0.0.1:5000/predict`. |
| `FileNotFoundError: sentiment_model.pkl` | Model artifacts haven't been exported yet. | Run `python train_and_export.py` first. |
| `Resource punkt_tab not found` | Missing NLTK tokenizer files. | Run `python -c "import nltk; nltk.download('punkt_tab')"` in your terminal. |
| CORS Blocked Error | Cross-origin requests are disabled in Flask. | Ensure `flask_cors` is installed and `CORS(app)` is declared in `app.py`. |

---

## Known Limitations

- **TF-IDF + Logistic Regression has no understanding of context, sarcasm,
  or negation depth** (e.g. "not bad at all" vs. "not good at all" can
  confuse bag-of-words-style models more than context-aware models).
- **Porter Stemming is a crude, rule-based technique** — it can merge
  words with different meanings (e.g. "universal" and "university" both
  stem toward "univers") or fail to normalize irregular forms, which
  introduces some noise into the feature space.
- **5,000 max TF-IDF features** caps the vocabulary the model can draw on;
  rare but sentiment-bearing words outside this set are invisible to the
  classifier.
- **No accuracy/precision/recall figures are documented yet** — add these
  from your `train_and_export.py` run output (e.g. via
  `classification_report`) to give this README a concrete, evidence-backed
  Results section rather than relying on the single example above.

## Possible Next Steps

- Report full evaluation metrics (accuracy, precision, recall, F1,
  confusion matrix) from the held-out validation set.
- Compare TF-IDF + Logistic Regression against a more context-aware
  approach (e.g. a pretrained transformer embedding) to quantify how much
  accuracy is being left on the table by the bag-of-words approach.
- Add input length limits and basic sanitization on the frontend, since
  very long reviews will scale prediction latency with input size.

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---

**Prepared by Muhiadin Said Hassan**
GitHub Profile: [https://github.com/MUHIYADIN2025](https://github.com/MUHIYADIN2025)