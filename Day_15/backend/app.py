from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np

app = Flask(__name__)
CORS(app)  # Enable CORS for cross-origin requests from Frontend

# Load trained model
model = joblib.load('model.pkl')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        
        # Extract features from request JSON in specific order
        features = [
            float(data['pregnancies']),
            float(data['glucose']),
            float(data['bloodPressure']),
            float(data['skinThickness']),
            float(data['insulin']),
            float(data['bmi']),
            float(data['diabetesPedigreeFunction']),
            float(data['age'])
        ]
        
        # Predict class and probability
        features_array = np.array([features])
        prediction = model.predict(features_array)[0]
        probability = model.predict_proba(features_array)[0][1]
        
        return jsonify({
            'status': 'success',
            'prediction': int(prediction),
            'probability': round(float(probability) * 100, 2),
            'message': 'Diabetic' if prediction == 1 else 'Non-Diabetic'
        })

    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True, port=5000)