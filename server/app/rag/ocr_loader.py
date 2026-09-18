import pymupdf
import pytesseract

from PIL import Image
from langchain_core.documents import Document


pytesseract.pytesseract.tesseract_cmd = (
    r"C:\Program Files\Tesseract-OCR\tesseract.exe"
)


def load_scanned_pdf(pdf_path):
    documents = []

    pdf = pymupdf.open(pdf_path)

    for page_index, page in enumerate(pdf):
        pix = page.get_pixmap(
            dpi=200,
            alpha=False,
        )

        image = Image.frombytes(
            "RGB",
            [pix.width, pix.height],
            pix.samples,
        )

        text = pytesseract.image_to_string(
            image,
            lang="eng+ben",
        )

        if not text.strip():
            continue

        document = Document(
            page_content=text,
            metadata={
                "document_name": pdf_path.name,
                "source_type": "official_pdf",
                "page_number": page_index + 1,
            },
        )

        documents.append(document)

    pdf.close()

    return documents