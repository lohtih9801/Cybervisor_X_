"""Quick start guide for the Multi-Agent System."""

import asyncio
from orchestrator import AgentOrchestrator


async def main():
    print("\n" + "="*70)
    print("MULTI-AGENT CYBERSECURITY SYSTEM - QUICK START")
    print("="*70 + "\n")

    # Initialize orchestrator
    print("Initializing orchestrator...")
    orchestrator = AgentOrchestrator()

    # Sample security data
    sample_data = {
        "source": "log_analysis",
        "data_type": "access_logs",
        "timestamp": "2026-02-13T15:30:00Z",
        "data": [
            "SELECT password FROM users WHERE admin=true;",
            "INSERT INTO logs VALUES ('test', 'SELECT * FROM tokens');",
            "<img src=x onerror=\"alert('xss')\">",
            "API_KEY=sk-1234567890abcdefghijklmnopqrst",
            "password=admin123",
            "DB Connection: Server=prod-db; User=sa; Password=MyPassword123;"
        ]
    }

    print("Sample data prepared:")
    print(f"  Source: {sample_data['source']}")
    print(f"  Type: {sample_data['data_type']}")
    print(f"  Records: {len(sample_data['data'])}")
    print()

    # Execute workflow
    print("Executing multi-agent workflow...")
    print("-" * 70)
    
    result = await orchestrator.execute_workflow(sample_data)

    if result.get("status") != "success":
        print(f"ERROR: {result.get('error')}")
        return

    # Print execution log
    print("\nEXECUTION LOG:")
    for log in result.get("execution_log", []):
        print(f"  [{log['agent']}] {log['message']}")

    # Print summary
    print("\n" + "="*70)
    print("ANALYSIS SUMMARY")
    print("="*70)

    summary = result.get("summary", {})
    print(f"\nTotal Vulnerabilities Found: {summary.get('total_vulnerabilities')}")
    print(f"Overall Priority: {summary.get('overall_priority', 'unknown').upper()}")

    # Print report
    report = result.get("report", {})
    
    print(f"\nReport ID: {report.get('report_id')}")
    print(f"Report Generated: {report.get('timestamp')}")

    # Vulnerability summary
    vuln_summary = report.get("vulnerability_summary", {})
    print(f"\nVulnerability Analysis:")
    print(f"  Total: {vuln_summary.get('total_vulnerabilities')}")
    print(f"  Types: {vuln_summary.get('unique_types')}")

    # Top recommendations
    print(f"\nTop Recommendations:")
    recommendations = report.get("recommendations", [])
    for rec in recommendations[:3]:
        print(f"  [{rec.get('priority').upper()}] ${rec.get('vulnerability')}")
        print(f"     Timeline: {rec.get('timeline')}")

    # Action items
    print(f"\nAction Items (Next 3 steps):")
    actions = report.get("action_items", [])
    for i, action in enumerate(actions[:3], 1):
        print(f"  {i}. [{action.get('priority').upper()}] {action.get('description')}")
        print(f"     Timeline: {action.get('timeline')}")

    # Compliance notes
    compliance = report.get("compliance_notes", "")
    if "ALERT" in compliance:
        print(f"\n⚠️  COMPLIANCE ALERT:")
        print(compliance.strip())

    print("\n" + "="*70)
    print("ANALYSIS COMPLETE")
    print("="*70 + "\n")

    print("For full API documentation, start the server:")
    print("  python main.py")
    print("  Visit: http://localhost:8000/docs\n")


if __name__ == "__main__":
    asyncio.run(main())
