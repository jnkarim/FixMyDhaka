from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings

from app.rag.config import (
    VECTORSTORE_DIR,
    COLLECTION_NAME,
    EMBEDDING_MODEL,
)

embeddings = HuggingFaceEmbeddings(
    model_name=EMBEDDING_MODEL,
    encode_kwargs={
        "normalize_embeddings": True,
    },
)


vector_store = Chroma(
    collection_name=COLLECTION_NAME,
    persist_directory=str(VECTORSTORE_DIR),
    embedding_function=embeddings,
)


def search_authority_documents(
    query: str,
    category: str,
    authority: str,
    k: int = 3,
):
    results = vector_store.similarity_search_with_score(
        query=query,
        k=k,
        filter={
            "$and": [
                {
                    "category": category,
                },
                {
                    "authority": authority,
                },
            ]
        },
    )

    return results


def main():
    jurisdiction = "DNCC"
    category = "Garbage"

    query = (
        f"{jurisdiction} official responsibility "
        f"for {category} service and citizen complaints"
    )

    results = search_authority_documents(
        query=query,
        category=category,
        authority=jurisdiction,
        k=3,
    )

    for index, result in enumerate(
        results,
        start=1,
    ):
        document, distance = result

        print("=" * 70)
        print(f"Result {index}")
        print(f"Distance: {distance}")

        print(
            "Authority:",
            document.metadata.get("authority"),
        )

        print(
            "Category:",
            document.metadata.get("category"),
        )

        print(
            "Source:",
            document.metadata.get("source_name"),
        )

        print("\nEvidence:\n")
        print(document.page_content)
        print()


if __name__ == "__main__":
    main()
