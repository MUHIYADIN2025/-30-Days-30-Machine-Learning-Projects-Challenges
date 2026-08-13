import streamlit as st
import pandas as pd
import numpy as np
import joblib
import plotly.express as px
import plotly.graph_objects as go
import os

st.set_page_config(
    page_title="AI Business & Risk Analytics",
    page_icon="📈",
    layout="wide"
)

# Load pipeline model
@st.cache_resource
def load_model():
    if not os.path.exists("risk_model.joblib"):
        from model_pipeline import train_and_save_pipeline
        train_and_save_pipeline()
    return joblib.load("risk_model.joblib")

pipeline = load_model()
model = pipeline['model']

# UI Header
st.title("📈 AI-Powered Intelligent Business & Risk Analytics Platform")
st.markdown("### Capstone Project — Day 30 | Machine Learning & MLOps Pipeline")
st.markdown("---")

# Sidebar - User Inputs
st.sidebar.header("📊 Business Financial Profile")

revenue = st.sidebar.number_input("Annual Revenue ($)", min_value=5000, max_value=5000000, value=250000, step=10000)
debt_ratio = st.sidebar.slider("Debt-to-Asset Ratio", min_value=0.0, max_value=1.0, value=0.45, step=0.01)
cash_flow_growth = st.sidebar.slider("Cash Flow Growth Rate YoY (%)", min_value=-0.50, max_value=1.00, value=0.12, step=0.01)
late_payments = st.sidebar.slider("Late Payments (Past 12 Months)", min_value=0, max_value=20, value=2)
credit_score = st.sidebar.slider("Commercial Credit Score", min_value=300, max_value=850, value=680)

# Layout Columns
col1, col2 = st.columns([1, 1])

# Real-time Prediction
input_df = pd.DataFrame([{
    'revenue': revenue,
    'debt_ratio': debt_ratio,
    'cash_flow_growth': cash_flow_growth,
    'late_payments_count': late_payments,
    'credit_score': credit_score
}])

risk_prob = model.predict_proba(input_df)[0][1]
prediction = model.predict(input_df)[0]

with col1:
    st.subheader("🎯 Real-Time Risk Assessment")
    
    fig_gauge = go.Figure(go.Indicator(
        mode="gauge+number",
        value=risk_prob * 100,
        domain={'x': [0, 1], 'y': [0, 1]},
        title={'text': "Default Risk Probability (%)"},
        gauge={
            'axis': {'range': [0, 100]},
            'bar': {'color': "#1E88E5"},
            'steps': [
                {'range': [0, 35], 'color': "#A5D6A7"},
                {'range': [35, 70], 'color': "#FFE082"},
                {'range': [70, 100], 'color': "#EF9A9A"}
            ],
            'threshold': {
                'line': {'color': "red", 'width': 4},
                'thickness': 0.75,
                'value': 70
            }
        }
    ))
    st.plotly_chart(fig_gauge, use_container_width=True)

    if prediction == 1:
        st.error("⚠️ HIGH RISK BUSINESS PROFILE DETECTED")
        st.write("Recommendation: Implement strict credit terms and require collateral monitoring.")
    else:
        st.success("✅ LOW / ACCEPTABLE BUSINESS RISK PROFILE")
        st.write("Recommendation: Approved for standard business lines and credit Expansion.")

with col2:
    st.subheader("🔍 Feature Importance & Driver Analysis")
    importances = model.feature_importances_
    features = input_df.columns
    
    fi_df = pd.DataFrame({'Feature': features, 'Importance': importances}).sort_values(by='Importance', ascending=True)
    
    fig_bar = px.bar(
        fi_df, 
        x='Importance', 
        y='Feature', 
        orientation='h', 
        title="ML Model Feature Drivers",
        color='Importance',
        color_continuous_scale='Blues'
    )
    st.plotly_chart(fig_bar, use_container_width=True)

# Footer
st.markdown("---")
st.caption("Muhiadin Said Hassan — 30 Days 30 Machine Learning Projects Capstone")