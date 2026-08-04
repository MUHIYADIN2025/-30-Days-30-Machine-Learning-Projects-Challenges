# 🎓 Day 22: Scholarship Eligibility Prediction using K-Nearest Neighbors (KNN)

A full-stack Machine Learning web application that predicts a student's eligibility for a scholarship based on academic performance, financial background, social indicators, and disciplinary history.

The application leverages **FastAPI** for real-time model training and inference via REST endpoints, paired with a modern, responsive **Tailwind CSS** dashboard for user interaction.

This project is part of the **30 Days 30 Machine Learning Projects Challenge**.

**Author:** Muhiadin Said Hassan

> ⚠️ **Not a real eligibility system.** This is an educational project. Any system that influences real access to financial aid or education must be reviewed for fairness across social and demographic groups before real-world use. See [Important Disclaimer](#️-important-disclaimer).

---

## Table of Contents

- [Project Overview](#-project-overview)
- [Directory Structure](#-directory-structure)
- [Tech Stack & Key Components](#️-tech-stack--key-components)
- [Machine Learning Workflow & Concepts](#️-machine-learning-workflow--concepts)
- [Why KNN, and Why k = 5?](#why-knn-and-why-k--5)
- [Getting Started](#-getting-started)
- [API Endpoints Reference](#-api-endpoints-reference)
- [Known Limitations & Future Improvements](#known-limitations--future-improvements)
- [Important Disclaimer](#️-important-disclaimer)
- [License](#-license)
- [Author](#-author)

---

## 📌 Project Overview

Predicting scholarship eligibility involves non-linear relationships between quantitative variables (e.g., GPA, family income) and qualitative/categorical attributes (e.g., orphan status, community service, disciplinary records).

This project implements **K-Nearest Neighbors (KNN)** classification with **Standard Scaling**, ensuring distance calculations across different feature scales (such as income in thousands vs. GPA on a 0–4 scale) remain accurate and unbiased.

## 📁 Directory Structure

```text
Day_22/
├── backend/
│   ├── app.py              # FastAPI application & model pipeline
│   └── schlerships.csv     # Training dataset
├── frontend/
│   └── index.html          # Tailwind CSS web UI dashboard
├── Day_22.ipynb            # EDA, model experimentation & prototyping notebook
└── README.md               # Project documentation
```

## 🛠️ Tech Stack & Key Components

- **Jupyter Notebook** (`Day_22.ipynb`): Data exploration (EDA), hyperparameter tuning (k-value selection), and confusion matrix analysis.
- **Frontend** (`frontend/index.html`): Modern UI built with HTML5, Fetch API, and Tailwind CSS.
- **Backend** (`backend/app.py`): REST API powered by Python, FastAPI, Uvicorn, and Pydantic.
- **Machine Learning Pipeline:** `scikit-learn` (`KNeighborsClassifier`, `StandardScaler`, `train_test_split`), `pandas`.

## ⚙️ Machine Learning Workflow & Concepts

```text
┌─────────────────┐     ┌──────────────────┐     ┌──────────────────────┐     ┌─────────────────┐
│  schlerships.csv │ ──> │ Feature Encoding │ ──> │ Standard Scaling     │ ──> │ KNN Classifier  │
│  Dataset        │     │ (One-Hot / Dummies)│     │ z = (x - μ) / σ      │     │ (k = 5)         │
└─────────────────┘     └──────────────────┘     └──────────────────────┘     └─────────────────┘
```

### 1. Exploratory Data Analysis (`Day_22.ipynb`)

Before deploying the API, feature distributions and categorical relationships were evaluated inside `Day_22.ipynb`. This helped determine feature importance, clean duplicate rows, and confirm k = 5 as the optimal number of neighbors.

### 2. Feature Encoding

Categorical string fields (`Orphanage`, `Disability`, `Community_Service`, `Extracurricular_Activities`, `Disciplinary_Record`) are converted into binary indicators via One-Hot Encoding (`pd.get_dummies`) to ensure standard numeric vector representations.

### 3. Feature Scaling

KNN utilizes Euclidean distance calculations:

**d(p, q) = √(Σ(pᵢ − qᵢ)²)**

Because `Family_Income_USD` scales in thousands while `GPA` operates between 0.0 and 4.0, StandardScaler transforms features so they share a mean (μ) of 0 and a variance (σ²) of 1:

**z = (x − μ) / σ**

Without this step, `Family_Income_USD` would dominate the distance calculation purely because of its larger numeric range — not because it's actually more important to eligibility — and GPA's genuine signal would be effectively drowned out.

## Why KNN, and Why k = 5?

KNN is a natural fit for this kind of eligibility decision because it's fundamentally **case-based reasoning**: a new applicant is classified by looking at the k most similar past applicants (by scaled feature distance) and taking a majority vote of their outcomes. This mirrors how scholarship committees often reason intuitively ("this student's profile looks similar to others we've approved"), which makes KNN's decision logic easier to explain to a non-technical stakeholder than many other classifiers.

**Why k = 5 specifically:** k controls a direct bias-variance tradeoff. A very small k (e.g., k = 1) makes predictions highly sensitive to noise or mislabeled individual records — a single unusual past applicant could swing a new prediction. A very large k oversmooths the decision boundary and risks diluting genuinely local patterns in the data. k = 5 was selected empirically in `Day_22.ipynb` (via cross-validation / accuracy comparison across candidate k values) as the point that balanced these two failure modes on this dataset — it is a data-driven choice, not an arbitrary default.

## 🚀 Getting Started

### Prerequisites

Ensure Python 3.8+ is installed. Install required packages:

```bash
pip install fastapi uvicorn pandas scikit-learn
```

### Step 1: Run Jupyter Notebook (Optional)

If you want to view the model experimentation or reproduce the data visualization:

```bash
jupyter notebook Day_22.ipynb
```

### Step 2: Launch Backend API

Open a terminal and navigate to the backend directory:

```bash
cd Day_22/backend
```

Start the Uvicorn server:

```bash
py -m uvicorn app:app --reload --port 8000
```

Access interactive Swagger API documentation at `http://127.0.0.1:8000/docs`.

### Step 3: Launch Frontend Server

Open a new terminal tab and navigate to the frontend directory:

```bash
cd Day_22/frontend
```

Start a simple static web server:

```bash
py -m http.server 3000
```

Open `http://localhost:3000` in your web browser to interact with the model.

## 🔌 API Endpoints Reference

### `GET /api/metrics`

Returns validation metrics evaluated on startup.

**Response Example:**
```json
{
  "accuracy": 0.925,
  "f1_score": 0.918,
  "k_neighbors": 5
}
```

### `POST /api/predict`

Evaluates student attributes and returns scholarship eligibility status.

**Request Payload:**
```json
{
  "GPA": 3.8,
  "Family_Income_USD": 120,
  "Orphanage": "Yes",
  "Disability": "No",
  "Community_Service": "Yes",
  "Extracurricular_Activities": "Yes",
  "Disciplinary_Record": "No"
}
```

**Response Payload:**
```json
{
  "eligibility_code": 1,
  "status": "Eligible for Scholarship",
  "confidence": 80.0
}
```

## Known Limitations & Future Improvements

- **KNN is sensitive to irrelevant or redundant features** — since prediction is purely distance-based, any encoded feature that isn't actually predictive of eligibility still contributes to the distance calculation and can subtly distort neighbor selection. Feature selection (dropping low-importance fields) is worth revisiting.
- **No fairness auditing across sensitive attributes** — this dataset explicitly includes `Orphanage` and `Disability` status as model inputs. Even when used with good intentions (e.g., to prioritize disadvantaged applicants), any model using these fields should be audited to confirm it isn't systematically disadvantaging any subgroup in ways that weren't intended.
- **KNN doesn't scale well to large datasets** — prediction requires computing distance to (a subset of) all training points, which becomes slow as the dataset grows. For a larger applicant pool, approximate nearest-neighbor methods or a different classifier may be needed.
- **`k_neighbors` is fixed at deployment time** — the API reports k = 5 as a static value; a more robust setup would re-validate the optimal k whenever the model is retrained on updated data, rather than assuming it stays optimal indefinitely.
- **No confidence calibration** — like other classifiers in this challenge, the returned `confidence` score is the raw neighbor-vote proportion, not a calibrated probability; a 80% confidence score doesn't necessarily mean an 80% real-world likelihood of being a "correct" eligibility decision.

## ⚠️ Important Disclaimer

This project is an educational machine learning exercise. It is:

- **Not a real scholarship eligibility system.**
- **Not audited for fairness across demographic or socioeconomic groups.**
- **Not reviewed by any educational institution or funding body.**

Any real system influencing a student's access to financial aid must be evaluated far more rigorously than this project — including fairness auditing across the sensitive attributes it uses (orphan status, disability status, disciplinary history), human review of edge cases, and transparency about how eligibility decisions are made. This project should not be used, as-is, to make real decisions about a student's access to a scholarship.

## 📝 License

Part of the 30 Days 30 Machine Learning Projects Challenge. Feel free to use and build upon this code!

## 👨‍💻 Author

**Muhiadin Said Hassan**
Developed as part of the 30-Day Machine Learning Projects Challenge.

- **GitHub:** https://github.com/MUHIYADIN2025
- **Email:** muhidiin090448@gmail.com