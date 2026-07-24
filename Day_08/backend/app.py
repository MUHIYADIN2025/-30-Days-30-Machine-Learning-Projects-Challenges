from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import PassiveAggressiveClassifier
from sklearn.metrics import accuracy_score, confusion_matrix, classification_report

app = Flask(__name__)
CORS(app)  # Allows React frontend to communicate with Flask backend

print("Training model... Please wait.")

# Load datasets
fake_df = pd.read_csv("Fake.csv")
true_df = pd.read_csv("True.csv")

fake_df['label'] = 0  # Label 0: Fake
true_df['label'] = 1  # Label 1: True
df = pd.concat([true_df, fake_df], axis=0).reset_index(drop=True)

X = df['text']
y = df['label']

# Vectorize text using TF-IDF
tf_idf_vectorizer = TfidfVectorizer(stop_words="english", max_df=0.7)
X_tf_idf = tf_idf_vectorizer.fit_transform(X)

# Split dataset
X_train, X_val, y_train, y_val = train_test_split(X_tf_idf, y, test_size=0.2, random_state=42)

# Train PassiveAggressiveClassifier
model = PassiveAggressiveClassifier(max_iter=50)
model.fit(X_train, y_train)

# Calculate model evaluation metrics
y_pred = model.predict(X_val)
acc = float(accuracy_score(y_val, y_pred))
cm = confusion_matrix(y_val, y_pred).tolist()
report = classification_report(y_val, y_pred, output_dict=True)

print(f"Model trained successfully! Accuracy: {acc * 100:.2f}%")

@app.route("/api/metrics", methods=["GET"])
def get_metrics():
    """Returns evaluation metrics for the React dashboard."""
    return jsonify({
        "accuracy": round(acc * 100, 2),
        "confusion_matrix": cm,
        "classification_report": {
            "fake": {
                "precision": round(report['0']['precision'], 2),
                "recall": round(report['0']['recall'], 2),
                "f1": round(report['0']['f1-score'], 2)
            },
            "real": {
                "precision": round(report['1']['precision'], 2),
                "recall": round(report['1']['recall'], 2),
                "f1": round(report['1']['f1-score'], 2)
            }
        },
        "dataset_info": {
            "total_articles": len(df),
            "fake_articles": len(fake_df),
            "real_articles": len(true_df)
        }
    })

@app.route("/api/predict", methods=["POST"])
def predict():
    """Predicts whether an incoming news text is Real or Fake."""
    data = request.get_json()
    text = data.get("text", "").strip()

    if not text:
        return jsonify({"error": "No text provided"}), 400

    text_vectorized = tf_idf_vectorizer.transform([text])
    prediction = model.predict(text_vectorized)[0]
    decision_score = float(model.decision_function(text_vectorized)[0])

    return jsonify({
        "prediction": "REAL" if prediction == 1 else "FAKE",
        "is_real": bool(prediction == 1),
        "score": round(decision_score, 4)
    })

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)