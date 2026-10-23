# SENTINEL // EDR
### ZERO-DAY DEFENSE
**Behavior-Based Zero-Day Ransomware Detection and Response System**

> Detect. Investigate. Respond.

SENTINEL // EDR is a cybersecurity project designed to identify suspicious endpoint activity associated with ransomware attacks using behavior-based detection, risk scoring, incident investigation, and response workflows.

Unlike approaches that rely only on known malware signatures, SENTINEL focuses on suspicious behavior patterns to help identify potentially malicious activity, including previously unseen threats.

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Problem Statement](#-problem-statement)
- [Objectives](#-objectives)
- [Key Features](#-key-features)
- [System Architecture](#-system-architecture)
- [Detection Workflow](#-detection-workflow)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Incident Reporting](#-incident-reporting)
- [Testing and Safety](#-testing-and-safety)
- [Limitations](#-limitations)
- [Future Enhancements](#-future-enhancements)
- [Contributors](#-contributors)
- [Disclaimer](#-disclaimer)

## 🔍 Overview

Ransomware can encrypt files, disrupt business operations, and compromise sensitive information. Traditional signature-based detection may struggle to identify new or modified malware variants.

SENTINEL // EDR aims to address this challenge by monitoring endpoint activity, identifying suspicious behavior, correlating multiple indicators, and presenting investigation results through a centralized dashboard.

The system supports an incident-response workflow that can include containment actions, evidence recording, and structured incident report generation.

## ⚠️ Problem Statement

Traditional endpoint protection methods may not recognize previously unseen ransomware immediately. Rapid file modifications, unusual process activity, suspicious file renaming, abnormal file entropy, and interactions with decoy files can indicate potential ransomware behavior.

A system that correlates these indicators can help security analysts investigate suspicious activity and make informed response decisions.

## 🎯 Objectives

- Identify suspicious endpoint behavior associated with ransomware.
- Analyze file, process, and available network activity.
- Correlate multiple behavioral indicators.
- Calculate a risk score to help prioritize incidents.
- Provide understandable explanations for detected threats.
- Support incident investigation and response workflows.
- Generate structured incident reports for analysis and documentation.

## 🚀 Key Features

### 1. Real-Time Endpoint Monitoring
Monitor supported endpoint telemetry, including file operations, process activity, and available network events.

### 2. Behavior-Based Detection
Identify suspicious patterns such as rapid file modifications, rename bursts, unusual entropy values, and suspicious process behavior.

### 3. Canary and Decoy File Monitoring
Use designated decoy files as additional indicators of potentially malicious activity.

### 4. Risk Scoring
Combine available detection indicators into a risk score to help prioritize suspicious incidents.

### 5. Incident Investigation
Present incident details, relevant behavioral indicators, event timelines, and available evidence through the dashboard.

### 6. Response and Containment Workflow
Support the recording and execution of response actions according to the implemented capabilities. Any simulated containment is distinguished from actual operating-system isolation.

### 7. Incident Reporting
Generate structured incident reports containing available event details, detection indicators, risk scores, and investigation timelines.

### 8. Security Dashboard
Provide a centralized interface for reviewing endpoint activity, investigating incidents, monitoring threats, and accessing reports.

## 🏗️ System Architecture

The project follows a modular endpoint detection and response workflow.

```text
┌──────────────────────────────┐
│       Endpoint Activity      │
│ Files • Processes • Network  │
└──────────────┬───────────────┘
               ↓
┌──────────────────────────────┐
│     Telemetry Collection     │
└──────────────┬───────────────┘
               ↓
┌──────────────────────────────┐
│   Behavioral Analysis Engine │
│ Pattern and Indicator Checks │
└──────────────┬───────────────┘
               ↓
┌──────────────────────────────┐
│   Risk Scoring & Correlation │
└──────────────┬───────────────┘
               ↓
┌──────────────────────────────┐
│ Dashboard & Incident Review  │
└──────────────┬───────────────┘
               ↓
┌──────────────────────────────┐
│ Response • Evidence • Reports│
└──────────────────────────────┘
```

*The diagram represents the conceptual workflow. Actual data flow depends on the implemented modules and integrations.*

## 🔄 Detection Workflow

1. **Observe:** Collect supported endpoint events and telemetry.
2. **Analyze:** Examine activity for suspicious behavioral indicators.
3. **Correlate:** Evaluate related events to identify potentially malicious patterns.
4. **Assess:** Calculate a risk score using the implemented detection logic.
5. **Investigate:** Review incident evidence and the event timeline.
6. **Respond:** Execute or simulate supported response actions.
7. **Report:** Generate an incident report for further investigation and documentation.

## 🛠️ Technology Stack

The project uses a web-based dashboard and a Python-based detection/backend workflow. Confirm the exact packages and versions against the repository before publishing this section.

| Component | Technology |
|---|---|
| Frontend | React |
| Frontend tooling | Vite |
| Backend / API | Python-based backend |
| API communication | REST API |
| Live updates | WebSockets, if enabled in the deployed implementation |
| Report generation | PDF and structured JSON reporting, where implemented |
| Detection | Behavioral analysis and risk scoring |

**Note:** Update this table to match the actual dependencies and configuration files in your repository. Do not list database technologies or integrations that are not present in the code.

## 📂 Project Structure

The repository may be organized into frontend and backend modules, for example:

```text
SENTINEL-EDR/
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
├── backend/
│   ├── main.py
│   └── ...
├── README.md
└── .gitignore
```

This is an illustrative structure. Keep the actual directory and file names from your GitHub repository when updating this section.

## ⚙️ Getting Started

### Prerequisites

Install the tools required by your implementation:

- Git
- Python and the backend's required version
- Node.js and npm
- Any additional database or service required by the repository

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd YOUR_REPOSITORY_FOLDER
```

Replace the example values with your actual GitHub repository URL and folder name.

### 2. Set Up the Backend

Open a terminal in the backend directory:

```bash
cd backend
python -m venv venv
```

Activate the virtual environment.

**Windows:**

```powershell
.\venv\Scripts\Activate.ps1
```

Install the project's declared dependencies:

```bash
pip install -r requirements.txt
```

Run the backend using the command specified by the project configuration or backend entry point.

### 3. Set Up the Frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite in the terminal.

**Important:** The commands above assume the repository contains `backend/requirements.txt` and `frontend/package.json`. Use the actual dependency files and startup commands from your repository if they differ.

### 4. Configure Environment Variables

If the project requires API URLs, database credentials, or other configuration values, configure them using a local environment file based on the provided example configuration.

- Never commit passwords, API keys, database credentials, or other secrets.
- Keep local environment files out of version control.
- Document required variables in an `.env.example` file without real credentials.

## 📊 Incident Reporting

SENTINEL // EDR is designed to present investigation results in a structured format that can support analysis and documentation.

Depending on the implemented modules, an incident report may include:

- Incident identifier and timestamp.
- Affected endpoint and process information.
- Observed behavioral indicators.
- Risk score and severity.
- Event timeline and available evidence.
- Response or containment status.
- Investigation summary.

Timestamps should represent the correct event time and display timezone. Reports should distinguish observed telemetry from generated or simulated demonstration data.

## 🧪 Testing and Safety

Testing should be performed only on systems and files that you own or are explicitly authorized to assess.

- Use a dedicated test directory for file-activity simulations.
- Prefer synthetic telemetry and harmless test events.
- Do not execute real ransomware on a personal or production machine.
- Verify that reports accurately reflect the events produced during testing.
- Distinguish simulated alerts and containment from real endpoint protection actions.

## ⚖️ Limitations

- Detection accuracy depends on the available telemetry and implemented behavioral rules.
- Legitimate applications may sometimes exhibit suspicious behavior, potentially resulting in false positives.
- Risk scores are indicators for investigation, not proof that an endpoint is compromised.
- Actual endpoint isolation and operating-system-level protection require the appropriate implementation and permissions.
- Detection performance, false-positive rates, and response latency must be measured through reproducible tests before making quantitative claims.

## 🔮 Future Enhancements

- Improve behavioral correlation and anomaly detection.
- Add more explainable detection rules and investigation context.
- Expand process lineage and event timeline visualization.
- Strengthen evidence integrity and audit logging.
- Integrate additional endpoint telemetry sources.
- Evaluate detection performance using reproducible test datasets.
- Improve secure containment and response integrations.
- Expand report customization and forensic investigation capabilities.

## 👥 Contributors

Add your actual project team members, roles, and faculty guide here.

- **Project Team:** SENTINEL // EDR Team
- **Institution:** Malla Reddy University
- **Department:** Department of Cyber Security
- **Academic Year:** 2026–2027
- **Class:** B.Tech II Year

## 📜 Disclaimer

SENTINEL // EDR is an academic cybersecurity project developed for learning, research, and authorized security testing. Its capabilities depend on the implemented modules and configured environment.

It is not a substitute for a fully validated commercial endpoint detection and response solution. Do not use the project to monitor systems or perform response actions without appropriate authorization.

---

**SENTINEL // EDR — Detect. Investigate. Respond.**

*Stronger Endpoints. Safer Tomorrow.*
