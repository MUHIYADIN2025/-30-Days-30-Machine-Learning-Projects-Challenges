import os
import uuid

import numpy as np
from PIL import Image
from flask import Flask, jsonify, request
from flask_cors import CORS
from tensorflow.keras.models import load_model


# ---------------------------------------------------------
# APPLICATION CONFIGURATION
# ---------------------------------------------------------

app = Flask(__name__)

CORS(
    app,
    resources={
        r"/api/*": {
            "origins": "*"
        }
    }
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

MODEL_PATH = os.path.join(
    BASE_DIR,
    "brain_tumor_model.h5"
)

UPLOAD_FOLDER = os.path.join(
    BASE_DIR,
    "uploads"
)

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

app.config["MAX_CONTENT_LENGTH"] = 10 * 1024 * 1024


# ---------------------------------------------------------
# MODEL CONFIGURATION
# ---------------------------------------------------------

IMG_SIZE = (224, 224)

CLASS_NAMES = [
    "Glioma",
    "Meningioma",
    "No Tumor",
    "Pituitary"
]


# ---------------------------------------------------------
# LOAD MODEL
# ---------------------------------------------------------

print("Loading Brain Tumor Classification Model...")

try:
    model = load_model(MODEL_PATH)

    print("Model loaded successfully.")

except Exception as error:
    model = None

    print("Failed to load model.")
    print(error)


# ---------------------------------------------------------
# ALLOWED FILE TYPES
# ---------------------------------------------------------

ALLOWED_EXTENSIONS = {
    "png",
    "jpg",
    "jpeg"
}


def allowed_file(filename):
    """
    Check whether uploaded file has a supported extension.
    """

    if "." not in filename:
        return False

    extension = filename.rsplit(".", 1)[1].lower()

    return extension in ALLOWED_EXTENSIONS


# ---------------------------------------------------------
# IMAGE PREPROCESSING
# ---------------------------------------------------------

def preprocess_image(image):
    """
    Convert uploaded image into model-compatible format.
    """

    image = image.convert("RGB")

    image = image.resize(IMG_SIZE)

    image_array = np.array(image)

    image_array = image_array.astype("float32")

    image_array = image_array / 255.0

    image_array = np.expand_dims(
        image_array,
        axis=0
    )

    return image_array


# ---------------------------------------------------------
# HEALTH CHECK
# ---------------------------------------------------------

@app.route("/api/health", methods=["GET"])
def health_check():

    return jsonify({
        "status": "success",
        "message": "Brain Tumor Classification API is running.",
        "model_loaded": model is not None
    })


# ---------------------------------------------------------
# MODEL INFORMATION
# ---------------------------------------------------------

@app.route("/api/model-info", methods=["GET"])
def model_info():

    return jsonify({
        "model": "MobileNetV2",
        "task": "Brain Tumor MRI Classification",
        "image_size": "224x224",
        "classes": CLASS_NAMES,
        "classes_count": len(CLASS_NAMES)
    })


# ---------------------------------------------------------
# PREDICTION ENDPOINT
# ---------------------------------------------------------

@app.route("/api/predict", methods=["POST"])
def predict():

    # Check model
    if model is None:

        return jsonify({
            "success": False,
            "error": "Model is not loaded."
        }), 500

    # Check file
    if "image" not in request.files:

        return jsonify({
            "success": False,
            "error": "No image file was uploaded."
        }), 400

    file = request.files["image"]

    # Check filename
    if file.filename == "":

        return jsonify({
            "success": False,
            "error": "No file selected."
        }), 400

    # Check extension
    if not allowed_file(file.filename):

        return jsonify({
            "success": False,
            "error": "Unsupported file type. Please upload PNG, JPG, or JPEG."
        }), 400

    try:

        # -------------------------------------------------
        # OPEN IMAGE
        # -------------------------------------------------

        image = Image.open(file.stream)

        # -------------------------------------------------
        # PREPROCESS
        # -------------------------------------------------

        processed_image = preprocess_image(image)

        # -------------------------------------------------
        # MODEL PREDICTION
        # -------------------------------------------------

        predictions = model.predict(
            processed_image,
            verbose=0
        )

        probabilities = predictions[0]

        predicted_index = int(
            np.argmax(probabilities)
        )

        predicted_class = CLASS_NAMES[predicted_index]

        confidence = float(
            probabilities[predicted_index]
        )

        # -------------------------------------------------
        # ALL CLASS PROBABILITIES
        # -------------------------------------------------

        class_probabilities = {}

        for index, class_name in enumerate(CLASS_NAMES):

            class_probabilities[class_name] = round(
                float(probabilities[index]) * 100,
                2
            )

        # -------------------------------------------------
        # SAVE IMAGE TEMPORARILY
        # -------------------------------------------------

        unique_filename = (
            f"{uuid.uuid4()}_{file.filename}"
        )

        save_path = os.path.join(
            UPLOAD_FOLDER,
            unique_filename
        )

        image.save(save_path)

        # -------------------------------------------------
        # RESPONSE
        # -------------------------------------------------

        return jsonify({
            "success": True,
            "prediction": predicted_class,
            "confidence": round(
                confidence * 100,
                2
            ),
            "probabilities": class_probabilities,
            "message": (
                "Prediction completed successfully."
            )
        })

    except Exception as error:

        return jsonify({
            "success": False,
            "error": str(error)
        }), 500


# ---------------------------------------------------------
# ERROR HANDLERS
# ---------------------------------------------------------

@app.errorhandler(413)
def file_too_large(error):

    return jsonify({
        "success": False,
        "error": "File is too large. Maximum size is 10 MB."
    }), 413


@app.errorhandler(404)
def not_found(error):

    return jsonify({
        "success": False,
        "error": "API endpoint not found."
    }), 404


# ---------------------------------------------------------
# RUN SERVER
# ---------------------------------------------------------

if __name__ == "__main__":

    print("----------------------------------------")
    print("Brain Tumor Classification API")
    print("----------------------------------------")
    print("Server: http://127.0.0.1:5000")
    print("----------------------------------------")

    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )