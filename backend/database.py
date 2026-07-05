import logging
from motor.motor_asyncio import AsyncIOMotorClient
from chromadb import PersistentClient
from config import settings
from rag.embeddings import GeminiEmbeddingFunction

logger = logging.getLogger(__name__)

# Global instances
mongo_client: AsyncIOMotorClient = None
chroma_client: PersistentClient = None
embedding_function = GeminiEmbeddingFunction()

async def init_db():
    """Initialize MongoDB and ChromaDB connections."""
    global mongo_client, chroma_client
    
    # MongoDB Setup
    mongo_client = AsyncIOMotorClient(settings.mongo_uri)
    try:
        await mongo_client.admin.command('ping')
        logger.info("Successfully connected to MongoDB.")
    except Exception as e:
        logger.error(f"MongoDB connection failed: {e}")
        
    # ChromaDB Setup
    try:
        chroma_client = PersistentClient(path=settings.chroma_persist_directory)
        # Ensure default collections exist (will be populated in Phase 2)
        chroma_client.get_or_create_collection(name="company_experiences")
        chroma_client.get_or_create_collection(name="dsa_knowledge")
        logger.info("Successfully connected to ChromaDB.")
    except Exception as e:
        logger.error(f"ChromaDB initialization failed: {e}")

async def close_db():
    """Close database connections."""
    if mongo_client:
        mongo_client.close()
        logger.info("MongoDB connection closed.")