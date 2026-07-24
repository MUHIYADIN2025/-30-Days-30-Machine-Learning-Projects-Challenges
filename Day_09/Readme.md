# Day 9 — Weather Forecasting for India (Linear Regression on Time Series)

## Overview

This project forecasts India's average daily temperature using a simple
**Linear Regression** model. Unlike Day 1's house price regression, the
single input feature here is **time itself** — a date converted to a
number — making this a basic introduction to time series forecasting with
a non-time-series-specific model.

## Contents

## Dataset

This project uses **`city_temperature.csv`** (~134 MB), which is **not committed to this repository** — it exceeds GitHub's 100 MB file size limit and is excluded via `.gitignore`.

### Download steps

1. Locate the dataset (commonly the "Daily Temperature of Major Cities" dataset on Kaggle: https://www.kaggle.com/datasets/sudalairajkumar/daily-temperature-of-major-cities — confirm this matches the exact source you used).
2. Download and unzip it.
3. Place the CSV at: `Day_9/backend/city_temperature.csv`

### Before training or running the API

`train_model.py` and `main.py` expect this file at the path above. If it's missing, `train_model.py` will raise a `FileNotFoundError` — re-download the dataset and place it there before running:

```bash
cd Day_9/backend
python train_model.py
```

This regenerates `model.joblib` locally, which **is** committed to the repo, so the FastAPI service (`main.py`) can run immediately without retraining — only re-run `train_model.py` if you want to retrain on updated data.






- `Day_9.ipynb` — the full notebook: data loading, preprocessing, training,
  evaluation, and visualization.
- `backend/` — FastAPI service serving the trained model (`train_model.py`,
  `main.py`, `requirements.txt`).
- `frontend/` — React (Vite) app with a date picker that calls the API for
  a temperature forecast.

## Machine Learning Approach

- **Dataset**: "Daily Temperature of Major Cities" (Kaggle), filtered to
  **India** only. Rows with the dataset's `-99` sentinel value (used to mark
  missing temperature readings) are dropped.
- **Feature engineering**: `Year`, `Month`, `Day` are combined into a single
  `Date` column, then converted to `Date_ordinal` — an integer day-count
  (via `pd.Timestamp.toordinal()`) — since Linear Regression requires
  numeric input and can't use a raw date directly.
- **Feature**: `Date_ordinal` (single column).
- **Target**: `AvgTemperature`.
- **Split**: 80% train / 20% validation, `random_state=42`.
- **Model**: `LinearRegression()`.
- **Evaluation**: Mean Squared Error (MSE) on the validation set.
- **Visualization**: scatter plot of actual vs. predicted temperature over
  the date range.

## Results

- **Mean Squared Error: 74.0253**

MSE alone is easiest to interpret in its square-root form: √74.03 ≈ **8.6°F**
of typical prediction error. For a model using only "how many days have
passed" as its input — with no seasonal awareness at all — that's a
reasonable baseline, but it also points directly at the model's core
limitation below.

## Backend (FastAPI)

### Setup

```powershell
cd Day_9/backend
py -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

Download `city_temperature.csv` (Kaggle: "Daily Temperature of Major
Cities") and place it in `Day_9/backend/` before training:

```powershell
py train_model.py
```

### Run the API

```powershell
uvicorn main:app --reload --port 8004
```

> Runs on **port 8004** so it doesn't collide with other days' backends.

### Endpoints

| Method | Path       | Description                                  |
|--------|------------|-----------------------------------------------|
| GET    | `/health`  | Returns `{ "status": "ok", "model_loaded": bool }` |
| POST   | `/predict` | Returns a predicted temperature for a given date |

**Request body for `/predict`:**
```json
{ "target_date": "2026-08-15" }
```

**Response:**
```json
{ "target_date": "2026-08-15", "predicted_temperature_f": 79.42 }
```

## Frontend (React + Vite)

```powershell
cd Day_9/frontend
npm install
npm run dev
```

A single date picker calls the API and displays the predicted temperature.
See `main.py`'s CORS `allow_origins` list if you see a "Backend offline"
indicator — it must include whatever port the Vite dev server is actually
running on.

## Known Limitations

- **No seasonality modeling.** A straight `Date_ordinal → Temperature` line
  cannot represent yearly hot/cold cycles — it can only fit an overall
  long-term trend (e.g. slow warming/cooling over years). Predictions for a
  specific day of the year will systematically miss the actual seasonal
  swing, which is very likely the dominant source of the ~8.6°F error above.
- **Dead code in the original notebook**: an early cell loads a global
  temperature dataset (`global-temp/monthly.csv`) into a `df` variable that
  is never used afterward — the actual modeling uses a separate `data`
  variable loaded from `city_temperature.csv`. This was left in as-is; it
  has no effect on the trained model but is worth removing for clarity.
- **Single-feature model**: only elapsed time is used — no humidity,
  pressure, or other meteorological variables that would typically inform a
  real forecast.

## Possible Next Steps

- Add cyclical seasonal features (e.g. `sin(day_of_year)`, `cos(day_of_year)`)
  so the model can capture yearly temperature cycles instead of only a
  linear trend — this would likely be the single biggest accuracy improvement.
- Compare against a dedicated time series model (e.g. ARIMA, Prophet) as a
  baseline reference for how much seasonality-aware modeling actually helps.
- Remove the unused dataset-loading cell from the notebook for clarity.

---

**Prepared by Muhiadin Said Hassan**

GitHub Profile: [https://github.com/MUHIYADIN2025](https://github.com/MUHIYADIN2025)