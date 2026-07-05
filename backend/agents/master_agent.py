import logging
from database import chroma_client, embedding_function
from rag.retriever import RAGRetriever
from .resume_agent import ResumeAgent
from .career_agent import CareerAgent
from .company_dna_agent import CompanyDNAAgent
from .strategy_agent import StrategyAgent

logger = logging.getLogger(__name__)

class MasterPlacementAgent:
    def __init__(self):
        self.resume_agent = ResumeAgent()
        self.career_agent = CareerAgent()
        self.company_agent = CompanyDNAAgent()
        self.strategy_agent = StrategyAgent()
        
        # Initialize RAG Retrievers for different knowledge bases
        try:
            self.company_retriever = RAGRetriever(
                collection=chroma_client.get_collection("company_experiences"),
                embed_fn=embedding_function,
                n_results=3
            )
        except Exception as e:
            logger.warning(f"Failed to load company_experiences RAG retriever: {e}")
            self.company_retriever = None

        try:
            self.dsa_retriever = RAGRetriever(
                collection=chroma_client.get_collection("dsa_knowledge"),
                embed_fn=embedding_function,
                n_results=2
            )
        except Exception as e:
            logger.warning(f"Failed to load dsa_knowledge RAG retriever: {e}")
            self.dsa_retriever = None

    async def route_task(self, task_type: str, payload: dict) -> dict:
        logger.info(f"Master Agent routing task: {task_type}")
        
        rag_context = ""
        
        # Pre-fetch RAG context based on task type before calling the LLM Agent
        if task_type == "COMPANY_PREP" and self.company_retriever:
            comp = payload.get('company_name', payload.get('company', 'General'))
            query = f"Interview experience for {comp} {payload.get('role', 'SDE-1')}"
            # Filter metadata to only search within the requested company
            rag_context = self.company_retriever.get_context(query, where_filter={"company": comp})
            
        elif task_type == "INTERVIEW_QUESTION" and self.dsa_retriever:
            topic = payload.get('topic', 'DSA')
            rag_context = self.dsa_retriever.get_context(f"Explain {topic} concepts and time complexity")

        elif task_type == "SKILL_GAP" and self.dsa_retriever:
            # Inject general DSA roadmaps or skill tips
            rag_context = self.dsa_retriever.get_context("Computer Science Fundamentals, DSA topics roadmaps")

        # Pass both the original payload AND the retrieved context to the specific agent
        agent_payload = {
            **payload,
            "rag_context": rag_context
        }

        # Make sure company_name is set for downstream agents that expect it
        if "company" in agent_payload and "company_name" not in agent_payload:
            agent_payload["company_name"] = agent_payload["company"]

        if task_type == "COMPANY_PREP":
            return await self.company_agent.execute(agent_payload)
        elif task_type == "RESUME_ANALYSIS":
            return await self.resume_agent.execute(agent_payload)
        elif task_type == "SKILL_GAP":
            return await self.career_agent.execute(agent_payload)
        elif task_type == "ROADMAP":
            return await self.strategy_agent.execute(agent_payload)
        else:
            logger.warning(f"Unknown task type: {task_type}")
            return {"error": f"Unknown task type: {task_type}"}

master_agent = MasterPlacementAgent()