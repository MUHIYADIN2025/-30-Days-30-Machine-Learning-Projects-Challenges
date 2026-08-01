# 📊 Day 17: Customer Segmentation & Churn Prediction System

**Author:** Muhiadin Said Hassan
**Objective:** End-to-end Machine Learning pipeline to group customers into behavioral clusters using K-Means Clustering and predict potential customer churn using Supervised Classification Models.

This project is part of the **30 Days 30 Machine Learning Projects Challenge**.

---

## Table of Contents

- [Project Overview](#-project-overview)
- [Key Features](#key-features)
- [Tech Stack & Dependencies](#️-tech-stack--dependencies)
- [Dataset](#-dataset)
- [Methodology & Pipeline](#️-methodology--pipeline)
- [Why K-Means + Supervised Classification Together?](#why-k-means--supervised-classification-together)
- [Model Performance Summary](#-model-performance-summary)
- [How to Run](#-how-to-run)
- [Project Structure](#project-structure)
- [Known Limitations & Future Improvements](#known-limitations--future-improvements)
- [Author](#-author)

---

## 📌 Project Overview

Customer retention is crucial for telecommunications and subscription-based businesses — acquiring a new customer typically costs far more than retaining an existing one. This project implements a hybrid machine learning pipeline combining **Unsupervised Learning** (for customer segmentation) and **Supervised Learning** (for churn prediction), so retention teams can act on *which type* of customer is at risk rather than treating the customer base as a single undifferentiated group.

### Key Features

- **Data Preprocessing & Cleaning** — handles missing values, type casting, and data transformations.
- **Customer Segmentation (Unsupervised)** — groups customers based on tenure and financial behavior using K-Means Clustering and the Elbow Method.
- **Churn Prediction (Supervised)** — evaluates classification models (Logistic Regression and Random Forest) to forecast customer churn using extracted segments alongside demographic and service features.

## 🛠️ Tech Stack & Dependencies

- **Language:** Python 3.8+
- **Data Manipulation:** `pandas`, `numpy`
- **Visualization:** `matplotlib`, `seaborn`
- **Machine Learning:** `scikit-learn` (`KMeans`, `LogisticRegression`, `RandomForestClassifier`, `StandardScaler`, `OneHotEncoder`, `ColumnTransformer`)

Install all required packages via pip:

```bash
pip install pandas numpy matplotlib seaborn scikit-learn
```

## 📂 Dataset

The project uses the official **IBM Telco Customer Churn** dataset.

- **Source:** IBM Telco Customer Churn CSV
- **Records:** 7,043 rows × 21 columns
- **Target Variable:** `Churn` (Yes / No)

## ⚙️ Methodology & Pipeline

```text
┌─────────────────┐     ┌──────────────────┐     ┌───────────────────┐     ┌──────────────────┐
│  Data Ingestion │ ──> │ Data Preprocess  │ ──> │ K-Means Clustering│ ──> │  Model Training  │
│  & Exploration  │     │   & Encoding     │     │   (Segment_ID)    │     │   & Evaluation   │
└─────────────────┘     └──────────────────┘     └───────────────────┘     └──────────────────┘
```

**1. Preprocessing:**
- Numerical conversion of `TotalCharges` (handling empty-string blanks with median imputation — this field is stored as text in the raw CSV and a small number of rows contain blank strings instead of numeric values for zero-tenure customers).
- Target encoding (`Churn`: Yes → 1, No → 0).
- Standard scaling for continuous features (`tenure`, `MonthlyCharges`, `TotalCharges`).
- One-Hot Encoding for categorical features using `ColumnTransformer`, keeping the encoding pipeline reusable and consistent between training and inference.

**2. Customer Segmentation (K = 3):**
- Applies K-Means clustering on scaled continuous parameters.
- Saves the optimal cluster evaluation chart as `elbow_telecom.png` — the Elbow Method plots within-cluster sum of squares (WCSS) against different values of K, and K is chosen at the point where adding more clusters stops meaningfully reducing WCSS.
- Appends the assigned `Segment_ID` as an engineered feature into the dataset, feeding the unsupervised result directly into the supervised stage below.

**3. Supervised Classification:**
- Evaluates Logistic Regression vs. Random Forest Classifier.
- Evaluated using standard metrics: Accuracy, Precision, Recall, and F1-Score.

## Why K-Means + Supervised Classification Together?

Treating segmentation and churn prediction as two separate, disconnected steps misses a useful signal: *which behavioral segment a customer belongs to* often correlates with churn risk in ways that raw account fields (tenure, contract type) don't fully capture on their own. By folding the K-Means `Segment_ID` back in as an engineered feature for the classifier, the supervised model gets access to a compressed summary of a customer's overall behavioral profile — without needing to be a clustering model itself. This keeps a single, clearly evaluable target for the supervised task (churn: yes/no) while still incorporating unsupervised learning into the pipeline.

## 📈 Model Performance Summary

| Model | Accuracy | Precision | Recall | F1-Score |
|---|:---:|:---:|:---:|:---:|
| **Logistic Regression** | 80.62% | 0.6593 | 0.5588 | **0.6049** |
| Random Forest | 78.85% | 0.6293 | 0.5539 | 0.5539 |

**Note:** Logistic Regression outperformed Random Forest across all key evaluation metrics (Accuracy, Recall, and F1-Score) for predicting churn in this dataset configuration. This is a useful reminder that a simpler, more interpretable model can beat a more complex ensemble once the evaluation metric is matched to the actual business problem — F1-Score is prioritized here over raw accuracy because the dataset is class-imbalanced (churners are the minority class), and accuracy alone would understate how well each model catches at-risk customers.

## 🚀 How to Run

**1. Clone the repository:**

```bash
git clone <repository-url>
cd Day_17
```

**2. Run the Jupyter Notebook:**

```bash
jupyter notebook Day_17.ipynb
```

Run all cells top to bottom — the notebook performs preprocessing, clustering, model training, and evaluation, and writes the generated artifacts below.

**Generated Artifacts:**
- `elbow_telecom.png` — visualization of the Elbow Method for optimal K selection.
- `telecom_segmented_customers.csv` — processed dataset containing customer details and assigned `Segment_ID`.

## Project Structure

```text
Day_17/
├── Day_17.ipynb                     # Main notebook: preprocessing, clustering, training, evaluation
├── Telco-Customer-Churn.csv         # Dataset (IBM Telco Customer Churn)
├── elbow_telecom.png                # Generated: Elbow Method chart for K selection
├── telecom_segmented_customers.csv  # Generated: dataset with assigned Segment_ID
└── README.md                        # Project documentation
```

## Known Limitations & Future Improvements

- **K = 3 is not shown to be validated against alternative K values in the summary above** — beyond the Elbow Method chart, reporting a Silhouette Score would give a second, more quantitative check that 3 clusters are actually well-separated rather than an arbitrary choice.
- **Single train/test split** — model comparison is based on one split rather than k-fold cross-validation, so the reported metrics carry more variance than a cross-validated estimate would.
- **No hyperparameter tuning shown** — both Logistic Regression and Random Forest appear to use default or lightly-configured hyperparameters; a grid search (especially over Random Forest's `n_estimators`/`max_depth`) could change which model wins.
- **Clustering features are limited to tenure and financial fields** — segmentation could potentially be richer by including service-usage features (e.g., number of add-on services) rather than tenure/charges alone.
- **No deployment layer** — this notebook produces a trained model and segmented dataset but does not expose a prediction API; see the related capstone project (`churn-segmentation-project` on GitHub) for a FastAPI deployment of a similar pipeline.

## 👨‍💻 Author

**Muhiadin Said Hassan**
Developed as part of the 30-Day Machine Learning Projects Challenge.

- **GitHub:** https://github.com/MUHIYADIN2025
- **Email:** muhidiin090448@gmail.com