import logging
from chromadb import Collection
from rag.embeddings import GeminiEmbeddingFunction

logger = logging.getLogger(__name__)

class RAGRetriever:
    """Fetches relevant context from ChromaDB based on a user query."""
    
    def __init__(self, collection: Collection, embed_fn: GeminiEmbeddingFunction, n_results: int = 3):
        self.collection = collection
        self.embed_fn = embed_fn
        self.n_results = n_results

    def get_context(self, query: str, where_filter: dict = None) -> str:
        """
        Queries ChromaDB and formats the results into a single string 
        ready to be injected into an LLM prompt.
        """
        logger.info(f"Retrieving context for query: '{query[:50]}...'")
        
        try:
            results = self.collection.query(
                query_texts=[query],
                n_results=self.n_results,
                where=where_filter # E.g., {"company": "Google"}
            )
            
            if not results['documents'] or not results['documents'][0]:
                logger.warning("No relevant context found in RAG.")
                return "No specific context found in the knowledge base."

            # Format retrieved documents cleanly
            context_parts = []
            for i, doc in enumerate(results['documents'][0]):
                meta = results['metadatas'][0][i]
                context_parts.append(f"[Source: {meta.get('type', 'Unknown')} - {meta.get('company', 'General')}]\n{doc}\n")
                
            final_context = "\n".join(context_parts)
            logger.info(f"Retrieved {len(context_parts)} context blocks.")
            return final_context
            
        except Exception as e:
            logger.error(f"Retrieval failed: {e}")
            return "Error retrieving context."