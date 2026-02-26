"""Main FastAPI application for the multi-agent cybersecurity system."""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Any, Dict, Optional
import uvicorn
from orchestrator import AgentOrchestrator
from config import DEBUG, LOG_LEVEL

# Initialize FastAPI app
app = FastAPI(
    title="Multi-Agent Cybersecurity System",
    description="A cybersecurity analysis system powered by multiple specialized agents",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize orchestrator
orchestrator = AgentOrchestrator()


# ============ Request/Response Models ============

class SecurityData(BaseModel):
    """Security data input model."""
    source: str
    data_type: str
    data: Any
    timestamp: Optional[str] = None


class AnalysisResponse(BaseModel):
    """Analysis response model."""
    status: str
    report: Optional[Dict[str, Any]] = None
    summary: Optional[Dict[str, Any]] = None
    execution_log: Optional[list] = None
    error: Optional[str] = None


# ============ API Endpoints ============

@app.get("/", tags=["Health"])
async def root():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "service": "Multi-Agent Cybersecurity System",
        "version": "1.0.0"
    }


@app.get("/health", tags=["Health"])
async def health_check():
    """Detailed health check."""
    return {
        "status": "healthy",
        "components": {
            "data_agent": "ready",
            "vulnerability_agent": "ready",
            "risk_agent": "ready",
            "mitigation_agent": "ready",
            "report_agent": "ready"
        }
    }


@app.post("/analyze", tags=["Analysis"], response_model=AnalysisResponse)
async def analyze_security(security_data: SecurityData):
    """
    Analyze security data using the multi-agent system.
    
    This endpoint processes security data through a pipeline of specialized agents:
    1. Data Agent - Validates and processes the input data
    2. Vulnerability Agent - Identifies security vulnerabilities
    3. Risk Agent - Assesses the severity of vulnerabilities
    4. Mitigation Agent - Suggests remediation strategies
    5. Report Agent - Generates a comprehensive analysis report
    """
    try:
        # Convert request to dictionary
        input_data = security_data.dict()
        
        # Execute the multi-agent workflow
        result = await orchestrator.execute_workflow(input_data)
        
        if result.get("status") != "success":
            raise HTTPException(
                status_code=400,
                detail=result.get("error", "Analysis failed")
            )
        
        return AnalysisResponse(
            status=result.get("status"),
            report=result.get("report"),
            summary=result.get("summary"),
            execution_log=result.get("execution_log")
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}"
        )


@app.get("/agents", tags=["System"])
async def list_agents():
    """Get list of available agents."""
    return {
        "agents": [
            {
                "name": "Data Agent",
                "role": "Data processing and validation",
                "status": "active"
            },
            {
                "name": "Vulnerability Agent",
                "role": "Vulnerability identification",
                "status": "active"
            },
            {
                "name": "Risk Agent",
                "role": "Risk assessment and scoring",
                "status": "active"
            },
            {
                "name": "Mitigation Agent",
                "role": "Mitigation strategy generation",
                "status": "active"
            },
            {
                "name": "Report Agent",
                "role": "Report generation",
                "status": "active"
            }
        ],
        "total_agents": 5
    }


@app.get("/execution-log", tags=["System"])
async def get_execution_log():
    """Get the latest execution log."""
    return {
        "log": orchestrator.get_execution_log()
    }


@app.post("/clear-logs", tags=["System"])
async def clear_logs():
    """Clear execution logs."""
    orchestrator.clear_logs()
    return {"status": "success", "message": "Logs cleared"}


@app.post("/test", tags=["Testing"])
async def test_analysis():
    """Test the multi-agent system with sample data."""
    sample_data = SecurityData(
        source="security_scan",
        data_type="vulnerability_report",
        timestamp="2026-02-13T00:00:00Z",
        data=[
            "SELECT * FROM users WHERE id=1",
            "password=12345",
            "<script>alert('xss')</script>",
            "AKIA1234567890123456"
        ]
    )
    
    return await analyze_security(sample_data)


# ============ Error Handlers ============

@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return {
        "status": "error",
        "detail": exc.detail
    }


# ============ Application Start ============

if __name__ == "__main__":
    print("Starting Multi-Agent Cybersecurity System...")
    print("API Documentation: http://localhost:8000/docs")
    
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        log_level=LOG_LEVEL.lower(),
        reload=DEBUG
    )
