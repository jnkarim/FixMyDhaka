import json
import re
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent.parent

DATA_PATH = BASE_DIR / "data" / "jurisdiction_areas.json"


with open(DATA_PATH, "r", encoding="utf-8") as file:
    JURISDICTION_DATA = json.load(file)


def normalize_location(location: str) -> str:
    location = location.lower().strip()

    location = re.sub(
        r"[^a-z0-9\s-]",
        " ",
        location,
    )

    location = re.sub(
        r"\s+",
        " ",
        location,
    )

    return location


def resolve_jurisdiction(location: str):
    normalized_location = normalize_location(location)

    matches = []

    for jurisdiction, data in JURISDICTION_DATA.items():

        for area in data["areas"]:
            normalized_area = normalize_location(area)

            if normalized_area in normalized_location:
                matches.append(
                    {
                        "jurisdiction": jurisdiction,
                        "matched_area": area,
                        "source": data["source"],
                    }
                )

    if len(matches) == 1:
        return matches[0]

    return None