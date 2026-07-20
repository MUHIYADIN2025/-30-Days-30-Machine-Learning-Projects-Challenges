import { useEffect, useState } from 'react';
import PredictionForm from './PredictionForm';
import { fetchHealth } from './api';

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value);

export default function App() {
  const [health, setHealth] = useState(null);
  const [healthError, setHealthError] = useState('');
  const [prediction, setPrediction] = useState(null);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const result = await fetchHealth();
        setHealth(result);
      } catch (err) {
        console.error(err);
        setHealthError('Health check failed. Prediction service may be unavailable.');
      }
    };

    checkHealth();
  }, []);

  const statusLabel = health
    ? health.model_loaded
      ? 'Online'
      : 'Loaded but unavailable'
    : 'Checking…';

  const statusColor = health
    ? health.model_loaded
      ? 'status-dot status-dot--green'
      : 'status-dot status-dot--red'
    : 'status-dot status-dot--grey';

  return (
    <div className="page-shell">
      <main className="container">
        <section className="hero">
          <div>
            <p className="eyebrow">House Price Predictor</p>
            <h1>Predict home value from median income</h1>
            <p className="intro">
              Enter the median income for your neighborhood and get a quick price estimate from the prediction service.
            </p>
          </div>
          <div className="health-card card">
            <div className={statusColor} aria-hidden="true"></div>
            <div>
              <p className="health-label">Service status</p>
              <p className="health-value">{statusLabel}</p>
            </div>
          </div>
        </section>

        <PredictionForm onResult={setPrediction} />

        <section aria-live="polite" className="result-card card">
          {prediction !== null ? (
            <p className="result-text">
              Predicted house value: <strong>{formatCurrency(prediction)}</strong>
            </p>
          ) : (
            <p className="result-text result-placeholder">
              Submit a median income to see the prediction.
            </p>
          )}
        </section>
      </main>
    </div>
  );
}
