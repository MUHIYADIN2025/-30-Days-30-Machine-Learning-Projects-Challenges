import { useState } from "react";

import {
  Brain,
  Upload,
  Image as ImageIcon,
  ShieldCheck,
  Activity,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Sparkles
} from "lucide-react";

import "./App.css";


const API_URL = "/api";


function App() {

  const [selectedFile, setSelectedFile] = useState(null);

  const [preview, setPreview] = useState(null);

  const [result, setResult] = useState(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");


  // -------------------------------------------------------
  // FILE SELECTION
  // -------------------------------------------------------

  const handleFileChange = (event) => {

    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setError("");

    setResult(null);

    setSelectedFile(file);

    const imageUrl = URL.createObjectURL(file);

    setPreview(imageUrl);
  };


  // -------------------------------------------------------
  // DRAG & DROP
  // -------------------------------------------------------

  const handleDrop = (event) => {

    event.preventDefault();

    const file = event.dataTransfer.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {

      setError(
        "Please upload a valid MRI image."
      );

      return;
    }

    setError("");

    setResult(null);

    setSelectedFile(file);

    setPreview(
      URL.createObjectURL(file)
    );
  };


  const handleDragOver = (event) => {

    event.preventDefault();
  };


  // -------------------------------------------------------
  // PREDICTION
  // -------------------------------------------------------

  const handlePredict = async () => {

    if (!selectedFile) {

      setError(
        "Please select an MRI image first."
      );

      return;
    }

    setLoading(true);

    setError("");

    setResult(null);


    try {

      const formData = new FormData();

      formData.append(
        "image",
        selectedFile
      );


      const response = await fetch(
        `${API_URL}/predict`,
        {
          method: "POST",
          body: formData
        }
      );


      const data = await response.json();


      if (!response.ok || !data.success) {

        throw new Error(
          data.error ||
          "Prediction failed."
        );
      }


      setResult(data);

    } catch (err) {

      setError(
        err.message ||
        "Unable to connect to the AI server."
      );

    } finally {

      setLoading(false);
    }
  };


  // -------------------------------------------------------
  // RESET
  // -------------------------------------------------------

  const handleReset = () => {

    setSelectedFile(null);

    setPreview(null);

    setResult(null);

    setError("");

  };


  // -------------------------------------------------------
  // RENDER
  // -------------------------------------------------------

  return (

    <div className="app">

      {/* =================================================
          NAVBAR
      ================================================= */}

      <header className="navbar">

        <div className="brand">

          <div className="brand-icon">
            <Brain size={25} />
          </div>

          <div>
            <h1>
              NeuroVision AI
            </h1>

            <span>
              MRI Classification
            </span>
          </div>

        </div>


        <div className="status">

          <span className="status-dot"></span>

          AI System Online

        </div>

      </header>


      {/* =================================================
          HERO
      ================================================= */}

      <main>

        <section className="hero">

          <div className="hero-content">

            <div className="eyebrow">
              <Sparkles size={16} />
              DEEP LEARNING TECHNOLOGY
            </div>

            <h2>
              Brain Tumor
              <span> MRI Classifier</span>
            </h2>

            <p>
              Upload a brain MRI image and let our
              MobileNetV2-powered classification
              model analyze the image.
            </p>

          </div>

        </section>


        {/* =================================================
            MAIN WORKSPACE
        ================================================= */}

        <section className="workspace">

          {/* ===============================================
              UPLOAD CARD
          =============================================== */}

          <div className="card upload-card">

            <div className="card-header">

              <div>

                <span className="section-label">
                  STEP 01
                </span>

                <h3>
                  Upload MRI Scan
                </h3>

              </div>

              <Upload size={22} />

            </div>


            <div
              className={`drop-zone ${
                preview ? "has-image" : ""
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >

              {preview ? (

                <div className="preview-wrapper">

                  <img
                    src={preview}
                    alt="MRI preview"
                    className="mri-preview"
                  />

                  <button
                    className="remove-image"
                    onClick={handleReset}
                  >
                    <RotateCcw size={16} />
                    Change Image
                  </button>

                </div>

              ) : (

                <label
                  htmlFor="image-upload"
                  className="upload-label"
                >

                  <div className="upload-icon">

                    <ImageIcon size={30} />

                  </div>

                  <h4>
                    Drop MRI image here
                  </h4>

                  <p>
                    or click to browse files
                  </p>

                  <span className="file-types">
                    JPG, JPEG, PNG • Max 10MB
                  </span>

                  <input
                    id="image-upload"
                    type="file"
                    accept="image/png,image/jpeg,image/jpg"
                    onChange={handleFileChange}
                    hidden
                  />

                </label>

              )}

            </div>


            {selectedFile && (

              <div className="file-info">

                <CheckCircle2
                  size={18}
                />

                <div>

                  <strong>
                    {selectedFile.name}
                  </strong>

                  <span>
                    {(
                      selectedFile.size /
                      1024 /
                      1024
                    ).toFixed(2)}
                    {" "}MB
                  </span>

                </div>

              </div>

            )}


            {error && (

              <div className="error-message">

                <AlertCircle size={18} />

                <span>
                  {error}
                </span>

              </div>

            )}


            <button
              className="predict-button"
              onClick={handlePredict}
              disabled={
                !selectedFile ||
                loading
              }
            >

              {loading ? (

                <>
                  <span className="spinner"></span>
                  Analyzing MRI...
                </>

              ) : (

                <>
                  <Activity size={20} />
                  Analyze MRI
                </>

              )}

            </button>

          </div>


          {/* ===============================================
              RESULT CARD
          =============================================== */}

          <div className="card result-card">

            <div className="card-header">

              <div>

                <span className="section-label">
                  STEP 02
                </span>

                <h3>
                  AI Prediction
                </h3>

              </div>

              <Brain size={22} />

            </div>


            {!result && !loading && (

              <div className="empty-result">

                <div className="empty-icon">

                  <Activity size={32} />

                </div>

                <h4>
                  Awaiting Analysis
                </h4>

                <p>
                  Upload an MRI scan and click
                  <strong> Analyze MRI </strong>
                  to generate a prediction.
                </p>

              </div>

            )}


            {loading && (

              <div className="analyzing">

                <div className="large-spinner"></div>

                <h4>
                  Analyzing MRI Scan
                </h4>

                <p>
                  The deep learning model is
                  processing the image...
                </p>

              </div>

            )}


            {result && !loading && (

              <div className="result-content">

                <div className="prediction-badge">

                  <CheckCircle2 size={20} />

                  Prediction Complete

                </div>


                <div className="prediction-main">

                  <span>
                    Predicted Class
                  </span>

                  <h4>
                    {result.prediction}
                  </h4>

                </div>


                <div className="confidence-section">

                  <div className="confidence-header">

                    <span>
                      Confidence
                    </span>

                    <strong>
                      {result.confidence}%
                    </strong>

                  </div>

                  <div className="progress-bar">

                    <div
                      className="progress-value"
                      style={{
                        width:
                          `${result.confidence}%`
                      }}
                    ></div>

                  </div>

                </div>


                <div className="probabilities">

                  <h4>
                    Class Probabilities
                  </h4>


                  {Object.entries(
                    result.probabilities
                  ).map(
                    ([name, value]) => (

                      <div
                        className="probability-row"
                        key={name}
                      >

                        <div className="probability-name">

                          <span>
                            {name}
                          </span>

                          <strong>
                            {value}%
                          </strong>

                        </div>

                        <div className="mini-progress">

                          <div
                            style={{
                              width:
                                `${value}%`
                            }}
                          ></div>

                        </div>

                      </div>

                    )
                  )}

                </div>


                <div className="disclaimer">

                  <ShieldCheck size={18} />

                  <p>
                    This AI prediction is for
                    educational and research
                    purposes only and should not
                    be considered a medical diagnosis.
                  </p>

                </div>


                <button
                  className="reset-button"
                  onClick={handleReset}
                >

                  <RotateCcw size={17} />

                  Analyze Another Image

                </button>

              </div>

            )}

          </div>

        </section>


        {/* =================================================
            MODEL INFORMATION
        ================================================= */}

        <section className="info-grid">

          <div className="info-card">

            <Brain size={24} />

            <div>

              <span>
                MODEL
              </span>

              <strong>
                MobileNetV2
              </strong>

            </div>

          </div>


          <div className="info-card">

            <Activity size={24} />

            <div>

              <span>
                IMAGE SIZE
              </span>

              <strong>
                224 × 224
              </strong>

            </div>

          </div>


          <div className="info-card">

            <ShieldCheck size={24} />

            <div>

              <span>
                CLASSES
              </span>

              <strong>
                4 Categories
              </strong>

            </div>

          </div>

        </section>

      </main>


      {/* =================================================
          FOOTER
      ================================================= */}

      <footer>

        <p>
          NeuroVision AI • Day 27 Machine Learning Project
        </p>

        <span>
          TensorFlow • MobileNetV2 • Flask • React
        </span>

      </footer>

    </div>

  );
}

export default App;