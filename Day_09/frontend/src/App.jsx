import { useState, useEffect, useCallback } from "react";
import ForecastForm from "./components/ForecastForm";
import { checkHealth, forecastTemperature } from "./api";
import "./index.css";

export default function App() {
  const [isBackendOnline, setIsBackendOnline] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const pingHealth = useCallback(async () => {
    try {
      const health = await checkHealth();
      setIsBackendOnline(Boolean(health.model_loaded));
    } catch (err) {
      console.error("Health check error:", err);
      setIsBackendOnline(false);
    }
  }, []);

  useEffect(() => {
    pingHealth();
  }, [pingHealth]);

  const handleSubmit = async (dateString) => {
    setError(null);
    setIsSubmitting(true);
    try {
      const forecast = await forecastTemperature(dateString);
      setResult(forecast);
    } catch (err) {
      console.error("Forecast error:", err);
      setError("Forecast service unavailable. Check that the backend is running.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page">
      <header className="header">
        <p className="eyebrow">Day 9 · Weather Forecast</p>
        <h1 className="title">India Temperature Forecast</h1>
        <p className="subtitle">
          A linear regression model trained on historical daily temperatures
          predicts India's average temperature for any given date.
        </p>
        <div className={`status-pill ${isBackendOnline ? "status-pill--online" : "status-pill--offline"}`}>
          <span className="status-dot" />
          {isBackendOnline === null
            ? "Checking backend…"
            : isBackendOnline
            ? "Backend online"
            : "Backend offline"}
        </div>
      </header>

      <main className="card">
        <ForecastForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </main>

      <section className="card result-card" aria-live="polite">
        {error && <p className="result-card__error">{error}</p>}

        {!error && !result && (
          <p className="result-card__placeholder">Pick a date to see the forecast.</p>
        )}

        {!error && result && (
          <>
            <p className="result-card__label">{result.target_date}</p>
            <p className="result-card__value">{result.predicted_temperature_f}°F</p>
          </>
        )}
      </section>
    </div>
  );
}