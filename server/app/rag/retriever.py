from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings

from app.rag.config import (
    VECTORSTORE_DIR,
    COLLECTION_NAME,
    EMBEDDING_MODEL,
)


print(
    "Loading embedding model..."
)

embeddings = (
    HuggingFaceEmbeddings(
        model_name=EMBEDDING_MODEL,
        encode_kwargs={
            "normalize_embeddings": True,
        },
    )
)

print(
    "Embedding model loaded."
)


vector_store = Chroma(
    collection_name=COLLECTION_NAME,
    persist_directory=str(
        VECTORSTORE_DIR
    ),
    embedding_function=embeddings,
)


def get_vectorstore():
    return vector_store


def search_authority_documents(
    query: str,
    category: str,
    authority: str | None = None,
    k: int = 3,
):
    print(
        ">>> similarity search START"
    )

    if authority:
        metadata_filter = {
            "$and": [
                {
                    "category": category,
                },
                {
                    "authority": authority,
                },
            ]
        }

    else:
        metadata_filter = {
            "category": category,
        }

    results = (
        vector_store
        .similarity_search_with_score(
            query=query,
            k=k,
            filter=metadata_filter,
        )
    )

    print(
        ">>> similarity search END"
    )

    return results


def main():
    jurisdiction = "DNCC"

    category = (
        "Road / Pothole"
    )

    authority = "DNCC"

    query = (
        f"{jurisdiction} official responsibility "
        f"for {category} service "
        f"and citizen complaints"
    )

    results = (
        search_authority_documents(
            query=query,
            category=category,
            authority=authority,
            k=3,
        )
    )

    print(
        f"\nQuery: {query}"
    )

    print(
        f"Category filter: {category}"
    )

    print(
        f"Authority filter: {authority}\n"
    )

    for index, result in enumerate(
        results,
        start=1,
    ):
        document, score = result

        print(
            "=" * 70
        )

        print(
            f"Result {index}"
        )

        print(
            f"Distance: {score}"
        )

        print(
            "Authority:",
            document.metadata.get(
                "authority"
            ),
        )

        print(
            "Category:",
            document.metadata.get(
                "category"
            ),
        )

        print(
            "Source:",
            document.metadata.get(
                "source_name"
            ),
        )

        print(
            "\nEvidence:\n"
        )

        print(
            document.page_content
        )

        print()


if __name__ == "__main__":
    main()