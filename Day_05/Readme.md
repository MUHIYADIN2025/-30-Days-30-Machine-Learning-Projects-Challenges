# Day 5 — Email Spam Detection (Naive Bayes)

## Overview

This notebook builds a **text classifier** that filters spam emails from
legitimate ones ("ham"). Unlike Day 1–4, the input here isn't numeric
measurements — it's raw email text, which has to be converted into numbers
before any model can learn from it.

## Contents

- `Day_5.ipynb` — the full notebook: dataset creation, text vectorization,
  training, and evaluation.

## Machine Learning Approach

- **Dataset**: a small hand-labeled set of emails, each marked `spam` or
  `ham` (legitimate).
- **Label encoding**: `ham` → 0, `spam` → 1.
- **Text vectorization**: `CountVectorizer(stop_words='english')` converts
  each email into a **bag-of-words** vector — a count of how often each
  vocabulary word appears, with common English stop words (the, is, and,
  etc.) removed since they carry little classification signal.
- **Split**: 80% train / 20% validation, `random_state=42` for reproducibility.
- **Model**: `MultinomialNB` (Multinomial Naive Bayes) — a standard choice
  for text classification because it models word-count-style features well
  and trains fast even on a large vocabulary.
- **Evaluation**: accuracy score and a confusion matrix, visualized with
  `matplotlib`/`seaborn`.

## Running the Notebook

```powershell
py -m venv venv
venv\Scripts\activate
pip install scikit-learn pandas matplotlib seaborn jupyter
jupyter notebook Day_5.ipynb
```

## Known Limitations

- The training set is small and manually written — it will not generalize
  well to real-world spam, which uses far more varied language, obfuscation
  (e.g. "fr33" instead of "free"), and evolves constantly to evade filters.
- `CountVectorizer` ignores word order and context entirely (a "bag of
  words" has no sense of grammar or sequence) — it cannot distinguish
  "not a scam" from "a scam."
- No cross-validation was performed; a single 80/20 split may not give a
  stable estimate of real-world accuracy on such a small dataset.

## Possible Next Steps

- Replace `CountVectorizer` with `TfidfVectorizer` to down-weight words that
  appear in almost every email and up-weight distinctive ones.
- Train on a larger, real-world labeled spam dataset (e.g. the classic
  SMS Spam Collection or Enron spam corpus) for a more realistic accuracy
  estimate.
- Add precision/recall/F1 alongside accuracy — for spam filtering, false
  positives (legitimate email marked as spam) are often costlier than false
  negatives, so recall alone isn't the full picture here.