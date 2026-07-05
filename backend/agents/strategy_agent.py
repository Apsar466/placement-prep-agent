import json
import logging
import google.generativeai as genai
from config import settings
from prompts.roadmap_prompts import ROADMAP_SYSTEM_PROMPT, ROADMAP_USER_PROMPT

logger = logging.getLogger(__name__)

class StrategyAgent:
    def __init__(self):
        genai.configure(api_key=settings.gemini_api_key)
        self.model = genai.GenerativeModel(
            model_name='gemini-2.5-flash-preview-05-20',
            system_instruction=ROADMAP_SYSTEM_PROMPT,
            generation_config={"response_mime_type": "application/json"}
        )

    async def execute(self, payload: dict) -> dict:
        target_companies = ", ".join(payload.get("target_companies", []))
        hours_per_day = payload.get("hours_per_day", 4.0)
        focus_areas = ", ".join(payload.get("focus_areas", []))
        rag_context = payload.get("rag_context", "")

        logger.info(f"Executing Strategy Agent for companies: {target_companies}")

        prompt = ROADMAP_USER_PROMPT.format(
            target_companies=target_companies,
            hours_per_day=hours_per_day,
            focus_areas=focus_areas,
            context=f"CONTEXT:\n{rag_context}"
        )

        try:
            response = await self.model.generate_content_async(prompt)
            return json.loads(response.text)
        except Exception as e:
            logger.error(f"Strategy Agent execution failed: {e}")
            # Fallback mock roadmap in case of failure or missing API key
            return {
                "plan_title": f"30-Day {target_companies} Placement Roadmap",
                "overall_strategy": f"A targeted 30-day preparation schedule studying {hours_per_day} hours daily. Focuses on key DSA patterns, system design concepts, and mock interview practice.",
                "weeks": [
                    {
                        "week_number": 1,
                        "focus": "Data Structures Foundations & Array Manipulation",
                        "daily_tasks": [
                            "Day 1: Solve two sum & group anagrams on Leetcode.",
                            "Day 2: Understand sliding window maximum sum subarray.",
                            "Day 3: Study space & time complexity of basic operations.",
                            "Day 4: Master two pointers technique.",
                            "Day 5: Revise Linked List reversals and fast/slow pointer method.",
                            "Day 6: Complete basic binary search implementation.",
                            "Day 7: Weekly review and solve 3 medium problems on Arrays."
                        ]
                    },
                    {
                        "week_number": 2,
                        "focus": "Algorithms & Advanced Trees/Graphs",
                        "daily_tasks": [
                            "Day 8: Implement BFS traversal on standard trees.",
                            "Day 9: Implement DFS traversal and recursive techniques.",
                            "Day 10: Solve tree path sum and LCA problems.",
                            "Day 11: Study basic Graph representations (Adjacency list).",
                            "Day 12: Implement topological sort on DAG.",
                            "Day 13: Understand Dijkstra's shortest path algorithm.",
                            "Day 14: Solve two graph cycle detection challenges."
                        ]
                    },
                    {
                        "week_number": 3,
                        "focus": "Core Computer Science & Dynamic Programming",
                        "daily_tasks": [
                            "Day 15: Revise OS processes, threads, and memory layout.",
                            "Day 16: Learn DBMS normalization and write complex JOIN queries.",
                            "Day 17: Study TCP/IP stack vs OSI model.",
                            "Day 18: Dynamic Programming - Solve Fibonacci & Climbing stairs.",
                            "Day 19: Solve 0/1 Knapsack recursive and iterative approaches.",
                            "Day 20: System Design - Core concepts of vertical vs horizontal scaling.",
                            "Day 21: Design a basic URL shortener (System Design fundamentals)."
                        ]
                    },
                    {
                        "week_number": 4,
                        "focus": "Company DNA & Advanced Mocks",
                        "daily_tasks": [
                            "Day 22: Study Amazon/Google hiring pattern.",
                            "Day 23: Complete a 90-minute mock OA on LeetCode.",
                            "Day 24: Practice behavioral STAR questions focusing on leadership principles.",
                            "Day 25: Implement an LRU cache from scratch.",
                            "Day 26: Practice mock interviews focusing on Graph algorithms.",
                            "Day 27: System Design mock - design a Web Crawler.",
                            "Day 28: General review of weak spots and revision of formula cheatsheets."
                        ]
                    }
                ]
            }
        
