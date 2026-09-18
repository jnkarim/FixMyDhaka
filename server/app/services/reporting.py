from app.graph.state import ReportState

REPORTING_ROUTES = {
    "DNCC": {
        "method": "DNCC complaint and suggestion form",
        "url": ("https://dncc.gov.bd/pages/web-forms/" "6922d3c081fc96cef9e9beb2"),
        "phone": "16106",
        "email": "info@dncc.gov.bd",
    },
    "DSCC": {
        "method": "Government Grievance Redress System (GRS)",
        "url": "https://grs.gov.bd",
        "phone": "02223386014 / 01709900888",
        "email": "info@dscc.gov.bd",
    },
    "DWASA": {
        "method": "Government Grievance Redress System (GRS)",
        "url": "https://grs.gov.bd",
        "phone": "16162",
        "email": "info@dwasa.org.bd",
    },
}


def build_complaint_text(
    state: ReportState,
    authority: str,
):
    description = state["description"].strip()
    location = state["location"].strip()
    category = state["category"]

    visual_evidence = state.get("visual_evidence")

    lines = [
        f"Subject: {category} issue at {location}",
        "",
        f"To: {authority}",
        "",
        (f"I would like to report a " f"{category} issue at {location}."),
        f"Description: {description}",
    ]

    if visual_evidence:
        lines.append(f"Photo evidence: {visual_evidence}")

    lines.extend(
        [
            "",
            ("Please inspect the location " "and take the appropriate action."),
        ]
    )

    return "\n".join(lines)


def build_action_plan(
    state: ReportState,
):
    empty_route = {
        "reporting_method": None,
        "reporting_url": None,
        "reporting_phone": None,
        "reporting_email": None,
        "complaint_text": None,
    }

    if state.get("needs_clarification"):
        return {
            **empty_route,
            "next_step": state.get("clarification_question"),
        }

    category = state.get("category")

    if not category or category == "Unclear":
        return {
            **empty_route,
            "next_step": (
                "Please provide more detail "
                "about the civic issue so it "
                "can be routed correctly."
            ),
        }

    if category == "Public Safety":
        return {
            **empty_route,
            "next_step": (
                "The current verified authority "
                "dataset does not support automatic "
                "routing for Public Safety issues. "
                "If there is immediate danger, "
                "contact the appropriate emergency "
                "service."
            ),
        }

    authority = state.get("authority")

    if not authority or not state.get("evidence_sufficient"):
        return {
            **empty_route,
            "next_step": (
                "A responsible authority could not "
                "be verified from the current "
                "official evidence. Review this "
                "report manually instead of guessing."
            ),
        }

    route = REPORTING_ROUTES.get(authority)

    if route is None:
        return {
            **empty_route,
            "next_step": (
                f"{authority} was verified as the "
                "responsible authority, but no "
                "official reporting route is "
                "configured yet."
            ),
        }

    complaint_text = build_complaint_text(
        state=state,
        authority=authority,
    )

    return {
        "reporting_method": route["method"],
        "reporting_url": route["url"],
        "reporting_phone": route["phone"],
        "reporting_email": route["email"],
        "next_step": (
            f"Submit this complaint to " f"{authority} using " f"{route['method']}."
        ),
        "complaint_text": complaint_text,
    }
