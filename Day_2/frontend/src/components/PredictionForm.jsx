import { useState } from 'react'
import { predictSpecies } from '../api'

const initialForm = {
  sepal_length: '',
  sepal_width: '',
  petal_length: '',
  petal_width: '',
}

function validateField(name, value) {
  const num = Number(value)
  if (value === '' || Number.isNaN(num)) {
    return 'Please enter a number.'
  }
  if (num <= 0 || num > 10) {
    return 'Value must be greater than 0 and at most 10.'
  }
  return ''
}

export default function PredictionForm({ onResult }) {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const nextErrors = {}
    Object.entries(form).forEach(([name, value]) => {
      nextErrors[name] = validateField(name, value)
    })

    setErrors(nextErrors)
    if (Object.values(nextErrors).some(Boolean)) {
      return
    }

    setIsLoading(true)
    try {
      const payload = Object.fromEntries(
        Object.entries(form).map(([key, value]) => [key, Number(value)]),
      )
      const result = await predictSpecies(payload)
      onResult(result)
    } catch (error) {
      console.error(error)
      onResult({ error: 'Prediction service unavailable' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card" noValidate>
      <div className="grid">
        {[
          ['sepal_length', 'Sepal Length (cm)'],
          ['sepal_width', 'Sepal Width (cm)'],
          ['petal_length', 'Petal Length (cm)'],
          ['petal_width', 'Petal Width (cm)'],
        ].map(([name, label]) => (
          <label key={name} className="field">
            <span>{label}</span>
            <input
              type="number"
              step="0.01"
              min="0"
              max="10"
              name={name}
              value={form[name]}
              onChange={handleChange}
              aria-invalid={Boolean(errors[name])}
            />
            {errors[name] ? <small className="error">{errors[name]}</small> : null}
          </label>
        ))}
      </div>

      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Predicting…' : 'Predict Species'}
      </button>
    </form>
  )
}
