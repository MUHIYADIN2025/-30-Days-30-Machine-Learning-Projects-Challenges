Markdown
# ⚡ Day 25: Hourly Energy Consumption Time Series Forecasting (LSTM)

![Python](https://img.shields.io/badge/Python-3.8%2B-blue?logo=python&logoColor=white)
![TensorFlow](https://img.shields.io/badge/TensorFlow-2.x-FF6F00?logo=tensorflow&logoColor=white)
![Pandas](https://img.shields.io/badge/Pandas-150458?logo=pandas&logoColor=white)
![Scikit-Learn](https://img.shields.io/badge/scikit--learn-F7931E?logo=scikit-learn&logoColor=white)

An introductory Deep Learning project focused on **Time Series Forecasting**. This project uses a **Long Short-Term Memory (LSTM)** Recurrent Neural Network built with TensorFlow/Keras to predict hourly electricity consumption in Megawatts (MW) using historical energy demand data.

---

## 📊 Dataset Overview

- **Source**: [Kaggle - Hourly Energy Consumption Dataset](https://www.kaggle.com/datasets/robikscube/hourly-energy-consumption)
- **File Used**: `AEP_hourly.csv` (American Electric Power hourly load data)
- **Records**: 121,273 hourly timestamps
- **Features**:
  - `Datetime`: Timestamp of recording (`YYYY-MM-DD HH:MM:SS`)
  - `AEP_MW`: Estimated electricity consumption in Megawatts (Target Variable)

---

## 📐 Machine Learning Pipeline

┌─────────────────────────┐
│ Load Dataset            │ (AEP_hourly.csv)
└────────────┬────────────┘
│
┌────────────▼────────────┐
│ Time Index & Preprocess │ Convert Datetime to index & perform linear interpolation
└────────────┬────────────┘
│
┌────────────▼────────────┐
│ Data Normalization      │ Scale target feature to [0, 1] range using MinMaxScaler
└────────────┬────────────┘
│
┌────────────▼────────────┐
│ Sequence Generation     │ Convert 1D time series to 3D sliding windows (60 hours → 1 hour target)
└────────────┬────────────┘
│
┌────────────▼────────────┐
│ Train/Val Split (80/20) │ Sequential temporal split (No shuffling)
└────────────┬────────────┘
│
┌────────────▼────────────┐
│ LSTM Model Training     │ Sequential Keras Model (50 LSTM units + Dense output)
└─────────────────────────┘


---

## ✨ Key Methodology & Design Choices

1. **Interpolation & Cleaning**: Time-series continuity is ensured using pandas interpolation (`df.interpolate()`) to fill isolated missing timestamp values cleanly.
2. **Feature Scaling**: Data is normalized using `MinMaxScaler(feature_range=(0, 1))` to stabilize weights during backpropagation in recurrent layers.
3. **Sliding Window Sequence Creation**:
   - **Lookback Window (`time_steps`)**: `60` hours
   - Inputs are structured into 3D tensors of shape `(samples, 60, 1)` to capture short-term temporal trends.
4. **Sequential Data Splitting**: Chronological 80/20 train/validation split (`X[:train_size]`) to prevent data leakage from the future into training sets.
5. **Model Architecture**:
   - `LSTM Layer`: 50 units (Extracts temporal dependencies over time steps)
   - `Dense Layer`: 1 unit (Outputs scalar predicted consumption for time $t+1$)
   - `Loss Function`: Mean Squared Error (`mse`)
   - `Optimizer`: Adam

---

## 📁 Repository Structure

```text
Day_25/
│
├── Day_25.ipynb            # Jupyter Notebook containing full data pipeline & training
├── AEP_hourly.csv          # Dataset file (Hourly AEP energy load)
└── README.md               # Project documentation
🚀 How to Run
1. Prerequisites
Ensure Python 3.8+ is installed on your local machine or Conda environment.

2. Install Required Packages
Bash
pip install pandas numpy scikit-learn tensorflow matplotlib
3. Run Notebook
Open Day_25.ipynb in VS Code or Jupyter Notebook and execute all cells sequentially:

Bash
jupyter notebook Day_25.ipynb
💡 Model Architecture (Keras)
Python
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense

# Define sequential network
model = Sequential([
    LSTM(50, return_sequences=False, input_shape=(60, 1)),
    Dense(1)
])

# Compile model
model.compile(optimizer='adam', loss='mean_squared_error')
📜 License
Distributed under the MIT License. Feel free to modify and expand for higher-order sequence architectures.