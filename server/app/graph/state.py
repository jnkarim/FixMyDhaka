from typing import TypedDict

class ReportState(TypedDict):
    description: str
    location: str
    
    category: str
    category_confidence: str