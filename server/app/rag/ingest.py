import shutil

from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma

from app.rag.config import (
    AUTHORITY_DOCS_DIR,
    VECTORSTORE_DIR,
    COLLECTION_NAME,
    EMBEDDING_MODEL,
)

from app.rag.sources import AUTHORITY_SOURCES


def load_documents():
    documents = []

    for source in AUTHORITY_SOURCES:

        file_path = (
            AUTHORITY_DOCS_DIR
            / source["filename"]
        )

        text = file_path.read_text(
            encoding="utf-8"
        ).strip()

        sections = text.split(
            "CATEGORY:"
        )

        authority_header = (
            sections[0].strip()
        )

        for section in sections[1:]:

            section = section.strip()

            if not section:
                continue

            lines = section.splitlines()

            category = lines[0].strip()

            content = (
                f"{authority_header}\n\n"
                f"CATEGORY: {section}"
            )

            document = Document(
                page_content=content,
                metadata={
                    "authority":
                        source["authority"],

                    "category":
                        category,

                    "source_name":
                        source["source_name"],

                    "filename":
                        source["filename"],
                },
            )

            documents.append(
                document
            )

            print(
                f"Loaded: "
                f"{source['authority']} "
                f"-> {category}"
            )

    return documents


def split_documents(documents):
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=700,
        chunk_overlap=100,
    )

    chunks = splitter.split_documents(
        documents
    )

    return chunks


def get_embeddings():
    embeddings = HuggingFaceEmbeddings(
        model_name=EMBEDDING_MODEL,

        encode_kwargs={
            "normalize_embeddings": True
        },
    )

    return embeddings


def build_vectorstore(chunks):

    if VECTORSTORE_DIR.exists():
        shutil.rmtree(
            VECTORSTORE_DIR
        )

    embeddings = get_embeddings()

    Chroma.from_documents(
        documents=chunks,
        embedding=embeddings,
        collection_name=COLLECTION_NAME,
        persist_directory=str(
            VECTORSTORE_DIR
        ),
    )


def main():
    print(
        "Loading authority documents..."
    )

    documents = load_documents()

    print(
        f"Loaded {len(documents)} "
        f"category documents."
    )

    print(
        "Splitting documents..."
    )

    chunks = split_documents(
        documents
    )

    print(
        f"Created {len(chunks)} chunks."
    )

    print(
        "Creating embeddings "
        "and vector store..."
    )

    build_vectorstore(
        chunks
    )

    print(
        "Authority vector store "
        "created successfully."
    )


if __name__ == "__main__":
    main()