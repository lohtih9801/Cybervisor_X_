"""Risk Agent - Assesses severity of vulnerabilities."""

from typing import Any, Dict
from .base_agent import BaseAgent


class RiskAgent(BaseAgent):
    """Agent responsible for assessing risk and severity levels."""

    def __init__(self):
        super().__init__(
            name="Risk Agent",
            description="Assesses the severity and risk level of vulnerabilities"
        )

        # 🔥 Added CVE and RCE support
        self.severity_scores = {
            "sql_injection": 9,
            "xss": 8,
            "weak_password": 7,
            "exposed_key": 9,
            "cve": 9,
            "remote_code_execution": 10,
        }

    async def process(self, input_data: Dict[str, Any]) -> Dict[str, Any]:

        if input_data.get("status") != "success":
            return {
                "status": "error",
                "message": "Invalid vulnerability data",
                "risk_assessment": None
            }

        vulnerabilities = input_data.get("vulnerabilities", [])

        risk_assessment = {
            "total_vulnerabilities": len(vulnerabilities),
            "critical": 0,
            "high": 0,
            "medium": 0,
            "low": 0,
            "overall_risk_score": 0,
            "overall_priority": "UNKNOWN",  # 🔥 Added
            "vulnerabilities_with_risk": []
        }

        total_score = 0

        for vuln in vulnerabilities:
            vuln_type = vuln.get("type", "")
            score = self.severity_scores.get(vuln_type, 5)

            # Categorize by score
            if score >= 9:
                risk_category = "critical"
                risk_assessment["critical"] += 1
            elif score >= 7:
                risk_category = "high"
                risk_assessment["high"] += 1
            elif score >= 5:
                risk_category = "medium"
                risk_assessment["medium"] += 1
            else:
                risk_category = "low"
                risk_assessment["low"] += 1

            total_score += score

            risk_assessment["vulnerabilities_with_risk"].append({
                **vuln,
                "risk_score": score,
                "risk_category": risk_category
            })

        # Calculate overall risk score
        if vulnerabilities:
            risk_assessment["overall_risk_score"] = total_score / len(vulnerabilities)

            # 🔥 Determine overall priority
            if risk_assessment["critical"] > 0:
                risk_assessment["overall_priority"] = "CRITICAL"
            elif risk_assessment["high"] > 0:
                risk_assessment["overall_priority"] = "HIGH"
            elif risk_assessment["medium"] > 0:
                risk_assessment["overall_priority"] = "MEDIUM"
            else:
                risk_assessment["overall_priority"] = "LOW"

        return {
            "status": "success",
            "risk_assessment": risk_assessment
        }
