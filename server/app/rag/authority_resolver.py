from app.rag.retriever import (
    search_authority_documents,
)


MAX_DISTANCE = 0.70


def resolve_authority(
    category: str,
    jurisdiction: str,
):
    query = (
        f"{jurisdiction} official responsibility "
        f"for {category} service and citizen complaints"
    )

    results = search_authority_documents(
        query=query,
        category=category,
        k=3,
    )

    if not results:
        return {
            "authority": None,
            "evidence_sufficient": False,
            "evidence": None,
            "source_name": None,
            "distance": None,
        }

    best_document, best_distance = (
        results[0]
    )

    authority = (
        best_document.metadata.get(
            "authority"
        )
    )

    source_name = (
        best_document.metadata.get(
            "source_name"
        )
    )

    evidence = (
        best_document.page_content
    )

    scope_valid = (
        authority == jurisdiction
        or (
            category == "Water / Sewerage"
            and authority == "DWASA"
        )
    )

    distance_valid = (
        best_distance <= MAX_DISTANCE
    )

    evidence_sufficient = (
        scope_valid
        and distance_valid
    )

    if not evidence_sufficient:
        return {
            "authority": None,
            "evidence_sufficient": False,
            "evidence": evidence,
            "source_name": source_name,
            "distance": best_distance,
        }

    return {
        "authority": authority,
        "evidence_sufficient": True,
        "evidence": evidence,
        "source_name": source_name,
        "distance": best_distance,
    }
    
def main():
    result = resolve_authority(
        category="Garbage",
        jurisdiction="DNCC",
    )

    print(result)


if __name__ == "__main__":
    main()