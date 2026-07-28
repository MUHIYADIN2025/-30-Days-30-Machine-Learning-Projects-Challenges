# 🏡 Ames Housing Price Prediction using XGBoost

An end-to-end Machine Learning pipeline predicting residential property prices in Ames, Iowa, using an **XGBoost Regressor** and standard Data Science best practices. This project demonstrates proper preprocessing, handling of high-cardinality categorical data, log-transformation techniques for target distribution correction, and hyperparameter configuration for gradient boosting.

**Author:** Muhiadin Said Hassan
**Series:** 30 Days 30 Machine Learning Projects Challenge

---

## Table of Contents

- [Project Overview](#-project-overview)
- [Key Pipeline & Technical Steps](#️-key-pipeline--technical-steps)
- [Why These Design Choices?](#why-these-design-choices)
- [Getting Started](#-getting-started)
- [Code Snippet](#-code-snippet)
- [Results & Future Improvements](#-results--future-improvements)
- [Project Structure](#project-structure)
- [Known Limitations](#known-limitations)
- [License](#-license)
- [Author](#-author)

---

## 📌 Project Overview

Predicting property values is a classic regression problem complicated by non-linear relationships, missing data, and mixed data types (numerical and categorical).

* **Dataset:** Ames Housing Dataset (2,930 observations, 81 features)
* **Target Variable:** `SalePrice` (USD)
* **Primary Evaluation Metric:** Root Mean Squared Error (RMSE) / Root Mean Squared Logarithmic Error (RMSLE)
* **Model:** XGBoost (`XGBRegressor`) with native categorical support

## 🛠️ Key Pipeline & Technical Steps

### 1. Data Cleaning & Feature Dropping

* **Identifier Removal:** Features like `Order` and `PID` are arbitrary database indices. Leaving them in model training causes severe overfitting, since the model can learn to "memorize" rows by their index rather than by meaningful housing attributes. These are stripped prior to feature engineering.

### 2. Missing Value Imputation

* **Numerical Features:** Missing entries are imputed using the column median to avoid sensitivity to extreme outliers (unlike the mean, which large outlier sale prices or lot sizes would skew).
* **Categorical Features:** Missing entries are imputed with `'None'`, accounting for real-world domain meaning (e.g., `None` for a house without a pool or garage — in the Ames dataset, a missing value in `PoolQC` or `GarageType` genuinely means "this house doesn't have one," not "data was lost").

### 3. Native Categorical Encoding

Rather than expanding feature space dimensions using One-Hot Encoding (`pd.get_dummies`), which leads to high sparsity (a single high-cardinality column like `Neighborhood` can explode into dozens of sparse binary columns), the pipeline leverages **XGBoost's Native Categorical Support** (`enable_categorical=True`). Categorical variables are converted to pandas `category` dtype, allowing the tree algorithm to find optimal splits natively without inflating the feature matrix.

### 4. Target Transformation

Real estate prices are heavily right-skewed — a small number of very expensive homes stretch the distribution's tail. To prevent predictions from being disproportionately influenced by these high-value outliers and to stabilize variance:

1. Target values are transformed using **log(1 + y)** prior to training.
2. Model outputs are inverse-transformed (**exp(y) − 1**) back to original USD currency units during validation evaluation.

## Why These Design Choices?

| Choice | Alternative | Why This Was Preferred |
|---|---|---|
| XGBoost native categorical support | One-Hot Encoding | Avoids sparse, high-dimensional feature blow-up from columns like `Neighborhood` (28 categories) or `Exterior1st` (15+ categories) |
| Median imputation (numeric) | Mean imputation | Robust to outlier sale prices and lot sizes that would otherwise pull the mean away from a "typical" value |
| `'None'` imputation (categorical) | Mode imputation / drop rows | Preserves the dataset's actual meaning — missing often encodes "feature absent," not "data missing at random" |
| Log-transformed target | Raw `SalePrice` | Right-skewed price distribution would otherwise cause the model to over-prioritize minimizing error on expensive homes at the cost of typical ones |
| XGBoost | Linear Regression / Random Forest | Handles non-linear feature interactions (e.g., quality × square footage) and mixed data types better than linear models, with typically faster training and better accuracy than a plain Random Forest on tabular data of this size |

## 🚀 Getting Started

### Prerequisites

Ensure you have Python 3.9+ installed along with the required libraries:

```bash
pip install pandas numpy scikit-learn xgboost
```

### Running the Notebook

```bash
jupyter notebook housing_prediction.ipynb
```

Run all cells top to bottom. The notebook loads `AmesHousing.csv`, applies the preprocessing pipeline described above, trains the model, and prints validation RMSE.

## ⚡ Code Snippet

```python
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from xgboost import XGBRegressor
from sklearn.metrics import root_mean_squared_error

# Load dataset
data = pd.read_csv('AmesHousing.csv').drop(columns=['Order', 'PID'], errors='ignore')

# Imputation
num_cols = data.select_dtypes(include=[np.number]).columns
cat_cols = data.select_dtypes(exclude=[np.number]).columns

data[num_cols] = data[num_cols].fillna(data[num_cols].median())
data[cat_cols] = data[cat_cols].fillna('None')

# Convert string categories to Pandas category dtype
for col in cat_cols:
    data[col] = data[col].astype('category')

# Features and target log-transformation
X = data.drop('SalePrice', axis=1)
y = np.log1p(data['SalePrice'])

# Train-Test Split
X_train, X_val, y_train, y_val = train_test_split(X, y, test_size=0.2, random_state=42)

# Model Training
model = XGBRegressor(
    n_estimators=500,
    learning_rate=0.05,
    max_depth=6,
    enable_categorical=True,
    random_state=42,
    early_stopping_rounds=50
)

model.fit(X_train, y_train, eval_set=[(X_val, y_val)], verbose=False)

# Evaluation
preds = np.expm1(model.predict(X_val))
actuals = np.expm1(y_val)
rmse = root_mean_squared_error(actuals, preds)

print(f"Validation RMSE: ${rmse:,.2f}")
```

## 📊 Results & Future Improvements

**Current Model Performance:** RMSE ≈ \$22,000–\$25,000 USD (depending on early stopping and hyperparameter configuration).

To put this in context: with a median Ames home price in the roughly \$150,000–\$200,000 range, an RMSE of \$22K–\$25K represents typical prediction error of about **12–15%** of a home's value — a reasonable baseline for a first-pass model, but with clear room for improvement (see below).

**Next Steps:**

* Add domain-specific feature engineering (e.g., `TotalSF = GrLivArea + TotalBsmtSF`, house age at time of sale, renovation recency).
* Implement automated hyperparameter tuning using **Optuna** or **GridSearchCV** rather than manually chosen `n_estimators`/`learning_rate`/`max_depth` values.
* Experiment with stacked ensembling (e.g., combining LightGBM, CatBoost, and Ridge Regression) to capture complementary error patterns across model types.
* Add k-fold cross-validation instead of a single train/validation split, for a more reliable estimate of generalization error.
* Report RMSLE alongside RMSE, since it more directly reflects the log-scale objective the model is actually optimizing.

## Project Structure

```text
Ames-Housing-Price-Prediction/
├── AmesHousing.csv          # Dataset file
├── housing_prediction.ipynb # Interactive Jupyter Notebook
└── README.md                # Project documentation
```

## Known Limitations

- **Single train/validation split** — the reported RMSE range comes from one 80/20 split rather than cross-validation, so it carries more variance than a k-fold estimate would.
- **No outlier removal** — a small number of documented extreme outliers in the Ames dataset (e.g., very large homes sold at unexpectedly low prices) are known to distort regression metrics if left in; they are not explicitly filtered here.
- **Manually chosen hyperparameters** — `n_estimators=500`, `learning_rate=0.05`, `max_depth=6` were set directly rather than tuned via search, so there is likely headroom left on the table.
- **No feature importance / explainability review** — the notebook does not currently inspect which features drive predictions (e.g., via `model.feature_importances_` or SHAP), which would help validate that the model is learning sensible housing-price relationships rather than spurious correlations.

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

## 👨‍💻 Author

**Muhiadin Said Hassan**
Developed as part of the 30-Day Machine Learning Projects Challenge.

- **GitHub:** https://github.com/MUHIYADIN2025
- **Email:** muhidiin090448@gmail.com