import numpy as np
from typing import List, Dict, Any, Optional
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.decomposition import TruncatedSVD
from sklearn.metrics.pairwise import cosine_similarity

# Initial domain vocabulary seed corpus for land governance
DOMAIN_CORPUS = [
    "peri-urban agricultural land conversion urbanization zoning master plan masterplan",
    "cadastral digital survey svamitva roshni land records modernization bhoomi dharani",
    "climate resilience flood mitigation coastal regulation zone wetland protection water bodies",
    "forest rights act FRA scheduled tribes traditional forest dwellers community forest resources",
    "land acquisition rehabilitation resettlement act LARR fair compensation displacement social impact",
    "industrial corridor infrastructure right of way land pooling town planning schemes TPS",
    "tenancy reforms land ceiling agricultural land fragmentation inheritance titling dispute resolution",
    "geospatial GIS remote sensing satellite imagery ndvi change detection urban sprawl",
    "disaster management heat island urban heat green cover afforestation biodiversity corridors",
    "panchayati raj rural land commons pastoral commons grazing lands gair mumkin pahar",
    "revenue administration patwari tehsildar registration stamp duty mutation records",
    "environmental impact assessment ecological sensitive zones eco-sensitive Western Ghats Aravallis"
]

class VectorService:
    def __init__(self, vector_dim: int = 64):
        self.vector_dim = vector_dim
        self.vectorizer = TfidfVectorizer(max_features=500, stop_words="english", ngram_range=(1, 2))
        self.svd = TruncatedSVD(n_components=min(vector_dim, len(DOMAIN_CORPUS) - 1), random_state=42)
        self._fit_initial_model()

    def _fit_initial_model(self):
        try:
            tfidf_mat = self.vectorizer.fit_transform(DOMAIN_CORPUS)
            self.svd.fit(tfidf_mat)
        except Exception:
            pass

    def encode(self, text: str) -> List[float]:
        """Encodes text into a normalized embedding vector."""
        if not text or not text.strip():
            return [0.0] * self.vector_dim
        try:
            tfidf_vec = self.vectorizer.transform([text])
            dense_vec = self.svd.transform(tfidf_vec)[0]
            norm = np.linalg.norm(dense_vec)
            if norm > 0:
                dense_vec = dense_vec / norm
            # Pad or trim to vector_dim
            result = dense_vec.tolist()
            if len(result) < self.vector_dim:
                result.extend([0.0] * (self.vector_dim - len(result)))
            return result[:self.vector_dim]
        except Exception:
            # Fallback simple deterministic hash vector
            h = abs(hash(text))
            vec = [(float((h >> i) & 1) * 2 - 1) / np.sqrt(self.vector_dim) for i in range(self.vector_dim)]
            return vec

    def compute_similarity(self, vec1: List[float], vec2: List[float]) -> float:
        """Computes cosine similarity between two vectors."""
        try:
            v1 = np.array(vec1, dtype=float)
            v2 = np.array(vec2, dtype=float)
            dot = np.dot(v1, v2)
            n1 = np.linalg.norm(v1)
            n2 = np.linalg.norm(v2)
            if n1 == 0 or n2 == 0:
                return 0.0
            score = float(dot / (n1 * n2))
            return max(0.0, min(1.0, (score + 1.0) / 2.0))  # Map [-1, 1] to [0, 1]
        except Exception:
            return 0.5

vector_service = VectorService()
