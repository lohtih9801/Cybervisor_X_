# Multi-Agent Cybersecurity System

A sophisticated multi-agent system for cybersecurity analysis powered by the Google Agent Development Kit (ADK). This system uses specialized agents to identify, assess, and mitigate security vulnerabilities.

## System Architecture

### Agents

1. **Data Agent** - Handles and validates collected security data
2. **Vulnerability Agent** - Identifies security weaknesses and vulnerabilities
3. **Risk Agent** - Assesses the severity and risk level of vulnerabilities
4. **Mitigation Agent** - Suggests remediation actions and mitigation strategies
5. **Report Agent** - Generates comprehensive security reports

### Workflow

The agents work in sequence:

```
Raw Data → Data Agent → Vulnerability Agent → Risk Agent → Mitigation Agent → Report Agent → Report
```

## Setup

### Prerequisites

- Python 3.8+
- Virtual environment (myenv)

### Installation

1. Activate the virtual environment:
```bash
# On Windows
myenv\Scripts\activate
# Or using PowerShell
. myenv\Scripts\Activate.ps1
```

2. Install dependencies:
```bash
pip install fastapi uvicorn pydantic python-dotenv requests
```

3. Configure environment:
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your Google Cloud Project details
# GOOGLE_CLOUD_PROJECT=your-project-id
```

## Running the System

### Start the Main Server

```bash
# Activate virtual environment first
python main.py
```

The API will be available at `http://localhost:8000`

### API Documentation

Interactive API documentation will be available at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Using the System

### Test Endpoint

The easiest way to test is using the test endpoint:

```bash
curl -X POST http://localhost:8000/test
```

### Analyze Security Data

Submit your own data for analysis:

```bash
curl -X POST http://localhost:8000/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "source": "security_scan",
    "data_type": "vulnerability_report",
    "data": [
      "SELECT * FROM users",
      "password=12345",
      "<script>alert(1)</script>"
    ]
  }'
```

### Using the Python Client

```python
from client import CyberAgentClient

client = CyberAgentClient("http://localhost:8000")

# Check health
health = client.health_check()
print(health)

# List agents
agents = client.list_agents()
print(agents)

# Analyze data
result = client.analyze(
    source="log_analysis",
    data_type="access_logs",
    data=["SELECT password FROM users WHERE id=1"]
)

# Pretty print the report
client.pretty_print_report(result)
```

## API Endpoints

### Health Check
- `GET /health` - Detailed health check
- `GET /` - Simple health check

### Analysis
- `POST /analyze` - Analyze security data
- `POST /test` - Run test analysis

### System
- `GET /agents` - List available agents
- `GET /execution-log` - Get latest execution log
- `POST /clear-logs` - Clear execution logs

## Project Structure

```
cyberagent/
├── main.py                      # FastAPI application
├── config.py                    # Configuration settings
├── orchestrator.py              # Agent orchestrator
├── client.py                    # Python client for API
├── .env.example                 # Environment configuration template
└── agents/
    ├── __init__.py
    ├── base_agent.py            # Abstract base agent class
    ├── data_agent.py            # Data processing agent
    ├── vulnerability_agent.py   # Vulnerability identification
    ├── risk_agent.py            # Risk assessment
    ├── mitigation_agent.py      # Mitigation strategies
    └── report_agent.py          # Report generation
```

## Example Output

The system generates comprehensive reports including:

- Executive Summary
- Vulnerability Analysis
- Risk Assessment
- Recommendations (by priority: critical, high, medium, low)
- Action Items with timelines
- Compliance Notes
- Execution Log

## Features

✅ Multi-agent architecture with specialized roles  
✅ Sequential workflow for comprehensive analysis  
✅ Async/await for efficient processing  
✅ RESTful API with FastAPI  
✅ Interactive API documentation  
✅ Conversation history for each agent  
✅ Comprehensive error handling  
✅ Execution logging and monitoring  
✅ Python client library included  

## Extending the System

### Adding a New Agent

1. Create a new file in `agents/` directory
2. Inherit from `BaseAgent`
3. Implement the `process()` method
4. Add to `agents/__init__.py`
5. Integrate into `orchestrator.py`

Example:

```python
from agents.base_agent import BaseAgent

class MyAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="My Agent",
            description="My custom agent"
        )
    
    async def process(self, input_data):
        # Your logic here
        return {"status": "success", "result": ...}
```

## Error Handling

All agents implement proper error handling:
- Input validation
- Status checking
- Graceful failure with error messages
- Execution logging for debugging

## Performance Considerations

- Agents process data sequentially but are async-compatible
- Can be scaled to process parallel requests
- Minimal memory footprint per agent
- Optimized for security analysis workflows

## Best Practices

1. Always validate input data using the Data Agent
2. Review recommendations by priority level
3. Follow up on critical issues immediately
4. Use execution logs for troubleshooting
5. Regularly update vulnerability patterns

## License

This project demonstrates the Google Agent Development Kit capabilities for multi-agent systems.

## Support

For issues or questions:
1. Check execution logs: `GET /execution-log`
2. Review agent status: `GET /agents`
3. Test system: `POST /test`
