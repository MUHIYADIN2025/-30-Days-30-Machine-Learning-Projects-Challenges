# 💳 Credit Card Fraud & Anomaly Detection

![Python](https://img.shields.io/badge/Python-3.8%2B-blue.svg)
![Scikit-Learn](https://img.shields.io/badge/Scikit--Learn-Latest-orange.svg)
![License](https://img.shields.io/badge/License-MIT-green.svg)

An end-to-end Machine Learning pipeline designed to detect anomalous and fraudulent credit card transactions using unsupervised and semi-supervised techniques (Isolation Forest).

---

## 📌 Project Overview

Financial fraud detection presents a severe class-imbalance challenge, where legitimate transactions vastly outnumber fraudulent ones ($>99.8\%$ normal transactions). This project implements an **Isolation Forest** model to detect anomalies without relying heavily on labeled balanced datasets, evaluating performance based on precision, recall, and decision boundaries rather than raw accuracy.

---

## 🚀 Key Features

* **Data Preprocessing & Cleaning:** Normalization and handling of extreme class imbalances.
* **Unsupervised Anomaly Detection:** Utilizes tree-based partition scoring (`IsolationForest`) to isolate anomalies.
* **Comprehensive Model Evaluation:** Includes Precision-Recall curves, confusion matrix visualization, and parameter impact analysis (e.g., dynamic `contamination` scoring).
* **Production-Ready Code:** Structured for reproducibility and modular integration.

---

## 📊 Dataset & Baseline Performance

The dataset evaluated contains standard anonymized PCA features (`V1` to `V28`), `Amount`, and `Time`.

### Test Evaluation Metrics ($X_{val}$)

| Metric | Normal ($1$) | Fraud ($-1$) | Overall Model |
| :--- | :--- | :--- | :--- |
| **Precision** | **1.00** | **0.09** | — |
| **Recall** | **0.99** | **0.54** | — |
| **F1-Score** | **0.99** | **0.15** | — |
| **Accuracy** | — | — | **98.94%** |

> **Note on Performance:** While raw accuracy reaches **98.94%**, the primary focus remains on **Fraud Recall ($54\%$)** and optimizing the precision-recall threshold to reduce false alarms.

### Confusion Matrix

| | Predicted Normal | Predicted Fraud |
| :--- | :--- | :--- |
| **Actual Fraud** | $45$ (False Negatives) | $53$ (True Positives) |
| **Actual Normal** | $56,307$ (True Negatives) | $557$ (False Positives) |

---

## 🛠️ Tech Stack

* **Language:** Python 3.8+
* **Data Processing:** Pandas, NumPy
* **Machine Learning:** Scikit-Learn
* **Visualization:** Matplotlib, Seaborn
* **Environment:** Jupyter Notebook / VS Code

---

## 💻 Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/your-username/credit-card-fraud-detection.git](https://github.com/your-username/credit-card-fraud-detection.git)
   cd credit-card-fraud-detection-