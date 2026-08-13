# Day 29: Anomaly Detection in Sensor Data (Isolation Forest) ⚙️📊

## Overview

This project focuses on Unsupervised Machine Learning techniques to detect
anomalies and equipment malfunctions in time-series industrial sensor data
(such as temperature and vibration spikes). By utilizing the **Isolation
Forest** algorithm, the model identifies non-standard operational patterns
without needing prior labeled historical targets.

## Key Features

- **Unsupervised Anomaly Detection**: Isolates outliers effectively in
  multi-dimensional feature space without manual class labeling.
- **Data Augmentation & Synthetic Anomaly Injection**: Simulates real-world
  sensor reading spikes to evaluate detection threshold accuracy.
- **Time-Series Visualization**: Highlights identified fault windows on
  time-series plots for predictive maintenance analysis.

## Tech Stack

- **Language**: Python 3.x
- **Frameworks/Libraries**: `scikit-learn`, `pandas`, `numpy`
- **Visualization**: `matplotlib`, `seaborn`

## Repository Structure

```text
Day_29/
├── data/
│   └── sensor_data.csv
├── anomaly_detection.py
├── README.md
└── requirements.txt
```

## Setup & Installation

### 1. Clone the repository

```bash
git clone https://github.com/MUHIYADIN2025/-30-Days-30-Machine-Learning-Projects-Challenges.git
cd Day_29
```

### 2. Install dependencies

```bash
pip install pandas numpy scikit-learn matplotlib seaborn
```

### 3. Run the script

```bash
python anomaly_detection.py
```

## Model Pipeline & Logic

1. **Feature Normalization**: Standardizes sensor dimensions using `StandardScaler`.
2. **Isolation Forest Tree Construction**: Constructs isolation trees based
   on random feature split selection.
3. **Contamination Parameter Tuning**: Sets target outlier proportion
   (`contamination=0.02`) to balance sensitivity and false alarms.
4. **Fault Mapping**: Maps isolation anomaly predictions (`-1`) into
   discrete fault binary alerts (`1`).

## Key Learnings

- Understanding the operational mechanics of Isolation Forest vs.
  distance-based anomaly algorithms (like DBSCAN).
- Handling time-series data streams in predictive maintenance scenarios.
- Configuring model contamination parameters for optimal recall on rare
  fault events.

## Known Limitations

- **No evaluation metrics are documented yet** — since this uses
  synthetic anomaly injection, ground truth is actually available here
  (unlike real-world unsupervised anomaly detection). Add
  precision/recall/F1 against the injected anomalies from your run output,
  the way Day 111's fraud detection README does, so the "0.02 contamination"
  choice is backed by a measured trade-off rather than left as an assumption.
- **`contamination=0.02` was set manually**, not derived from the actual
  proportion of injected anomalies — if the true anomaly rate in your
  synthetic data differs meaningfully from 2%, this will bias the model
  toward over- or under-flagging.
- **Isolation Forest treats each sensor reading independently** — it
  doesn't model temporal dependencies (e.g. a gradual drift building over
  many readings), which a dedicated time-series anomaly method might catch
  more effectively.

## Possible Next Steps

- Report precision/recall/F1 against the known synthetic anomaly labels to
  quantify detection accuracy, not just describe the method.
- Compare Isolation Forest against a time-aware approach (e.g. a rolling
  z-score or an LSTM autoencoder) to see whether temporal context improves
  detection of gradual equipment drift.
- Sweep `contamination` across a few values and plot the resulting
  precision/recall trade-off, rather than fixing it at a single value.

---

**Prepared by Muhiadin Said Hassan**
GitHub Profile: [https://github.com/MUHIYADIN2025](https://github.com/MUHIYADIN2025)