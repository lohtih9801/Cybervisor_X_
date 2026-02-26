#!/bin/bash
# Multi-Agent Cybersecurity System - Setup Script

echo ""
echo "========================================"
echo "Multi-Agent Cybersecurity System Setup"
echo "========================================"
echo ""

# Check if virtual environment exists
if [ ! -d "myenv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv myenv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source myenv/bin/activate

# Install requirements
echo "Installing dependencies..."
pip install -r requirements.txt

# Configuration setup
if [ ! -f ".env" ]; then
    echo "Creating .env file from template..."
    cp .env.example .env
    echo "Please update .env with your Google Cloud Project ID"
fi

echo ""
echo "========================================"
echo "Setup Complete!"
echo "========================================"
echo ""
echo "Next steps:"
echo "1. Update .env with your Google Cloud Project ID"
echo "2. Run: python main.py"
echo "3. Visit: http://localhost:8000/docs"
echo ""
echo "To run tests:"
echo "pytest test_agents.py -v"
echo ""
echo "To use the client:"
echo "python client.py"
echo ""
