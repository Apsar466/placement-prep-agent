import logging
from fastapi import APIRouter, HTTPException
from models.company import CompanyPrepRequest, CompanyPrepResponse
from services.company_service import CompanyPrepService

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/company/prepare", response_model=CompanyPrepResponse)
async def prepare_for_company(request: CompanyPrepRequest):
    """
    Generates a company-specific preparation guide using the Company DNA Agent.
    Retrieves past interview experiences via RAG before prompting the LLM.
    """
    try:
        logger.info(f"Generating company prep for {request.company_name} - {request.role}")
        service = CompanyPrepService()
        result = await service.generate_prep_guide(request)
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Failed to generate company prep: {e}")
        raise HTTPException(status_code=500, detail="Company preparation generation failed.")