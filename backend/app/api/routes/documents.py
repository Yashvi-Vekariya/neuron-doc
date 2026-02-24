from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from app.api.deps import get_current_user
from app.services.pdf_processor import pdf_processor
from app.services.rag.embeddings import embedding_service
from app.services.groq_client import groq_service
from app.core.database import db
import uuid
import os
from typing import List
from app.models.document import DocumentResponse
from datetime import datetime

router = APIRouter(prefix="/documents", tags=["Documents"])

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload", response_model=DocumentResponse)
async def upload_document(
    file: UploadFile = File(...),
    current_user = Depends(get_current_user)
):
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
    
    doc_id = str(uuid.uuid4())
    file_path = f"{UPLOAD_DIR}/{doc_id}.pdf"
    
    content = await file.read()
    with open(file_path, "wb") as f:
        f.write(content)
    
    text = pdf_processor.extract_text(content)
    
    if not text or len(text.strip()) == 0:
        raise HTTPException(status_code=400, detail="Could not extract text from PDF")
    
    chunks = pdf_processor.chunk_text(text, chunk_size=500, overlap=50)
    
    supabase = db.get_client()
    successful_chunks = 0
    
    for i, chunk in enumerate(chunks):
        try:
            embedding = embedding_service.embed(chunk)
            
            result = supabase.table("documents").insert({
                "doc_id": doc_id,
                "user_id": current_user["id"],
                "content": chunk,
                "page": i,
                "embedding": embedding
            }).execute()
            
            successful_chunks += 1
        except Exception as e:
            print(f"Chunk {i} error: {e}")
    
    if successful_chunks == 0:
        raise HTTPException(status_code=500, detail="Failed to store chunks")
    
    summary = groq_service.generate_summary(text)
    suggestions = groq_service.generate_suggestions(text)
    
    document = {
        "id": str(uuid.uuid4()),
        "doc_id": doc_id,
        "user_id": current_user["id"],
        "filename": file.filename,
        "file_size": len(content),
        "mime_type": "application/pdf",
        "status": "completed",
        "chunks": successful_chunks,
        "summary": summary,
        "suggestions": suggestions,
        "created_at": datetime.utcnow().isoformat()
    }
    
    result = supabase.table("documents_meta").insert(document).execute()
    
    os.remove(file_path)
    
    return DocumentResponse(**document)

@router.get("/", response_model=List[DocumentResponse])
async def get_documents(current_user = Depends(get_current_user)):
    supabase = db.get_client()
    result = supabase.table("documents_meta") \
        .select("*") \
        .eq("user_id", current_user["id"]) \
        .order("created_at", desc=True) \
        .execute()
    
    return [DocumentResponse(**doc) for doc in result.data]

@router.delete("/{doc_id}")
async def delete_document(doc_id: str, current_user = Depends(get_current_user)):
    supabase = db.get_client()
    
    supabase.table("documents").delete().eq("doc_id", doc_id).eq("user_id", current_user["id"]).execute()
    
    result = supabase.table("documents_meta") \
        .delete() \
        .eq("doc_id", doc_id) \
        .eq("user_id", current_user["id"]) \
        .execute()
    
    if not result.data:
        raise HTTPException(status_code=404, detail="Document not found")
    
    return {"message": "Document deleted successfully"}