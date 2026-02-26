"""Example client for testing the multi-agent system."""

import asyncio
import json
import requests
from typing import Dict, Any


class CyberAgentClient:
    """Client for interacting with the CyberAgent API."""

    def __init__(self, base_url: str = "http://localhost:8000"):
        self.base_url = base_url

    def health_check(self) -> Dict[str, Any]:
        """Check API health."""
        response = requests.get(f"{self.base_url}/health")
        return response.json()

    def list_agents(self) -> Dict[str, Any]:
        """List available agents."""
        response = requests.get(f"{self.base_url}/agents")
        return response.json()

    def analyze(self, source: str, data_type: str, data: Any) -> Dict[str, Any]:
        """Submit data for analysis."""
        payload = {
            "source": source,
            "data_type": data_type,
            "data": data
        }
        response = requests.post(
            f"{self.base_url}/analyze",
            json=payload
        )
        return response.json()

    def test_analysis(self) -> Dict[str, Any]:
        """Run test analysis."""
        response = requests.post(f"{self.base_url}/test")
        return response.json()

    def get_execution_log(self) -> Dict[str, Any]:
        """Get execution log."""
        response = requests.get(f"{self.base_url}/execution-log")
        return response.json()

    def clear_logs(self) -> Dict[str, Any]:
        """Clear execution logs."""
        response = requests.post(f"{self.base_url}/clear-logs")
        return response.json()

    def pretty_print_report(self, result: Dict[str, Any]):
        """Pretty print analysis report."""
        print("\n" + "="*80)
        print("MULTI-AGENT CYBERSECURITY ANALYSIS REPORT")
        print("="*80 + "\n")

        if result.get("status") == "error":
            print(f"ERROR: {result.get('error')}\n")
            return

        report = result.get("report", {})
        summary = result.get("summary", {})
        execution_log = result.get("execution_log", [])

        # Print summary
        print("EXECUTIVE SUMMARY")
        print("-" * 80)
        print(f"Report ID: {report.get('report_id')}")
        print(f"Timestamp: {report.get('timestamp')}")
        print(f"Overall Priority: {report.get('overall_priority').upper()}")
        print()

        # Print vulnerability summary
        print("VULNERABILITY SUMMARY")
        print("-" * 80)
        vuln_summary = report.get("vulnerability_summary", {})
        print(f"Total Vulnerabilities: {vuln_summary.get('total_vulnerabilities')}")
        print(f"Unique Types: {vuln_summary.get('unique_types')}")
        print()

        # Print recommendations
        print("TOP RECOMMENDATIONS")
        print("-" * 80)
        recommendations = report.get("recommendations", [])
        for rec in recommendations[:5]:  # Show top 5
            print(f"[{rec.get('priority').upper()}] {rec.get('vulnerability')}")
            print(f"  Timeline: {rec.get('timeline')}")
            for strategy in rec.get('strategies', [])[:2]:
                print(f"  - {strategy}")
            print()

        # Print action items
        print("ACTION ITEMS")
        print("-" * 80)
        action_items = report.get("action_items", [])
        for action in action_items[:5]:  # Show top 5
            print(f"[{action.get('priority').upper()}] {action.get('description')}")
            print(f"  Timeline: {action.get('timeline')} | Owner: {action.get('owner')}")
            print()

        # Print execution log
        print("EXECUTION LOG")
        print("-" * 80)
        for log_entry in execution_log:
            print(f"{log_entry.get('agent')}: {log_entry.get('message')}")
        print()
        print("="*80 + "\n")


def example_usage():
    """Example usage of the client."""
    print("Initializing CyberAgent Client...")
    client = CyberAgentClient()

    # Check health
    print("Checking API health...")
    health = client.health_check()
    print(f"Status: {health.get('status')}")
    print(f"Components: {len(health.get('components', {}))} ready\n")

    # List agents
    print("Available Agents:")
    agents_info = client.list_agents()
    for agent in agents_info.get("agents", []):
        print(f"  - {agent.get('name')}: {agent.get('role')}")
    print()

    # Run test analysis
    print("Running test analysis...")
    result = client.test_analysis()
    client.pretty_print_report(result)

    # Custom analysis
    print("Running custom analysis...")
    custom_result = client.analyze(
        source="log_analysis",
        data_type="access_logs",
        data=[
            "SELECT password FROM users",
            "UNION SELECT token FROM tokens",
            "<img src=x onerror=\"alert('xss')\">"
        ]
    )
    client.pretty_print_report(custom_result)


if __name__ == "__main__":
    example_usage()
