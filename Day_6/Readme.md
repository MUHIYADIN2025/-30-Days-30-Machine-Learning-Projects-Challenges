# Day 6 — Predict Wine Quality with Support Vector Machines (SVM)

Hey, it's Day 6 of the [30 Day 30 Machine Learning Projects Challenge](https://github.com/MUHIYADIN2025/-30-Days-30-Machine-Learning-Projects-Challenges). Today's problem was "Predict wine quality from physicochemical properties using SVM". This is the 5th classification problem in a row. We will learn what SVM is and how it works, along with other important machine learning techniques.

If you want to go straight to the code, I've uploaded it to this repository [GIT REPO](https://github.com/MUHIYADIN2025/-30-Days-30-Machine-Learning-Projects-Challenges)

The process will be the same as I briefly explained in the previous progress posts. I'll use ChatGPT and ask follow-up questions.

## Talk about the Problem Please!

Today, we used Support Vector Machines (SVM) to predict the quality of wine based on its physicochemical properties (like acidity, sugar, and alcohol content). The goal was to build a model that could classify wine into different quality categories (from 0 to 10) using SVM.

## What is SVM?

Support Vector Machines (SVM) are powerful classifiers that find the best boundary (hyperplane) between different classes. Imagine you have data points scattered in space, and you need to separate them into different groups. SVM draws a line (in 2D) or a plane (in 3D) that best divides these points.

In our case, we used SVC (Support Vector Classifier), a type of SVM designed for classification tasks. To handle the non-linearity of our data, we used the RBF (Radial Basis Function) kernel, which creates curved decision boundaries to separate complex data.

**Why RBF instead of a linear kernel?** A linear kernel only draws a straight line/plane between classes — it works when classes are cleanly separable along a straight boundary. Wine quality doesn't behave that way: a wine with high acidity and low alcohol might land in the same quality bucket as one with the opposite profile, depending on how the features interact. RBF handles this by measuring similarity between points based on distance, letting the decision boundary curve around clusters instead of forcing a straight cut.

## Understanding the Data

We used the [Wine Quality Dataset](https://www.kaggle.com/datasets/yasserh/wine-quality-dataset) from Kaggle, which contains the physicochemical properties of wine and the corresponding quality ratings. The features include attributes like acidity, sugar levels, and alcohol content, and the target is the wine quality score. Download it locally and put it in the `dataset` directory at root level of this repository.

## Code Workflow

The process was divided into several steps:

1. Load the data
2. Preprocess the data
3. Data Preprocessing: Feature scaling
4. Split the data into training and validation sets
5. Create and train the SVM model
6. Make predictions and evaluate the model
7. Visualization

### Step 3 in more depth: why scale the features at all?

SVM measures distances between data points to decide where the boundary goes. If one feature (say, `total sulfur dioxide`, which ranges into the hundreds) sits on a completely different numeric scale than another (like `chlorides`, which sits near zero), the larger-range feature ends up dominating the distance calculation — not because it's more predictive, but purely because of its units. `StandardScaler` rescales every feature to mean 0, standard deviation 1, so each one contributes based on its actual relationship to wine quality, not its raw magnitude.

### Step 6 in more depth: what the results actually showed

Running the model on the validation split gave:

- **Overall accuracy: 65.9%**
- Performance broken down by quality score:

| Quality | Precision | Recall | F1-score | Support |
|---------|-----------|--------|----------|---------|
| 4       | 0.00      | 0.00   | 0.00     | 6       |
| 5       | 0.70      | 0.75   | 0.72     | 96      |
| 6       | 0.62      | 0.70   | 0.65     | 99      |
| 7       | 0.71      | 0.38   | 0.50     | 26      |
| 8       | 0.00      | 0.00   | 0.00     | 2       |

Two things stand out here:

- **The model does reasonably well on quality 5 and 6** — which makes sense, since those two categories make up the vast majority of the validation set (96 and 99 samples out of 229).
- **The model completely fails on quality 4 and 8** (0.00 across the board). This isn't the model being "bad" at those wines specifically — it's a **class imbalance problem**. With only 6 and 2 validation examples respectively, the model barely saw any of these during training either, so it never learned what distinguishes them. `classification_report` was run with `zero_division=0` specifically to handle this gracefully instead of throwing a warning for classes with no predicted samples.

This is a common pattern in real-world quality/rating data: most items cluster around "average," and the extremes (very poor or very excellent) are rare — which makes them the hardest to predict well.

### Step 7: the confusion matrix

The heatmap visualization makes the imbalance issue visible at a glance: most of the "heat" concentrates around the 5–6 and 6–5 cells (the model confusing adjacent quality scores with each other), while the 4 and 8 rows/columns stay empty. This is often more informative than the accuracy number alone, since it shows *where* the model is confused, not just *how often*.

## Known Limitations

- Class imbalance (very few quality-4 and quality-8 samples) means the model can't reliably predict wines at the extremes — it's effectively only useful for the mid-range (5–7) qualities that dominate the dataset.
- No hyperparameter tuning was performed on `C` or `gamma` (the RBF kernel's key parameters) — both were left at scikit-learn's defaults.
- A single 80/20 split was used rather than cross-validation, so the 65.9% accuracy is one estimate, not a stable average.

## Possible Next Steps

- Address class imbalance directly — e.g. `class_weight='balanced'` in `SVC`, or oversampling the rare quality classes (SMOTE).
- Tune `C` and `gamma` via grid search or randomized search to see if accuracy improves beyond the default kernel settings.
- Try treating this as a regression problem instead of classification (predicting a continuous quality score) since the categories are ordinal (4 is closer to 5 than to 8), which SVM classification doesn't inherently capture.