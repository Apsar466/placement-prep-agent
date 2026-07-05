import fitz  # PyMuPDF
import logging

logger = logging.getLogger(__name__)

class PDFExtractor:
    """Extracts raw text from PDF files using PyMuPDF for high performance."""
    
    @staticmethod
    def extract_text_from_bytes(pdf_bytes: bytes) -> str:
        try:
            doc = fitz.open(stream=pdf_bytes, filetype="pdf")
            text = ""
            for page in doc:
                text += page.get_text()
            doc.close()
            
            if not text.strip():
                logger.warning("PDF extracted but contained no text (might be image-based).")
                return ""
                
            return text.strip()
        except Exception as e:
            logger.error(f"Failed to extract PDF text: {e}")
            raise ValueError("Could not parse PDF. Ensure it is a valid text-based PDF.")
