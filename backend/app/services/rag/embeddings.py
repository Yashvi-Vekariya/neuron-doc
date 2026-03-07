from sentence_transformers import SentenceTransformer
import numpy as np
import os

os.environ["TRANSFORMERS_OFFLINE"] = "1"
os.environ["HF_DATASETS_OFFLINE"] = "1"

class EmbeddingService:
    def __init__(self):
        print("Loading embedding model...")
        self.model = SentenceTransformer('all-MiniLM-L6-v2', local_files_only=True)
        self.dimension = 384
        print("Embedding model loaded!")
    
    def embed(self, text: str) -> list:
        try:
            embedding = self.model.encode(text, normalize_embeddings=True)
            return embedding.tolist()
        except Exception as e:
            print(f"Embedding error: {e}")
            return [0.0] * self.dimension
    
    def embed_batch(self, texts: list) -> list:
        try:
            embeddings = self.model.encode(texts, normalize_embeddings=True)
            return [e.tolist() for e in embeddings]
        except Exception as e:
            print(f"Batch embedding error: {e}")
            return [self.embed(t) for t in texts]

embedding_service = EmbeddingService()