import PyPDF2
import io
from typing import List

class PDFProcessor:
    @staticmethod
    def extract_text(file_content: bytes) -> str:
        text = ""
        try:
            pdf_reader = PyPDF2.PdfReader(io.BytesIO(file_content))
            max_pages = min(len(pdf_reader.pages), 10)
            for i in range(max_pages):
                page_text = pdf_reader.pages[i].extract_text() or ""
                text += page_text
                if len(text) > 50000:
                    text = text[:50000]
                    break
        except Exception as e:
            print(f"PDF extraction error: {e}")
        return text

    @staticmethod
    def chunk_text(text: str, chunk_size: int = 500, overlap: int = 150) -> List[str]:
        chunks = []
        if not text:
            return chunks
        text = text[:50000]
        text_length = len(text)
        start = 0
        while start < text_length:
            end = min(start + chunk_size, text_length)
            chunk = text[start:end]
            if chunk.strip():
                chunks.append(chunk)
            start = end - overlap if overlap > 0 and end < text_length else end
        return chunks

pdf_processor = PDFProcessor()