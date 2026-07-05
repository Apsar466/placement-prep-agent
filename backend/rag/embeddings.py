import logging
import google.generativeai as genai
from chromadb.api.types import EmbeddingFunction
from config import settings

logger = logging.getLogger(__name__)

class GeminiEmbeddingFunction(EmbeddingFunction):
    """
    Custom ChromaDB Embedding Function using Google's text-embedding-004.
    Implements the standard interface required by ChromaDB.
    """
    def __init__(self):
        self.has_api_key = settings.gemini_api_key and settings.gemini_api_key != "your_gemini_api_key_here"
        if not self.has_api_key:
            logger.warning("GEMINI_API_KEY is not set or is placeholder. Using mock embeddings for testing.")
        else:
            try:
                genai.configure(api_key=settings.gemini_api_key)
            except Exception as e:
                logger.error(f"Error configuring genai API key: {e}")
                self.has_api_key = False
        self.model = "models/text-embedding-004"

    def __call__(self, input: list[str]) -> list[list[float]]:
        """Generates embeddings for a list of documents or queries."""
        if not self.has_api_key:
            # Return mock 768-dim embeddings for testing
            mock_embedding = [0.1] * 768
            return [mock_embedding for _ in input]
            
        try:
            # Task type determines how Gemini weights the embeddings
            # RETRIEVAL_DOCUMENT for indexing, RETRIEVAL_QUERY for searching
            response = genai.embed_content(
                model=self.model,
                content=input,
                task_type="RETRIEVAL_DOCUMENT"
            )
            return response['embedding']
        except Exception as e:
            logger.error(f"Failed to generate embeddings: {e}")
            raise