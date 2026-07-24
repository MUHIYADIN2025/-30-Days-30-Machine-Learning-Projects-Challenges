# Day 10 — Movie Recommendation System (Item-Based Collaborative Filtering)

**Author:** Muhiadin Said Hassan
**Series:** 30 Days 30 Machine Learning Projects Challenge

## Overview

A movie recommendation engine built with **item-based collaborative filtering**. Instead of relying on movie metadata (genre, cast, etc.), the model learns purely from user rating patterns: two movies are considered similar if the same users tended to rate them similarly. Ratings for movies a user hasn't seen yet are then predicted from the movies they *have* rated, weighted by item similarity. A React dashboard visualizes the model's recommendations and evaluation metrics.

## Dataset

- **Source:** MovieLens dataset (`ratings.csv`, `movieId`/`userId`/`rating`/`timestamp`) combined with a movie metadata file (`movies.csv`) containing titles, genres, and other descriptive fields.
- **Note:** Neither CSV is committed to this repository — download them separately and place them in this folder before running the notebook (see **Setup** below).

## Approach

1. **Build the user–item matrix** — pivot `ratings.csv` so rows are users, columns are movies, and cell values are ratings. Unrated movies are filled with `0`.
2. **Mean-center ratings** — subtract each user's average rating before filling missing values, so an unrated movie isn't mistaken for a genuinely low rating.
3. **Compute item-item similarity** — cosine similarity is calculated between movie columns on the centered matrix.
4. **Predict ratings** — for every user, predicted ratings are a similarity-weighted average of their centered ratings, with the user's mean added back to return to the original 0–5 scale.
5. **Evaluate** — predictions are compared against actual ratings (excluding unrated entries) using RMSE and MSE.

## Setup

### Notebook (model training)

```bash
pip install pandas numpy scikit-learn
```

Place `ratings.csv` and `movies.csv` in this folder, then run the notebook top to bottom:

```bash
jupyter notebook Day_10.ipynb
```

### Frontend dashboard (visualizing recommendations)

```powershell
cd frontend
npm install
npm run dev
```

Open the URL printed in the terminal (typically `http://localhost:5173`).

## Results

| Metric | Value |
|---|---|
| RMSE | 0.874 |
| MSE | 0.764 |

*(Corrected after fixing a mislabeled-metric bug and a zero-fill bias — see Known Issues below for what was found and fixed.)*

## Known Issues & Recommended Fixes

Two issues were found and corrected during review:

1. **The printed metric was mislabeled.** The original code printed `"root mean square error"` but never took a square root — it was actually printing MSE. Fixed by computing `sqrt(mean_squared_error(...))`.
2. **Zero-filling biased the similarity and prediction calculations.** Unrated movies were filled with `0`, which was treated as a real low rating rather than "no rating." Fixed by mean-centering each user's ratings before filling with 0.

**Further improvements still worth making:**
- Hold out a proper train/test split (mask a random subset of known ratings) instead of evaluating on the same matrix used to compute similarity, for a realistic generalization estimate.
- Incorporate `movies.csv` metadata (genres) as a fallback for cold-start movies with very few ratings.
- Connect the frontend dashboard to the live `predicted_ratings_df` output instead of the current mock data.

## Frontend Dashboard

A cinema-themed React dashboard (`frontend/`) visualizes model output:

- **User selector** — switch between sample users to see personalized recommendations
- **Top pick hero card** — highest-predicted movie with star rating
- **Metrics plaques** — RMSE, MSE, user count, catalog size
- **Film-strip recommendation list** — top 6 predicted movies per user
- **Rating distribution chart** — dataset-wide rating spread

Built with React + Vite + Recharts. See `frontend/src/MovieRecommenderDashboard.jsx` to swap in live model output (currently uses mock data — see the `RECOMMENDATIONS_BY_USER` object).

## Project Structure

```
Day_10/
├── Day_10.ipynb                     # Main notebook: pivot, similarity, prediction, evaluation
├── ratings.csv                      # Dataset — not committed, see Setup
├── movies.csv                       # Dataset — not committed, see Setup
├── Readme.md                        # This file
│
└── frontend/                        # React dashboard
    ├── package.json
    ├── vite.config.js
    ├── index.html
    ├── .gitignore                   # node_modules/, dist/
    └── src/
        ├── main.jsx
        ├── App.jsx
        └── MovieRecommenderDashboard.jsx
```

## Author

- **GitHub:** https://github.com/MUHIYADIN2025
- **Email:** muhidiin090448@gmail.com