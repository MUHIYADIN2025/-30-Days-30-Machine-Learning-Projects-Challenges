import joblib
import pandas as pd
from sklearn.ensemble import GradientBoostingClassifier

# Load data
train_data = pd.read_csv("train.csv").dropna()

# Separate target and features
X_train = train_data.drop("satisfaction", axis=1)
y_train = train_data["satisfaction"].map(
    {"satisfied": 1, "neutral or dissatisfied": 0}
)

# One-hot encoding
X_train_encoded = pd.get_dummies(X_train, drop_first=True)
feature_columns = X_train_encoded.columns.tolist()

# Train Model
model = GradientBoostingClassifier(random_state=42)
model.fit(X_train_encoded, y_train)

# Save model and feature structure
joblib.dump(
    {"model": model, "feature_columns": feature_columns}, "gbm_model.pkl"
)
print("Model successfully trained and exported to 'gbm_model.pkl'")