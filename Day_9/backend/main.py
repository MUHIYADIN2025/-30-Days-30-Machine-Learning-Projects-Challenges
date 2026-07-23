"""
FastAPI service exposing the trained India weather forecasting model.
Run with: uvicorn main:app --reload --port 8004
"""
from contextlib import asynccontextmanager
from datetime import date
from pathlib import Path

import joblib
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

MODEL_PATH = Path(__file__).parent / "model.joblib"
model = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    global model
    if not MODEL_PATH.exists():
        raise RuntimeError(
            f"Model file not found at {MODEL_PATH}. Run train_model.py first."
        )
    model = joblib.load(MODEL_PATH)
    yield
    model = None


app = FastAPI(title="India Weather Forecast API", version="1.0.0", lifespan=lifespan)

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


class ForecastRequest(BaseModel):
    target_date: date  # e.g. "2026-08-15"


class ForecastResponse(BaseModel):
    target_date: date
    predicted_temperature_f: float


@app.get("/health")
def health_check():
    return {"status": "ok", "model_loaded": model is not None}


@app.post("/predict", response_model=ForecastResponse)
def predict(payload: ForecastRequest):
    if model is None:
        raise HTTPException(status_code=503, detail="Model is not loaded")

    date_ordinal = payload.target_date.toordinal()
    prediction = model.predict([[date_ordinal]])[0]

    return ForecastResponse(
        target_date=payload.target_date,
        predicted_temperature_f=round(float(prediction), 2),
    )