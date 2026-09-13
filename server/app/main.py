import base64
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from pydantic import BaseModel


from app.graph.workflow import graph

app = FastAPI()

# health check
@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.post("/api/reports/analyze")
async def analyze_report(
    description: str = Form(...),
    location: str = Form(...),
    photo: UploadFile | None = File(None),
):
    image_base64 = None
    image_mime_type = None

    if photo is not None:
        allowed_types = ("image/jpeg", "image/png", "image/webp")

        if photo.content_type not in allowed_types:
            raise HTTPException(
                status_code=400,
                detail="Only JPEG, PNG, and WebP images are allowed.",
            )

        image_bytes = await photo.read()

        if len(image_bytes) > 5 * 1024 * 1024:
            raise HTTPException(
                status_code=400,
                detail="Image must be smaller than 5 MB.",
            )

        image_base64 = base64.b64encode(image_bytes).decode("utf-8")

        image_mime_type = photo.content_type

    result = graph.invoke(
        {
            "description": description,
            "location": location,
            "image_base64": image_base64,
            "image_mime_type": image_mime_type,
            "category": "",
            "category_confidence": 0.0,
            "visual_evidence": None,
            "image_relevant": False,
            "needs_clarification": False,
            "clarification_question": None,
        }
    )

    return {
        "description": result["description"],
        "location": result["location"],
        "detected_category": result["category"],
        "confidence": result["category_confidence"],
        "image_relevant": result["image_relevant"],
        "visual_evidence": result["visual_evidence"],
        "needs_clarification": result["needs_clarification"],
        "clarification_question": result["clarification_question"],
    }
