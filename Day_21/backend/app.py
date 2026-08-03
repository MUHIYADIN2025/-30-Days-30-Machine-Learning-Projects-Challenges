from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import SVC
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score

app = FastAPI(title="Loan Approval ML API", version="1.0")

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global models dictionary
models = {}

class LoanApplication(BaseModel):
    Income: float
    CreditScore: float
    EmploymentYears: float
    LoanAmount: float
    HasCollateral: int
    PreviousDefaults: int
    DebtToIncome: float
    IncomePerYearEmployed: float

@app.on_event("startup")
def train_and_load_models():
    """Loads dataset and trains models matching Day 21 pipeline."""
    try:
        df = pd.read_csv('clean_loan_dataset.csv')
        X = df.drop(columns=['Approved'])
        y = df['Approved']

        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.20, stratify=y, random_state=42
        )

        # Train models
        log_reg = LogisticRegression(max_iter=1000, random_state=42).fit(X_train, y_train)
        rf_clf = RandomForestClassifier(n_estimators=100, random_state=42).fit(X_train, y_train)
        svm_clf = SVC(probability=True, random_state=42).fit(X_train, y_train)

        models["log_reg"] = {"model": log_reg, "name": "Logistic Regression"}
        models["rf"] = {"model": rf_clf, "name": "Random Forest"}
        models["svm"] = {"model": svm_clf, "name": "Support Vector Machine"}

        # Store baseline metrics
        models["metrics"] = {
            "Logistic Regression": {
                "accuracy": round(accuracy_score(y_test, log_reg.predict(X_test)), 3),
                "f1": round(f1_score(y_test, log_reg.predict(X_test)), 3)
            },
            "Random Forest": {
                "accuracy": round(accuracy_score(y_test, rf_clf.predict(X_test)), 3),
                "f1": round(f1_score(y_test, rf_clf.predict(X_test)), 3)
            },
            "Support Vector Machine": {
                "accuracy": round(accuracy_score(y_test, svm_clf.predict(X_test)), 3),
                "f1": round(f1_score(y_test, svm_clf.predict(X_test)), 3)
            }
        }
    except Exception as e:
        print(f"Error loading models: {e}")

@app.get("/api/metrics")
def get_metrics():
    return models.get("metrics", {})

@app.post("/api/predict")
def predict_loan(data: LoanApplication):
    if not models:
        raise HTTPException(status_code=500, detail="Models not loaded")

    features = pd.DataFrame([data.dict()])
    results = {}

    for key in ["log_reg", "rf", "svm"]:
        clf = models[key]["model"]
        pred = int(clf.predict(features)[0])
        prob = float(clf.predict_proba(features)[0][1])
        results[models[key]["name"]] = {
            "approved": bool(pred),
            "confidence": round(prob * 100, 2)
        }

    return {"status": "success", "predictions": results}