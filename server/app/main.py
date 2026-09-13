from fastapi import FastAPI
from pydantic import BaseModel

from app.graph.workflow import graph

app = FastAPI()

class ReportAnalyzeRequest(BaseModel):
    description: str
    location: str

@app.get('/health')
def health_check():
    return {"status": "ok"}

@app.post('/api/reports/analyze')
def analyze_report(report: ReportAnalyzeRequest):
    
    result = graph.invoke({
        "description": report.description,
        "location": report.location,
        "category": "",
        "category_confidence": 0.0,
    })
    
    return {
        "description": result["description"],
        "location": result["location"],
        "detected_category": result["category"],
        "confidence": result["category_confidence"]
    }