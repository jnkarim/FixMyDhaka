import base64
import logging
import math
import os
import time
from collections import defaultdict, deque
from io import BytesIO
from threading import Lock

from PIL import Image, UnidentifiedImageError

from contextlib import (
    asynccontextmanager,
)

from fastapi import (
    FastAPI,
    File,
    Form,
    HTTPException,
    Header,
    Request,
    UploadFile,
)

from fastapi.middleware.cors import (
    CORSMiddleware,
)

from fastapi.staticfiles import (
    StaticFiles,
)

from starlette.concurrency import (
    run_in_threadpool,
)

from app.db import (
    REPORT_UPLOAD_DIR,
    init_db,
)

from app.schemas.report import (
    ReportStatusUpdate,
)

from app.services.report_repository import (
    create_report,
    get_report,
    list_reports,
    set_report_photo,
    update_report,
    verify_report_edit_token,
)

from app.services.reporting import (
    build_action_plan,
)

REPORT_UPLOAD_DIR.mkdir(
    parents=True,
    exist_ok=True,
)

logger = logging.getLogger(__name__)
MAX_IMAGE_BYTES = 5 * 1024 * 1024
MAX_IMAGE_PIXELS = 20_000_000
MAX_DESCRIPTION_CHARS = 2000
MAX_LOCATION_CHARS = 250


class AnalysisRateLimiter:
    """Small per-process guard. Use shared edge/Redis limits in production."""

    def __init__(self, max_requests=6, window_seconds=60):
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self.lock = Lock()
        self.requests = defaultdict(deque)
        self.last_cleanup = 0.0

    def check(self, client_key):
        now = time.monotonic()
        with self.lock:
            if now - self.last_cleanup >= self.window_seconds:
                for key in list(self.requests):
                    calls = self.requests[key]
                    while calls and now - calls[0] >= self.window_seconds:
                        calls.popleft()
                    if not calls:
                        del self.requests[key]
                self.last_cleanup = now

            calls = self.requests[client_key]
            while calls and now - calls[0] >= self.window_seconds:
                calls.popleft()
            if len(calls) >= self.max_requests:
                return max(1, math.ceil(self.window_seconds - (now - calls[0])))
            calls.append(now)
            return None


analysis_rate_limiter = AnalysisRateLimiter()


def validate_image(image_bytes: bytes, mime_type: str) -> None:
    expected_formats = {
        "image/jpeg": "JPEG",
        "image/png": "PNG",
        "image/webp": "WEBP",
    }
    try:
        with Image.open(BytesIO(image_bytes)) as image:
            if image.format != expected_formats[mime_type]:
                raise ValueError("The image content does not match its type.")
            if image.width * image.height > MAX_IMAGE_PIXELS:
                raise ValueError("Image dimensions are too large.")
            image.verify()
    except (
        OSError,
        ValueError,
        UnidentifiedImageError,
        Image.DecompressionBombError,
    ) as exc:
        raise HTTPException(
            status_code=400, detail="Invalid or unsupported image."
        ) from exc


@asynccontextmanager
async def lifespan(app):
    init_db()

    yield


app = FastAPI(
    title="FixMyDhaka API",
    version="1.0.0",
    lifespan=lifespan,
)


frontend_url = (
    os.getenv(
        "FRONTEND_URL",
        "",
    )
    .strip()
    .rstrip("/")
)


allowed_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]


if frontend_url:
    allowed_origins.append(frontend_url)


app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=False,
    allow_methods=["GET", "POST", "PATCH"],
    allow_headers=["Content-Type", "X-Report-Edit-Token"],
)


app.mount(
    "/uploads",
    StaticFiles(directory=str(REPORT_UPLOAD_DIR)),
    name="uploads",
)


def build_report_title(
    description,
):
    text = " ".join(description.split())

    if len(text) <= 80:
        return text

    return text[:77].rstrip() + "..."


