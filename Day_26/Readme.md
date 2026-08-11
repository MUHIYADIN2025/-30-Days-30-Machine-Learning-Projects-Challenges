# 🎬 Day 26 — Hybrid Movie Recommendation System

> **A full-stack Machine Learning recommendation engine combining Content-Based Filtering and Collaborative Filtering into a production-style hybrid recommendation pipeline.**

[![Python](https://img.shields.io/badge/Python-3.x-3776AB?style=for-the-badge\&logo=python\&logoColor=white)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-REST_API-000000?style=for-the-badge\&logo=flask\&logoColor=white)](https://flask.palletsprojects.com/)
[![React](https://img.shields.io/badge/React-Vite-61DAFB?style=for-the-badge\&logo=react\&logoColor=black)](https://react.dev/)
[![Scikit-Learn](https://img.shields.io/badge/Scikit--Learn-ML-F7931E?style=for-the-badge\&logo=scikit-learn\&logoColor=white)](https://scikit-learn.org/)
[![Pandas](https://img.shields.io/badge/Pandas-Data_Processing-150458?style=for-the-badge\&logo=pandas\&logoColor=white)](https://pandas.pydata.org/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](#-license)

---

## 📌 Project Overview

**Day 26** focuses on building an end-to-end **Hybrid Movie Recommendation System** that combines two major recommendation techniques:

* 🎯 **Content-Based Filtering**
* 👥 **Collaborative Filtering**

The system uses a two-stage recommendation pipeline:

```text
User + Seed Movie
       │
       ▼
┌───────────────────────────┐
│ Content-Based Filtering   │
│ TF-IDF + Cosine Similarity│
└─────────────┬─────────────┘
              │
              ▼
     Candidate Movies
              │
              ▼
┌───────────────────────────┐
│ Collaborative Filtering   │
│ SVD Rating Prediction     │
└─────────────┬─────────────┘
              │
              ▼
      Personalized Ranking
              │
              ▼
       Top-N Recommendations
```

The application is completely decoupled into a **React frontend** and a **Flask REST API backend**, communicating through HTTP requests and JSON responses.

---

# ✨ Key Features

### 🎬 Hybrid Recommendation Engine

Combines content similarity with personalized user-rating predictions to generate more relevant recommendations.

### 🧠 Content-Based Filtering

Uses:

* TF-IDF Vectorization
* Movie genres / metadata
* Cosine Similarity

This stage identifies movies that are similar to the selected seed movie.

### 👤 Collaborative Filtering

Uses:

* Singular Value Decomposition (SVD)
* User-item rating relationships
* Predicted user ratings

The model estimates how much a specific user may enjoy candidate movies.

### 🔀 Two-Stage Recommendation Pipeline

Instead of relying on a single algorithm:

```text
Stage 1
TF-IDF + Cosine Similarity
          ↓
Candidate Generation
          ↓
Stage 2
SVD Rating Prediction
          ↓
Personalized Ranking
          ↓
Top-N Movies
```

### ⚡ REST API

Flask provides a lightweight API layer for:

* Movie catalog retrieval
* Personalized recommendations
* JSON-based communication
* Cross-Origin Resource Sharing (CORS)

### 💻 Modern Frontend

Built with:

* React
* Vite
* Component-based architecture
* Responsive UI
* Searchable movie selection
* User ID input
* Loading states
* Error handling
* Predicted rating badges

---

# 🏗️ System Architecture

```text
                         ┌──────────────────────────────┐
                         │       React Frontend         │
                         │        Vite + React          │
                         │                              │
                         │  • User ID                   │
                         │  • Movie Search              │
                         │  • Recommendation UI        │
                         │  • Rating Display             │
                         └──────────────┬───────────────┘
                                        │
                              HTTP / JSON Requests
                                        │
                                        ▼
                         ┌──────────────────────────────┐
                         │        Flask REST API        │
                         │            app.py            │
                         │                              │
                         │  GET  /api/movies            │
                         │  POST /api/recommend         │
                         └──────────────┬───────────────┘
                                        │
                                        ▼
                         ┌──────────────────────────────┐
                         │   hybrid_recommender.pkl     │
                         │                              │
                         │  Serialized ML Artifacts     │
                         └──────────────┬───────────────┘
                                        │
                    ┌───────────────────┴───────────────────┐
                    │                                       │
                    ▼                                       ▼
        ┌──────────────────────┐              ┌──────────────────────┐
        │ Content-Based Model  │              │ Collaborative Model  │
        │                      │              │                      │
        │ TF-IDF              │              │ SVD                  │
        │ Genres / Metadata   │              │ User Ratings         │
        │ Cosine Similarity   │              │ Rating Prediction    │
        └──────────┬───────────┘              └──────────┬───────────┘
                   │                                     │
                   └──────────────────┬──────────────────┘
                                      ▼
                         ┌──────────────────────────────┐
                         │       Ranking Engine         │
                         │                              │
                         │      Top-N Recommendations   │
                         └──────────────┬───────────────┘
                                        │
                                        ▼
                         ┌──────────────────────────────┐
                         │        JSON Response         │
                         │                              │
                         │ Personalized Recommendations │
                         └──────────────────────────────┘
```

---

# 🧠 Machine Learning Pipeline

## 1️⃣ Data Preparation

The system uses the MovieLens datasets:

```text
movies.csv
ratings.csv
```

Movie metadata contains information such as:

```text
movieId
title
genres
```

Ratings contain user-item interactions used by the collaborative filtering model.

---

## 2️⃣ Content-Based Filtering

Movie genres are transformed into numerical vectors using **TF-IDF**.

Conceptually:

```text
Movie Genres
     ↓
TF-IDF Vectorization
     ↓
Numerical Feature Matrix
     ↓
Cosine Similarity
     ↓
Similar Movies
```

Cosine similarity measures how similar two movie feature vectors are.

Higher similarity indicates stronger content similarity.

---

## 3️⃣ Collaborative Filtering

The collaborative filtering component uses **Singular Value Decomposition (SVD)** to learn latent relationships between:

```text
Users ↔ Movies ↔ Ratings
```

The model predicts a rating for a specific user and candidate movie.

Example:

```text
User ID: 1

Candidate Movie A → 4.65
Candidate Movie B → 4.41
Candidate Movie C → 4.28
```

---

## 4️⃣ Hybrid Recommendation

The final recommendation process combines both approaches:

```text
Seed Movie
    │
    ▼
Find Similar Movies
    │
    ▼
Generate Candidates
    │
    ▼
Predict User Ratings
    │
    ▼
Sort by Predicted Rating
    │
    ▼
Return Top-N
```

This creates a recommendation system that considers both:

> **"What is similar to this movie?"**

and

> **"What is this user likely to enjoy?"**

---

# 📁 Repository Structure

```text
Day_26/
│
├── backend/
│   ├── app.py
│   ├── train_and_export.py
│   ├── hybrid_recommender.pkl
│   ├── movies.csv
│   └── ratings.csv
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

# 🛠️ Technology Stack

| Layer                   | Technology      |
| ----------------------- | --------------- |
| Programming Language    | Python          |
| Machine Learning        | Scikit-Learn    |
| Collaborative Filtering | SVD             |
| Data Processing         | Pandas          |
| Model Serialization     | Joblib / Pickle |
| Backend                 | Flask           |
| API                     | REST + JSON     |
| CORS                    | Flask-CORS      |
| Frontend                | React           |
| Build Tool              | Vite            |
| Dataset                 | MovieLens       |
| Version Control         | Git / GitHub    |

---

# 📡 REST API

## 🎞️ Get Movie Catalog

### Endpoint

```http
GET /api/movies
```

Returns available movie titles for the frontend movie selector.

### Example

```bash
curl http://127.0.0.1:5000/api/movies
```

---

## 🎯 Get Hybrid Recommendations

### Endpoint

```http
POST /api/recommend
```

### Request

```json
{
  "user_id": 1,
  "title": "Toy Story (1995)",
  "top_n": 6
}
```

### Response

```json
{
  "user_id": 1,
  "base_movie": "Toy Story (1995)",
  "recommendations": [
    {
      "movieId": 3114,
      "title": "Toy Story 2 (1999)",
      "genres": "Adventure|Animation|Children|Comedy|Fantasy",
      "predicted_rating": 4.65
    }
  ]
}
```

---

# 🚀 Getting Started

## Prerequisites

Make sure you have installed:

* Python 3.x
* Node.js
* npm
* Git

---

## 1️⃣ Clone the Repository

```bash
git clone <YOUR_REPOSITORY_URL>
cd Day_26
```

> Replace `<YOUR_REPOSITORY_URL>` with the actual repository URL.

---

# 🐍 Backend Setup

Navigate to the backend:

```bash
cd backend
```

Install dependencies:

```bash
pip install pandas scikit-learn scikit-surprise flask flask-cors joblib
```

---

## 🧠 Train the Recommendation Model

Run:

```bash
python train_and_export.py
```

This generates the serialized recommendation artifact:

```text
hybrid_recommender.pkl
```

---

## ▶️ Start Flask API

Run:

```bash
python app.py
```

The backend should be available at:

```text
http://127.0.0.1:5000
```

---

# ⚛️ Frontend Setup

Open another terminal.

Navigate to:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Vite will provide a local URL similar to:

```text
http://localhost:5173
```

Open that URL in your browser.

---

# 🔄 Application Workflow

```text
1. User opens React application
              ↓
2. Frontend requests movie catalog
              ↓
3. User selects a movie
              ↓
4. User enters User ID
              ↓
5. React sends POST request
              ↓
6. Flask receives request
              ↓
7. TF-IDF finds similar movies
              ↓
8. SVD predicts user ratings
              ↓
9. Recommendations are ranked
              ↓
10. Flask returns JSON
              ↓
11. React renders Top-N movies
```

---

# 🧪 Example Use Case

Suppose the user selects:

```text
User ID
1

Movie
Toy Story (1995)

Recommendations
6
```

The backend performs:

```text
Toy Story (1995)
        ↓
Genre Similarity
        ↓
Candidate Movies
        ↓
SVD Predictions
        ↓
Ranking
        ↓
Top 6 Recommendations
```

The frontend then displays the personalized results with predicted ratings.

---

# 🛠️ Troubleshooting

| Problem               | Possible Cause                 | Solution                                |
| --------------------- | ------------------------------ | --------------------------------------- |
| Network error         | Flask server is not running    | Run `python app.py`                     |
| CORS error            | CORS configuration missing     | Verify `CORS(app)`                      |
| `KeyError: movieId`   | Dataset column mismatch        | Check `movies.csv` columns              |
| Movie not found       | Incorrect movie title          | Verify title exists in dataset          |
| Blank React page      | JavaScript/runtime error       | Open browser DevTools with `F12`        |
| `ModuleNotFoundError` | Missing Python package         | Run the dependency installation command |
| Port already in use   | Another process uses port 5000 | Stop the process or change Flask port   |
| Missing `.pkl` file   | Model hasn't been exported     | Run `python train_and_export.py`        |

---

# 📊 Engineering Concepts Demonstrated

This project demonstrates practical experience with:

* Machine Learning pipelines
* Recommendation systems
* Content-based filtering
* Collaborative filtering
* TF-IDF
* Cosine similarity
* Matrix factorization
* SVD
* Feature engineering
* Model serialization
* REST API development
* Flask backend development
* React frontend development
* Frontend/backend separation
* API integration
* JSON communication
* CORS configuration
* Error handling
* Full-stack ML application architecture

---

# 🎯 Learning Objectives — Day 26

By completing this project, the following concepts were practiced:

```text
Machine Learning
       +
Recommendation Systems
       +
Python
       +
Flask REST API
       +
React
       +
Vite
       +
Model Deployment
       +
Full-Stack Integration
```

The project demonstrates how a trained ML model can be transformed into an interactive application rather than remaining inside a notebook.

---

# 🔮 Future Improvements

Potential improvements include:

* [ ] Add user authentication
* [ ] Add movie posters and images
* [ ] Add genre filtering
* [ ] Add recommendation explanations
* [ ] Add popularity-based fallback recommendations
* [ ] Add model evaluation metrics
* [ ] Add recommendation history
* [ ] Add user profiles
* [ ] Add Docker deployment
* [ ] Add automated testing
* [ ] Add production WSGI server
* [ ] Deploy frontend and backend to cloud infrastructure
* [ ] Add CI/CD pipeline

---

# 📸 Screenshots

Add your application screenshots here:

```markdown
![Home Page](screenshots/home.png)

![Movie Recommendations](screenshots/recommendations.png)

![API Response](screenshots/api-response.png)
```

Recommended screenshot structure:

```text
Day_26/
└── screenshots/
    ├── home.png
    ├── recommendations.png
    └── api-response.png
```

---

# 💡 Why This Project Matters

Traditional recommendation systems often rely on only one source of information.

A **hybrid recommendation system** combines different recommendation strategies to produce a more personalized experience.

This project demonstrates an important real-world Machine Learning workflow:

```text
Raw Data
   ↓
Data Processing
   ↓
Feature Engineering
   ↓
Model Training
   ↓
Model Serialization
   ↓
REST API
   ↓
Frontend Application
   ↓
End User
```

This makes the project a practical example of moving from **Machine Learning experimentation to application development**.

---

# 👨‍💻 Author

**Muhiadin Said Hassan**

### Software AI Engineer | Machine Learning Engineer

Focused on building practical AI and Machine Learning applications, intelligent systems, and production-oriented software solutions.

---

# 📚 Project Series

**Day 26** is part  of  30 Days 30 Machine Learning Projects Challenge. of an ongoing Machine Learning / AI development journey focused on transforming theoretical concepts into practical, deployable applications.

```text
Day 26
└── Hybrid Movie Recommendation System
    ├── Content-Based Filtering
    ├── Collaborative Filtering
    ├── TF-IDF
    ├── Cosine Similarity
    ├── SVD
    ├── Flask REST API
    └── React + Vite Frontend
```

---

# 📜 License

This project is distributed under the **MIT License**.

---

<div align="center">

### 🎬 Hybrid Recommendation System

**Machine Learning • Recommendation Systems • Flask • React**

⭐ If you found this project useful, consider giving the repository a star.

</div>
