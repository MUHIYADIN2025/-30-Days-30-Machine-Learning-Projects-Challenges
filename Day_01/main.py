from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, confloat

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

class PredictionRequest(BaseModel):
    med_inc: confloat(gt=0, le=20)

class PredictionResponse(BaseModel):
    predicted_house_value: float
    unit: str = "hundreds of thousands of USD"

@app.get("/health")
def health():
    return {"status": "ok", "model_loaded": True}

@app.post("/predict", response_model=PredictionResponse)
def predict(payload: PredictionRequest):
    # Replace this placeholder formula with your real model logic.
    predicted_house_value = 2.5 + payload.med_inc * 0.75
    return {"predicted_house_value": predicted_house_value, "unit": "hundreds of thousands of USD"}
