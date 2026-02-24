from sentence_transformers import SentenceTransformer
import numpy as np

class EmbeddingService:
    def __init__(self):
        self.model = SentenceTransformer("all-MiniLM-L6-v2")
        self.dimension = 384
    
    def embed(self, text: str) -> list:
        try:
            embedding = self.model.encode(text)
            return embedding.tolist()
        except Exception as e:
            print(f"Embedding error: {e}")
            return [0.0] * self.dimension
    
    def embed_batch(self, texts: list) -> list:
        try:
            embeddings = self.model.encode(texts)
            return [emb.tolist() for emb in embeddings]
        except Exception as e:
            print(f"Batch embedding error: {e}")
            return [[0.0] * self.dimension for _ in texts]

embedding_service = EmbeddingService()