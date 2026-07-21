from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import joblib

app = FastAPI(title="Credit Card Default Risk API")

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model & feature list
try:
    model = joblib.load("model.pkl")
    features = joblib.load("features.pkl")
except Exception as e:
    print(f"Warning: Model or features file not found. Ensure export_model.py has run. {e}")

class ClientData(BaseModel):
    LIMIT_BAL: float
    SEX: int
    EDUCATION: int
    MARRIAGE: int
    AGE: int
    PAY_0: int
    PAY_2: int
    PAY_3: int
    PAY_4: int
    BILL_AMT1: float
    BILL_AMT2: float
    BILL_AMT3: float
    BILL_AMT4: float
    BILL_AMT5: float
    BILL_AMT6: float
    PAY_AMT1: float
    PAY_AMT2: float
    PAY_AMT3: float
    PAY_AMT4: float
    PAY_AMT5: float
    PAY_AMT6: float

@app.get("/")
def home():
    return {"status": "Model API is online and operational"}

@app.post("/predict")
def predict_default(data: ClientData):
    input_df = pd.DataFrame([data.model_dump()])
    
    # Ensure all required columns are present
    for col in features:
        if col not in input_df.columns:
            input_df[col] = 0
            
    input_df = input_df[features]
    
    prediction = int(model.predict(input_df)[0])
    probability = float(model.predict_proba(input_df)[0][1])
    
    return {
        "prediction": prediction,
        "default_probability": round(probability * 100, 2),
        "status": "High Risk" if prediction == 1 else "Low Risk"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)