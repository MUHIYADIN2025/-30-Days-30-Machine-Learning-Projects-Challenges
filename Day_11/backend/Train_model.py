"""
Trains an Isolation Forest anomaly detector on the Kaggle Credit Card Fraud
Detection dataset and exports it (plus evaluation metrics) to model.joblib.
"""
import kagglehub
import joblib
import pandas as pd
import os
from sklearn.model_selection import train_test_split
from sklearn.ensemble import IsolationForest
from sklearn.metrics import accuracy_score, confusion_matrix, classification_report

dataset_path = kagglehub.dataset_download("saurabhbadole/credit-card-dataset")
df = pd.read_csv(os.path.join(dataset_path, "creditcard.csv"))

FEATURE_COLUMNS = [c for c in df.columns if c != "Class"]

X = df[FEATURE_COLUMNS]
y = df["Class"].map({0: 1, 1: -1})  # -1 = anomaly (fraud), 1 = normal

X_train, X_val, y_train, y_val = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

model = IsolationForest(contamination=0.01, random_state=42)
model.fit(X_train)

predictions = model.predict(X_val)
accuracy = accuracy_score(y_val, predictions)
conf_matrix = confusion_matrix(y_val, predictions).tolist()
report = classification_report(y_val, predictions, zero_division=1, output_dict=True)

print(f"Accuracy: {accuracy:.4f}")
print("Confusion Matrix:", conf_matrix)

# Persist the model, feature order, and evaluation metrics together so the
# API can serve both live predictions and the dashboard's stat cards.
joblib.dump(
    {
        "model": model,
        "feature_columns": FEATURE_COLUMNS,
        "metrics": {
            "accuracy": accuracy,
            "confusion_matrix": conf_matrix,  # [[TN-ish, FP],[FN, TP]] in class order [-1, 1]
            "classification_report": report,
            "total_transactions": int(len(df)),
            "fraud_count": int((df["Class"] == 1).sum()),
            "normal_count": int((df["Class"] == 0).sum()),
        },
    },
    "model.joblib",
)
print("Model saved to model.joblib")