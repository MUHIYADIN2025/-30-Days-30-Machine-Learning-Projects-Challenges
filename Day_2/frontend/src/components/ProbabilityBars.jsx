export default function ProbabilityBars({ probabilities }) {
  if (!probabilities) return null

  const entries = Object.entries(probabilities)
  const max = Math.max(...entries.map(([, value]) => Number(value || 0)))

  return (
    <div className="bars" aria-label="probability bars">
      {entries.map(([label, value]) => {
        const percent = Math.round((Number(value) / max) * 100) || 0
        return (
          <div key={label} className="bar-row">
            <div className="bar-labels">
              <span>{label}</span>
              <span>{(Number(value) * 100).toFixed(1)}%</span>
            </div>
            <div className="bar-track" aria-hidden="true">
              <div className="bar-fill" style={{ width: `${Math.max(percent, 6)}%` }} />
            </div>
          </div>
        )
      })}
    </div>
  )
}
