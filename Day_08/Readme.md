# Day 8 — Fake News Detection (PassiveAggressive Classifier + TF-IDF)

## Overview

This project classifies news articles as **Real** or **Fake** based purely on
their text content. It combines two techniques suited for this kind of
high-dimensional, fast-training text classification task:

- **TF-IDF (Term Frequency–Inverse Document Frequency)** to convert raw
  article text into numerical features that reflect how distinctive each
  word is to a given article, rather than just how often it appears.
- **Passive-Aggressive Classifier**, an online learning algorithm that
  updates aggressively whenever it misclassifies an example and stays
  "passive" (makes no update) when it's already correct — a good fit for
  large, sparse text feature sets like TF-IDF output.

A live dashboard sits on top of the trained model, letting a user paste in
article text and get an instant Real/Fake classification alongside the
model's performance metrics.

## Dataset

- **Source**: Kaggle "Fake News Detection Datasets" (`Fake.csv` + `True.csv`).
- **Total articles**: 44,898
  - Real news samples: 21,417
  - Fake news samples: 23,481
- Labels: `0` = Fake, `1` = Real.

## Machine Learning Approach

1. **Load & label**: `Fake.csv` and `True.csv` are loaded separately, each
   assigned a label, then concatenated into one dataset.
2. **Feature/target split**: `X` = article text, `y` = label.
3. **Vectorization**: `TfidfVectorizer(stop_words="english", max_df=0.7)`
   converts text into TF-IDF vectors, dropping English stop words and any
   word appearing in more than 70% of documents (too common to be
   discriminative — likely just generic news-writing language).
4. **Split**: 80% train / 20% validation, `random_state=42`.
5. **Model**: `PassiveAggressiveClassifier(max_iter=10)`.
6. **Evaluation**: accuracy, confusion matrix, and full classification report.
7. **Visualization**: confusion matrix rendered as a heatmap.

## Results

From the notebook run:

- **Accuracy: 99.41%**
- **Confusion Matrix**:

  |               | Predicted Fake | Predicted Real |
  |---------------|:--------------:|:---------------:|
  | **Actual Fake** | 4620          | 30              |
  | **Actual Real** | 23            | 4307            |

- **Classification Report**:

  | Class | Precision | Recall | F1-score | Support |
  |-------|-----------|--------|----------|---------|
  | Fake (0) | 1.00   | 0.99   | 0.99     | 4650    |
  | Real (1) | 0.99   | 0.99   | 0.99     | 4330    |

> **Note on the dashboard numbers**: the deployed dashboard (screenshot
> below) shows 99.35% accuracy with a slightly different confusion matrix
> (4618 / 32 / 26 / 4304). This is expected — `PassiveAggressiveClassifier`
> was trained without a `random_state`, so its internal weight updates are
> not perfectly reproducible run to run, even on the identical train/test
> split. The two results agree to within a few samples out of ~9,000, which
> confirms the model is stable, just not bit-for-bit deterministic.

## Why Accuracy Alone Isn't the Full Story Here

A 99%+ accuracy on a roughly balanced dataset (21.4k vs 23.5k) is a
genuinely strong result, not an artifact of class imbalance the way it might
be on a skewed dataset. The precision/recall balance across both classes
(all at 0.99) confirms the model isn't just biased toward one label — it's
Actually distinguishing the two classes well.

## Dashboard

A "Fake News Detection Dashboard" wraps the trained model in a usable
interface:

- **Model Accuracy** displayed prominently (99.35% in the live deployment).
- **Dataset summary cards**: total articles, real news count, fake news count.
- **Analyze News Content**: a text box where a user pastes article text and
  clicks "Classify News Article" to get an instant prediction.
- **Model Metrics panel**: live confusion matrix (True Fake / False Real /
  False Fake / True Real) and per-class precision/recall/F1, so the
  dashboard doubles as both a classifier tool and a transparency report on
  how the model performs.

## Known Limitations

- **No `random_state` on the classifier** means exact metrics shift slightly
  between training runs — acceptable here given the small variance observed,
  but worth fixing (`PassiveAggressiveClassifier(max_iter=10, random_state=42)`)
  for fully reproducible results.
- **TF-IDF has no understanding of context or meaning** — it only measures
  word distinctiveness. A well-written fake article using formal, varied
  vocabulary similar to real news could evade detection; conversely, a real
  article using unusual phrasing could be misclassified.
- **Dataset is time- and source-specific** (a known Kaggle corpus, mostly
  U.S. political news from a specific period). The model's strong accuracy
  reflects patterns in *this* dataset — vocabulary, publication style,
  even specific outlets — and may not generalize to fake news from a
  different domain, time period, or language.
- **max_iter=10** is low for a Passive-Aggressive model and triggered a
  `ConvergenceWarning` during training; the model still performs well here,
  but increasing `max_iter` could be tested for a more stable fit.

## Possible Next Steps

- Add `random_state` to the classifier for reproducible metrics across runs.
- Evaluate on a separate, more recent fake-news dataset to test real-world
  generalization beyond this specific corpus.
- Try `TfidfVectorizer` with n-grams (e.g. `ngram_range=(1,2)`) to capture
  short phrases, not just single words, which may catch stylistic patterns
  TF-IDF alone misses.
- Add a confidence score to dashboard predictions using the classifier's
  `decision_function` output, rather than a binary Real/Fake label alone.