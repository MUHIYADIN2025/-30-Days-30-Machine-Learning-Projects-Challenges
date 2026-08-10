import re
import joblib
from flask import Flask, jsonify, request
from flask_cors import CORS
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer
from nltk.tokenize import word_tokenize

app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Resource Sharing

# Load trained artifacts
model = joblib.load("sentiment_model.pkl")
vectorizer = joblib.load("tfidf_vectorizer.pkl")


def preprocess_text(text):
    text = re.sub(r"<.*?>", "", text)
    text = re.sub(r"[^\w\s]", "", text)
    text = text.lower()
    tokens = word_tokenize(text)

    stop_words = set(stopwords.words("english"))
    tokens = [word for word in tokens if word not in stop_words]

    stemmer = PorterStemmer()
    tokens = [stemmer.stem(word) for word in tokens]

    return " ".join(tokens)


@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json(force=True)
    review_text = data.get("review", "")

    if not review_text.strip():
        return jsonify({"error": "Empty review input."}), 400

    # Clean text, vectorise, and infer
    cleaned_text = preprocess_text(review_text)
    vectorized_text = vectorizer.transform([cleaned_text])

    prediction = model.predict(vectorized_text)[0]
    probabilities = model.predict_proba(vectorized_text)[0]

    classes = model.classes_
    prob_dict = {
        cls: round(float(prob), 4) for cls, prob in zip(classes, probabilities)
    }

    return jsonify(
        {
            "review": review_text,
            "sentiment": prediction,
            "probabilities": prob_dict,
        }
    )


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)