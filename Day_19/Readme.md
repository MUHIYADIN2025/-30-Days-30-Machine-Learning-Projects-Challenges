# 🛒 Day 19: Fraudulent E-Commerce Transaction Analysis & Detection

An end-to-end Machine Learning project analyzing ~1.5 million e-commerce transactions to identify patterns of fraudulent activity, perform data cleaning, handle domain-specific anomalies, and train a **Random Forest Classifier** to detect fraud.

This project is part of the **30 Days 30 Machine Learning Projects Challenge**.

**Author:** Muhiadin Said Hassan

---

## Table of Contents

- [Project Overview](#-project-overview)
- [Data Pipeline & Key Steps](#️-data-pipeline--key-steps)
- [Why Random Forest for Fraud Detection?](#why-random-forest-for-fraud-detection)
- [Handling Class Imbalance](#handling-class-imbalance)
- [Tech Stack](#️-model--tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#project-structure)
- [Known Limitations & Future Improvements](#known-limitations--future-improvements)
- [Important Disclaimer](#️-important-disclaimer)
- [Author](#-author)

---

## 📌 Project Overview

E-commerce platforms face significant financial losses due to fraudulent transactions. This project focuses on processing a high-volume dataset (~1.5M rows) of customer transactions, detecting data quality issues (e.g., negative or under-age customer records), and building an automated predictive model to classify transactions as **Legitimate** or **Fraudulent**.

## 🛠️ Data Pipeline & Key Steps

### Step 1 — Data Loading & Merging

- Combined multiple raw dataset parts (`Fraudulent_E-Commerce_Transaction_Data.csv` & `Fraudulent_E-Commerce_Transaction_Data_2.csv`) using `pandas`.
- Total dataset shape: **1,496,586 rows** and **16 columns**.
- Verified missing values: **0 null entries** found (clean schema).

### Step 2 — Data Quality & Sanity Check

- Explored feature distributions (e.g., `Customer Age`).
- **Identified Anomalies:**
  - Negative ages: `259` records.
  - Under-age transactions (< 18 years old): `66,526` records.
- **Data Cleaning:** filtered the dataset to include only adult transactions (`Customer Age >= 18`), reducing dataset size to **1,430,060 rows**.

  These aren't edge cases to shrug off — negative ages are physically impossible and indicate either a data entry bug or a placeholder/sentinel value upstream, while a large under-18 segment in an e-commerce fraud dataset is often a sign of test accounts, bot traffic, or a data generation artifact rather than genuine transactions. Leaving them in would let the model learn from records that don't represent real customer behavior.

### Step 3 — Class Imbalance & Fraud Exploration

- Analyzed the target variable `Is Fraudulent`:
  - **Legitimate (0):** ~95%
  - **Fraudulent (1):** ~5%
- Evaluated fraud distribution across categorical drivers like `Payment Method`.

## Why Random Forest for Fraud Detection?

Fraud detection is a classic case where the *pattern* of a transaction matters more than any single feature in isolation — a specific combination of payment method, transaction amount, and timing might be suspicious together even when none of those fields looks unusual alone. A Random Forest naturally captures these feature interactions without manual engineering, handles a mix of numeric and categorical fields well, and — importantly for a fraud analyst — its `feature_importances_` output gives a starting point for explaining *why* the model flags a transaction, which matters when flagged transactions may need human review before action is taken.

## Handling Class Imbalance

With fraud at roughly 5% of transactions, a model can score 95% accuracy by predicting "legitimate" for everything — while catching zero fraud. This makes **accuracy the wrong metric to optimize or report** for this problem. The pipeline should instead prioritize:

- **Precision & Recall on the fraud class specifically** — recall answers "of all real fraud, how much did we catch?"; precision answers "of everything we flagged, how much was actually fraud?" Both matter, and the right balance depends on the cost of a false positive (annoying a legitimate customer) vs. a false negative (missing real fraud).
- **`classification_report` and `confusion_matrix`** (already in the tech stack) over a single accuracy number, since they break out performance per class instead of averaging it away.
- **Class weighting or resampling** — `RandomForestClassifier(class_weight='balanced')` or resampling techniques (e.g., SMOTE oversampling of the minority class) are common next steps if recall on the fraud class is too low with default settings.

## ⚙️ Model & Tech Stack

- **Language:** Python 3.x
- **Data Manipulation:** `pandas`, `numpy`
- **Visualization:** `matplotlib`, `seaborn`
- **Machine Learning:** `scikit-learn` (`RandomForestClassifier`, `train_test_split`, `classification_report`, `confusion_matrix`)

## 🚀 Getting Started

### Prerequisites

Install the required Python packages:

```bash
pip install pandas numpy scikit-learn matplotlib seaborn
```

### Running the Notebook

Ensure both raw dataset files are present in the working directory:
- `Fraudulent_E-Commerce_Transaction_Data.csv`
- `Fraudulent_E-Commerce_Transaction_Data_2.csv`

Then run:

```bash
jupyter notebook Day_19.ipynb
```

Run all cells top to bottom — the notebook merges the two raw files, cleans anomalous records, explores class balance, trains the classifier, and reports evaluation metrics.

## Project Structure

```text
Day_19/
├── Day_19.ipynb                                    # Main notebook: cleaning, EDA, model training, evaluation
├── Fraudulent_E-Commerce_Transaction_Data.csv       # Raw dataset, part 1 (not committed — see note below)
├── Fraudulent_E-Commerce_Transaction_Data_2.csv     # Raw dataset, part 2 (not committed — see note below)
└── README.md                                        # Project documentation
```

> **Note:** at ~1.5M rows, these CSVs are likely large enough to exceed typical Git hosting limits (GitHub blocks files over 100MB). Confirm the combined file sizes before committing — if either exceeds the limit, add them to `.gitignore` and document the data source/download steps here instead, the same pattern used in this challenge's other large-dataset projects (Day_9, Day_16).

## Known Limitations & Future Improvements

- **No explicit class-imbalance handling shown in the pipeline steps above** — if the model is trained on the raw 95/5 split without `class_weight='balanced'` or resampling, it likely has low recall on the fraud class even with strong overall accuracy. This should be verified via the confusion matrix, not the accuracy score.
- **Under-18 and negative-age filtering removes ~4.4% of the original data** — worth double-checking that this filtering doesn't also discard genuine fraud examples from the minority class disproportionately, which would already-scarce fraud examples scarcer still.
- **No temporal validation** — if transactions have timestamps, a random train/test split can leak information from the future into training. A time-based split (train on earlier transactions, test on later ones) gives a more realistic estimate of real-world deployment performance.
- **No cost-sensitive evaluation** — precision/recall/F1 treat all false positives and false negatives as equally costly, which usually isn't true in fraud detection (a missed fraud can cost far more than a false alarm, or vice versa depending on the business). A cost-weighted metric, or an explicit precision-recall tradeoff analysis, would better reflect real business impact.
- **No deployment/monitoring layer** — this notebook produces a trained classifier but not a serving API; fraud patterns also drift over time, so a production system would need periodic retraining and drift monitoring, not a one-time model.

## ⚠️ Important Disclaimer

This project is an educational exercise in applying classification techniques to an imbalanced fraud dataset. It is **not a production fraud detection system** — real fraud detection pipelines require rigorous validation, cost-sensitive evaluation, human-in-the-loop review processes, and regulatory compliance considerations well beyond the scope of this notebook.

## 👨‍💻 Author

**Muhiadin Said Hassan**
Developed as part of the 30-Day Machine Learning Projects Challenge.

- **GitHub:** https://github.com/MUHIYADIN2025
- **Email:** muhidiin090448@gmail.com