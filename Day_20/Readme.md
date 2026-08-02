# 🎬 Day 20: Recommender System using Matrix Factorization (SVD)

An end-to-end Collaborative Filtering Recommender System built on the **MovieLens Small Dataset** using **Singular Value Decomposition (SVD)** via the `scikit-surprise` library.

This project is part of the **30 Days 30 Machine Learning Projects Challenge**.

**Author:** Muhiadin Said Hassan

---

## Table of Contents

- [Project Overview](#-project-overview)
- [What Is SVD-Based Collaborative Filtering?](#-what-is-svd-based-collaborative-filtering)
- [Data Pipeline & Key Steps](#️-data-pipeline--key-steps)
- [Evaluation Results](#-evaluation-results)
- [Getting Started](#-getting-started)
- [Tech Stack](#️-tech-stack)
- [Known Limitations & Future Improvements](#known-limitations--future-improvements)
- [Author](#-author)

---

## 📌 Project Overview

Recommender systems are essential for modern content platforms to personalize user experience. This project uses **Matrix Factorization (SVD)** to decompose user-item interaction matrices into lower-dimensional latent factors, enabling accurate prediction of user ratings for unrated movies.

## 🔍 What Is SVD-Based Collaborative Filtering?

The core idea behind matrix factorization for recommendations: represent every user and every movie as a vector of **latent factors** — dimensions that aren't hand-labeled (not "action-ness" or "runtime") but are learned automatically from the rating data itself. A user's predicted rating for a movie is then estimated as the dot product of that user's latent vector and that movie's latent vector, plus learned bias terms for the user, the movie, and the global average rating.

SVD factorizes the (extremely sparse — most users haven't rated most movies) user-item ratings matrix into two smaller, dense matrices whose product approximates the original ratings. Training the model means learning the latent factors and bias terms that minimize prediction error on the ratings that *are* known, which then generalizes to predicting the ratings that aren't.

**This is a meaningfully different approach from the item-based cosine-similarity collaborative filtering built earlier in this challenge (Day 10):** that approach directly compares raw rating vectors between items, while SVD learns compressed latent representations. SVD is generally more robust to sparsity and tends to generalize better on larger datasets, at the cost of being less directly interpretable — you can't easily point to *why* two movies ended up with similar latent vectors, whereas cosine similarity between raw rating patterns is more transparent.

## 🛠️ Data Pipeline & Key Steps

### Step 1 — Data Ingestion & Exploration

- Loaded the MovieLens dataset (`ratings.csv`).
- Extracted core interaction attributes: `userId`, `movieId`, `rating`, and `timestamp`.

### Step 2 — Data Preparation for Surprise Library

- Determined rating boundaries (`min = 0.5`, `max = 5.0`).
- Constructed a `Reader` object configured for the rating scale — `surprise` needs this explicitly since it doesn't infer the valid rating range from the data automatically.
- Extracted relevant columns (`userId`, `movieId`, `rating`) to create a `Surprise Dataset`.

### Step 3 — Model Training & Validation

- Utilized 5-fold cross-validation (`cv=5`) to evaluate model stability across iterations, rather than relying on a single train/test split.
- Evaluated standard error metrics: **RMSE** (Root Mean Squared Error) and **MSE** (Mean Squared Error).

## 📊 Evaluation Results

| Metric | Fold 1 | Fold 2 | Fold 3 | Fold 4 | Fold 5 | **Mean** | **Std** |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **RMSE** | 0.8724 | 0.8690 | 0.8734 | 0.8805 | 0.8733 | **0.8737** | **0.0037** |
| **MSE** | 0.7611 | 0.7552 | 0.7628 | 0.7752 | 0.7627 | **0.7634** | **0.0065** |

> **Key Takeaway:** the model demonstrated stable training across folds with an average **RMSE of ~0.87** on a 0.5–5.0 rating scale, and — just as importantly — a very low standard deviation across folds (0.0037), meaning performance isn't dependent on which particular slice of users/movies ends up in the training vs. validation split. This consistency is itself a meaningful result, separate from the RMSE value alone.

## 🚀 Getting Started

### 1. Prerequisites

Install the required Python packages:

```bash
pip install pandas scikit-surprise
```

> **Note:** the PyPI package name is `scikit-surprise`, but the Python import statement is `import surprise` — installing a package literally named `surprise` will fail with `ModuleNotFoundError`. On Windows, `scikit-surprise` compiles a native extension at install time and may require Microsoft C++ Build Tools if the install fails; it also currently requires `numpy<2.0`.

### 2. Dataset Source

Download the MovieLens Small Dataset directly from [Kaggle](https://www.kaggle.com/datasets/shubhammehta21/movie-lens-small-latest-dataset) and place `ratings.csv` into your project directory.

### 3. Folder Structure

```text
Day_20/
├── ratings.csv
├── Day_20.ipynb
└── README.md
```

## ⚙️ Tech Stack

- **Language:** Python 3.x
- **Data Handling:** `pandas`
- **Recommendation Framework:** `scikit-surprise` (`SVD`, `Dataset`, `Reader`)

## Known Limitations & Future Improvements

- **No hyperparameter tuning shown** — `SVD()` here appears to use default hyperparameters (number of latent factors, learning rate, regularization). `surprise.model_selection.GridSearchCV` could search over these to improve RMSE further.
- **Cold-start problem not addressed** — SVD (like all collaborative filtering) cannot generate meaningful predictions for a brand-new user or movie with no rating history, since there's no interaction data to learn a latent vector from. A production system typically needs a fallback strategy (e.g., popularity-based recommendations) for these cases.
- **RMSE alone doesn't measure recommendation quality directly** — a low RMSE on rating prediction doesn't necessarily mean the *top-N recommendations* shown to a user are good; ranking-focused metrics (e.g., Precision@K, Recall@K, NDCG) would give a more direct measure of recommendation usefulness.
- **"Small" MovieLens dataset only** — this dataset is intentionally limited in size for fast experimentation; results on the full MovieLens dataset (25M+ ratings) may differ, and production-scale sparsity is typically far more severe.
- **No comparison against the Day 10 item-based approach** — since both projects solve the same underlying problem on similar data, a direct RMSE comparison between the cosine-similarity method (Day 10) and this SVD method would be a natural next analysis.

## 👨‍💻 Author

**Muhiadin Said Hassan**
Developed as part of the 30-Day Machine Learning Projects Challenge.

- **GitHub:** https://github.com/MUHIYADIN2025
- **Email:** muhidiin090448@gmail.com