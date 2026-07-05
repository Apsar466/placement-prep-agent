from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # MongoDB
    mongo_uri: str = "mongodb://localhost:27017/placement_db"
    
    # ChromaDB
    chroma_persist_directory: str = "./chroma_db"
    
    # Gemini
    gemini_api_key: Optional[str] = None
    
    # Server
    backend_port: int = 8000

    class Config:
        env_file = ".env"
        case_sensitive = False

settings = Settings()