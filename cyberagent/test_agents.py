"""Unit tests for the multi-agent system."""

import pytest
import asyncio
from agents import (
    DataAgent,
    VulnerabilityAgent,
    RiskAgent,
    MitigationAgent,
    ReportAgent
)


@pytest.fixture
def data_agent():
    return DataAgent()


@pytest.fixture
def vulnerability_agent():
    return VulnerabilityAgent()


@pytest.fixture
def risk_agent():
    return RiskAgent()


@pytest.fixture
def mitigation_agent():
    return MitigationAgent()


@pytest.fixture
def report_agent():
    return ReportAgent()


# ============ Data Agent Tests ============

@pytest.mark.asyncio
async def test_data_agent_process_valid_data(data_agent):
    """Test data agent with valid data."""
    input_data = {
        "source": "security_scan",
        "timestamp": "2026-02-13T00:00:00Z",
        "type": "vulnerability_report",
        "data": [{"id": 1, "severity": "high"}]
    }
    
    result = await data_agent.process(input_data)
    
    assert result["status"] == "success"
    assert result["processed"] == True
    assert result["record_count"] == 1


@pytest.mark.asyncio
async def test_data_agent_process_invalid_data(data_agent):
    """Test data agent with invalid data."""
    result = await data_agent.process("invalid")
    
    assert result["status"] == "error"
    assert result["data"] is None


# ============ Vulnerability Agent Tests ============

@pytest.mark.asyncio
async def test_vulnerability_agent_detection(vulnerability_agent):
    """Test vulnerability detection."""
    processed_data = {
        "processed": True,
        "raw_data": [
            "SELECT * FROM users",
            "<script>alert('xss')</script>"
        ]
    }
    
    result = await vulnerability_agent.process(processed_data)
    
    assert result["status"] == "success"
    assert result["vulnerabilities_found"] > 0


@pytest.mark.asyncio
async def test_vulnerability_agent_no_vulnerabilities(vulnerability_agent):
    """Test clean data."""
    processed_data = {
        "processed": True,
        "raw_data": ["clean data", "safe content"]
    }
    
    result = await vulnerability_agent.process(processed_data)
    
    assert result["status"] == "success"


# ============ Risk Agent Tests ============

@pytest.mark.asyncio
async def test_risk_agent_assessment(risk_agent):
    """Test risk assessment."""
    vulnerability_data = {
        "status": "success",
        "vulnerabilities": [
            {"type": "sql_injection", "severity": "medium"},
            {"type": "xss", "severity": "high"}
        ]
    }
    
    result = await risk_agent.process(vulnerability_data)
    
    assert result["status"] == "success"
    risk_assessment = result["risk_assessment"]
    assert risk_assessment["total_vulnerabilities"] == 2
    assert "overall_risk_score" in risk_assessment


# ============ Mitigation Agent Tests ============

@pytest.mark.asyncio
async def test_mitigation_agent_suggestions(mitigation_agent):
    """Test mitigation strategy generation."""
    risk_data = {
        "status": "success",
        "risk_assessment": {
            "total_vulnerabilities": 1,
            "vulnerabilities_with_risk": [
                {
                    "type": "sql_injection",
                    "risk_score": 9,
                    "risk_category": "critical"
                }
            ]
        }
    }
    
    result = await mitigation_agent.process(risk_data)
    
    assert result["status"] == "success"
    assert len(result["mitigations"]) > 0
    assert result["overall_priority"] == "critical"


# ============ Report Agent Tests ============

@pytest.mark.asyncio
async def test_report_agent_generation(report_agent):
    """Test report generation."""
    mitigation_data = {
        "status": "success",
        "mitigations": [
            {
                "vulnerability_type": "sql_injection",
                "risk_score": 9,
                "priority": "critical",
                "strategies": ["Use parameterized queries"]
            }
        ],
        "overall_priority": "critical"
    }
    
    result = await report_agent.process(mitigation_data)
    
    assert result["status"] == "success"
    report = result["report"]
    assert "report_id" in report
    assert "timestamp" in report
    assert "executive_summary" in report
    assert "recommendations" in report


# ============ Integration Tests ============

@pytest.mark.asyncio
async def test_full_workflow(data_agent, vulnerability_agent, risk_agent, 
                            mitigation_agent, report_agent):
    """Test complete workflow."""
    # Step 1: Data Agent
    raw_data = {
        "source": "test",
        "timestamp": "2026-02-13T00:00:00Z",
        "type": "test",
        "data": ["SELECT * FROM users"]
    }
    
    data_result = await data_agent.process(raw_data)
    assert data_result["status"] == "success"
    
    # Step 2: Vulnerability Agent
    vuln_result = await vulnerability_agent.process(data_result)
    assert vuln_result["status"] == "success"
    
    # Step 3: Risk Agent
    risk_result = await risk_agent.process(vuln_result)
    assert risk_result["status"] == "success"
    
    # Step 4: Mitigation Agent
    mitigation_result = await mitigation_agent.process(risk_result)
    assert mitigation_result["status"] == "success"
    
    # Step 5: Report Agent
    report_result = await report_agent.process(mitigation_result)
    assert report_result["status"] == "success"
    assert "report" in report_result


def test_agent_history():
    """Test conversation history."""
    agent = DataAgent()
    
    agent.add_to_history("user", "test message")
    history = agent.get_history()
    
    assert len(history) == 1
    assert history[0]["role"] == "user"
    assert history[0]["content"] == "test message"
    
    agent.clear_history()
    assert len(agent.get_history()) == 0


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
