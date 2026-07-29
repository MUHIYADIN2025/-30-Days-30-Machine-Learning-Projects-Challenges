# Day 15: Diabetes Risk Prediction Web Application 🩺

A full-stack Machine Learning web application that predicts the likelihood of diabetes based on user health metrics. Built using a **Random Forest Classifier** served through a **Flask REST API** backend and an interactive **HTML/CSS/JavaScript** frontend.

This project is part of the **30 Days 30 Machine Learning Projects Challenge**.

**Author:** Muhiadin Said Hassan

> ⚠️ **Not a medical device.** This application is an educational machine learning project trained on a public research dataset. It is **not validated for clinical use** and must never be used to make real medical decisions. See [Important Disclaimer](#️-important-disclaimer) for details.

---

## Table of Contents

- [Features](#-features)
- [Tech Stack](#️-tech-stack)
- [How It Works](#-how-it-works)
- [Why Random Forest?](#why-random-forest)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Dataset Features](#-dataset-features)
- [API Endpoints](#-api-endpoints)
- [Known Limitations & Future Improvements](#known-limitations--future-improvements)
- [Important Disclaimer](#️-important-disclaimer)
- [License](#-license)

---

## 📌 Features

- **Interactive UI**: Clean, responsive user interface to input patient medical data.
- **Real-Time Prediction**: Sends form inputs via REST API to evaluate risk probabilities instantly.
- **Machine Learning Model**: Powered by a trained Random Forest Classifier using the Pima Indians Diabetes Dataset.
- **Decoupled Architecture**: Modular design separating the ML/Backend service from the Frontend presentation layer.

## 🛠️ Tech Stack

- **Machine Learning & Backend:**
  - Python 3.11
  - Flask & Flask-CORS
  - Scikit-learn
  - Pandas & NumPy
  - Joblib
- **Frontend:**
  - HTML5 & CSS3
  - JavaScript (Fetch API)

## 🔬 How It Works

**Training (`train_model.py`):**
1. Loads the Pima Indians Diabetes Dataset (768 patient records, 8 physiological features, binary outcome).
2. Splits data into training and test sets.
3. Trains a `RandomForestClassifier` on the 8 input features against the diabetes outcome label.
4. Serializes the trained model to `backend/model.pkl` using `joblib`.

**Inference (`backend/app.py` → Flask):**
1. Loads `model.pkl` once when the Flask server starts.
2. Exposes a `POST /predict` endpoint that accepts the 8 health metrics as JSON.
3. Passes the input through the trained model to get both a binary prediction (diabetic / non-diabetic) and a probability score.
4. Returns the prediction, probability, and a human-readable message as JSON.

**Frontend (`frontend/index.html` + `script.js`):**
1. Presents a form for the 8 input fields (pregnancies, glucose, blood pressure, etc.).
2. On submit, sends the form values to the Flask API via the Fetch API.
3. Displays the returned prediction and probability to the user.

## Why Random Forest?

The Pima Indians Diabetes Dataset is small (768 rows) and tabular, with a mix of features that have non-linear relationships to diabetes risk (e.g., the combined effect of BMI and glucose matters more than either alone). A Random Forest handles this well without requiring feature scaling, is robust to the dataset's known outliers and skewed feature distributions, and — importantly for a health-adjacent tool — the model output can be inspected via `feature_importances_` to sanity-check that predictions are driven by clinically plausible factors (glucose, BMI, age) rather than spurious noise.

## 📁 Project Structure

```text
Day_15/
│
├── backend/
│   ├── app.py              # Flask API server
│   ├── train_model.py      # Script to train and export the model
│   ├── model.pkl            # Saved trained Random Forest model
│   └── requirements.txt    # Python dependencies
│
├── frontend/
│   ├── index.html          # Web application structure
│   ├── style.css           # UI styling
│   └── script.js           # API integration script
│
└── README.md               # Project documentation
```

## 🚀 Getting Started

Follow these instructions to get the project up and running locally.

### Prerequisites

Ensure you have Python installed on your system. You can verify by running:

```bash
python --version
```

### 1. Backend Setup

Navigate to the `backend` directory:

```bash
cd backend
```

Install the required Python dependencies:

```bash
py -m pip install -r requirements.txt
```

Train the model and generate `model.pkl`:

```bash
py train_model.py
```

Start the Flask API server:

```bash
py app.py
```

The API will start running on `http://127.0.0.1:5000`.

### 2. Frontend Setup

Open a new terminal window and navigate to the `frontend` folder:

```bash
cd frontend
```

Start a local HTTP server:

```bash
py -m http.server 8000
```

Open your web browser and go to:

```
http://localhost:8000
```

## 📊 Dataset Features

The model accepts 8 physiological parameters to calculate risk:

1. **Pregnancies** — number of times pregnant
2. **Glucose** — plasma glucose concentration (2 hours in an oral glucose tolerance test)
3. **Blood Pressure** — diastolic blood pressure (mm Hg)
4. **Skin Thickness** — triceps skin fold thickness (mm)
5. **Insulin** — 2-hour serum insulin (mu U/ml)
6. **BMI** — body mass index (weight in kg / (height in m)²)
7. **Diabetes Pedigree Function** — a score reflecting family history/genetic diabetes risk
8. **Age** — age in years

## 💻 API Endpoints

### `POST /predict`

**Request Payload:**
```json
{
  "pregnancies": 1,
  "glucose": 120,
  "bloodPressure": 70,
  "skinThickness": 20,
  "insulin": 80,
  "bmi": 25.0,
  "diabetesPedigreeFunction": 0.5,
  "age": 30
}
```

**Response Payload:**
```json
{
  "status": "success",
  "prediction": 0,
  "probability": 20.55,
  "message": "Non-Diabetic"
}
```

## Known Limitations & Future Improvements

- **Small, single-population dataset** — the Pima Indians Diabetes Dataset contains only 768 records from one specific population (women of Pima Indian heritage, age 21+). A model trained on it will not generalize reliably to other demographics, and should not be presented as broadly applicable.
- **No input validation on the backend** — the current API accepts raw numeric values without range checks (e.g., a negative glucose value or an unrealistic BMI would still be passed to the model). Adding server-side validation would prevent nonsensical predictions from silently succeeding.
- **No confidence calibration** — the returned probability comes directly from `predict_proba()`, which for tree ensembles is not always well-calibrated (i.e., a "70% probability" may not correspond to a true 70% real-world likelihood). Calibration (e.g., via `CalibratedClassifierCV`) would make the probability more trustworthy.
- **No authentication or rate limiting** — as with any locally-run Flask API, add an API key or rate limiting before exposing this beyond local development.
- **No missing-value handling documented** — the original Pima dataset famously encodes missing values as `0` in fields like `Glucose`, `BloodPressure`, and `BMI` (a value of 0 is medically impossible for these). If `train_model.py` doesn't explicitly handle this, the model may have learned from these as if they were real zero values — worth auditing before trusting feature importances.

## ⚠️ Important Disclaimer

This project is an educational exercise built for a machine learning practice challenge. It is:

- **Not a certified or clinically validated medical device or diagnostic tool.**
- **Not reviewed or approved by any health authority.**
- **Not a substitute for professional medical advice, diagnosis, or treatment.**

The model was trained on a small, decades-old research dataset from a single population and has not been validated against real-world clinical outcomes. Anyone with concerns about their diabetes risk should consult a qualified healthcare professional rather than rely on this tool's output.

## 📝 License

This project is licensed under the MIT License — feel free to use and adapt it for learning purposes!

## 👨‍💻 Author

**Muhiadin Said Hassan**
Developed as part of the 30-Day Machine Learning Projects Challenge.

- **GitHub:** https://github.com/MUHIYADIN2025
- **Email:** muhidiin090448@gmail.com