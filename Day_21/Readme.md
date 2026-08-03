# 🏦 Day 21: Credit Risk & Loan Approval Prediction Dashboard

A full-stack Machine Learning web application that predicts loan approval outcomes and assesses credit default risk using an ensemble of classifiers. Built as part of the **30 Days 30 Machine Learning Projects Challenge**.

**Author:** Muhiadin Said Hassan

> ⚠️ **Not a real lending system.** This is an educational project. Real credit-decisioning systems are subject to fair-lending regulations (e.g., the Equal Credit Opportunity Act in the U.S.) and require rigorous bias auditing before ever being used to affect a real person's access to credit. See [Important Disclaimer](#️-important-disclaimer).

---

## Table of Contents

- [Project Overview](#-project-overview)
- [Key Features](#key-features)
- [Architecture & Feature Engineering](#-architecture--feature-engineering)
- [Why Compare Three Models?](#why-compare-three-models)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [API Endpoints](#-api-endpoints)
- [Known Limitations & Future Improvements](#known-limitations--future-improvements)
- [Important Disclaimer](#️-important-disclaimer)
- [Author](#-author)

---

## 📌 Project Overview

This project provides an interactive dashboard to evaluate loan applications in real time. It utilizes machine learning models trained on financial metrics to deliver instant classification results, model probabilities, and historical performance metrics.

### Key Features

- **Multi-Model Evaluation:** Evaluates candidate data across **Logistic Regression**, **Random Forest**, and **Support Vector Machine (SVM)** classifiers.
- **Real-time API:** FastAPI backend serving asynchronous model predictions and baseline evaluation metrics.
- **Modern UI:** Responsive, single-page dashboard built with HTML5, Tailwind CSS, and Vanilla JavaScript.
- **Interactive Predictions:** Instant UI updates displaying approval decisions and model confidence scores.

## 📐 Architecture & Feature Engineering

### Model Features

The pipeline extracts and processes the following features from applicant financial records:

| Feature Name | Type | Description |
|---|---|---|
| `Income` | Continuous | Total annual income ($) |
| `CreditScore` | Continuous | Applicant credit score (FICO scale) |
| `EmploymentYears` | Continuous | Total years of employment history |
| `LoanAmount` | Continuous | Total requested loan principal ($) |
| `HasCollateral` | Binary | Collateral status (`1` = Yes, `0` = No) |
| `PreviousDefaults` | Binary | Historical default records (`1` = Yes, `0` = No) |
| `DebtToIncome` | Continuous | Ratio of total monthly debt payment to gross monthly income |
| `IncomePerYearEmployed` | Continuous | Derived feature: Income ÷ EmploymentYears |

**Why these engineered features matter:** `DebtToIncome` and `IncomePerYearEmployed` aren't raw fields from an application form — they're derived ratios that are standard practice in real underwriting, because a ratio often carries more signal than either input alone. A $65,000 income means something very different for a borrower with 1 year of employment history versus 20 years; `IncomePerYearEmployed` gives the model a single feature that captures income *stability* rather than just income *level*. Similarly, `DebtToIncome` is one of the most heavily weighted factors in real-world credit underwriting, since it directly measures a borrower's capacity to take on additional debt payments.

## Why Compare Three Models?

Logistic Regression, Random Forest, and SVM represent three genuinely different modeling assumptions, which is useful for a credit-risk problem where the "right" model isn't obvious upfront:

- **Logistic Regression** — a linear, highly interpretable baseline. In lending specifically, interpretability isn't just a nice-to-have: adverse action notices (telling a rejected applicant *why* they were declined) are a real regulatory requirement in many jurisdictions, and a linear model's coefficients make this far easier to produce than a black-box model's output.
- **Random Forest** — captures non-linear interactions between features (e.g., the effect of `DebtToIncome` may depend on `CreditScore` in a non-additive way) that Logistic Regression cannot.
- **SVM** — effective when classes are separated by a complex boundary in feature space, and can be a strong performer on smaller, well-scaled datasets like this one.

Comparing all three, rather than committing to one upfront, lets the `/api/metrics` endpoint show which approach actually performs best on this specific dataset instead of assuming a single "best" algorithm in the abstract.

## 📂 Project Structure

```text
Day_21/
├── backend/
│   ├── app.py                   # FastAPI REST API & model inference pipeline
│   └── clean_loan_dataset.csv   # Dataset used for model training
├── frontend/
│   └── index.html               # Web UI dashboard
└── README.md                    # Project documentation
```

## 🚀 Getting Started

### Prerequisites

- Python 3.9+
- A web browser (Chrome, Firefox, Edge, Safari)

### 1. Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
pip install fastapi uvicorn pandas scikit-learn
```

Verify dataset location: ensure `clean_loan_dataset.csv` is placed directly inside the `backend/` directory.

Start the API server:

```bash
py -m uvicorn app:app --reload --port 8000
```

The backend will start at `http://127.0.0.1:8000`.

### 2. Frontend Setup

Open `frontend/index.html` using any of the following methods:

- **Direct File:** double-click `index.html` in File Explorer.
- **Live Server (VS Code):** right-click `index.html` and select "Open with Live Server."
- **Python Server:** run `py -m http.server 3000` inside the `frontend/` folder and visit `http://localhost:3000`.

## 🔌 API Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/` | GET | Health check route |
| `/api/metrics` | GET | Retrieves Accuracy and F1 scores for trained models |
| `/api/predict` | POST | Accepts applicant payload and returns model predictions |
| `/docs` | GET | Interactive OpenAPI / Swagger documentation |

**Example Request Body (`POST /api/predict`):**

```json
{
  "Income": 65000,
  "CreditScore": 710,
  "EmploymentYears": 5,
  "LoanAmount": 15000,
  "HasCollateral": 1,
  "PreviousDefaults": 0,
  "DebtToIncome": 0.25,
  "IncomePerYearEmployed": 13000
}
```

## Known Limitations & Future Improvements

- **No fairness/bias auditing** — real credit models must be tested for disparate impact across protected classes (race, gender, age, etc.) even when those fields aren't direct model inputs, since features can act as proxies. This project does not include any such analysis, which is a hard requirement before any real-world use.
- **`/api/metrics` reports Accuracy and F1, but loan approval datasets are often imbalanced** — if approvals significantly outnumber rejections (or vice versa) in the training data, Accuracy can be misleading; Precision/Recall per class and a confusion matrix would give a more honest picture, similar to the class-imbalance handling discussed in this challenge's fraud-detection project (Day 19).
- **No explainability layer for individual predictions** — the dashboard returns a decision and confidence score, but not *why* (e.g., via SHAP values or logistic regression coefficients), which is close to a regulatory requirement for real adverse-action notices, not just a UX nicety.
- **No input validation range-checking** — the API should reject clearly invalid inputs (negative income, credit scores outside the valid FICO range, etc.) rather than passing them through to the model.
- **Static dataset, no drift monitoring** — credit risk patterns shift with macroeconomic conditions; a real system would need periodic retraining and performance monitoring rather than a model trained once.

## ⚠️ Important Disclaimer

This project is an educational machine learning exercise. It is:

- **Not a real credit-decisioning or lending system.**
- **Not validated against real-world loan performance or regulatory fair-lending standards.**
- **Not reviewed for bias or disparate impact across protected groups.**

Real-world credit and lending models are subject to significant regulatory oversight (in the U.S., including the Equal Credit Opportunity Act and Fair Credit Reporting Act) precisely because biased or poorly validated models can cause real financial harm. This project should not be used, as-is, to make actual lending decisions.

## 👨‍💻 Author

**Muhiadin Said Hassan**
Developed as part of the 30-Day Machine Learning Projects Challenge.

- **GitHub:** https://github.com/MUHIYADIN2025
- **Email:** muhidiin090448@gmail.com