# 🏆 Day 30 — AI-Powered Intelligent Business & Risk Analytics Platform

> **Capstone Project — Day 30/30 | Machine Learning & MLOps Pipeline**

An end-to-end **Business Financial Risk Analytics Platform** designed to evaluate commercial financial profiles, estimate default risk, and provide transparent machine learning insights through an interactive Streamlit dashboard.

The project combines a trained **Random Forest Classifier**, serialized model deployment with **Joblib**, and interactive **Plotly** visualizations to create a practical business risk assessment application.

---

## 📊 Project Overview

The platform accepts key financial and credit indicators for a business and transforms them into an interpretable risk assessment.

The application provides:

* Real-time default risk prediction
* Default probability scoring
* Interactive risk visualization
* Feature importance analysis
* Business financial profile controls
* Serialized ML model deployment
* Interactive Plotly analytics

The dashboard is designed to demonstrate how Machine Learning can support **commercial credit analysis and business risk assessment**.

---

# 🎯 Core Objective

The main objective of this capstone project is to build a complete Machine Learning application that moves through the full pipeline:

```text
Raw Business Financial Data
            │
            ▼
      Feature Preparation
            │
            ▼
     Machine Learning Model
       Random Forest
            │
            ▼
       Risk Prediction
            │
            ▼
   Probability Calculation
            │
            ▼
   Explainable ML Insights
            │
            ▼
 Interactive Streamlit Dashboard
```

---

# 🚀 Key Features

## 🎯 Real-Time Risk Assessment

The application evaluates a business financial profile and generates a predicted default risk probability.

The dashboard allows users to interactively adjust financial variables and immediately evaluate the resulting risk profile.

---

## 📈 Default Risk Probability Gauge

A visual risk gauge communicates the model's estimated default probability.

The interface provides an intuitive interpretation of the prediction rather than displaying only a raw model output.

```text
Low Risk        Moderate Risk          High Risk
   │                  │                    │
   ▼                  ▼                    ▼
████████████████████████████████████████████
                     ▲
               Risk Probability
```

---

## 🔍 Feature Importance & Driver Analysis

The platform exposes the most influential model features through a feature-importance visualization.

This improves model transparency by showing which financial indicators contribute most strongly to the Random Forest model's decisions.

Example dashboard drivers include:

* Late payments count
* Debt-to-asset ratio
* Commercial credit score
* Cash-flow growth
* Annual revenue

---

## 💼 Business Financial Profile

The dashboard provides interactive financial inputs such as:

### Annual Revenue

```text
Annual Revenue ($)
```

### Debt-to-Asset Ratio

```text
Debt / Assets
```

### Cash Flow Growth

```text
Cash Flow Growth Rate YoY (%)
```

### Late Payments

```text
Late Payments — Past 12 Months
```

### Commercial Credit Score

```text
Commercial Credit Score
```

These variables are passed through the prediction pipeline to produce the final risk assessment.

---

# 🧠 Machine Learning Pipeline

The project follows a production-oriented Machine Learning workflow.

```text
                 BUSINESS PROFILE
                        │
                        ▼
              Financial Features
                        │
                        ▼
               Feature Processing
                        │
                        ▼
             Random Forest Classifier
                        │
              ┌─────────┴─────────┐
              │                   │
              ▼                   ▼
       Risk Prediction       Feature Importance
              │                   │
              ▼                   ▼
      Default Probability    Driver Analysis
              │                   │
              └─────────┬─────────┘
                        ▼
               Streamlit Dashboard
```

---

# 🤖 Machine Learning Model

## Random Forest Classifier

The predictive backend uses a **Random Forest Classifier** to estimate business default risk.

Random Forest is an ensemble learning approach that combines multiple decision trees to generate a more robust classification result.

The trained model is persisted with:

```text
risk_model.joblib
```

This allows the trained model to be loaded directly by the application without retraining every time the dashboard starts.

---

# 🔬 Explainable Machine Learning

