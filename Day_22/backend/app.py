from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import accuracy_score, f1_score
import os

app = FastAPI(title="Scholarship Eligibility Prediction API")

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variables to hold model pipeline state
scaler = None
knn_model = None
model_metrics = {}

# Standard expected columns after one-hot encoding
EXPECTED_COLUMNS = [
    'GPA', 'Family_Income_USD', 'Orphanage_Yes', 'Disability_Yes',
    'Community_Service_Yes', 'Extracurricular_Activities_Yes', 'Disciplinary_Record_Yes'
]

class StudentData(BaseModel):
    GPA: float = Field(..., ge=0.0, le=4.0, example=3.5)
    Family_Income_USD: float = Field(..., ge=0, example=120)
    Orphanage: str = Field(..., example="Yes")
    Disability: str = Field(..., example="No")
    Community_Service: str = Field(..., example="Yes")
    Extracurricular_Activities: str = Field(..., example="Yes")
    Disciplinary_Record: str = Field(..., example="No")

def train_knn_pipeline():
    global scaler, knn_model, model_metrics
    csv_path = "schlerships.csv"
    
    if not os.path.exists(csv_path):
        raise FileNotFoundError(f"Dataset '{csv_path}' not found in backend directory.")
        
    data = pd.read_csv(csv_path)
    
    # Target encoding
    data["Scholarship_Status"] = data["Scholarship_Status"].map({
        "Eligible": 1,
        "Not Eligible": 0
    })
    
    X = data.drop("Scholarship_Status", axis=1)
    y = data["Scholarship_Status"]
    
    # Feature One-Hot Encoding
    X = pd.get_dummies(X, drop_first=True)
    
    # Ensure columns match expected layout
    X = X.reindex(columns=EXPECTED_COLUMNS, fill_value=False)
    
    # Train test split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42, stratify=y
    )
    
    # Feature Scaling
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Model initialization & training
    knn_model = KNeighborsClassifier(n_neighbors=5)
    knn_model.fit(X_train_scaled, y_train)
    
    # Evaluation
    y_pred = knn_model.predict(X_test_scaled)
    model_metrics = {
        "accuracy": round(float(accuracy_score(y_test, y_pred)), 4),
        "f1_score": round(float(f1_score(y_test, y_pred)), 4),
        "k_neighbors": 5
    }

@app.on_event("startup")
def startup_event():
    train_knn_pipeline()

@app.get("/")
def read_root():
    return {"message": "Scholarship Eligibility API is active. Visit /docs for OpenAPI specs."}

@app.get("/api/metrics")
def get_metrics():
    if not model_metrics:
        raise HTTPException(status_code=500, detail="Model metrics unavailable.")
    return model_metrics

@app.post("/api/predict")
def predict_eligibility(student: StudentData):
    if not knn_model or not scaler:
        raise HTTPException(status_code=500, detail="Model is not trained.")
        
    # Convert input payload to DataFrame
    input_dict = {
        "GPA": [student.GPA],
        "Family_Income_USD": [student.Family_Income_USD],
        "Orphanage_Yes": [True if student.Orphanage.strip().lower() == "yes" else False],
        "Disability_Yes": [True if student.Disability.strip().lower() == "yes" else False],
        "Community_Service_Yes": [True if student.Community_Service.strip().lower() == "yes" else False],
        "Extracurricular_Activities_Yes": [True if student.Extracurricular_Activities.strip().lower() == "yes" else False],
        "Disciplinary_Record_Yes": [True if student.Disciplinary_Record.strip().lower() == "yes" else False],
    }
    
    input_df = pd.DataFrame(input_dict)
    input_df = input_df.reindex(columns=EXPECTED_COLUMNS, fill_value=False)
    
    # Scale feature vector
    input_scaled = scaler.transform(input_df)
    
    # Inference
    prediction = int(knn_model.predict(input_scaled)[0])
    probabilities = knn_model.predict_proba(input_scaled)[0].tolist()
    
    return {
        "eligibility_code": prediction,
        "status": "Eligible for Scholarship" if prediction == 1 else "Not Eligible",
        "confidence": round(float(max(probabilities) * 100), 2)
    }