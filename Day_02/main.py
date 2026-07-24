"""
FastAPI service exposing the trained Iris Logistic Regression model.
Run with: uvicorn ma:app --reload --port 8001
"""
from contextlib import asynccontextmanager
from pathlib import Path

import joblib
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

MODEL_PATH = Path(__file__).parent / "model.joblib"
model = None

# Must match the exact column order used in train_model.py
FEATURE_ORDER = [
    "sepal length (cm)",
    "sepal width (cm)",
    "petal length (cm)",
    "petal width (cm)",
]


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Load the trained model once at startup instead of on every request."""
    global model
    if not MODEL_PATH.exists():
        raise RuntimeError(
            f"Model file not found at {MODEL_PATH}. Run train_model.py first."
        )
    model = joblib.load(MODEL_PATH)
    yield
    model = None


app = FastAPI(title="Iris Classifier API", lifespan=lifespan)

# CRITICAL: without this, the browser's CORS preflight (OPTIONS) request
# gets no response and FastAPI returns 405, blocking every fetch() call
# from the React frontend regardless of what /predict itself does.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://127.0.0.1:5176",
        "http://127.0.0.1:5177",
        "http://127.0.0.1:5178"
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


class IrisFeatures(BaseModel):
    sepal_length: float = Field(..., gt=0, le=10, description="Sepal length in cm")
    sepal_width: float = Field(..., gt=0, le=10, description="Sepal width in cm")
    petal_length: float = Field(..., gt=0, le=10, description="Petal length in cm")
    petal_width: float = Field(..., gt=0, le=10, description="Petal width in cm")


@app.get("/health")
def health() -> dict:
    return {"status": "ok", "model_loaded": model is not None}


@app.post("/predict")
def predict(features: IrisFeatures) -> dict:
    if model is None:
        raise HTTPException(status_code=503, detail="Model is not loaded")

    input_df = pd.DataFrame(
        [[features.sepal_length, features.sepal_width, features.petal_length, features.petal_width]],
        columns=FEATURE_ORDER,
    )

    prediction = model.predict(input_df)[0]
    proba = model.predict_proba(input_df)[0]
    class_names = model.classes_

    return {
        "predicted_species": str(prediction),
        "probabilities": {cls: round(float(p), 4) for cls, p in zip(class_names, proba)},
    }