A key objective of this project is not only to produce predictions, but also to provide insight into the factors influencing those predictions.

The platform exposes:

```text
Feature
   ↓
Model Importance
   ↓
Visual Driver Analysis
```

This gives users a clearer understanding of the variables associated with the model's output.

---

# 📊 Dashboard Analytics

The Streamlit dashboard provides an interactive interface containing:

| Component                  | Purpose                               |
| -------------------------- | ------------------------------------- |
| Business Financial Profile | Enter financial indicators            |
| Risk Assessment            | Display predicted default probability |
| Risk Gauge                 | Visualize risk level                  |
| Feature Drivers            | Explain model feature importance      |
| Financial Controls         | Adjust business profile dynamically   |
| Plotly Charts              | Interactive visual analytics          |

---

# 🏗️ Application Architecture

```text
┌──────────────────────────────────────────────┐
│              STREAMLIT FRONTEND              │
│                                              │
│  Financial Inputs                            │
│  Risk Dashboard                              │
│  Probability Gauge                           │
│  Feature Importance                          │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│            MACHINE LEARNING LAYER            │
│                                              │
│        Random Forest Classifier              │
│                                              │
│        risk_model.joblib                     │
└──────────────────────┬───────────────────────┘
                       │
                       ├───────────────┐
                       │               │
                       ▼               ▼
             Risk Probability    Feature Importance
                       │               │
                       └───────┬───────┘
                               ▼
                     Plotly Visualization
```

---

# 🛠️ Technology Stack

## Programming

* **Python 3.x**

## Machine Learning & Data

* **Scikit-Learn**
* **Pandas**
* **NumPy**
* **Joblib**

## Application Framework

* **Streamlit**

## Visualization

* **Plotly Express**
* **Plotly Graph Objects**

---

# 📁 Repository Structure

```text
Day_30/
│
├── app.py
│   └── Streamlit interactive dashboard
│
├── model_pipeline.py
│   └── Model training, evaluation and serialization
│
├── risk_model.joblib
│   └── Trained Random Forest model artifact
│
├── requirements.txt
│   └── Python dependencies
│
└── README.md
    └── Project documentation
```

---

# ⚙️ Installation & Setup

## 1. Clone the Repository

```bash
git clone https://github.com/MUHIYADIN2025/-30-Days-30-Machine-Learning-Projects-Challenges.git
```

Navigate to the capstone project:

```bash
cd -30-Days-30-Machine-Learning-Projects-Challenges/Day_30
```

---

## 2. Install Dependencies

Run:

```bash
pip install -r requirements.txt
```

---

## 3. Train the Model

Run the Machine Learning pipeline:

```bash
python model_pipeline.py
```

This process trains the Random Forest model and produces the serialized model artifact:

```text
risk_model.joblib
```

---

## 4. Launch the Dashboard

Start Streamlit:

```bash
streamlit run app.py
```

The application will provide a local URL similar to:

```text
http://localhost:8501
```

Open the URL in your browser.

---

# 🔄 End-to-End Workflow

```text
1. Launch Streamlit
        │
        ▼
2. Enter Business Financial Profile
        │
        ▼
3. Submit Financial Inputs
        │
        ▼
4. Load Serialized ML Model
        │
        ▼
5. Generate Default Risk Prediction
        │
        ▼
6. Calculate Risk Probability
        │
        ▼
7. Analyze Feature Importance
        │
        ▼
8. Render Interactive Plotly Dashboard
```

---

# 📌 Example Financial Inputs

The dashboard supports interactive controls for business indicators such as:

```text
Annual Revenue
        ↓
Debt-to-Asset Ratio
        ↓
Cash Flow Growth Rate
        ↓
Late Payments
        ↓
Commercial Credit Score
```

These inputs are used by the trained predictive model to generate the business risk assessment.

---

# 📊 Dashboard

The final dashboard provides a professional visual interface for business risk analysis.

### Main Dashboard Components

