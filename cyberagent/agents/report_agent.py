"""Report Agent - Generates comprehensive reports."""

from typing import Any, Dict
from datetime import datetime
from .base_agent import BaseAgent


class ReportAgent(BaseAgent):
    """Agent responsible for generating comprehensive security reports."""

    def __init__(self):
        super().__init__(
            name="Report Agent",
            description="Generates comprehensive security reports"
        )

    async def process(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generate comprehensive security report.
        
        Args:
            input_data: Complete analysis from all agents
            
        Returns:
            Comprehensive security report
        """
        if input_data.get("status") != "success":
            return {
                "status": "error",
                "message": "Invalid mitigation data",
                "report": None
            }

        mitigations = input_data.get("mitigations", [])
        overall_priority = input_data.get("overall_priority", "unknown")

        # Generate executive summary
        report = {
            "report_id": self._generate_report_id(),
            "timestamp": datetime.now().isoformat(),
            "executive_summary": self._generate_executive_summary(mitigations, overall_priority),
            "vulnerability_summary": self._generate_vulnerability_summary(mitigations),
            "recommendations": self._generate_recommendations(mitigations),
            "action_items": self._generate_action_items(mitigations),
            "compliance_notes": self._generate_compliance_notes(mitigations),
            "overall_priority": overall_priority
        }

        return {
            "status": "success",
            "report": report,
            "report_format": "json"
        }

    def _generate_report_id(self) -> str:
        """Generate a unique report ID."""
        from datetime import datetime
        import random
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
        random_suffix = f"{random.randint(1000, 9999)}"
        return f"SEC-{timestamp}-{random_suffix}"

    def _generate_executive_summary(self, mitigations: list, overall_priority: str) -> str:
        """Generate executive summary."""
        summary = f"""
Security Analysis Report - Overall Priority: {overall_priority.upper()}

This report presents a comprehensive security analysis identifying vulnerabilities,
assessing their risk levels, and providing actionable mitigation strategies.

Total Issues Found: {len(mitigations)}
        """
        return summary.strip()

    def _generate_vulnerability_summary(self, mitigations: list) -> Dict[str, Any]:
        """Generate vulnerability summary."""
        by_type = {}
        for mit in mitigations:
            vuln_type = mit.get("vulnerability_type", "unknown")
            if vuln_type not in by_type:
                by_type[vuln_type] = 0
            by_type[vuln_type] += 1

        return {
            "total_vulnerabilities": len(mitigations),
            "by_type": by_type,
            "unique_types": len(by_type)
        }

    def _generate_recommendations(self, mitigations: list) -> list:
        """Generate recommendations."""
        recommendations = []
        for i, mit in enumerate(mitigations, 1):
            recommendations.append({
                "id": f"REC-{i}",
                "vulnerability": mit.get("vulnerability_type"),
                "priority": mit.get("priority"),
                "timeline": mit.get("timeline"),
                "strategies": mit.get("strategies", [])
            })
        return recommendations

    def _generate_action_items(self, mitigations: list) -> list:
        """Generate action items."""
        action_items = []
        
        # Group by priority
        by_priority = {"critical": [], "high": [], "medium": [], "low": []}
        for mit in mitigations:
            priority = mit.get("priority", "low")
            if priority in by_priority:
                by_priority[priority].append(mit)

        for priority, items in by_priority.items():
            if items:
                for item in items:
                    action_items.append({
                        "description": f"Address {item.get('vulnerability_type')} vulnerability",
                        "priority": priority,
                        "timeline": item.get("timeline"),
                        "owner": "Security Team",
                        "status": "pending"
                    })

        return action_items

    def _generate_compliance_notes(self, mitigations: list) -> str:
        """Generate compliance notes."""
        if any(m.get("priority") == "critical" for m in mitigations):
            return """
COMPLIANCE ALERT: Critical vulnerabilities detected that may impact compliance
with security regulations (OWASP, CWE, etc.). Immediate remediation required.
            """
        return "No immediate compliance impacts detected."