def save_photo(
    public_id,
    image_bytes,
    mime_type,
):
    extension_map = {
        "image/jpeg": ".jpg",
        "image/png": ".png",
        "image/webp": ".webp",
    }

    extension = extension_map[mime_type]

    filename = f"{public_id}" f"{extension}"

    file_path = REPORT_UPLOAD_DIR / filename

    file_path.write_bytes(image_bytes)

    return filename


@app.get("/health")
def health_check():
    return {
        "status": "ok",
    }


@app.post("/api/reports/analyze")
async def analyze_report(
    request: Request,
    description: str = Form(...),
    location: str = Form(...),
    latitude: float | None = Form(None),
    longitude: float | None = Form(None),
    photo: UploadFile | None = File(None),
):
    description = description.strip()

    location = location.strip()

    if not description:
        raise HTTPException(
            status_code=400,
            detail=("Description is required."),
        )

    if not location:
        raise HTTPException(status_code=400, detail="Location is required.")

    if len(description) > MAX_DESCRIPTION_CHARS:
        raise HTTPException(
            status_code=400, detail="Description is too long (max 2000 characters)."
        )
    if len(location) > MAX_LOCATION_CHARS:
        raise HTTPException(
            status_code=400, detail="Location is too long (max 250 characters)."
        )

    if (latitude is None) != (longitude is None):
        raise HTTPException(
            status_code=400, detail="Provide both latitude and longitude."
        )
    if latitude is not None and (
        not math.isfinite(latitude)
        or not (-90 <= latitude <= 90)
        or not math.isfinite(longitude)
        or not (-180 <= longitude <= 180)
    ):
        raise HTTPException(status_code=400, detail="Invalid coordinates.")

    # Do not use untrusted X-Forwarded-For headers to construct the client key.
    client_key = request.client.host if request.client else "unknown"
    retry_after = analysis_rate_limiter.check(client_key)
    if retry_after is not None:
        raise HTTPException(
            status_code=429,
            detail="Too many analysis requests. Please retry later.",
            headers={"Retry-After": str(retry_after)},
        )

    image_base64 = None

    image_mime_type = None

    image_bytes = None

    if photo is not None:
        allowed_types = (
            "image/jpeg",
            "image/png",
            "image/webp",
        )

        if photo.content_type not in allowed_types:
            raise HTTPException(
                status_code=400,
                detail=("Only JPEG, PNG, " "and WebP images " "are allowed."),
            )

        # Read at most one byte over the limit (not an arbitrary-size file).
        image_bytes = await photo.read(MAX_IMAGE_BYTES + 1)

        if len(image_bytes) > MAX_IMAGE_BYTES:
            raise HTTPException(
                status_code=400,
                detail=("Image must be " "smaller than 5 MB."),
            )

        validate_image(image_bytes, photo.content_type)
        image_base64 = base64.b64encode(image_bytes).decode("utf-8")

        image_mime_type = photo.content_type

    initial_state = {
        "description": description,
        "location": location,
        "image_base64": image_base64,
        "image_mime_type": image_mime_type,
        "retrieval_attempts": 0,
    }

    try:
        # IMPORTANT:
        # Heavy LangGraph / RAG dependencies
        # are loaded only when a report is analyzed.
        #
        # This keeps Render startup fast enough
        # to bind the HTTP port first.
        from app.graph.workflow import graph

        result = await run_in_threadpool(
            graph.invoke,
            initial_state,
        )

    except Exception as error:
        error_message = str(error)

        logger.exception("Report analysis failed")

        if "RESOURCE_EXHAUSTED" in error_message or "429" in error_message:
            raise HTTPException(
                status_code=503,
                detail=(
                    "AI analysis is temporarily "
                    "unavailable because the model "
                    "usage limit has been reached. "
                    "Please try again shortly."
                ),
            )

        raise HTTPException(
            status_code=500,
            detail=("Unable to analyze the report."),
        )

    action_plan = build_action_plan(result)

    result = {
        **result,
        **action_plan,
    }

    saved_report = None
    report_edit_token = None

    category = result.get("category")

    location_valid = result.get("location_valid")

    needs_clarification = result.get(
        "needs_clarification",
        False,
    )

    can_save = (
        location_valid
        and not needs_clarification
        and category
        and category != "Unclear"
    )

    if can_save:
        evidence_sufficient = bool(result.get("evidence_sufficient"))

        authority = result.get("authority")

        routing_status = (
            "Routed" if (authority and evidence_sufficient) else "Needs review"
        )

        saved_report, report_edit_token = create_report(
            {
                "title": build_report_title(description),
                "description": description,
                "location": location,
                "latitude": latitude,
                "longitude": longitude,
                "category": category,
                "category_confidence": result.get("category_confidence"),
                "jurisdiction": result.get("jurisdiction"),
                "authority": authority,
                "authority_source": result.get("authority_source"),
                "authority_evidence": result.get("authority_evidence"),
                "evidence_sufficient": evidence_sufficient,
                "visual_evidence": result.get("visual_evidence"),
                "reporting_method": result.get("reporting_method"),
                "reporting_url": result.get("reporting_url"),
                "next_step": result.get("next_step"),
                "copyable_complaint": result.get("complaint_text"),
                "issue_status": "Open",
                "routing_status": routing_status,
                "official_submission_status": "Not submitted",
            }
        )

        if saved_report and image_bytes and image_mime_type:
            filename = save_photo(
                public_id=saved_report["public_id"],
                image_bytes=image_bytes,
                mime_type=image_mime_type,
            )

            saved_report = set_report_photo(
                saved_report["public_id"],
                filename,
            )

    return {
        "report_id": (saved_report["public_id"] if saved_report else None),
        "report_saved": saved_report is not None,
        # Sent only once to the creator; never included in GET/list responses.
        "edit_token": report_edit_token,
        "issue_status": (saved_report["issue_status"] if saved_report else None),
        "routing_status": (saved_report["routing_status"] if saved_report else None),
        "official_submission_status": (
            saved_report["official_submission_status"] if saved_report else None
        ),
        "description": result.get(
            "description",
            description,
        ),
        "location": result.get(
            "location",
            location,
        ),
        "latitude": latitude,
        "longitude": longitude,
        "location_valid": result.get("location_valid"),
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
        "photo_url": (saved_report["photo_url"] if saved_report else None),
    }


