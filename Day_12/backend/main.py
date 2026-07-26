import joblib
import numpy as np
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

app = FastAPI(title="Airline Passenger Satisfaction API")

# Allow CORS requests from any localhost port
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model and saved features
try:
    saved_data = joblib.load("gbm_model.pkl")
    model = saved_data["model"]
    feature_columns = saved_data["feature_columns"]
except Exception as e:
    raise RuntimeError(f"Error loading gbm_model.pkl: {e}")


class PassengerData(BaseModel):
    Gender: str
    Customer_Type: str = Field(..., alias="Customer_Type")
    Age: int
    Type_of_Travel: str
    Class: str
    Flight_Distance: int
    Inflight_wifi_service: int
    Departure_Arrival_time_convenient: int
    Ease_of_Online_booking: int
    Gate_location: int
    Food_and_drink: int
    Online_boarding: int
    Seat_comfort: int
    Inflight_entertainment: int
    On_board_service: int
    Leg_room_service: int
    Baggage_handling: int
    Checkin_service: int
    Inflight_service: int
    Cleanliness: int
    Departure_Delay_in_Minutes: int
    Arrival_Delay_in_Minutes: int


@app.get("/")
def health_check():
    return {"status": "running", "message": "Airline Satisfaction Predictor API"}


@app.post("/predict")
def predict_satisfaction(data: PassengerData):
    try:
        raw_dict = data.dict()

        # Build raw dict mapping to standard dataset column names
        formatted_dict = {
            "Gender": raw_dict["Gender"],
            "Customer Type": raw_dict["Customer_Type"],
            "Age": raw_dict["Age"],
            "Type of Travel": raw_dict["Type_of_Travel"],
            "Class": raw_dict["Class"],
            "Flight Distance": raw_dict["Flight_Distance"],
            "Inflight wifi service": raw_dict["Inflight_wifi_service"],
            "Departure/Arrival time convenient": raw_dict[
                "Departure_Arrival_time_convenient"
            ],
            "Ease of Online booking": raw_dict["Ease_of_Online_booking"],
            "Gate location": raw_dict["Gate_location"],
            "Food and drink": raw_dict["Food_and_drink"],
            "Online boarding": raw_dict["Online_boarding"],
            "Seat comfort": raw_dict["Seat_comfort"],
            "Inflight entertainment": raw_dict["Inflight_entertainment"],
            "On-board service": raw_dict["On_board_service"],
            "Leg room service": raw_dict["Leg_room_service"],
            "Baggage handling": raw_dict["Baggage_handling"],
            "Checkin service": raw_dict["Checkin_service"],
            "Inflight service": raw_dict["Inflight_service"],
            "Cleanliness": raw_dict["Cleanliness"],
            "Departure Delay in Minutes": raw_dict[
                "Departure_Delay_in_Minutes"
            ],
            "Arrival Delay in Minutes": raw_dict["Arrival_Delay_in_Minutes"],
        }

        # Convert to DataFrame
        df_input = pd.DataFrame([formatted_dict])

        # One-hot encode inputs
        df_encoded = pd.get_dummies(df_input, drop_first=True)

        # Re-index/Align dataframe with trained features
        df_aligned = pd.DataFrame(columns=feature_columns)

        for col in feature_columns:
            if col in df_encoded.columns:
                df_aligned[col] = df_encoded[col]
            elif col in df_input.columns:
                df_aligned[col] = df_input[col]
            else:
                df_aligned[col] = 0

        df_aligned = df_aligned.fillna(0)

        # Make Prediction
        prediction = int(model.predict(df_aligned)[0])
        probability = float(model.predict_proba(df_aligned)[0][prediction])

        result = (
            "Satisfied" if prediction == 1 else "Neutral or Dissatisfied"
        )

        return {
            "prediction": result,
            "satisfaction_code": prediction,
            "confidence": float(np.round(probability * 100, 2)),
        }

    except Exception as e:
        print("Detailed Backend Error:", str(e))
        raise HTTPException(status_code=500, detail=str(e))