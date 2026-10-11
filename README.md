# CYBERVISOR-X: AI Threat Intelligence & Multi-Agent Defense Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/Frontend-React%2019-blue.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Bundler-Vite-purple.svg)](https://vitejs.dev/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI%20%7C%20ADK-green.svg)](https://fastapi.tiangolo.com/)
[![Node.js](https://img.shields.io/badge/Auth%20Service-Express.js-lightgrey.svg)](https://nodejs.org/)

**CYBERVISOR-X** is an enterprise-grade AI-powered cybersecurity intelligence and threat analysis platform. It pairs an interactive, high-performance web dashboard with an autonomous multi-agent defense architecture built to detect, correlate, evaluate, and mitigate security threats in real-time using MITRE ATT&CK framework intelligence.

---

## 🔑 Default Login Credentials

The application is pre-configured with a default administrator account:

| Field | Value |
| :--- | :--- |
| **Username** | `admin` |
| **Email** | `admin@cybervisorx.com` |
| **Password** | `Admin@1234` |
| **Role** | `admin` (Full administrative & security analyst access) |

> **Note:** The admin role has full access to view and approve newly registered analysts, inspect raw audit logs, configure system settings, and generate threat reports.

---

## 🏗️ Architecture Overview

The system is organized into two primary pillars:

```
Cybervisor_X_/
├── cybervisor-x/               # Frontend Application & Threat Matrix UI
│   ├── cti-master/             # MITRE ATT&CK Cyber Threat Intelligence Dataset
│   ├── public/                 # Matrix data and static assets
│   ├── src/
│   │   ├── components/
│   │   │   ├── chat/           # AI Threat Intelligence Assistant Chat
│   │   │   ├── layout/         # TopBar, Sidebar, and DashboardLayout
│   │   │   ├── pages/          # Matrix, Dashboard, Analysis, Reports, Logs, Settings, Login
│   │   │   ├── ui/             # Technique cards, modals, and panel components
│   │   │   └── utils/          # Storage management, session tracking, and audit log utilities
│   │   ├── styles/             # Global CSS and layout stylesheets
│   │   ├── App.jsx             # Route protection, session lifecycle, and state manager
│   │   └── main.jsx            # React root entry point
│   ├── package.json
│   └── vite.config.js
│
├── cyberagent/                 # Multi-Agent Security Engine & Auth Services
│   ├── agents/                 # Specialized Autonomous AI Agents
│   │   ├── base_agent.py       # Core Agent interface & ADK foundation
│   │   ├── data_agent.py       # Security telemetry ingestion & normalization
│   │   ├── vulnerability_agent.py # Weakness & CVE identification
│   │   ├── risk_agent.py       # Likelihood, impact, and severity scoring
│   │   ├── mitigation_agent.py # Actionable remediation and defense strategies
│   │   └── report_agent.py     # Executive & technical threat report generator
│   ├── backend/                # Authentication & OTP Service
│   │   ├── package.json
│   │   └── server.js           # Express + Nodemailer OTP verification & user management
│   ├── main.py                 # FastAPI backend server
│   ├── orchestrator.py         # Multi-agent sequential pipeline runner
│   ├── config.py               # System & Google Cloud ADK configuration
│   └── requirements.txt        # Python backend dependencies
│
├── LICENSE                     # MIT License
└── README.md                   # Project documentation
```

---

## 🚀 Key Features

### 1. Interactive MITRE ATT&CK Matrix Explorer
- Deep-dive into enterprise, mobile, ICS, and pre-attack matrices.
- Explore tactics, techniques, sub-techniques, and detailed threat actor behaviors.
- Search and filter techniques by keywords, IDs, and tactics.

### 2. Autonomous Multi-Agent Defense Pipeline
The Python backend uses a sequential multi-agent architecture:
```
Raw Security Data ➔ Data Agent ➔ Vulnerability Agent ➔ Risk Agent ➔ Mitigation Agent ➔ Report Agent ➔ Actionable Intelligence
```
- **Data Agent:** Ingests, normalizes, and sanitizes security telemetry.
- **Vulnerability Agent:** Maps indicators against known vulnerabilities and patterns.
- **Risk Agent:** Computes quantitative risk scores based on likelihood and exploitability.
- **Mitigation Agent:** Delivers vendor-agnostic defense playbooks.
- **Report Agent:** Synthesizes analysis into structured executive summaries and technical advisories.

### 3. Identity & Access Governance
- Role-Based Access Control (**Admin** vs. **Analyst**).
- Dynamic password hashing using browser-native SHA-256 (`crypto.subtle`).
- Optional 2FA / OTP email verification workflow for new analyst registration.
- Admin dashboard to approve, reject, or manage system accounts.

### 4. Continuous Audit & Log Monitoring
- Comprehensive tracking of authentication events, failed logins, and administrative operations.
- Real-time audit log viewer with exportable security audit reports.

---

## 🛠️ Installation & Setup Guide

### 1. Frontend Setup (`cybervisor-x`)

1. Open a terminal and navigate to the frontend directory:
   ```bash
   cd cybervisor-x
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the local development server:
   ```bash
   npm run dev
   ```

4. The dashboard will be accessible at: **`http://localhost:5173`**

---

### 2. Authentication & OTP Backend Setup (`cyberagent/backend`)

The Express backend provides email OTP verification and registration workflows:

1. Navigate to the backend directory:
   ```bash
   cd cyberagent/backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. *(Optional)* Create a `.env` file for Gmail SMTP credentials if you want live email OTP delivery:
   ```env
   PORT=5000
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   ```

4. Start the authentication server:
   ```bash
   node server.js
   ```
   Server runs on **`http://localhost:5000`**.

---

### 3. Multi-Agent Python Backend Setup (`cyberagent`)

1. Navigate to the agent directory:
   ```bash
   cd cyberagent
   ```

2. Set up a Python virtual environment:
   ```bash
   # On Windows (PowerShell)
   python -m venv myenv
   .\myenv\Scripts\Activate.ps1

   # On Linux / macOS
   python3 -m venv myenv
   source myenv/bin/activate
   ```

3. Install required packages:
   ```bash
   pip install -r requirements.txt
   ```

4. Configure environment settings:
   ```bash
   cp .env.example .env
   ```

5. Launch the FastAPI server:
   ```bash
   python main.py
   ```
   The API will be available at **`http://localhost:8000`** (Swagger docs at `http://localhost:8000/docs`).

---

## 🧪 Quick Test Endpoints

Test the multi-agent pipeline via `curl` or Swagger UI:

```bash
curl -X POST http://localhost:8000/test
```

Submit custom security telemetry for agent analysis:
```bash
curl -X POST http://localhost:8000/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "source": "firewall_log",
    "data_type": "suspicious_payload",
    "data": [
      "SELECT * FROM users WHERE admin=1",
      "cmd.exe /c powershell -enc JABv..."
    ]
  }'
```

---

## 🔒 Security Best Practices

- Change the default administrator password in production environments.
- Protect Google Cloud / ADK service account keys and never commit production `.env` files.
- Enable HTTPS and strict CORS configurations for production deployments.

---

## 📜 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for full details.
