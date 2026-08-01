# 📈 Day 16: Stock Price Time Series Forecasting with ARIMA

Welcome to **Day 16** of the coding challenge! This project demonstrates how to perform **Time Series Analysis and Forecasting** on historical stock price data using the **ARIMA** (AutoRegressive Integrated Moving Average) model.

This project is part of the **30 Days 30 Machine Learning Projects Challenge**.

**Author:** Muhiadin Said Hassan

> ⚠️ **Not financial advice.** This project is an educational exercise in time-series modeling. Stock price forecasts produced here are based on a single statistical model applied to historical data and must never be used as the basis for real investment decisions. See [Important Disclaimer](#️-important-disclaimer).

---

## Table of Contents

- [Project Overview](#-project-overview)
- [What Is ARIMA, and Why Use It Here?](#-what-is-arima-and-why-use-it-here)
- [Requirements & Installation](#️-requirements--installation)
- [Getting Started](#-getting-started)
- [Workflow & Methodology](#-workflow--methodology)
- [File Structure](#-file-structure)
- [Known Limitations & Future Improvements](#known-limitations--future-improvements)
- [Important Disclaimer](#️-important-disclaimer)
- [Acknowledgments](#-acknowledgments)
- [Author](#-author)

---

## 📌 Project Overview

Stock price prediction is a classic financial time-series problem. In this module, we utilize statistical modeling techniques to understand underlying trends, stationarity, and seasonality in stock market data to forecast future closing prices.

- **Model Used:** ARIMA (`statsmodels.tsa.arima.model.ARIMA`)
- **Primary Focus:** Time series stationarity, parameter tuning (p, d, q), and forecasting future values.
- **Dataset Source:** [Kaggle Stock Dataset](https://www.kaggle.com/datasets/soumendraprasad/stock)

## 🔍 What Is ARIMA, and Why Use It Here?

ARIMA models a time series purely from its own past values and past forecast errors — no external features (news, earnings, macroeconomic indicators) are involved. It's built from three components, corresponding directly to the (p, d, q) parameters:

- **AR (p) — AutoRegressive:** the current value is modeled as a function of its own previous values (e.g., today's price is related to the last *p* days' prices).
- **I (d) — Integrated:** the number of times the series is differenced (subtracting each value from the previous one) to remove trends and make the series **stationary** — a requirement for ARIMA, since the model assumes the statistical properties of the series (mean, variance) don't change over time.
- **MA (q) — Moving Average:** the current value is modeled as a function of past forecast errors, capturing short-term shocks that decay over time.

**Why ARIMA for a first pass at stock forecasting?** It's a well-understood, interpretable baseline that requires no external data beyond the price series itself, making it a natural starting point before reaching for more complex approaches (LSTM, Prophet, or models that incorporate external regressors). Its main weakness — and the reason it's a *baseline* rather than a production forecasting tool — is that stock prices are widely believed to approximate a random walk, meaning a large share of day-to-day price movement is not predictable from past prices alone, regardless of how well-tuned the model is.

## 🛠️ Requirements & Installation

Ensure you have Python 3.8+ installed along with the following required libraries:

```bash
pip install pandas matplotlib statsmodels notebook
```

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd Day_16
```

### 2. Download the Dataset

Obtain the dataset from [Kaggle](https://www.kaggle.com/datasets/soumendraprasad/stock) and place the CSV file in your working directory as `stock_data.csv`.

### 3. Run the Notebook

```bash
jupyter notebook Day_16.ipynb
```

Run all cells top to bottom. The notebook loads the historical price series, checks and enforces stationarity, fits the ARIMA model, and plots forecasted vs. actual prices.

## 📊 Workflow & Methodology

1. **Data Preprocessing & Visualization**
   - Load historical stock price data using `pandas`.
   - Visualize trends over time (e.g., Close Price) to get an initial read on trend and volatility.

2. **Stationarity Check & Differencing**
   - Test for stationarity (commonly via the Augmented Dickey-Fuller test).
   - Apply logarithmic transformations and/or differencing (**d**) until the series passes the stationarity test — ARIMA's forecasts are unreliable if this step is skipped or done incorrectly.

3. **ARIMA Model Configuration**
   - Define model parameters (p, d, q):
     - **p** (AutoRegressive terms)
     - **d** (Integrated / order of differencing)
     - **q** (Moving Average terms)
   - Parameters are typically chosen by inspecting ACF/PACF plots, or via a grid search minimizing AIC/BIC.

4. **Model Training & Evaluation**
   - Fit the ARIMA model on historical training data.
   - Forecast future time steps and plot predicted vs. actual stock prices.
   - Evaluate forecast accuracy (e.g., RMSE or MAPE against a held-out test period).

## 📄 File Structure

```text
Day_16/
│
├── Day_16.ipynb          # Jupyter Notebook containing code and visualizations
├── README.md             # Project documentation
└── stock_data.csv        # Historical stock dataset (download from Kaggle)
```

## Known Limitations & Future Improvements

- **No train/test split shown in the workflow above** — for a trustworthy accuracy estimate, the model should be fit only on data up to a cutoff date and evaluated on a held-out period *after* that date, rather than fit on the full series and visually compared to the same data.
- **Single-variable model** — ARIMA here uses only the closing price series. It doesn't incorporate volume, broader market indices, or news/sentiment data, all of which carry real predictive signal that a pure ARIMA model cannot use.
- **Parameter selection process isn't automated** — if (p, d, q) are chosen manually from ACF/PACF plots, results can vary by analyst judgment. Tools like `pmdarima.auto_arima` can search the parameter space systematically and select by AIC/BIC.
- **No confidence intervals reported** — ARIMA forecasts naturally come with confidence intervals that widen the further out the forecast horizon goes; displaying these (not just a point forecast) gives a much more honest picture of forecast uncertainty.
- **Stationarity assumption may not hold across regimes** — a model fit on a calm market period may perform poorly if the forecast period includes a volatility shock (e.g., an earnings surprise or macro event) — ARIMA has no mechanism to anticipate structural breaks.

## ⚠️ Important Disclaimer

This project is an educational exercise in applying time-series statistical methods to financial data. It is:

- **Not financial advice, investment guidance, or a trading signal.**
- **Not a production-grade forecasting system.**
- **Not validated against real trading performance or backtested with transaction costs, slippage, or risk management.**

Stock prices are influenced by a vast range of unpredictable factors (news, macroeconomic events, market sentiment) that a univariate ARIMA model, using only historical prices, cannot capture. Past model performance on historical data does not guarantee future forecasting accuracy. Anyone making real investment decisions should consult a qualified financial advisor rather than rely on this project's output.

## 🤝 Acknowledgments

- Dataset provided by [Soumendra Prasad on Kaggle](https://www.kaggle.com/datasets/soumendraprasad/stock).
- Time series implementation built with `statsmodels`.

## 👨‍💻 Author

**Muhiadin Said Hassan**
Developed as part of the 30-Day Machine Learning Projects Challenge.

- **GitHub:** https://github.com/MUHIYADIN2025
- **Email:** muhidiin090448@gmail.com