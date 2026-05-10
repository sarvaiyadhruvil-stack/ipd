import pdfplumber
import PyPDF2
from fastapi import HTTPException
from PIL import Image
import io
import os

try:
    import pytesseract
    from pdf2image import convert_from_path
    OCR_AVAILABLE = True
except ImportError:
    OCR_AVAILABLE = False

def extract_text_from_pdf(file_path: str) -> str:
    text = ""
    # 1. Try pdfplumber (Best for text-based PDFs)
    try:
        with pdfplumber.open(file_path) as pdf:
            for page in pdf.pages:
                extracted = page.extract_text()
                if extracted:
                    text += extracted + "\n"
    except Exception as e:
        print(f"pdfplumber failed: {e}")

    # 2. Try PyPDF2 as fallback (If pdfplumber fails)
    if not text.strip():
        try:
            with open(file_path, "rb") as f:
                reader = PyPDF2.PdfReader(f)
                for page in reader.pages:
                    extracted = page.extract_text()
                    if extracted:
                        text += extracted + "\n"
        except Exception as e:
            print(f"PyPDF2 fallback failed: {e}")

    # 3. OCR Fallback (If no text found - likely a scanned PDF)
    if not text.strip() or len(text.strip()) < 50:
        if OCR_AVAILABLE:
            try:
                print(f"Attempting OCR for: {file_path}")
                # We limit to first 10 pages for performance in demo
                images = convert_from_path(file_path, last_page=10)
                ocr_text = ""
                for image in images:
                    page_text = pytesseract.image_to_string(image)
                    if page_text:
                        ocr_text += page_text + "\n"
                
                if ocr_text.strip():
                    text = ocr_text
                    print("OCR successfully extracted text.")
            except Exception as e:
                print(f"OCR failed: {e}. Ensure Poppler is installed and in PATH.")
        else:
            print("OCR requested but dependencies (pytesseract/pdf2image) are missing.")

    if not text.strip():
        raise HTTPException(
            status_code=400, 
            detail="Could not extract text from PDF. It may be a scanned document and OCR is either unavailable or failed. Please check server logs."
        )

    return text.strip()


