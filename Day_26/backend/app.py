import joblib
import pandas as pd
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

print("Loading model artifacts...")
artifacts = joblib.load('hybrid_recommender.pkl')
movies = artifacts['movies']
indices = artifacts['indices']
cosine_sim = artifacts['cosine_sim']
svd = artifacts['svd']

# Dynamically identify movie ID column name
id_col = next(
    (col for col in ['movieId', 'id', 'movie_id'] if col in movies.columns),
    None,
)


@app.route('/api/movies', methods=['GET'])
def get_movies():
  titles = movies['title'].dropna().unique().tolist()
  return jsonify({'titles': titles})


@app.route('/api/recommend', methods=['POST'])
def recommend():
  try:
    data = request.get_json(force=True)
    user_id = int(data.get('user_id', 1))
    title = data.get('title', '')
    top_n = int(data.get('top_n', 10))

    if not title or title not in indices:
      return (
          jsonify({'error': f"Movie '{title}' was not found in database."}),
          404,
      )

    # Handle cases where multiple movies share the same title
    idx = indices[title]
    if isinstance(idx, pd.Series):
      idx = idx.iloc[0]

    # Step A: Get content-based candidates
    sim_scores = list(enumerate(cosine_sim[idx]))
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)[1:31]

    # Step B: Score candidates with Collaborative Filtering
    movie_candidates = []
    for i in sim_scores:
      row = movies.iloc[i[0]]

      # Extract ID safely regardless of column casing
      m_id = row[id_col] if id_col else row.name
      m_title = row['title']
      m_genre = row['genres'] if 'genres' in row else 'N/A'

      predicted_rating = svd.predict(user_id, m_id).est
      movie_candidates.append({
          'movieId': int(m_id),
          'title': m_title,
          'genres': str(m_genre),
          'predicted_rating': round(float(predicted_rating), 2),
      })

    # Step C: Rank candidates
    movie_candidates = sorted(
        movie_candidates, key=lambda x: x['predicted_rating'], reverse=True
    )

    return jsonify({
        'user_id': user_id,
        'base_movie': title,
        'recommendations': movie_candidates[:top_n],
    })

  except Exception as e:
    print(f'Error during prediction: {e}')
    return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
  app.run(host='0.0.0.0', port=5000, debug=True)