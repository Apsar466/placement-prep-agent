import sys
import os
import logging
import json
import asyncio

# Add the backend directory to the Python path so we can import our modules
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import database
from rag.ingester import DataIngestor

# Configure basic logging for the script
logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")
logger = logging.getLogger(__name__)

async def main():
    print("--- Starting Placement Data Ingestion ---")
    
    # 1. Initialize DB connections
    await database.init_db()
    
    if not database.chroma_client:
        logger.error("ChromaDB client was not initialized. Ingestion aborted.")
        return

    # 2. Run Ingestion
    data_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'mock_placement_data.json')
    if not os.path.exists(data_path):
        logger.error(f"Data file not found at {data_path}")
        return

    with open(data_path, 'r', encoding='utf-8') as f:
        all_documents = json.load(f)

    # Ingest data group by type
    # Type 1: company_experiences
    company_experiences_docs = [doc for doc in all_documents if doc.get("type") == "company_experiences"]
    if company_experiences_docs:
        logger.info(f"Ingesting {len(company_experiences_docs)} company experiences...")
        collection = database.chroma_client.get_collection(name="company_experiences")
        ingestor = DataIngestor(collection=collection, embed_fn=database.embedding_function)
        
        # Save temp JSON for this subset to use ingest_from_json or write a custom helper
        # We can implement a quick custom list ingestor
        ids = [doc["id"] for doc in company_experiences_docs]
        docs_text = [doc["content"] for doc in company_experiences_docs]
        metadatas = [
            {"company": doc.get("company", "General"), "role": doc.get("role", "SDE"), "type": doc.get("type", "general")}
            for doc in company_experiences_docs
        ]
        collection.upsert(ids=ids, documents=docs_text, metadatas=metadatas)
        logger.info("Successfully ingested company experiences.")

    # Type 2: dsa_knowledge
    dsa_docs = [doc for doc in all_documents if doc.get("type") == "dsa_knowledge"]
    if dsa_docs:
        logger.info(f"Ingesting {len(dsa_docs)} DSA knowledge items...")
        collection = database.chroma_client.get_collection(name="dsa_knowledge")
        ingestor = DataIngestor(collection=collection, embed_fn=database.embedding_function)
        
        ids = [doc["id"] for doc in dsa_docs]
        docs_text = [doc["content"] for doc in dsa_docs]
        metadatas = [
            {"company": doc.get("company", "General"), "role": doc.get("role", "SDE"), "type": doc.get("type", "general")}
            for doc in dsa_docs
        ]
        collection.upsert(ids=ids, documents=docs_text, metadatas=metadatas)
        logger.info("Successfully ingested DSA knowledge.")
    
    # 3. Cleanup
    await database.close_db()
    print("--- Ingestion Complete ---")

if __name__ == "__main__":
    # Run the async main function
    asyncio.run(main())