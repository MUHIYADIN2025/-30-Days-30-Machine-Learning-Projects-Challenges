# 💳 Credit Card Default Risk Intelligence Dashboard

An end-to-end Machine Learning web application designed to predict the likelihood of credit card default using client demographic data, payment history, and billing records. 

The project features a **FastAPI** backend serving a trained **RandomForestClassifier** model and an interactive **React + Tailwind CSS** frontend dashboard.

---

## 📁 Project Structure

```text
credit-default-dashboard/
│
├── README.md                # Project documentation
│
├── backend/
│   ├── app.py               # FastAPI server script
│   ├── export_model.py      # Model serialization helper
│   ├── model.pkl            # Trained RandomForest model weights
│   ├── features.pkl         # Saved feature order matching training data
│   └── requirements.txt     # Python backend dependencies
│
└── frontend/
    ├── public/
    │   └── index.html       # Primary HTML entry point
    ├── src/
    │   ├── App.js           # React Dashboard component & logic
    │   ├── index.js         # React root entry point
    │   └── index.css        # Tailwind CSS imports & base styles
    ├── package.json         # Node.js dependencies
    └── tailwind.config.js   # Tailwind configuration


✨ Features
Real-time Assessment: Interactive form controls to dynamically recalculate risk status.

Risk Probability Meter: Visual indication displaying calculated risk percentages.

Interactive Charting: Dynamic Recharts bar graphs reflecting bill vs. payment history trends.

Session History Tracking: Logs recent client evaluations within the current browser session.

Dark Mode UI: Modern financial dashboard design using Tailwind CSS and Lucide React icons.



## Author


**Muhiadin Said Hassan**


AI Engineer | Machine Learning Enthusiast


