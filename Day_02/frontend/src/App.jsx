import { useEffect, useState } from 'react'
import { checkHealth } from './api'
import PredictionForm from './components/PredictionForm'
import ProbabilityBars from './components/ProbabilityBars'

export default function App() {
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [health, setHealth] = useState({ status: 'unknown', model_loaded: false })

  useEffect(() => {
    const pingHealth = async () => {
      try {
        const response = await checkHealth()
        setHealth(response)
      } catch (err) {
        console.error(err)
        setHealth({ status: 'unavailable', model_loaded: false })
      }
    }

    pingHealth()
  }, [])

  const handleResult = (payload) => {
    if (payload?.error) {
      setError(payload.error)
      setResult(null)
      return
    }

    setError('')
    setResult(payload)
  }

  return (
    <main className="app-shell">
      <section className="hero">
        <div className="hero-text">
          <p className="eyebrow">Iris Species Classifier</p>
          <h1>Predict flower species from measurements</h1>
          <p>Enter the sepal and petal dimensions in centimeters to get a species prediction and confidence scores.</p>
        </div>
        <div className="health-pill" aria-live="polite">
          <span className={`status-dot ${health.status === 'ok' ? 'online' : 'offline'}`} />
          <span>{health.status === 'ok' ? 'Backend healthy' : 'Backend offline'}</span>
        </div>
      </section>

      <PredictionForm onResult={handleResult} />

      <section className="result-card" aria-live="polite">
        {error ? (
          <div className="error-banner">{error}</div>
        ) : result ? (
          <>
            <h2 className="predicted-species">{result.predicted_species}</h2>
            <p className="subtitle">Predicted species</p>
            <ProbabilityBars probabilities={result.probabilities} />
          </>
        ) : (
          <p className="placeholder">Submit a measurement set to see the prediction.</p>
        )}
      </section>
    </main>
  )
}
