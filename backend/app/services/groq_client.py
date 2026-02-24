from groq import Groq
from app.core.config import settings

class GroqService:
    def __init__(self):
        self.client = Groq(api_key=settings.GROQ_API_KEY)
        self.model = "llama-3.3-70b-versatile"
    
    def generate_response(self, prompt: str, system_prompt: str = None, temperature: float = 0.1):
        messages = []
        
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        
        messages.append({"role": "user", "content": prompt})
        
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                temperature=temperature,
                max_tokens=1024
            )
            return response.choices[0].message.content
        except Exception as e:
            print(f"Groq API error: {e}")
            return None
    
    def rewrite_query(self, query: str) -> str:
        system_prompt = """You are a query rewriting expert. 
Rewrite the question to be more specific and clear for document search.
Return ONLY the rewritten question."""
        
        return self.generate_response(query, system_prompt, temperature=0.3) or query
    
    def generate_summary(self, text: str) -> str:
        system_prompt = "Summarize the following document concisely:"
        return self.generate_response(text[:10000], system_prompt, temperature=0.3) or text[:300] + "..."
    
    def generate_suggestions(self, text: str, count: int = 3) -> list:
        system_prompt = f"Generate {count} relevant questions about this document. Return as JSON array."
        try:
            response = self.generate_response(text[:5000], system_prompt, temperature=0.5)
            import json
            return json.loads(response) if response else []
        except:
            return ["What is this document about?", "What are the key points?", "Summarize this document"]

groq_service = GroqService()