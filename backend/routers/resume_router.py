import logging
from fastapi import APIRouter, UploadFile, File, HTTPException
from services.resume_service import ResumeService

router = APIRouter()
logger = logging.getLogger(__name__)

# Hardcoded user_id for Phase 3, will be replaced by JWT auth later
DEFAULT_USER_ID = "user_001" 

@router.post("/resume/analyze", response_model_exclude={"raw_text"})
async def analyze_resume(file: UploadFile = File(...)):
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed.")
    
    try:
        file_bytes = await file.read()
        result = await ResumeService.analyze_resume(file_bytes, DEFAULT_USER_ID)
        return result
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        logger.error(f"Resume endpoint error: {e}")
        raise HTTPException(status_code=500, detail="AI Analysis failed. Please try again.")