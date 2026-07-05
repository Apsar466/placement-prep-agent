import uuid
import logging
from typing import Dict, Any
from database import mongo_client, chroma_client, embedding_function
from agents.adaptive_interview_agent import AdaptiveInterviewAgent
from rag.retriever import RAGRetriever

logger = logging.getLogger(__name__)

# In-memory state management to avoid requiring an extra state file
_active_sessions: Dict[str, Dict[str, Any]] = {}

class InterviewService:
    def __init__(self):
        self.agent = AdaptiveInterviewAgent()
        try:
            self.dsa_retriever = RAGRetriever(
                chroma_client.get_collection("dsa_knowledge"), 
                embedding_function, 
                n_results=2
            )
        except Exception:
            self.dsa_retriever = None

    async def start_interview(self, company: str, role: str, interview_type: str) -> dict:
        session_id = str(uuid.uuid4())
        
        _active_sessions[session_id] = {
            "session_id": session_id,
            "company": company,
            "role": role,
            "history": [],
            "current_difficulty": "MEDIUM",
            "total_score": 0,
            "question_count": 0
        }
        
        context = "Standard interview context."
        if self.dsa_retriever:
            context = self.dsa_retriever.get_context(f"{company} {role} interview questions")
        
        q_data = await self.agent.generate_question(company, role, _active_sessions[session_id]["current_difficulty"], context)
        _active_sessions[session_id]["history"].append({"role": "ai", "content": q_data["question"]})
        
        return {
            "is_finished": False,
            "session_id": session_id,
            "question": q_data["question"],
            "difficulty": _active_sessions[session_id]["current_difficulty"],
            "hints": q_data.get("hints", [])
        }

    async def evaluate_and_continue(self, session_id: str, user_answer: str, finish: bool) -> dict:
        if session_id not in _active_sessions:
            raise ValueError("Invalid or expired interview session.")
            
        state = _active_sessions[session_id]
        state["history"].append({"role": "user", "content": user_answer})
        state["question_count"] += 1

        if finish or state["question_count"] >= 5:
            transcript_str = "\n".join([f"{h['role'].upper()}: {h['content']}" for h in state["history"]])
            report = await self.agent.generate_final_report(state["company"], state["role"], transcript_str, state["question_count"])
            
            db = mongo_client.placement_db
            await db.interview_history.insert_one({
                "session_id": session_id,
                "company": state["company"],
                "role": state["role"],
                "final_report": report
            })
            
            del _active_sessions[session_id]
            return {
                "is_finished": True,
                "session_id": session_id,
                "final_report": report
            }

        last_question = state["history"][-2]["content"]
        context = "Standard evaluation."
        if self.dsa_retriever:
            context = self.dsa_retriever.get_context(f"Ideal answer for: {last_question}")
            
        eval_data = await self.agent.evaluate_answer(state["company"], last_question, user_answer, state["current_difficulty"], context)
        
        state["total_score"] += eval_data["score_out_of_10"]
        state["current_difficulty"] = eval_data["next_difficulty"]

        next_context = "Standard question."
        if self.dsa_retriever:
            next_context = self.dsa_retriever.get_context(f"{state['company']} {state['current_difficulty']} question")
            
        q_data = await self.agent.generate_question(state["company"], state["role"], state["current_difficulty"], next_context)
        state["history"].append({"role": "ai", "content": q_data["question"]})

        return {
            "is_finished": False,
            "session_id": session_id,
            "question": q_data["question"],
            "difficulty": state["current_difficulty"],
            "hints": q_data.get("hints", [])
        }