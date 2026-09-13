from typing import Literal

from dotenv import load_dotenv
from pydantic import BaseModel, Field

from langchain_google_genai import ChatGoogleGenerativeAI
from langgraph.graph import START, StateGraph, END

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
    ]

    # extra validation with Field
    confidence: float = Field(ge=0, le=1)


model = ChatGoogleGenerativeAI(model="gemini-3.8-flash")

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
    
    Complaint:
    {state["description"]}
    
    Location:
    {state["location"]}
    
    classify based on the actual reported problem.
    """

    result = classifier.invoke(prompt)

    return {"category": result["category"], "category_confidence": result["confidence"]}


builder = StateGraph(ReportState)
builder.add_node("classify_issue", classify_issue)
builder.add_edge(START, "classify_issue")
builder.add_edge("classify_issue", END)

graph = builder.compile()
