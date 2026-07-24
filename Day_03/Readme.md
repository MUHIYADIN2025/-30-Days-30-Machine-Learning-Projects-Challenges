# Day 3 — Handwritten Digit Recognition (K-Nearest Neighbors)

## Overview
this is a part 30 Days of a 30 Machine Learning Projects-Challenges journey.
This notebook builds a classifier that recognizes handwritten digits (0-9)
from the classic **MNIST** dataset, using **K-Nearest Neighbors (KNN)**.

Each digit is a 28x28 grayscale image, flattened into a 784-value feature
vector (one value per pixel). The model learns to classify a new digit by
comparing it to its closest neighbors in that 784-dimensional space.

## Contents

- `Day_3.ipynb` — the full notebook: data loading, preprocessing, training,
  and evaluation.

## Machine Learning Approach

- **Dataset**: `sklearn.datasets.fetch_openml("mnist_784")` — 70,000 images,
  784 features each, 10 balanced classes (digits 0-9).
- **Preprocessing**: pixel values normalized from the 0-255 range to 0-1.
- **Split**: 80% train / 20% validation, `random_state=42` for reproducibility.
- **Model**: `KNeighborsClassifier(n_neighbors=3)`.
- **Evaluation**: accuracy score, confusion matrix, and a full classification
  report (precision/recall/F1 per digit).

## Running the Notebook

```powershell
py -m venv venv
venv\Scripts\activate
pip install scikit-learn pandas numpy matplotlib seaborn jupyter
jupyter notebook Day_3.ipynb
```

> **Note**: `fetch_openml` downloads ~55MB on first run and caches it locally
> (typically under `~/scikit_learn_data`). This can take a few minutes
> depending on your connection, but only happens once.

## Known Limitations

- KNN stores the entire training set in memory and computes distances at
  prediction time — this makes it slow to query as the dataset grows, unlike
  models that learn a compact set of parameters (e.g. logistic regression).
- No hyperparameter tuning was performed on `k`; `k=3` was chosen as a
  reasonable starting point, not the result of a search.

## Possible Next Steps

- Try different values of `k` (e.g. 1, 5, 7) and compare validation accuracy.
- Compare KNN against a different model family (e.g. a small neural network)
  on the same data.
- Build a small web interface where a user can draw a digit and get a live
  prediction.


GitHub Profile: https://github.com/MUHIYADIN2025