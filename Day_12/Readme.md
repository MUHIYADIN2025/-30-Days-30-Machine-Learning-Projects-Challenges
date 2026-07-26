# ✈️ Day 12: Airline Passenger Satisfaction Predictor

A full-stack machine learning application that predicts passenger satisfaction
(*Satisfied* vs *Neutral/Dissatisfied*) based on flight details and customer
rating metrics. Built with **Gradient Boosting Classifier**, **FastAPI**, and
**React (Vite)**.

---

## 📌 Features

- **Predictive ML Model** — Gradient Boosting Classifier trained on tabular
  passenger data (flight details, service ratings, and demographics).
- **RESTful API Backend** — a FastAPI server handling pre-processing, feature
  alignment, and inference behind a clean HTTP interface.
- **Dynamic React Frontend** — a responsive UI built with React and Vite for
  immediate satisfaction feedback.
- **Confidence Scoring** — every prediction returns both the classification
  and a percentage confidence score, not just a bare label.

---

## 🏗 System Architecture & Directory Structure

```text
Day_12/
├── backend/
│   ├── main.py               # FastAPI server & prediction pipeline
│   ├── train_and_export.py   # Script to train and export the ML model
│   ├── gbm_model.pkl         # Saved Gradient Boosting model & feature list
│   ├── train.csv             # Training dataset
│   ├── test.csv              # Validation dataset
│   └── requirements.txt      # Python dependencies
└── frontend/
    ├── src/
    │   ├── App.jsx           # Main React UI component
    │   ├── App.css           # Custom styling
    │   └── main.jsx          # App entry point
    ├── index.html            # HTML shell
    └── package.json          # Node dependencies & scripts
```

---

## 🧠 Machine Learning Approach

- **Model**: `GradientBoostingClassifier` — an ensemble method that builds
  trees sequentially, with each new tree correcting the errors of the ones
  before it. Well suited to tabular data with mixed numeric and categorical
  features, like this dataset.
- **Target**: passenger satisfaction, binary — *Satisfied* vs
  *Neutral/Dissatisfied*.
- **Features**: flight details (e.g. class, distance, delay minutes) combined
  with customer service ratings (e.g. in-flight wifi, seat comfort, food and
  drink, online boarding).
- **Artifact**: the trained model and its exact feature column order are
  bundled together in `gbm_model.pkl`, so the API can align incoming
  requests to the same feature schema used during training.

> **Note**: this README currently omits validation accuracy, precision/recall,
> and confusion matrix figures. Fill these in from your `train_and_export.py`
> run output before publishing — reporting a model's real evaluation numbers
> (not just that it "works") is what makes this section credible to anyone
> reviewing the project.

---

## ⚙️ Backend Setup (FastAPI)

```powershell
cd Day_12/backend
py -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

Train and export the model (only needed once, or after changing the training
data/pipeline):

```powershell
py train_and_export.py
```

Run the API:

```powershell
uvicorn main:app --reload --port 8006
```

> Runs on **port 8006** to avoid colliding with other days' backends running
> alongside it.

### API Endpoints

| Method | Path       | Description                                              |
|--------|------------|------------------------------------------------------------|
| GET    | `/health`  | Returns service and model-load status                      |
| POST   | `/predict` | Returns predicted satisfaction label + confidence score     |

> Document the exact request/response JSON schema here once `main.py`'s
> Pydantic models are finalized, so frontend developers (or your future
> self) don't need to read the backend source to integrate with it.

---

## 💻 Frontend Setup (React + Vite)

```powershell
cd Day_12/frontend
npm install
npm run dev
```

The UI collects flight and service-rating inputs, submits them to the
backend's `/predict` endpoint, and displays the resulting satisfaction
prediction alongside its confidence score.

> Ensure the backend's CORS configuration (`allow_origins` in `main.py`)
> includes whatever port the Vite dev server reports on startup —
> otherwise the frontend will show a "backend offline" state even while the
> API is running.

---

## Known Limitations

- Gradient Boosting models can be sensitive to noisy or inconsistent input
  data; feature preprocessing consistency between training and inference is
  critical (`gbm_model.pkl` storing the feature list alongside the model
  helps guard against silent misalignment).
- No hyperparameter tuning details are documented yet — record whether
  `n_estimators`, `learning_rate`, and `max_depth` were tuned or left at
  defaults, since that materially affects how much further improvement is
  realistically possible.

## Possible Next Steps

- Add SHAP or feature-importance visualization to the dashboard, so a
  prediction comes with an explanation of which factors drove it.
- Compare Gradient Boosting against a simpler baseline (e.g. Logistic
  Regression) to quantify how much the added model complexity is actually
  buying in accuracy.
- Add input validation ranges on the frontend matching the training data's
  actual value ranges, to prevent out-of-distribution inputs from producing
  unreliable predictions silently.

---

**Prepared by Muhiadin Said Hassan**
GitHub Profile: [https://github.com/MUHIYADIN2025](https://github.com/MUHIYADIN2025)