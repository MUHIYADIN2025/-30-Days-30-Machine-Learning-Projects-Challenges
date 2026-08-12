from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from transformers import pipeline

app = FastAPI(title="Biomedical NER API")

# Enable CORS for React frontend cross-origin requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize HF pipeline with the Day 28 model
MODEL_NAME = "d4data/biomedical-ner-all"
ner_pipeline = pipeline("ner", model=MODEL_NAME, aggregation_strategy="simple")

class TextRequest(BaseModel):
    text: str

@app.post("/predict")
def predict_entities(request: TextRequest):
    if not request.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty.")
    
    try:
        results = ner_pipeline(request.text)
        # Convert float32 scores to Python floats for JSON serialization
        formatted_results = [
            {
                "entity": item["entity_group"],
                "word": item["word"],
                "score": float(item["score"]),
                "start": item["start"],
                "end": item["end"]
            }
            for item in results
        ]
        return {"entities": formatted_results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)