# 📰 Day 18: Topic Modeling with Latent Dirichlet Allocation (LDA)

Welcome to **Day 18** of the coding challenge! This project focuses on **Natural Language Processing (NLP)** and **Topic Modeling**. It applies **Latent Dirichlet Allocation (LDA)** to extract hidden thematic structures and recurring topics from news article summaries.

This project is part of the **30 Days 30 Machine Learning Projects Challenge**.

**Author:** Muhiadin Said Hassan

---

## Table of Contents

- [Project Overview](#-project-overview)
- [What Is LDA, and Why Use It Here?](#-what-is-lda-and-why-use-it-here)
- [Requirements & Installation](#️-requirements--installation)
- [Getting Started](#-getting-started)
- [Methodology & Pipeline](#️-methodology--pipeline)
- [Repository Structure](#-repository-structure)
- [Known Limitations & Future Improvements](#known-limitations--future-improvements)
- [Author](#-author)

---

## 📌 Project Overview

Extracting insights from unstructured textual data is a core capability of modern NLP. This project processes headlines and news snippets to automatically discover hidden topics using statistical topic modeling.

- **Model Used:** Latent Dirichlet Allocation (LDA) via `gensim`
- **Visualization:** `pyLDAvis` (interactive topic visualization)
- **NLP Preprocessing:** Tokenization, stop-word removal, and lemmatization via `nltk`
- **Dataset:** New York Times Articles Dataset (`ArticlesApril2017.csv`)

## 🔍 What Is LDA, and Why Use It Here?

LDA is an **unsupervised** statistical model — it discovers topics without ever being told what the topics are, which fits this task well since news snippets aren't pre-labeled with topic categories. The core idea: every document is treated as a mixture of topics, and every topic is treated as a probability distribution over words. LDA works backward from the observed word patterns across all documents to infer both (a) which topics likely exist, and (b) how much each document draws on each topic.

Concretely, LDA assumes each document was "generated" by:
1. Picking a mixture of topics for the document (e.g., 70% politics, 30% economy).
2. For each word in the document, picking a topic according to that mixture, then picking a word according to that topic's word-distribution.

Fitting the model reverses this process statistically, using the actual word co-occurrence patterns in the corpus to estimate the most probable topic-word and document-topic distributions. The result is a set of topics, each represented as a ranked list of the words most associated with it, which a human can then interpret and label (e.g., a topic dominated by "election," "vote," "campaign" is clearly about politics, even though LDA itself never uses the word "politics").

**Why LDA specifically, rather than a more modern embedding-based approach?** LDA is fast, requires no labeled data or pretrained embeddings, and produces directly interpretable topic-word distributions — useful for a first-pass exploratory analysis of what a corpus is "about" before reaching for heavier NLP tooling.

## 🛠️ Requirements & Installation

Ensure Python 3.8+ is installed, then install the required libraries:

```bash
pip install pandas nltk gensim pyLDAvis notebook
```

> **Note:** `nltk` requires downloading its stop-word and lemmatizer data separately the first time. If `nltk.tokenize.word_tokenize` or `WordNetLemmatizer` raise a `LookupError`, run this once in Python:
> ```python
> import nltk
> nltk.download('punkt')
> nltk.download('stopwords')
> nltk.download('wordnet')
> ```

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd Day_18
```

### 2. Ensure Dataset Availability

Make sure `ArticlesApril2017.csv` is present in the working directory.

### 3. Run the Jupyter Notebook

```bash
jupyter notebook Day_18.ipynb
```

Run all cells top to bottom — the notebook loads the article snippets, preprocesses the text, builds the document-term corpus, trains the LDA model, and generates the topic visualization.

## ⚙️ Methodology & Pipeline

```text
┌────────────────┐     ┌─────────────────────┐     ┌─────────────────────┐     ┌───────────────────┐
│ Load Dataset   │ ──> │ NLP Preprocessing   │ ──> │ Dictionary & Corpus │ ──> │ LDA Model         │
│ (snippets)     │     │ (Clean, Lemmatize)  │     │ (Bag-of-Words)      │     │ Training & Topics │
└────────────────┘     └─────────────────────┘     └─────────────────────┘     └───────────────────┘
```

**1. Data Ingestion:** loads the dataset and extracts short news text from the `snippet` column.

**2. Preprocessing Pipeline:**
- Case normalization (lowercase conversion).
- Cleaning unwanted punctuation and special characters.
- Tokenization using `nltk.tokenize.word_tokenize`.
- English stop-word filtering and lemmatization using `WordNetLemmatizer` (lemmatization reduces words to their dictionary root form — e.g., "running"/"ran" → "run" — so LDA treats them as the same underlying concept instead of separate tokens).

**3. Corpus & Dictionary Creation:** converts text into a Document-Term Matrix (Bag-of-Words) using `gensim.corpora.Dictionary`, which maps every unique remaining word to an integer ID and represents each document as a list of (word ID, frequency) pairs.

**4. LDA Model Training:** trains a 5-topic LDA statistical model across multiple passes over the corpus (multiple passes let the model's topic-word distributions converge more reliably than a single pass would).

## 📄 Repository Structure

```text
Day_18/
│
├── Day_18.ipynb          # Jupyter Notebook containing code and LDA execution
├── ArticlesApril2017.csv # New York Times Dataset
└── README.md             # Project documentation
```

## Known Limitations & Future Improvements

- **Topic count (5) is fixed, not tuned** — the number of topics is a hyperparameter chosen manually here rather than selected via a coherence score (e.g., `gensim`'s `CoherenceModel`) across a range of candidate topic counts. A different K could produce more distinct, interpretable topics.
- **No topic coherence score reported** — without a quantitative coherence metric, topic quality currently relies on manual inspection of the top words per topic, which is subjective and doesn't scale to comparing multiple model configurations.
- **Snippets are short text** — LDA traditionally works best on longer documents with richer word co-occurrence patterns; short news snippets provide a weaker signal per document, which can produce noisier topic-word distributions than full-article text would.
- **Single month of data (April 2017)** — topics discovered are necessarily specific to that month's news cycle and won't generalize to other time periods without retraining.
- **No topic labeling automation** — topics are currently only represented as ranked word lists; a human still needs to interpret and name each one (e.g., "Topic 3 = Politics"). This is standard for LDA but worth noting as a manual step in the current pipeline.

## 👨‍💻 Author

**Muhiadin Said Hassan**
Developed as part of the 30-Day Machine Learning Projects Challenge.

- **GitHub:** https://github.com/MUHIYADIN2025
- **Email:** muhidiin090448@gmail.com