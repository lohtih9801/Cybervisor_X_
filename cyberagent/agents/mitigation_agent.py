"""
Mitigation Agent - Suggests remediation actions.
Enhanced with fallback detection and proper priority handling.
"""

from typing import Any, Dict, List
from .base_agent import BaseAgent


class MitigationAgent(BaseAgent):
    """Agent responsible for suggesting mitigation strategies."""

    def __init__(self):
        super().__init__(
            name="Mitigation Agent",
            description="Suggests remediation actions and mitigation strategies"
        )

        # Comprehensive mitigation strategy database
        self.mitigation_strategies = {
            "sql_injection": [
                "Use parameterized queries and prepared statements",
                "Implement strict input validation",
                "Apply least privilege to database accounts",
                "Use ORM frameworks"
            ],
            "xss": [
                "Implement Content Security Policy (CSP)",
                "Encode output properly",
                "Sanitize user inputs",
                "Enable X-XSS-Protection headers"
            ],
            "weak_password": [
                "Enforce strong password policies (minimum 12 characters)",
                "Enable multi-factor authentication (MFA)",
                "Implement password complexity requirements",
                "Rotate passwords regularly"
            ],
            "exposed_key": [
                "Rotate exposed credentials immediately",
                "Move secrets to secure vault (AWS Secrets Manager, etc.)",
                "Remove keys from public repositories",
                "Enable secret scanning in CI/CD pipelines"
            ],
            "brute_force": [
                "Enable account lockout policies",
                "Disable public RDP access",
                "Restrict remote access via VPN",
                "Enable MFA for all remote logins"
            ],
            "ransomware": [
                "Isolate infected systems immediately",
                "Disconnect affected machines from network",
                "Restore from verified backups",
                "Conduct forensic investigation"
            ],
            "malware": [
                "Run full antivirus and EDR scan",
                "Isolate infected machine",
                "Remove malicious executables",
                "Update system security patches"
            ],
            "phishing": [
                "Reset compromised credentials",
                "Enable email filtering rules",
                "Conduct phishing awareness training",
                "Enable MFA for affected users"
            ],
            "cve": [
                "Apply vendor security patch immediately",
                "Upgrade to secure software version",
                "Disable vulnerable service temporarily",
                "Monitor exploit attempts"
            ],
            "remote_code_execution": [
                "Patch affected software immediately",
                "Restrict external access",
                "Monitor suspicious processes",
                "Perform vulnerability scanning"
            ],
            "ddos": [
                "Enable rate limiting",
                "Use Web Application Firewall (WAF)",
                "Implement traffic filtering",
                "Use CDN with DDoS protection"
            ],
            "data_exfiltration": [
                "Audit outbound network traffic",
                "Enable Data Loss Prevention (DLP)",
                "Restrict external file transfers",
                "Monitor user activity logs"
            ]
        }

    async def process(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Suggest mitigation strategies for identified risks.
        """

        if input_data.get("status") != "success":
            return {
                "status": "error",
                "message": "Invalid risk assessment data",
                "mitigations": []
            }

        risk_assessment = input_data.get("risk_assessment", {})
        vulnerabilities_with_risk = risk_assessment.get("vulnerabilities_with_risk", [])

        # 🔥 Fallback keyword-based detection
        if not vulnerabilities_with_risk:
            raw_input = input_data.get("raw_input", "").lower()

            if "rdp" in raw_input or "failed login" in raw_input:
                vulnerabilities_with_risk.append({"type": "brute_force", "risk_score": 8})

            elif "ransom" in raw_input or "encrypted" in raw_input:
                vulnerabilities_with_risk.append({"type": "ransomware", "risk_score": 9})

            elif "unknown exe" in raw_input or "system32" in raw_input:
                vulnerabilities_with_risk.append({"type": "malware", "risk_score": 8})

            elif "phishing" in raw_input or "email link" in raw_input:
                vulnerabilities_with_risk.append({"type": "phishing", "risk_score": 6})

            elif "password" in raw_input and (
                "less than" in raw_input
                or "weak" in raw_input
                or "short" in raw_input
                or "6 characters" in raw_input
            ):
                vulnerabilities_with_risk.append({"type": "weak_password", "risk_score": 6})

            elif "cve" in raw_input:
                vulnerabilities_with_risk.append({"type": "cve", "risk_score": 9})

            elif "exposed key" in raw_input or "aws key" in raw_input:
                vulnerabilities_with_risk.append({"type": "exposed_key", "risk_score": 8})

            elif "ddos" in raw_input or "100000 requests" in raw_input:
                vulnerabilities_with_risk.append({"type": "ddos", "risk_score": 8})

            elif "data transferred" in raw_input or "exfiltrate" in raw_input:
                vulnerabilities_with_risk.append({"type": "data_exfiltration", "risk_score": 8})

        mitigations: List[Dict[str, Any]] = []

        for vuln in vulnerabilities_with_risk:
            vuln_type = vuln.get("type", "unknown")
            risk_score = vuln.get("risk_score", 0)

            strategies = self.mitigation_strategies.get(
                vuln_type,
                [
                    "Conduct full security audit",
                    "Apply security best practices",
                    "Perform penetration testing"
                ]
            )

            # Severity mapping
            if risk_score >= 9:
                priority = "critical"
                timeline = "immediate"
            elif risk_score >= 7:
                priority = "high"
                timeline = "urgent"
            elif risk_score >= 4:
                priority = "medium"
                timeline = "scheduled"
            else:
                priority = "low"
                timeline = "review"

            mitigations.append({
                "vulnerability_type": vuln_type,
                "risk_score": risk_score,
                "priority": priority,
                "timeline": timeline,
                "strategies": strategies
            })

        return {
            "status": "success",
            "mitigations_count": len(mitigations),
            "mitigations": mitigations,
            "overall_priority": self._calculate_overall_priority(mitigations)
        }

    def _calculate_overall_priority(self, mitigations: List[Dict[str, Any]]) -> str:
        priorities = [m.get("priority") for m in mitigations]

        if "critical" in priorities:
            return "critical"
        elif "high" in priorities:
            return "high"
        elif "medium" in priorities:
            return "medium"
        elif "low" in priorities:
            return "low"
        return "low"