import asyncio
import base64
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from fastapi import (
    FastAPI,
    File,
    Form,
    HTTPException,
    UploadFile,
)

from fastapi.middleware.cors import (
    CORSMiddleware,
)

from app.graph.workflow import graph

logger = logging.getLogger(__name__)


app = FastAPI(
    title="FixMyDhaka API",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check():
    return {
        "status": "ok",
    }


@app.post("/api/reports/analyze")
async def analyze_report(
    description: str = Form(...),
    location: str = Form(...),
    photo: UploadFile | None = File(None),
):
    description = description.strip()
    location = location.strip()

    if not description:
        raise HTTPException(
            status_code=400,
            detail="Description is required.",
        )

    if not location:
        raise HTTPException(
            status_code=400,
            detail="Location is required.",
        )

    image_base64 = None
    image_mime_type = None

    if photo is not None:
        allowed_types = (
            "image/jpeg",
            "image/png",
            "image/webp",
        )

        if photo.content_type not in allowed_types:
            raise HTTPException(
                status_code=400,
                detail=("Only JPEG, PNG, and WebP " "images are allowed."),
            )

        image_bytes = await photo.read()

        if len(image_bytes) > (5 * 1024 * 1024):
            raise HTTPException(
                status_code=400,
                detail=("Image must be smaller " "than 5 MB."),
            )

        image_base64 = base64.b64encode(image_bytes).decode("utf-8")

        image_mime_type = photo.content_type

    initial_state = {
        "description": description,
        "location": location,
        "location_valid": False,
        "jurisdiction": None,
        "jurisdiction_area": None,
        "jurisdiction_source": None,
        "category": "",
        "category_confidence": 0.0,
        "image_base64": image_base64,
        "image_mime_type": image_mime_type,
        "visual_evidence": None,
        "image_relevant": False,
        "needs_clarification": False,
        "clarification_question": None,
        "authority": None,
        "evidence_sufficient": False,
        "authority_evidence": None,
        "authority_source": None,
        "authority_distance": None,
        "retrieval_attempts": 0,
        "reporting_method": None,
        "reporting_url": None,
        "reporting_phone": None,
        "reporting_email": None,
        "next_step": None,
        "complaint_text": None,
    }

    try:
        result = await asyncio.to_thread(
            graph.invoke,
            initial_state,
        )

    except Exception as exc:
        logger.exception("Report analysis failed")

        raise HTTPException(
            status_code=500,
            detail=("Report analysis failed. " "Please try again."),
        ) from exc

    return {
        "description": result["description"],
        "location": result["location"],
        "location_valid": result["location_valid"],
        "jurisdiction": result.get("jurisdiction"),
        "jurisdiction_area": result.get("jurisdiction_area"),
        "jurisdiction_source": result.get("jurisdiction_source"),
        "detected_category": result.get("category"),
        "confidence": result.get("category_confidence"),
        "image_relevant": result.get("image_relevant"),
        "visual_evidence": result.get("visual_evidence"),
        "needs_clarification": result.get("needs_clarification"),
        "clarification_question": result.get("clarification_question"),
        "authority": result.get("authority"),
        "evidence_sufficient": result.get("evidence_sufficient"),
        "authority_evidence": result.get("authority_evidence"),
        "authority_source": result.get("authority_source"),
        "authority_distance": result.get("authority_distance"),
        "reporting_method": result.get("reporting_method"),
        "reporting_url": result.get("reporting_url"),
        "reporting_phone": result.get("reporting_phone"),
        "reporting_email": result.get("reporting_email"),
        "next_step": result.get("next_step"),
        "copyable_complaint": result.get("complaint_text"),
    }
