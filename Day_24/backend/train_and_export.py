import re
import joblib
import pandas as pd
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer
from nltk.tokenize import word_tokenize
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split


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


def main():
    print("Loading dataset...")
    data = pd.read_csv("IMDB Dataset.csv")

    print("Preprocessing reviews...")
    data["cleaned_review"] = data["review"].apply(preprocess_text)

    X = data["cleaned_review"]
    y = data["sentiment"]

    X_train, X_val, y_train, y_val = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    print("Fitting TF-IDF Vectorizer...")
    tfidf_vectorizer = TfidfVectorizer(max_features=5000)
    X_train_tfidf = tfidf_vectorizer.fit_transform(X_train)

    print("Training Logistic Regression Model...")
    model = LogisticRegression()
    model.fit(X_train_tfidf, y_train)

    # Save artifacts
    print("Saving model and vectorizer...")
    joblib.dump(model, "sentiment_model.pkl")
    joblib.dump(tfidf_vectorizer, "tfidf_vectorizer.pkl")
    print("Training complete and artifacts saved successfully.")


if __name__ == "__main__":
    main()