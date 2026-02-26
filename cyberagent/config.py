"""Configuration for the multi-agent cybersecurity system."""

import os
from dotenv import load_dotenv

load_dotenv()

# Google Cloud Configuration
PROJECT_ID = os.getenv("GOOGLE_CLOUD_PROJECT", "your-project-id")
LOCATION = os.getenv("LOCATION", "us-central1")

# Agent Configuration
AGENTS_CONFIG = {
    "data_agent": {
        "name": "Data Agent",
        "description": "Handles collected data and prepares it for analysis",
        "role": "data_handler"
    },
    "vulnerability_agent": {
        "name": "Vulnerability Agent", 
        "description": "Identifies security weaknesses and vulnerabilities",
        "role": "vulnerability_identifier"
    },
    "risk_agent": {
        "name": "Risk Agent",
        "description": "Assesses the severity and risk level of vulnerabilities",
        "role": "risk_assessor"
    },
    "mitigation_agent": {
        "name": "Mitigation Agent",
        "description": "Suggests remediation actions and mitigation strategies",
        "role": "mitigation_suggester"
    },
    "report_agent": {
        "name": "Report Agent",
        "description": "Generates comprehensive security reports",
        "role": "report_generator"
    }
}

# Model Configuration
MODEL_CONFIG = {
    "model": "gemini-2.0-flash",
    "temperature": 0.7,
    "max_output_tokens": 2048
}

# System Settings
DEBUG = os.getenv("DEBUG", "False").lower() == "true"
LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")
