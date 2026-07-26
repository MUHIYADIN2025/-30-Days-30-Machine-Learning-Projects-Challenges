import React, { useState } from 'react';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    Gender: 'Female',
    Customer_Type: 'Loyal Customer',
    Age: 30,
    Type_of_Travel: 'Business travel',
    Class: 'Business',
    Flight_Distance: 500,
    Inflight_wifi_service: 4,
    Departure_Arrival_time_convenient: 4,
    Ease_of_Online_booking: 4,
    Gate_location: 3,
    Food_and_drink: 4,
    Online_boarding: 4,
    Seat_comfort: 4,
    Inflight_entertainment: 5,
    On_board_service: 4,
    Leg_room_service: 4,
    Baggage_handling: 5,
    Checkin_service: 4,
    Inflight_service: 5,
    Cleanliness: 4,
    Departure_Delay_in_Minutes: 0,
    Arrival_Delay_in_Minutes: 0,
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const ratingFeatures = [
    'Inflight_wifi_service',
    'Departure_Arrival_time_convenient',
    'Ease_of_Online_booking',
    'Gate_location',
    'Food_and_drink',
    'Online_boarding',
    'Seat_comfort',
    'Inflight_entertainment',
    'On_board_service',
    'Leg_room_service',
    'Baggage_handling',
    'Checkin_service',
    'Inflight_service',
    'Cleanliness',
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: isNaN(value) || name === 'Gender' || name === 'Customer_Type' || name === 'Type_of_Travel' || name === 'Class' ? value : Number(value),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('http://127.0.0.1:8000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Prediction request failed.');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Airline Passenger Satisfaction Predictor</h2>
      <form onSubmit={handleSubmit} className="prediction-form">
        <div className="form-grid">
          <div className="form-group">
            <label>Gender</label>
            <select name="Gender" value={formData.Gender} onChange={handleChange}>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div className="form-group">
            <label>Customer Type</label>
            <select name="Customer_Type" value={formData.Customer_Type} onChange={handleChange}>
              <option value="Loyal Customer">Loyal Customer</option>
              <option value="disloyal Customer">Disloyal Customer</option>
            </select>
          </div>

          <div className="form-group">
            <label>Travel Type</label>
            <select name="Type_of_Travel" value={formData.Type_of_Travel} onChange={handleChange}>
              <option value="Business travel">Business travel</option>
              <option value="Personal Travel">Personal Travel</option>
            </select>
          </div>

          <div className="form-group">
            <label>Class</label>
            <select name="Class" value={formData.Class} onChange={handleChange}>
              <option value="Business">Business</option>
              <option value="Eco">Eco</option>
              <option value="Eco Plus">Eco Plus</option>
            </select>
          </div>

          <div className="form-group">
            <label>Age</label>
            <input type="number" name="Age" value={formData.Age} onChange={handleChange} min="1" max="100" />
          </div>

          <div className="form-group">
            <label>Flight Distance (km)</label>
            <input type="number" name="Flight_Distance" value={formData.Flight_Distance} onChange={handleChange} min="0" />
          </div>

          <div className="form-group">
            <label>Departure Delay (Mins)</label>
            <input type="number" name="Departure_Delay_in_Minutes" value={formData.Departure_Delay_in_Minutes} onChange={handleChange} min="0" />
          </div>

          <div className="form-group">
            <label>Arrival Delay (Mins)</label>
            <input type="number" name="Arrival_Delay_in_Minutes" value={formData.Arrival_Delay_in_Minutes} onChange={handleChange} min="0" />
          </div>
        </div>

        <h3>Ratings (0 - 5)</h3>
        <div className="rating-grid">
          {ratingFeatures.map((feature) => (
            <div className="form-group" key={feature}>
              <label>{feature.replace(/_/g, ' ')}</label>
              <input
                type="number"
                name={feature}
                value={formData[feature]}
                onChange={handleChange}
                min="0"
                max="5"
              />
            </div>
          ))}
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Predicting...' : 'Predict Satisfaction'}
        </button>
      </form>

      {error && <div className="error-box">{error}</div>}

      {result && (
        <div className={`result-card ${result.satisfaction_code === 1 ? 'satisfied' : 'dissatisfied'}`}>
          <h3>Result: {result.prediction}</h3>
          <p>Confidence: {result.confidence}%</p>
        </div>
      )}
    </div>
  );
}

export default App;