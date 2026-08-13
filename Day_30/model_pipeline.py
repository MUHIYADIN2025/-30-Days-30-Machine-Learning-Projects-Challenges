import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score
import joblib

def generate_synthetic_business_data(n_samples=2000):
    """Generates realistic synthetic financial and operational business risk data."""
    np.random.seed(42)
    
    revenue = np.random.uniform(10000, 1000000, n_samples)
    debt_ratio = np.random.uniform(0.1, 0.95, n_samples)
    cash_flow_growth = np.random.uniform(-0.3, 0.5, n_samples)
    late_payments_count = np.random.randint(0, 15, n_samples)
    credit_score = np.random.randint(300, 850, n_samples)
    
    # Calculate Risk Label (1 = High Risk / Default, 0 = Low Risk)
    risk_score = (
        (debt_ratio * 3.5) +
        (late_payments_count * 0.4) -
        (cash_flow_growth * 2.0) -
        (credit_score / 250)
    )
    
    risk_label = (risk_score > 1.2).astype(int)
    
    df = pd.DataFrame({
        'revenue': revenue,
        'debt_ratio': debt_ratio,
        'cash_flow_growth': cash_flow_growth,
        'late_payments_count': late_payments_count,
        'credit_score': credit_score,
        'risk_label': risk_label
    })
    
    return df

def train_and_save_pipeline():
    print("Generating synthetic business risk dataset...")
    df = generate_synthetic_business_data()
    
    X = df.drop(columns=['risk_label'])
    y = df['risk_label']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    
    print("Training Random Forest Business Analytics Model...")
    model = RandomForestClassifier(n_estimators=100, max_depth=10, random_state=42)
    model.fit(X_train, y_train)
    
    y_pred = model.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    print(f"\nModel Accuracy: {acc * 100:.2f}%")
    print("\nClassification Report:\n", classification_report(y_test, y_pred))
    
    # Save model and feature names
    payload = {
        'model': model,
        'features': list(X.columns)
    }
    joblib.dump(payload, 'risk_model.joblib')
    print("Pipeline saved successfully to 'risk_model.joblib'!")

if __name__ == "__main__":
    train_and_save_pipeline()