```text
┌─────────────────────────────────────────────────────────┐
│ AI-Powered Intelligent Business & Risk Analytics       │
│                                                         │
│ Capstone Project — Day 30 | ML & MLOps Pipeline        │
├───────────────────────┬─────────────────────────────────┤
│ Business Financial    │ Feature Importance              │
│ Profile               │                                 │
│                       │ Model Feature Drivers           │
│ Revenue               │ ███████████████████             │
│ Debt Ratio            │ ██████                          │
│ Cash Flow Growth      │ █████                           │
│ Late Payments         │ ████                            │
│ Credit Score          │ ██                              │
├───────────────────────┴─────────────────────────────────┤
│              Real-Time Risk Assessment                  │
│                                                         │
│                 Default Risk Probability                │
│                         5.3%                            │
└─────────────────────────────────────────────────────────┘
```

---

# 🧩 MLOps Concepts Demonstrated

This capstone demonstrates several practical MLOps concepts:

### Model Persistence

The trained model is serialized using:

```python
joblib
```

and stored as:

```text
risk_model.joblib
```

### Model Serving

The Streamlit application loads the trained artifact and performs inference without retraining the model.

### Reproducible Pipeline

The model training process is separated from the application layer:

```text
model_pipeline.py
        │
        ▼
risk_model.joblib
        │
        ▼
     app.py
```

This separation makes the system easier to maintain and extend.

---

# 🔐 Model Transparency

The project incorporates model interpretability through feature importance.

Rather than showing only:

```text
Prediction → Risk
```

the system also provides:

```text
Prediction
    +
Feature Drivers
    +
Risk Probability
```

This makes the dashboard more suitable for demonstrating how ML outputs can support business decision analysis.

---

# 📈 Future Improvements

Potential future versions could include:

* [ ] FastAPI model-serving layer
* [ ] React frontend
* [ ] PostgreSQL or MySQL integration
* [ ] User authentication
* [ ] Business profile persistence
* [ ] Prediction history
* [ ] Automated model monitoring
* [ ] Model drift detection
* [ ] SHAP explainability
* [ ] Docker deployment
* [ ] CI/CD pipeline
* [ ] Cloud deployment
* [ ] Real-time database analytics
* [ ] Automated PDF risk reports

---

# 🎓 Learning Outcomes

By completing this project, the following practical skills were demonstrated:

```text
Python
  ↓
Data Processing
  ↓
Machine Learning
  ↓
Random Forest
  ↓
Model Persistence
  ↓
MLOps Concepts
  ↓
Interactive Visualization
  ↓
Streamlit Application
  ↓
Business Risk Analytics
```

The capstone therefore connects **Machine Learning development** with **interactive application deployment** and **business-oriented analytics**.

---

# 🏆 30-Day Machine Learning Challenge

This project represents the completion of:

```text
╔══════════════════════════════════════╗
║       30 DAYS / 30 ML PROJECTS       ║
║                                      ║
║              DAY 30 / 30             ║
║                                      ║
║           🏆 CAPSTONE PROJECT        ║
╚══════════════════════════════════════╝
```

The challenge progressed from individual Machine Learning concepts and practical projects toward a complete business-focused capstone application.

---

# 👨‍💻 Author

## Muhiadin Said Hassan

**Software AI Engineer | Machine Learning Engineer**

Focused on building practical AI systems, Machine Learning applications, predictive analytics platforms, and production-oriented software solutions.

---

# 🌟 Project Repository

**30 Days — 30 Machine Learning Projects Challenge**

```text
https://github.com/MUHIYADIN2025/-30-Days-30-Machine-Learning-Projects-Challenges
```

---

# 📜 License

This project is distributed under the **MIT License**.

---

<div align="center">

### 🏆 Day 30 — Capstone Project

**AI-Powered Intelligent Business & Risk Analytics Platform**

**Machine Learning • MLOps • Streamlit • Random Forest • Plotly**

⭐ **30 Days. 30 Projects. One Complete Machine Learning Journey.**

</div>
