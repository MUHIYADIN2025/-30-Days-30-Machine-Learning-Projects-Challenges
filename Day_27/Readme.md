# 🧠 Day 27 — Brain Tumor MRI Classification System

A full-stack Artificial Intelligence application for classifying brain MRI images using Deep Learning and Transfer Learning.

The project combines:

- TensorFlow
- Keras
- MobileNetV2
- Flask REST API
- React
- Vite

---

## 🚀 Project Overview

The model is trained using the Brain Tumor MRI Dataset.

The Deep Learning pipeline uses MobileNetV2 as a pretrained feature extractor and adds custom classification layers.

The model classifies MRI images into four categories:

- Glioma
- Meningioma
- No Tumor
- Pituitary

---

## 🧠 Machine Learning Architecture

```text
MRI Image
    │
    ▼
Resize 224 × 224
    │
    ▼
Normalize Pixel Values
    │
    ▼
MobileNetV2
    │
    ▼
Global Average Pooling
    │
    ▼
Dense Layer
    │
    ▼
Dropout
    │
    ▼
Softmax
    │
    ▼
4-Class Prediction                                    📊 Training Configuration
Parameter	Value
Model	MobileNetV2
Input Size	224 × 224
Batch Size	32
Epochs	10
Classes	4
Optimizer	Adam
Loss	Categorical Crossentropy
Activation	Softmax
📈 Training Result

The training notebook reached approximately:

Training Accuracy: 89.32%
Validation Accuracy: 82.44%

The notebook also generated:

training_results.png

for Accuracy and Loss visualization.

🏗️ Project Architecture
Day_27/
│
├── backend/
│   ├── app.py
│   ├── requirements.txt
│   ├── brain_tumor_model.h5
│   └── uploads/
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
└── README.md
⚙️ Backend Setup

Open a terminal:

cd Day_27/backend

Create virtual environment:

python -m venv venv

Activate on Windows:

venv\Scripts\activate

Install dependencies:

pip install -r requirements.txt

Make sure this file exists:

brain_tumor_model.h5

Start Flask:

python app.py

Backend:

http://127.0.0.1:5000
⚛️ Frontend Setup

Open another terminal:

cd Day_27/frontend

Install dependencies:

npm install

Start React:

npm run dev

Frontend:

http://localhost:5173
📡 API Endpoints
Health Check
GET /api/health

Example:

http://127.0.0.1:5000/api/health
Model Information
GET /api/model-info
MRI Prediction
POST /api/predict

Form-data:

image = MRI image

Example response:

{
  "success": true,
  "prediction": "Glioma",
  "confidence": 91.42,
  "probabilities": {
    "Glioma": 91.42,
    "Meningioma": 4.12,
    "No Tumor": 1.03,
    "Pituitary": 3.43
  }
}
🔄 Application Workflow
User
 │
 ▼
React Frontend
 │
 │ Upload MRI
 ▼
Flask REST API
 │
 ▼
Image Preprocessing
 │
 ▼
TensorFlow Model
 │
 ▼
MobileNetV2
 │
 ▼
Prediction
 │
 ▼
Confidence Scores
 │
 ▼
JSON Response
 │
 ▼
React UI
🧪 Example

Upload:

brain_mri.jpg

The frontend sends:

POST /api/predict

The backend processes the image and returns:

Prediction:
Glioma

Confidence:
91.42%
🛠️ Technologies
Machine Learning
Python
TensorFlow
Keras
MobileNetV2
NumPy
Pillow
Backend
Flask
Flask-CORS
REST API
Frontend
React
Vite
JavaScript
CSS
Lucide React
🔐 Important Note

This project is intended for:

Education
Machine Learning research
Software engineering demonstrations
Portfolio development

It is not a medical diagnostic system.

MRI predictions should not be used to make medical decisions.

👨‍💻 Author
Muhiadin Said Hassan

Software AI Engineer & Machine Learning Engineer

Focused on:

Artificial Intelligence
Machine Learning
Deep Learning
Computer Vision
Full-Stack AI Applications
REST API Development
📜 License

MIT License


---

## 16. Sida loo ordo project-ka

### Terminal 1 — Backend

```bash
cd Day_27/backend
python -m venv venv

Windows:

venv\Scripts\activate
pip install -r requirements.txt

Kadib:

python app.py

Waa inaad aragtaa:

Brain Tumor Classification API
Server: http://127.0.0.1:5000
Terminal 2 — React
cd Day_27/frontend
npm install

Kadib:

npm run dev

Fur:

http://localhost:5173
Architecture-ka ugu dambeeya
                 DAY 27
                   │
        ┌──────────┴──────────┐
        │                     │
   FRONTEND                BACKEND
   React + Vite             Flask
        │                     │
        │   POST /predict     │
        └────────────────────►│
                              │
                              ▼
                       TensorFlow/Keras
                              │
                              ▼
                         MobileNetV2
                              │
                              ▼
                     4-Class Prediction
                              │
                              ▼
                       JSON Response
                              │
        ◄─────────────────────┘
        │
        ▼
   Prediction UI
   + Confidence
   + Probabilities