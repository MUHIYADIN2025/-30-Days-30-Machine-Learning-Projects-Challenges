"""
FastAPI service exposing the trained Isolation Forest fraud detector.
Run with: uvicorn main:app --reload --port 8005
"""
from contextlib import asynccontextmanager
from pathlib import Path

import joblib
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

MODEL_PATH = Path(__file__).parent / "model.joblib"
model = None
feature_columns = None
metrics = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    global model, feature_columns, metrics
    if not MODEL_PATH.exists():
        raise RuntimeError(
            f"Model file not found at {MODEL_PATH}. Run train_model.py first."
        )
    bundle = joblib.load(MODEL_PATH)
    model = bundle["model"]
    feature_columns = bundle["feature_columns"]
    metrics = bundle["metrics"]
    yield
    model = None
    feature_columns = None
    metrics = None


app = FastAPI(title="Credit Card Fraud Detection API", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        "http://127.0.0.1:5175",
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


class TransactionInput(BaseModel):
    # Raw feature values matching model.feature_columns order: Time, V1-V28, Amount
    features: dict[str, float]


class PredictionResponse(BaseModel):
    is_fraud: bool
    label: str


class MetricsResponse(BaseModel):
    accuracy: float
    total_transactions: int
    fraud_count: int
    normal_count: int
    confusion_matrix: list
    classification_report: dict
    feature_columns: list


@app.get("/health")
def health_check():
    return {"status": "ok", "model_loaded": model is not None}


@app.get("/metrics", response_model=MetricsResponse)
def get_metrics():
    if metrics is None:
        raise HTTPException(status_code=503, detail="Model is not loaded")
    return MetricsResponse(**metrics, feature_columns=feature_columns)


@app.post("/predict", response_model=PredictionResponse)
def predict(payload: TransactionInput):
    if model is None:
        raise HTTPException(status_code=503, detail="Model is not loaded")

    missing = [col for col in feature_columns if col not in payload.features]
    if missing:
        raise HTTPException(
            status_code=422, detail=f"Missing required features: {missing}"
        )

    input_df = pd.DataFrame([payload.features], columns=feature_columns)
    prediction = model.predict(input_df)[0]  # -1 = anomaly, 1 = normal

    return PredictionResponse(
        is_fraud=bool(prediction == -1),
        label="Fraud" if prediction == -1 else "Normal",
    )