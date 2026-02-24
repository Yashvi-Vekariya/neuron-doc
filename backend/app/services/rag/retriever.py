from app.core.database import db
from app.services.rag.embeddings import embedding_service
import traceback

class RetrieverService:
    def __init__(self):
        self.supabase = db.get_client()
    
    def hybrid_search(self, query_embedding: list, text_query: str, doc_id: str = None, limit: int = 5):
        results = []
        
        # Vector search
        try:
            if doc_id:
                vector_res = self.supabase.rpc(
                    "match_documents_by_doc",
                    {
                        "query_embedding": query_embedding,
                        "match_count": limit,
                        "filter_doc_id": doc_id
                    }
                ).execute()
            else:
                vector_res = self.supabase.rpc(
                    "match_documents",
                    {
                        "query_embedding": query_embedding,
                        "match_count": limit
                    }
                ).execute()
            
            if vector_res.data:
                results.extend(vector_res.data)
        except Exception as e:
            print(f"Vector search error: {e}")
            traceback.print_exc()
        
        # Keyword search fallback
        if len(results) < limit:
            try:
                query = self.supabase.table("documents").select("*")
                
                if doc_id:
                    query = query.eq("doc_id", doc_id)
                
                keyword_res = query.ilike("content", f"%{text_query}%") \
                                  .limit(limit - len(results)) \
                                  .execute()
                
                if keyword_res.data:
                    # Avoid duplicates
                    existing_ids = {r.get('id') for r in results if r.get('id')}
                    for r in keyword_res.data:
                        if r.get('id') not in existing_ids:
                            results.append(r)
            except Exception as e:
                print(f"Keyword search error: {e}")
        
        return results
    
    def search(self, query: str, doc_id: str = None, limit: int = 5):
        # Create embedding
        query_embedding = embedding_service.embed(query)
        
        # Hybrid search
        return self.hybrid_search(query_embedding, query, doc_id, limit)

retriever_service = RetrieverService()