from PIL import Image
from fastapi import HTTPException
import os

try:
    import pytesseract
    OCR_AVAILABLE = True
except ImportError:
    OCR_AVAILABLE = False

def extract_text_from_image(file_path: str) -> str:
    if not OCR_AVAILABLE:
        raise HTTPException(
            status_code=400,
            detail="Image OCR is not available. Please install Tesseract OCR on the server."
        )
    
    try:
        # Preprocessing image for better OCR
        image = Image.open(file_path)
        # Convert to RGB if needed
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # OCR
        text = pytesseract.image_to_string(image)
        
        if not text.strip():
            # Try some basic image enhancement if no text found
            # (e.g. grayscale)
            gray = image.convert('L')
            text = pytesseract.image_to_string(gray)

        return text.strip()
    except Exception as e:
        print(f"Image OCR failed: {e}")
        raise HTTPException(status_code=400, detail=f"Image OCR failed: {str(e)}. Ensure Tesseract is installed.")

