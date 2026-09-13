from typing import Literal

from dotenv import load_dotenv
from pydantic import BaseModel, Field

from langchain_google_genai import ChatGoogleGenerativeAI
from langgraph.graph import START, StateGraph, END
from langchain_core.messages import HumanMessage

from app.graph.state import ReportState

load_dotenv()


class IssueClassification(BaseModel):
    category: Literal[
        "Road / Pithole",
        "Garbage",
        "Streetlight",
        "Waterlogging / Drainage",
        "Water / Sewerage",
        "Public Safety",
        "Unclear",
    ]

    image_relevant: bool

    visual_evidence: str | None

    needs_clarification: bool

    clarification_question: str | None

    # extra validation with Field
    confidence: float = Field(ge=0, le=1)


model = ChatGoogleGenerativeAI(
    model="gemini-3.8-flash",
    thinking_level="low",
)

classifier = model.with_structured_output(
    schema=IssueClassification.model_json_schema(), method="json_schema"
)


def classify_issue(state: ReportState):

    prompt = f"""
    You classify civic issues reported in Dhaka.
    
    Choose exactly one category:
    - Road / Pothole
    - Garbage
    - Streetlight
    - Waterlogging / Drainage
    - Water / Sewarage
    - Public Safety
    - Unclear
    
    Complaint:
    {state["description"]}
    
    Location:
    {state["location"]}
    
    Rules:
    - Use both the written complaint and image if an image is provided.
    - Do not invent details that are not visible or stated.
    - If there is not enough information, use "Unclear".
    - If the image is unrelated to the complaint, set image_relevant to false.
    - visual_evidence should contain only relevant visible evidence.
    - If clarification is required, provide one short clarification question.
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
    
    message = HumanMessage(
        content=content
    )

    result = classifier.invoke([message])

    return {
        "category": result["category"],
        "category_confidence": result["confidence"],
        "visual_evidence": result["visual_evidence"],
        "image_relevant": result["image_relevant"],
        "needs_clarification": result["needs_clarification"],
        "clarification_question": result["clarification_question"],
    }

builder = StateGraph(ReportState)
builder.add_node("classify_issue", classify_issue)
builder.add_edge(START, "classify_issue")
builder.add_edge("classify_issue", END)

graph = builder.compile()
