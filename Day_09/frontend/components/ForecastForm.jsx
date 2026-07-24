import { useState } from "react";

export default function ForecastForm({ onSubmit, isSubmitting }) {
  const [selectedDate, setSelectedDate] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!selectedDate) return;
    onSubmit(selectedDate);
  };

  return (
    <form className="forecast-form" onSubmit={handleSubmit}>
      <label htmlFor="target-date" className="forecast-form__label">
        Pick a date
      </label>
      <input
        id="target-date"
        type="date"
        className="forecast-form__input"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
        required
      />
      <button className="btn btn--primary" type="submit" disabled={isSubmitting || !selectedDate}>
        {isSubmitting ? "Forecasting…" : "Get Forecast"}
      </button>
    </form>
  );
}