import os
import pdfplumber

def extract_text_from_pdf(file_path):
    """
    Extracts text from a PDF file using pdfplumber.
    Handles empty, corrupted, or scanned/image-only PDFs cleanly.
    """
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"File not found: {file_path}")

    extracted_pages = []
    try:
        with pdfplumber.open(file_path) as pdf:
            if len(pdf.pages) == 0:
                raise ValueError("The PDF document has 0 pages.")
                
            for page_idx, page in enumerate(pdf.pages):
                text = page.extract_text()
                if text and text.strip():
                    extracted_pages.append(text.strip())

    except Exception as e:
        if isinstance(e, ValueError):
            raise e
        raise ValueError(f"Failed to read PDF file: {str(e)}")

    full_text = "\n\n".join(extracted_pages).strip()

    if not full_text or len(full_text) < 10:
        raise ValueError(
            "Unable to extract text from this PDF. Please upload a text-based resume PDF."
        )

    return full_text
