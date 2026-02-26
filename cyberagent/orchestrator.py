"""Orchestrator for managing multi-agent workflow."""

from typing import Any, Dict
from agents import (
    DataAgent,
    VulnerabilityAgent,
    RiskAgent,
    MitigationAgent,
    ReportAgent
)


class AgentOrchestrator:
    """Orchestrates the workflow of multiple agents."""

    def __init__(self):
        self.data_agent = DataAgent()
        self.vulnerability_agent = VulnerabilityAgent()
        self.risk_agent = RiskAgent()
        self.mitigation_agent = MitigationAgent()
        self.report_agent = ReportAgent()
        self.execution_log = []

    async def execute_workflow(self, raw_data: Dict[str, Any]) -> Dict[str, Any]:
        self.execution_log = []

        try:
            # Step 1: Data Agent
            self._log("DATA_AGENT", "Processing raw data")
            processed_data = await self.data_agent.execute(raw_data)
            if processed_data.get("status") != "success":
                return self._create_error_response("Data processing failed")

            # Step 2: Vulnerability Agent
            self._log("VULNERABILITY_AGENT", "Analyzing for vulnerabilities")
            vulnerability_data = await self.vulnerability_agent.execute(processed_data)
            if vulnerability_data.get("status") != "success":
                return self._create_error_response("Vulnerability analysis failed")

            # Step 3: Risk Agent
            self._log("RISK_AGENT", "Assessing risk levels")
            risk_data = await self.risk_agent.execute(vulnerability_data)
            if risk_data.get("status") != "success":
                return self._create_error_response("Risk assessment failed")

            # 🔥 Pass raw input forward (IMPORTANT)
            risk_data["raw_input"] = raw_data.get("text", "")

            # Step 4: Mitigation Agent
            self._log("MITIGATION_AGENT", "Generating mitigation strategies")
            mitigation_data = await self.mitigation_agent.execute(risk_data)
            if mitigation_data.get("status") != "success":
                return self._create_error_response("Mitigation generation failed")

            # Step 5: Report Agent
            self._log("REPORT_AGENT", "Generating final report")
            report_data = await self.report_agent.execute(mitigation_data)
            if report_data.get("status") != "success":
                return self._create_error_response("Report generation failed")

            return {
                "status": "success",
                "workflow_completed": True,
                "report": report_data.get("report"),
                "execution_log": self.execution_log,
                "summary": {
                    "total_vulnerabilities": mitigation_data.get("mitigations_count", 0),
                    "overall_priority": mitigation_data.get("overall_priority", "low")
                }
            }

        except Exception as e:
            self._log("ERROR", str(e))
            return self._create_error_response(f"Workflow error: {str(e)}")

    def _log(self, agent: str, message: str):
        """Log agent execution."""
        self.execution_log.append({
            "agent": agent,
            "message": message
        })

    def _create_error_response(self, error_message: str) -> Dict[str, Any]:
        """Create an error response."""
        return {
            "status": "error",
            "workflow_completed": False,
            "error": error_message,
            "execution_log": self.execution_log
        }

    def get_execution_log(self):
        return self.execution_log

    def clear_logs(self):
        self.execution_log = []