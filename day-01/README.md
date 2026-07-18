# Day 01

This folder contains the Day 1 project for house price prediction.

## Contents

- `main.py` - FastAPI backend serving a prediction endpoint.
- `frontend/` - React + Vite frontend for entering median income and viewing predicted house value.
- `Day1.ipynb` - Jupyter notebook for exploratory data analysis and model development.
- `.gitignore` - Ignore patterns specific to this folder.

## Running locally

### Backend

```bash
cd day-01
py -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend

```bash
cd day-01/frontend
npm install
npm run dev
```

## Notes

- The frontend expects the backend to be available at `http://localhost:8000`.
- Update `main.py` with the final prediction model or model-serving logic when ready.
