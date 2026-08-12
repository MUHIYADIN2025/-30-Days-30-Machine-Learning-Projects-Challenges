# Day 28: Biomedical Named Entity Recognition (NER) App

A full-stack application for extracting biomedical entities (medications, diseases, anatomical parts, dosages, and clinical terms) from unstructured medical text using Hugging Face Transformers, a FastAPI REST API, and a React frontend.

---

## Features

* **Pre-trained Biomedical Model**: Uses `d4data/biomedical-ner-all` to classify complex medical terms in real time.
* **FastAPI Backend**: Provides lightweight, asynchronous endpoints for model inference with automatic CORS support and request validation.
* **React Frontend**: Clean, responsive UI for inputting text, triggering inference, and visualizing extracted entity tags alongside confidence scores.

---

## Project Structure

```text
Day_28/
├── backend/
│   └── app.py            # FastAPI backend server & inference pipeline
├── frontend/
│   ├── src/
│   │   └── App.jsx       # React UI for entering text and visualizing entities
│   └── package.json
├── Day_28.ipynb          # Notebook for model exploration and testing
└── README.md
Getting Started
Prerequisites
Python: 3.10 or higher

Node.js: v18 or higher & npm

1. Backend Setup
Open a terminal and navigate to the backend directory:

Bash
cd backend
Install Python dependencies:

Bash
pip install fastapi uvicorn pydantic transformers torch
Start the FastAPI server:

Bash
python app.py
The backend will run on http://localhost:8000. On the first run, Hugging Face will automatically download the pre-trained model weights.

2. Frontend Setup
Open a new terminal window and navigate to the frontend directory:

Bash
cd frontend
Install Node packages:

Bash
npm install
Launch the React development server:

Bash
npm run dev
Open the URL output by Vite (typically http://localhost:5173) in your browser.

API Reference
POST /predict
Extracts biomedical entities from input text.

Request Body:

JSON
{
  "text": "Patient was prescribed Aspirin 100mg for headache."
}
Response:

JSON
{
  "entities": [
    {
      "entity": "Sign_symptom",
      "word": "headache",
      "score": 0.985,
      "start": 40,
      "end": 48
    },
    {
      "entity": "Medication",
      "word": "Aspirin",
      "score": 0.992,
      "start": 23,
      "end": 30
    }
  ]
}
Tech Stack
Machine Learning: Hugging Face transformers, PyTorch, BioBERT

Backend: FastAPI, Uvicorn, Pydantic

Frontend: React, Vite, JavaScript (ES6+)