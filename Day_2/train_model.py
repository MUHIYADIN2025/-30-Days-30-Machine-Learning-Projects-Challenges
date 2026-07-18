"""
Trains the Iris classifier and exports it to model.joblib.

IMPORTANT: uses species NAMES (setosa/versicolor/virginica) as the target,
and a DataFrame with named feature columns, to exactly match what main.py
expects when it later calls model.predict()/predict_proba() and reads
model.classes_.
"""
from pathlib import Path

import joblib
import pandas as pd
from sklearn.datasets import load_iris
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report

# Must match FEATURE_ORDER in main.py exactly
FEATURE_ORDER = [
    "sepal length (cm)",
    "sepal width (cm)",
    "petal length (cm)",
    "petal width (cm)",
]


def train_and_save_model(output_path: str | Path = "model.joblib") -> None:
    iris = load_iris()
    X = pd.DataFrame(iris.data, columns=FEATURE_ORDER)
    y = pd.Series(iris.target_names[iris.target], name="species")  # e.g. "setosa"

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    model = LogisticRegression(max_iter=200)
    model.fit(X_train, y_train)

    predictions = model.predict(X_test)
    print(f"Accuracy: {accuracy_score(y_test, predictions):.4f}")
    print(classification_report(y_test, predictions))

    joblib.dump(model, output_path)
    print(f"Model saved to {output_path}")


if __name__ == "__main__":
    train_and_save_model("model.joblib")