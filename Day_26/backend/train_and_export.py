import joblib
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel
from surprise import SVD, Dataset, Reader

print("Loading datasets...")
movies = pd.read_csv("movies.csv")  # movieId, title, genres
ratings = pd.read_csv("ratings.csv")  # userId, movieId, rating

# Content-Based: TF-IDF on Genres
movies["genres"] = movies["genres"].fillna("")
tfidf = TfidfVectorizer(stop_words="english")
tfidf_matrix = tfidf.fit_transform(movies["genres"])
cosine_sim = linear_kernel(tfidf_matrix, tfidf_matrix)

# Collaborative Filtering: SVD
reader = Reader(rating_scale=(0.5, 5.0))
data = Dataset.load_from_df(ratings[["userId", "movieId", "rating"]], reader)
trainset = data.build_full_trainset()

svd = SVD()
svd.fit(trainset)

# Save artifacts
print("Exporting model artifacts...")
artifacts = {
    "movies": movies,
    "indices": pd.Series(
        movies.index, index=movies["title"]
    ).drop_duplicates(),
    "cosine_sim": cosine_sim,
    "svd": svd,
}

joblib.dump(artifacts, "hybrid_recommender.pkl")
print("Artifacts successfully saved to 'hybrid_recommender.pkl'")