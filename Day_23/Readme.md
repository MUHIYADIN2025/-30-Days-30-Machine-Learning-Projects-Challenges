# Day 23 — Customer Segmentation with K-Means Clustering

## Overview

This project segments mall customers into distinct behavioral groups using
**K-Means clustering**, based on their age, gender, annual income, and
spending score. Unlike the supervised classification/regression projects
earlier in this challenge, this is **unsupervised learning** — there are no
labels to predict; the goal is to discover natural groupings in the data.

## Dataset

- **Source**: Kaggle — [Customer Segmentation Tutorial in Python](https://www.kaggle.com/datasets/vjchoudhary7/customer-segmentation-tutorial-in-python) (`Mall_Customers.csv`)
- **200 customers**, 5 columns: `CustomerID`, `Genre` (gender), `Age`,
  `Annual Income (k$)`, `Spending Score (1-100)`.
- No missing values.

## Machine Learning Approach

1. **Preprocessing**:
   - `CustomerID` is excluded from the clustering features (a unique row
     identifier carries no behavioral signal).
   - `Genre` (gender) is label-encoded: Male → 0, Female → 1.
2. **Feature scaling**: `StandardScaler` is applied to all four clustering
   features. This matters more here than in most supervised models —
   K-Means clusters based on Euclidean distance, so without scaling,
   `Annual Income` (values in the tens of thousands) would completely
   dominate the distance calculation over `Age` or `Spending Score` (values
   under 100), regardless of which is actually more meaningful for grouping
   customers.
3. **Choosing K — the Elbow Method**: K-Means requires the number of
   clusters to be chosen in advance. The Elbow Method fits K-Means for
   K = 1 through 10 and plots each run's inertia (within-cluster sum of
   squares). The "elbow" — where adding more clusters stops meaningfully
   reducing inertia — indicates a good K value.
4. **Final clustering**: `K = 4` was selected based on the elbow plot, and
   `KMeans(n_clusters=4, init='k-means++', random_state=42)` was fit on the
   scaled features.
5. **Visualization**: clusters are plotted on Annual Income vs. Spending
   Score, colored by assigned cluster, to visually inspect segment
   separation.

## Results

The clustering produced 4 visually distinct customer segments when plotted
by income vs. spending score, with the classic pattern seen in this dataset:
groups such as low-income/low-spending, high-income/low-spending,
high-income/high-spending, and mid-range customers each formed identifiable
clusters. (Add the exact per-cluster customer counts and centroid values
from your run here, e.g. via `pd.Series(y_kmeans).value_counts()`, for a
complete results section.)

## Known Limitations

- **`data.drop('CustomerID', axis=1)` has no effect** — `drop()` returns a
  new DataFrame by default rather than modifying `data` in place, and the
  result isn't assigned back or run with `inplace=True`. `CustomerID`
  therefore remains in `data` afterward. This doesn't affect the clustering
  itself (the feature set `X` is built by explicitly selecting the four
  relevant columns in a later cell), but the drop line is effectively dead
  code — worth fixing with `data = data.drop('CustomerID', axis=1)` for
  clarity, even though it's not currently causing incorrect results.
- **K = 4 was chosen visually from the elbow plot**, which involves some
  subjectivity — a more rigorous approach (e.g. silhouette score) would
  give a quantitative second opinion on the right number of clusters.
- **Small dataset (200 customers)** — clusters found here are illustrative
  of the technique but wouldn't necessarily generalize to a larger or
  different customer base without re-running the analysis on that data.
- **Gender encoding (0/1) is treated as a continuous numeric feature** by
  K-Means, which implicitly assumes "female" is more similar to "male + 1"
  than to "male" in Euclidean space — a modeling simplification worth being
  aware of, though common practice for binary categorical features.

## Possible Next Steps

- Add a silhouette score analysis alongside the elbow plot to validate the
  choice of K = 4 quantitatively, not just visually.
- Profile each cluster (mean age, income, spending score per group) and
  give each segment a descriptive business label (e.g. "high income,
  low engagement") to make the output actionable for a marketing team.
- Try clustering on income and spending score alone (dropping age/gender)
  to see whether the classic 5-cluster pattern often seen in this specific
  dataset emerges, and compare against the current 4-cluster result.

---

**Prepared by Muhiadin Said Hassan**
GitHub Profile: [https://github.com/MUHIYADIN2025](https://github.com/MUHIYADIN2025)
