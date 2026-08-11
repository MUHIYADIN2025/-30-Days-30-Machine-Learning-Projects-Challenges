import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [userId, setUserId] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState('');
  const [movieList, setMovieList] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/movies')
      .then((res) => res.json())
      .then((data) => {
        if (data.titles) {
          setMovieList(data.titles);
          setSelectedMovie(data.titles[0] || '');
        }
      })
      .catch(() =>
        setError(
          'Failed to connect to backend server. Ensure app.py is running.'
        )
      );
  }, []);

  const handleFetchRecommendations = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setRecommendations([]);

    try {
      const response = await fetch('http://127.0.0.1:5000/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: Number(userId),
          title: selectedMovie,
          top_n: 6,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setRecommendations(data.recommendations);
      } else {
        setError(data.error || 'Failed to fetch recommendations.');
      }
    } catch (err) {
      setError('Network error connecting to Flask API.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <header className="header">
        <h1>🎬 Day 26: Hybrid Movie Recommender</h1>
        <p>Content-Based Filtering (TF-IDF) + Collaborative Filtering (SVD)</p>
      </header>

      <form onSubmit={handleFetchRecommendations} className="form-card">
        <div className="form-group">
          <label>User ID:</label>
          <input
            type="number"
            min="1"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Select Seed Movie:</label>
          <select
            value={selectedMovie}
            onChange={(e) => setSelectedMovie(e.target.value)}
          >
            {movieList.map((movie, idx) => (
              <option key={idx} value={movie}>
                {movie}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Calculating...' : 'Get Hybrid Recommendations'}
        </button>
      </form>

      {error && <div className="error-banner">{error}</div>}

      {recommendations.length > 0 && (
        <section className="results-section">
          <h2>Top Recommendations for User {userId}</h2>
          <div className="grid">
            {recommendations.map((item, index) => (
              <div key={index} className="movie-card">
                <span className="badge">#{index + 1}</span>
                <h3>{item.title}</h3>
                <p className="genre">
                  {item.genres ? item.genres.split('|').join(' • ') : 'N/A'}
                </p>
                <div className="rating">
                  ⭐ Score: <strong>{item.predicted_rating}</strong> / 5.0
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default App;