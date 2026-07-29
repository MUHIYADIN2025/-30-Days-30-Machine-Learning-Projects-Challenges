document.getElementById('predictionForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    // Collect values from form fields
    const formData = {
        pregnancies: document.getElementById('pregnancies').value,
        glucose: document.getElementById('glucose').value,
        bloodPressure: document.getElementById('bloodPressure').value,
        skinThickness: document.getElementById('skinThickness').value,
        insulin: document.getElementById('insulin').value,
        bmi: document.getElementById('bmi').value,
        diabetesPedigreeFunction: document.getElementById('diabetesPedigreeFunction').value,
        age: document.getElementById('age').value
    };

    const resultDiv = document.getElementById('result');
    const resultHeader = document.getElementById('resultHeader');
    const resultDetails = document.getElementById('resultDetails');

    try {
        // Send POST request to Flask backend
        const response = await fetch('http://127.0.0.1:5000/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (response.ok && data.status === 'success') {
            resultDiv.classList.remove('hidden', 'diabetic', 'non-diabetic');
            
            if (data.prediction === 1) {
                resultDiv.classList.add('diabetic');
                resultHeader.innerText = 'High Risk of Diabetes';
            } else {
                resultDiv.classList.add('non-diabetic');
                resultHeader.innerText = 'Low Risk of Diabetes';
            }
            resultDetails.innerText = `Estimated Risk Probability: ${data.probability}%`;
        } else {
            alert('Backend Error: ' + (data.message || 'Unknown error occurred.'));
        }
    } catch (error) {
        console.error('Fetch Error:', error);
        alert('Could not connect to the backend server. Please make sure Flask (py app.py) is running on port 5000.');
    }
});