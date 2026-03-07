import httpx
import numpy as np
import os

class EmbeddingService:
    def __init__(self):
        self.dimension = 384
        self.api_url = "https://router.huggingface.co/hf-inference/models/sentence-transformers/all-MiniLM-L6-v2/pipeline/feature-extraction"
        self.hf_token = os.getenv("HF_API_KEY", "")
        print("Embedding service ready!")

    def embed(self, text: str) -> list:
        try:
            headers = {"Authorization": f"Bearer {self.hf_token}"}
            response = httpx.post(self.api_url, headers=headers, json={"inputs": text}, timeout=30)
            embedding = response.json()
            if isinstance(embedding[0], list):
                embedding = np.mean(embedding, axis=0).tolist()
            return embedding
        except Exception as e:
            print(f"Embedding error: {e}")
            return [0.0] * self.dimension

    def embed_batch(self, texts: list) -> list:
        return [self.embed(t) for t in texts]

embedding_service = EmbeddingService()