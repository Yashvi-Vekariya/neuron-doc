from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class DocumentBase(BaseModel):
    filename: str
    file_size: int
    mime_type: str

class DocumentCreate(DocumentBase):
    user_id: str

class DocumentInDB(DocumentBase):
    id: str
    doc_id: str
    user_id: str
    status: str  # processing, completed, failed
    chunks: int = 0
    summary: Optional[str] = None
    suggestions: List[str] = []
    created_at: datetime
    updated_at: Optional[datetime] = None

class DocumentResponse(DocumentBase):
    id: str
    doc_id: str
    status: str
    chunks: int
    summary: Optional[str] = None
    suggestions: List[str] = []
    created_at: datetime