@echo off
REM Multi-Agent Cybersecurity System - Setup Script

echo.
echo ========================================
echo Multi-Agent Cybersecurity System Setup
echo ========================================
echo.

REM Check if virtual environment exists
if not exist "myenv" (
    echo Creating virtual environment...
    python -m venv myenv
)

REM Activate virtual environment
echo Activating virtual environment...
call myenv\Scripts\activate.bat

REM Install requirements
echo Installing dependencies...
pip install -r requirements.txt

REM Configuration setup
if not exist ".env" (
    echo Creating .env file from template...
    copy .env.example .env
    echo Please update .env with your Google Cloud Project ID
)

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Update .env with your Google Cloud Project ID
echo 2. Run: python main.py
echo 3. Visit: http://localhost:8000/docs
echo.
echo To run tests:
echo pytest test_agents.py -v
echo.
echo To use the client:
echo python client.py
echo.
pause
