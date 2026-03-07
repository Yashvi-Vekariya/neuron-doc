from app.services.groq_client import groq_service
from app.services.rag.retriever import retriever_service
from app.core.database import db
from typing import Dict, Any, List

class GeneratorService:
    def __init__(self):
        self.groq = groq_service
    
    def generate_answer(self, question: str, doc_id: str = None) -> Dict[str, Any]:
        # Step 1: Use original question directly
        refined_question = question
        
        # Step 2: Retrieve relevant documents via vector search
        docs = retriever_service.search(refined_question, doc_id)
        
        # Step 3: Force include ALL chunks via keyword search
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
        
        # Step 4: Prepare context
        if docs and len(docs) > 0:
            context = "\n\n".join([
                f"[Chunk {i+1}]:\n{d.get('content', '')}"
                for i, d in enumerate(docs[:10])
            ])
        else:
            context = "No relevant documents found."

        # DEBUG - print context to terminal
        print("\n=== CONTEXT SENT TO LLM ===")
        print(context[:2000])
        print("=== END CONTEXT ===\n")
        
        # Step 5: Generate answer
        system_prompt = """You are a document Q&A assistant analyzing a resume/CV.
Answer questions using ONLY the provided context chunks.

CRITICAL RULES:
- Read ALL chunks carefully from top to bottom before responding
- This resume contains project details with specific metrics and percentages
- If ANY chunk contains relevant information, use it to answer
- For project questions: look for project names, tech stack, and achievement numbers
- Quote specific numbers and facts directly from the context
- Only say 'I cannot find this information' if truly absent from ALL chunks"""

        user_prompt = f"""Here are the document chunks:

{context}

Question: {question}

Instructions: Read ALL chunks carefully. Find relevant information and answer directly:"""

        answer = self.groq.generate_response(user_prompt, system_prompt)
        
        # Step 6: Calculate confidence
        confidence = 0.9 if docs and len(docs) > 0 else 0.3
        
        # Step 7: Format sources
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