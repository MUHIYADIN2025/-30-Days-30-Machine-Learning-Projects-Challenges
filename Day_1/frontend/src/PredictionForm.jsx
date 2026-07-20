import { useState } from 'react';
import { fetchPrediction } from './api';

export default function PredictionForm({ onResult }) {
  const [medInc, setMedInc] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    onResult(null);

    const value = Number(medInc);
    if (!value || value <= 0 || value > 20) {
      setError('Median Income must be greater than 0 and at most 20.');
      return;
    }

    setLoading(true);
    try {
      const prediction = await fetchPrediction(value);
      const predictedDollars = prediction.predicted_house_value * 100000;
      onResult(predictedDollars);
    } catch (fetchError) {
      console.error(fetchError);
      setError('Prediction service unavailable. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="card form-card" onSubmit={handleSubmit} noValidate>
      <label htmlFor="medInc" className="label">
        Median Income (in tens of thousands USD)
      </label>
      <input
        id="medInc"
        name="medInc"
        type="number"
        step="0.1"
        min="0.1"
        max="20"
        value={medInc}
        onChange={(event) => setMedInc(event.target.value)}
        className="input"
        required
        aria-describedby="medIncHelp"
      />
      <p id="medIncHelp" className="hint">
        Enter a value from 0.1 to 20, for example 5.5 = $55,000.
      </p>

      <button type="submit" className="button" disabled={loading}>
        {loading ? 'Predicting…' : 'Get Prediction'}
      </button>

      <div aria-live="polite" className="status">
        {error ? <p className="error-message">{error}</p> : null}
      </div>
    </form>
  );
}
