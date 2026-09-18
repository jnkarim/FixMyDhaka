from typing import Literal

from dotenv import load_dotenv
from pydantic import BaseModel, Field

from langchain_core.messages import HumanMessage
from langchain_google_genai import ChatGoogleGenerativeAI
from langgraph.graph import START, END, StateGraph

from app.graph.state import ReportState
from app.services.jurisdiction import resolve_jurisdiction

from app.rag.authority_resolver import (
    resolve_authority,
)

load_dotenv()

# Structured Output Schema of Gemini
class IssueClassification(BaseModel):
    category: Literal[
        "Road / Pothole",
        "Garbage",
        "Streetlight",
        "Waterlogging / Drainage",
        "Water / Sewerage",
        "Public Safety",
        "Unclear",
    ]

    image_relevant: bool
    visual_evidence: str | None
    confidence: float = Field(ge=0, le=1)


model = ChatGoogleGenerativeAI(
    model="gemini-3.8-flash",
    thinking_level="low",
)

classifier = model.with_structured_output(
    schema=IssueClassification.model_json_schema(),
    method="json_schema",
)


def classify_issue(state: ReportState):
    prompt = f"""
You classify civic issues reported in Dhaka.

Choose exactly one category:
- Road / Pothole
- Garbage
- Streetlight
- Waterlogging / Drainage
- Water / Sewerage
- Public Safety
- Unclear

Complaint:
{state["description"]}

Location:
{state["location"]}

Rules:
- Use both the written complaint and image if an image is provided.
- Do not invent details that are not visible or stated.
- If the image is unrelated to the complaint, set image_relevant to false.
- visual_evidence should contain only relevant visible evidence.
- Classify only the type of civic issue.
- Do not judge whether the location is specific enough.
- If the issue itself cannot be identified, use "Unclear".
- Do not invent details that are not visible or stated.
"""

    content = [
        {
            "type": "text",
            "text": prompt,
        }
    ]

    if state["image_base64"]:
        content.append(
            {
                "type": "image",
                "base64": state["image_base64"],
                "mime_type": state["image_mime_type"],
            }
        )

    message = HumanMessage(content=content)

    # actual AI call
    result = classifier.invoke([message])

    return {
        "category": result["category"],
        "category_confidence": result["confidence"],
        "visual_evidence": result["visual_evidence"],
        "image_relevant": result["image_relevant"],
    }

# Job is to verify location
def validate_location(state: ReportState):
    result = resolve_jurisdiction(state["location"])

    if result is None:
        return {
            "location_valid": False,
            "jurisdiction": None,
            "jurisdiction_area": None,
            "jurisdiction_source": None,
            "needs_clarification": True,
            "clarification_question": (
                "I could not verify this location as being within DNCC or DSCC. "
                "Please provide a more specific Dhaka area."
            ),
        }

    return {
        "location_valid": True,
        "jurisdiction": result["jurisdiction"],
        "jurisdiction_area": result["matched_area"],
        "jurisdiction_source": result["source"],
        "needs_clarification": False,
        "clarification_question": None,
    }

# routing function 
def route_after_location(
    state: ReportState,
) -> Literal["classify_issue", END]:
    if state["location_valid"]:
        return "classify_issue"

    return END

def resolve_authority_node(
    state: ReportState,
):
    category = state.get("category")
    jurisdiction = state.get(
        "jurisdiction"
    )

    current_attempts = state.get(
        "retrieval_attempts",
        0,
    )

    if (
        not category
        or category == "Unclear"
        or not jurisdiction
    ):
        return {
            "authority": None,
            "evidence_sufficient": False,
            "authority_evidence": None,
            "authority_source": None,
            "authority_distance": None,
            "retrieval_attempts":
                current_attempts + 1,
        }

    result = resolve_authority(
        category=category,
        jurisdiction=jurisdiction,
    )

    return {
        "authority":
            result["authority"],

        "evidence_sufficient":
            result["evidence_sufficient"],

        "authority_evidence":
            result["evidence"],

        "authority_source":
            result["source_name"],

        "authority_distance":
            result["distance"],

        "retrieval_attempts":
            current_attempts + 1,
    }

builder = StateGraph(ReportState)

builder.add_node(
    "validate_location",
    validate_location,
)

builder.add_node(
    "classify_issue",
    classify_issue,
)

builder.add_node(
    "resolve_authority",
    resolve_authority_node,
)

builder.add_edge(
    START,
    "validate_location",
)

builder.add_conditional_edges(
    "validate_location",
    route_after_location,
)

builder.add_edge(
    "classify_issue",
    "resolve_authority",
)

builder.add_edge(
    "resolve_authority",
    END,
)

graph = builder.compile()