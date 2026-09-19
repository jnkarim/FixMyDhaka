from typing import Literal

from pydantic import BaseModel


class ReportStatusUpdate(BaseModel):
    issue_status: (
        Literal[
            "Open",
            "Resolved",
        ]
        | None
    ) = None

    official_submission_status: (
        Literal[
            "Not submitted",
            "Submitted externally",
        ]
        | None
    ) = None