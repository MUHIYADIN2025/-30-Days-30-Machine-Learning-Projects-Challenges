Day 2 — Iris Species Classification (Logistic Regression)

Overview

This project builds a multi-class classifier that predicts the species of an
Iris flower (setosa, versicolor, or virginica) from four measurements:
sepal length, sepal width, petal length, and petal width — all in centimeters.

Where Day 1 solved a regression problem (predicting a continuous house price),
Day 2 solves a classification problem (predicting a category) using
Logistic Regression on the classic Iris dataset.

Project Structure

Day_2/
├── Day_2.ipynb          # Original notebook: data prep, training, evaluation
├── train_model.py       # Standalone script that trains and exports the model
├── main.py               # FastAPI backend serving the model
├── requirements.txt      # Python dependencies
├── model.joblib          # Trained model artifact (generated, not committed)
└── frontend/              # React (Vite) UI that calls the API

Machine Learning Approach


Dataset: sklearn.datasets.load_iris — 150 samples, 4 features, 3 balanced classes.
Split: 80% train / 20% validation, random_state=42 for reproducibility.
Model: LogisticRegression(max_iter=200) — the default max_iter=100 wasn't
enough for the solver to converge on this feature scale, so it was increased.
Evaluation: accuracy score, confusion matrix, and a full classification
report (precision/recall/F1 per class), printed by train_model.py.


Backend (FastAPI)

Setup

powershellcd Day_2
py -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
py train_model.py

train_model.py prints accuracy and a classification report, then saves the
trained model to model.joblib.

Run the API

powershelluvicorn main:app --reload --host 0.0.0.0


GitHub Profile: https://github.com/MUHIYADIN2025