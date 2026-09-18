import shutil

from dotenv import load_dotenv
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma

from app.rag.config import (
    AUTHORITY_DOCS_DIR,
    VECTORSTORE_DIR,
    COLLECTION_NAME,
    EMBEDDING_MODEL,
)

from app.rag.ocr_loader import load_scanned_pdf


load_dotenv()


def load_documents():
    documents = []

    pdf_files = list(
        AUTHORITY_DOCS_DIR.glob("*.pdf")
    )

    if not pdf_files:
        raise FileNotFoundError(
            f"No PDF files found in {AUTHORITY_DOCS_DIR}"
        )

    for pdf_path in pdf_files:
        print(f"Loading: {pdf_path.name}")

        pages = load_scanned_pdf(pdf_path)

        documents.extend(pages)

    return documents


def split_documents(documents):
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=1200,
        chunk_overlap=200,
    )

    chunks = splitter.split_documents(documents)

    return chunks


def build_vectorstore(chunks):
    if VECTORSTORE_DIR.exists():
        shutil.rmtree(VECTORSTORE_DIR)

    embeddings = HuggingFaceEmbeddings(
        model_name=EMBEDDING_MODEL,
    )

    Chroma.from_documents(
        documents=chunks,
        embedding=embeddings,
        collection_name=COLLECTION_NAME,
        persist_directory=str(VECTORSTORE_DIR),
    )


def main():
    print("Loading documents...")

    documents = load_documents()

    print(f"Loaded {len(documents)} pages.")

    print("Splitting documents...")

    chunks = split_documents(documents)

    print(f"Created {len(chunks)} chunks.")

    print("Creating local embeddings and vector store...")

    build_vectorstore(chunks)

    print("Authority vector store created successfully.")


if __name__ == "__main__":
    main()