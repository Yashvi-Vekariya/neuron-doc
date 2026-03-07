from app.services.groq_client import groq_service
from app.services.rag.retriever import retriever_service
from app.core.database import db
from typing import Dict, Any, List

class GeneratorService:
    def __init__(self):
        self.groq = groq_service
    
    def generate_answer(self, question: str, doc_id: str = None) -> Dict[str, Any]:
        refined_question = question
        
        docs = retriever_service.search(refined_question, doc_id)
        
        if doc_id:
            supabase = db.get_client()
            words = [w.strip('?.,!') for w in question.split() if len(w.strip('?.,!')) >= 4]
            existing_ids = {d.get('id') for d in docs}
            for word in words:
                try:
                    kw_result = supabase.table('documents') \
                        .select('*') \
                        .eq('doc_id', doc_id) \
                        .ilike('content', f'%{word}%') \
                        .execute()
                    if kw_result.data:
                        for r in kw_result.data:
                            if r.get('id') not in existing_ids:
                                docs.append(r)
                                existing_ids.add(r.get('id'))
                except Exception as e:
                    print(f"Keyword search error: {e}")
        
        if docs and len(docs) > 0:
            context = "\n\n".join([
                f"[Chunk {i+1}]:\n{d.get('content', '')}"
                for i, d in enumerate(docs[:10])
            ])
        else:
            context = "No relevant documents found."

        print("\n=== CONTEXT SENT TO LLM ===")
        print(context[:2000])
        print("=== END CONTEXT ===\n")
        
        system_prompt = """You are a document Q&A assistant. Answer questions based ONLY on the provided context chunks.

CRITICAL RULES:
- Read ALL chunks carefully before responding
- If ANY chunk contains relevant information, use it to answer
- Connect related information across chunks to form complete answers
- Quote specific numbers and facts directly from the context
- Only say 'I cannot find this information' if truly absent from ALL chunks"""

        user_prompt = f"""Here are the document chunks:

{context}

Question: {question}

Answer directly based on the chunks above:"""

        answer = self.groq.generate_response(user_prompt, system_prompt)
        
        confidence = 0.9 if docs and len(docs) > 0 else 0.3
        
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