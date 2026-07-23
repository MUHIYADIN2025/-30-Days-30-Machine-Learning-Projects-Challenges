"""
Trains a simple Linear Regression model to predict India's average daily
temperature from a date, and exports it to model.joblib for the API to load.

NOTE: expects 'city_temperature.csv' (Kaggle "Daily Temperature of Major
Cities" dataset) in this directory, with columns including Country, Month,
Day, Year, AvgTemperature.
"""
import joblib
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error

data = pd.read_csv("city_temperature.csv")

# Filter to India, and drop the dataset's sentinel value (-99) used for
# missing temperature readings.
india_data = data[(data["Country"] == "India") & (data["AvgTemperature"] > -99)].copy()

india_data.loc[:, "Date"] = pd.to_datetime(india_data[["Year", "Month", "Day"]])
rel_india_data = india_data[["Date", "AvgTemperature"]].dropna()

# Linear Regression needs numeric input, so the date is converted to its
# ordinal representation (an integer day count) rather than used directly.
rel_india_data["Date_ordinal"] = rel_india_data["Date"].map(pd.Timestamp.toordinal)

X = rel_india_data[["Date_ordinal"]]
y = rel_india_data["AvgTemperature"]

X_train, X_val, y_train, y_val = train_test_split(X, y, test_size=0.2, random_state=42)

model = LinearRegression()
model.fit(X_train, y_train)

predictions = model.predict(X_val)
mse = mean_squared_error(y_val, predictions)
print(f"Mean Squared Error: {mse:.4f}")

joblib.dump(model, "model.joblib")
print("Model saved to model.joblib")