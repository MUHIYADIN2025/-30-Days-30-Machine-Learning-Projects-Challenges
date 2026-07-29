import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
import joblib

def train_and_save():
    # Load dataset
    data = pd.read_csv('diabetes.csv')
    
    # Split features and target
    X = data.drop('Outcome', axis=1)
    y = data['Outcome']
    
    # Split dataset
    X_train, X_val, y_train, y_val = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Train Random Forest Model
    random_forest = RandomForestClassifier(
        n_estimators=100, 
        min_samples_leaf=1, 
        min_samples_split=5, 
        random_state=42
    )
    random_forest.fit(X_train, y_train)
    
    # Save trained model to file
    joblib.dump(random_forest, 'model.pkl')
    print("Model trained and saved as 'model.pkl' successfully.")

if __name__ == '__main__':
    train_and_save()