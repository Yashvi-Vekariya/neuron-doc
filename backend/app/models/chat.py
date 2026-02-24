from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

class MessageBase(BaseModel):
    role: str  # user, assistant
    content: str

class MessageCreate(MessageBase):
    user_id: str
    doc_id: str

class MessageInDB(MessageBase):
    id: str
    user_id: str
    doc_id: str
    confidence: Optional[float] = None
    sources: Optional[List[Dict[str, Any]]] = None
    created_at: datetime

class ChatRequest(BaseModel):
    doc_id: str
    question: str

class Source(BaseModel):
    text: str
    page: int
    doc_id: str

class ChatResponse(BaseModel):
    answer: str
    confidence: float
    sources: List[Source]