# Credit Card Default Prediction using Random Forest

## About this Notebook

This notebook demonstrates how to build a machine learning model to predict whether a credit card customer is likely to default on their next payment. The project uses the **UCI Credit Card Default Dataset** and implements a **Random Forest Classifier** with Scikit-learn.

The notebook covers the complete machine learning workflow, including:

- Loading the dataset
- Data preprocessing
- Feature and target selection
- Splitting the dataset into training and validation sets
- Training a Random Forest Classifier
- Making predictions
- Evaluating model performance using classification metrics

## Dataset

**Dataset:** UCI Credit Card Default Dataset

**Target Variable:**
- `default.payment.next.month`
  - `0` = No Default
  - `1` = Default

## Technologies Used

- Python
- Pandas
- NumPy
- Scikit-learn
- Random Forest Classifier

## Machine Learning Workflow

1. Load the dataset
2. Prepare features and target
3. Split data into training and validation sets
4. Train a Random Forest model
5. Predict customer defaults
6. Evaluate model accuracy and performance

## Model

The notebook uses the following Random Forest configuration:

- `n_estimators = 400`
- `max_depth = 20`
- `min_samples_leaf = 8`
- `random_state = 42`

## Evaluation Metrics

The model is evaluated using:

- Accuracy Score
- Confusion Matrix
- Classification Report

## Learning Objectives

After completing this notebook, you will understand how to:

- Prepare data for supervised learning
- Train a Random Forest classifier
- Predict customer credit default risk
- Evaluate classification models
- Build an end-to-end machine learning pipeline

## Requirements

Install the required packages:

```bash
pip install pandas numpy scikit-learn
```

## Project Structure

```
project/
│
├── Day_7.ipynb
├── UCI_Credit_Card.csv
└── README.md
```

## Author

**Muhiadin Said Hassan**

AI Engineer | Machine Learning Enthusiast


This notebook is intended for educational purposes and demonstrates a practical application of machine learning for credit risk prediction.