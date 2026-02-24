from fastapi import APIRouter, HTTPException, Depends  # ← Depends add karo
from app.models.chat import ChatRequest, ChatResponse, MessageCreate
from app.api.deps import get_current_user
from app.services.rag.generator import generator_service
from app.core.database import db
import uuid
from datetime import datetime

router = APIRouter(prefix="/chat", tags=["Chat"])

@router.post("/", response_model=ChatResponse)
async def chat(
    request: ChatRequest,
    current_user = Depends(get_current_user)
):
    if not request.question or len(request.question.strip()) == 0:
        raise HTTPException(status_code=400, detail="Question cannot be empty")
    
    # Generate answer
    result = generator_service.generate_answer(request.question, request.doc_id)
    
    # Save to history
    supabase = db.get_client()
    
    # Save user message
    supabase.table("messages").insert({
        "id": str(uuid.uuid4()),
        "user_id": current_user["id"],
        "doc_id": request.doc_id,
        "role": "user",
        "content": request.question,
        "created_at": datetime.utcnow().isoformat()
    }).execute()
    
    # Save assistant message
    supabase.table("messages").insert({
        "id": str(uuid.uuid4()),
        "user_id": current_user["id"],
        "doc_id": request.doc_id,
        "role": "assistant",
        "content": result["answer"],
        "confidence": result["confidence"],
        "sources": result["sources"],
        "created_at": datetime.utcnow().isoformat()
    }).execute()
    
    return ChatResponse(**result)

@router.get("/history/{doc_id}")
async def get_history(doc_id: str, current_user = Depends(get_current_user)):
    supabase = db.get_client()
    result = supabase.table("messages") \
        .select("*") \
        .eq("user_id", current_user["id"]) \
        .eq("doc_id", doc_id) \
        .order("created_at") \
        .execute()
    
    return {"messages": result.data}