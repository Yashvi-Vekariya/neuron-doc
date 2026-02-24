# Lightweight Railway-safe embedding service
import numpy as np

class EmbeddingService:
    def __init__(self):
        self.dimension = 384  # same dimension maintain
    
    def embed(self, text: str) -> list:
        try:
            # temporary lightweight embedding (hash based)
            vec = np.zeros(self.dimension)
            for i, ch in enumerate(text[:self.dimension]):
                vec[i] = ord(ch) / 1000.0
            return vec.tolist()
        except Exception as e:
            print(f"Embedding error: {e}")
            return [0.0] * self.dimension
    
    def embed_batch(self, texts: list) -> list:
        return [self.embed(t) for t in texts]

embedding_service = EmbeddingService()