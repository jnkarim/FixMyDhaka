from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

DATA_DIR = BASE_DIR/"data"
AUTHORITY_DOCS_DIR = DATA_DIR/"authority_docs"

VECTORSTORE_DIR = DATA_DIR/"authority_vectorstore"

COLLECTION_NAME = "authority_documents"

EMBEDDING_MODEL = "models/gemini-embedding-001"