@app.get("/api/reports")
def get_reports(
    limit: int = 100,
    offset: int = 0,
):
    limit = min(
        max(
            limit,
            1,
        ),
        200,
    )

    offset = max(
        offset,
        0,
    )

    reports = list_reports(
        limit=limit,
        offset=offset,
    )

    return {
        "reports": reports,
        "count": len(reports),
    }


@app.get("/api/reports/{report_id}")
def get_report_by_id(
    report_id: str,
):
    report = get_report(report_id)

    if report is None:
        raise HTTPException(
            status_code=404,
            detail=("Report not found."),
        )

    return report


@app.patch("/api/reports/{report_id}")
def patch_report(
    report_id: str,
    payload: ReportStatusUpdate,
    edit_token: str | None = Header(default=None, alias="X-Report-Edit-Token"),
):
    existing = get_report(report_id)

    if existing is None:
        raise HTTPException(
            status_code=404,
            detail=("Report not found."),
        )

    if not edit_token:
        raise HTTPException(status_code=401, detail="Report edit token is required.")
    if not verify_report_edit_token(report_id, edit_token):
        raise HTTPException(
            status_code=403, detail="Not authorized to edit this report."
        )

    updates = payload.model_dump(exclude_none=True)
    if not updates:
        raise HTTPException(status_code=400, detail="Provide a status to update.")

    updated = update_report(report_id, updates)

    return updated
