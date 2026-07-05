import json
import logging
from chromadb import Collection
from rag.embeddings import GeminiEmbeddingFunction

logger = logging.getLogger(__name__)

class DataIngestor:
    """Handles chunking, embedding, and storing placement data into ChromaDB."""
    
    def __init__(self, collection: Collection, embed_fn: GeminiEmbeddingFunction):
        self.collection = collection
        self.embed_fn = embed_fn

    def ingest_from_json(self, file_path: str):
        """Reads mock data and upserts into the target ChromaDB collection."""
        logger.info(f"Starting ingestion from {file_path}...")
        
        with open(file_path, 'r', encoding='utf-8') as f:
            documents = json.load(f)

        ids = [doc["id"] for doc in documents]
        documents_text = [doc["content"] for doc in documents]
        
        # Metadata allows us to filter by company or type later
        metadatas = [
            {"company": doc.get("company", "General"), "role": doc.get("role", "SDE"), "type": doc.get("type", "general")}
            for doc in documents
        ]

        try:
            # Upsert handles both adding new documents and updating existing ones by ID
            self.collection.upsert(
                ids=ids,
                documents=documents_text,
                metadatas=metadatas
            )
            logger.info(f"Successfully ingested {len(documents)} documents into {self.collection.name}.")
        except Exception as e:
            logger.error(f"Ingestion failed: {e}")
            raise