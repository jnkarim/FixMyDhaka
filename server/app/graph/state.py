from typing import TypedDict


class ReportState(TypedDict):
    description: str
    location: str

    location_valid: bool

    jurisdiction: str | None
    jurisdiction_area: str | None
    jurisdiction_source: str | None

    category: str
    category_confidence: str

    image_base64: str | None
    image_mime_type: str | None

    visual_evidence: str | None
    image_relevant: bool

    needs_clarification: bool
    clarification_question: str | None

    authority: str | None

    evidence_sufficient: bool
    authority_evidence: str | None
    authority_source: str | None
    authority_distance: float | None
    retrieval_attempts: int
