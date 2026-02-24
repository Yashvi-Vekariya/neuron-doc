from app.services.groq_client import groq_service
from app.services.rag.retriever import retriever_service
from typing import Dict, Any, List

class GeneratorService:
    def __init__(self):
        self.groq = groq_service
    
    def generate_answer(self, question: str, doc_id: str = None) -> Dict[str, Any]:
        # Step 1: Rewrite query
        refined_question = self.groq.rewrite_query(question)
        
        # Step 2: Retrieve relevant documents
        docs = retriever_service.search(refined_question, doc_id)
        
        # Step 3: Prepare context
        if docs and len(docs) > 0:
            context = "\n\n".join([
                f"[Page {d.get('page', 0)}]: {d.get('content', '')}"
                for d in docs[:5]
            ])
        else:
            context = "No relevant documents found."
        
        # Step 4: Generate answer
        system_prompt = """You are a helpful document Q&A assistant.
You are given content extracted from a PDF document.
Your job is to answer the user's question using the provided context.
Always try to find and extract relevant information from the context.
Give detailed and accurate answers based on what is in the document.
Only say 'I cannot find this information' if the context is completely empty or totally unrelated to the question."""

        user_prompt = f"""Here is the document content:

{context}

Question: {refined_question}

Please answer the question based on the document content above:"""

        answer = self.groq.generate_response(user_prompt, system_prompt)
        
        # Step 5: Calculate confidence
        confidence = 0.9 if docs and len(docs) > 0 else 0.3
        
        # Step 6: Format sources
        sources = []
        for d in docs[:3]:
            sources.append({
                "text": d.get("content", "")[:200] + "..." if len(d.get("content", "")) > 200 else d.get("content", ""),
                "page": d.get("page", 0),
                "doc_id": d.get("doc_id", doc_id)
            })
        
        return {
            "answer": answer or "I couldn't generate an answer.",
            "confidence": confidence,
            "sources": sources
        }

generator_service = GeneratorService()