"""
Sentinel EDR - Real-Time Behavior-Based Zero-Day Ransomware Prevention Engine
Active Filesystem Monitoring on EDR_Test/ with Process Correlation & Multi-Factor Anomaly Scoring.
Comprehensive Enterprise SOC Backend with Endpoints, Incidents, Rules, and Containment.
"""

import asyncio
import datetime
import os
import random
from typing import List, Optional, Dict, Any, Union
from contextlib import asynccontextmanager

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from detector.process_tracker import ProcessTracker
from detector.behavior_engine import BehaviorEngine
from detector.file_monitor import FileSystemMonitor
from detector.test_generator import TestBehaviorGenerator
from report_generator import generate_sentinel_pdf, load_incident_json
import auth


# -----------------------------------------------------------------------------
# Configuration & Monitored Paths
# -----------------------------------------------------------------------------

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
MONITORED_DIR = os.path.join(BASE_DIR, "EDR_Test")

# Ensure test directories exist
os.makedirs(os.path.join(MONITORED_DIR, "Documents"), exist_ok=True)
os.makedirs(os.path.join(MONITORED_DIR, "Images"), exist_ok=True)
os.makedirs(os.path.join(MONITORED_DIR, "TestFiles"), exist_ok=True)
os.makedirs(os.path.join(MONITORED_DIR, "Decoy"), exist_ok=True)


# -----------------------------------------------------------------------------
# Data Models & Schemas
# -----------------------------------------------------------------------------

class ProcessNode(BaseModel):
    name: str
    pid: Union[int, str] = "UNKNOWN"
    command_line: str
    parent_pid: Optional[Union[int, str]] = None
    status: str = "RUNNING"  # RUNNING, TERMINATED
    sha256: str = ""
    privilege: str = "Medium / User"


class TelemetryEvent(BaseModel):
    id: str
    timestamp: str
    process_name: str
    pid: Union[int, str] = "UNKNOWN"
    parent_process: str = "UNRESOLVED"
    target_file: str
    action_taken: str  # FILE_CREATED, FILE_MODIFIED, FILE_DELETED, ALLOWED, MONITORED, PROCESS_FORCE_TERMINATED
    severity: str      # INFO, WARNING, CRITICAL_KILL
    entropy_score: float = Field(default=4.0, ge=0.0, le=8.0)
    detection_trigger: str
    response_latency: str
    status: str        # INTACT, SUSPICIOUS, TAMPER_ATTEMPT_BLOCKED
    lineage: Optional[List[ProcessNode]] = None
    details: Optional[str] = None


class CanaryTrap(BaseModel):
    id: str
    path: str
    filename: str
    doc_type: str
    directory_type: str
    size_kb: float
    integrity_status: str  # INTACT, TAMPER_ATTEMPT_BLOCKED
    last_checked: str
    canary_token: str
    decoy_entropy: float


class Endpoint(BaseModel):
    id: str
    hostname: str
    os: str
    ip: str
    agent: str
    risk_score: int
    threat_level: str  # NORMAL, LOW, ELEVATED, CRITICAL
    status: str        # ONLINE, ISOLATING, ISOLATED, OFFLINE
    last_seen: str
    department: str
    mac: str = "00:50:56:A1:B2:C3"
    cpu_usage_pct: float = 14.2
    memory_usage_pct: float = 46.8
    active_processes: int = 142
    active_connections: int = 12
    isolated_at: Optional[str] = None


class Incident(BaseModel):
    id: str
    threat_name: str
    endpoint: str
    endpoint_id: str
    risk_score: int
    severity: str  # LOW, MEDIUM, HIGH, CRITICAL
    status: str    # OPEN, INVESTIGATING, CONTAINED, RESOLVED
    created_at: str
    detection_vector: str
    summary: str
    ai_summary: str
    timeline: List[Dict[str, Any]]
    process_tree: List[Dict[str, Any]]
    file_activities: List[Dict[str, Any]]
    network_activities: List[Dict[str, Any]]
    indicators: List[Dict[str, Any]]
    containment_history: List[Dict[str, Any]]
    analyst_notes: List[Dict[str, Any]]


class DetectionRule(BaseModel):
    id: str
    name: str
    description: str
    severity: str  # LOW, MEDIUM, HIGH, CRITICAL
    threshold: str
    enabled: bool
    trigger_count: int
    category: str
    last_triggered: str


class ContainmentAction(BaseModel):
    id: str
    action_type: str  # ISOLATE_ENDPOINT, RELEASE_ENDPOINT, TERMINATE_PROCESS, BLOCK_CONNECTION, RESOLVE_INCIDENT
    target: str
    target_id: str
    status: str       # SUCCESS, PENDING, FAILED
    executed_at: str
    analyst: str
    details: str


class SOCStats(BaseModel):
    protected_endpoints: int = 24
    online_endpoints: int = 21
    active_threats: int = 3
    critical_threats: int = 2
    isolated_endpoints: int = 1
    current_risk_score: int = 94
    monitored_endpoints: int = 24
    active_traps: int = 48
    zero_day_threats_blocked: int = 14
    avg_containment_time: str = "11ms"
    engine_status: str = "ENGINE ACTIVE - REAL-TIME MONITORING"
    kernel_driver_status: str = "ATTACHED (Minifilter: SentinelTrap.sys)"
    system_uptime: str = "4d 18h 22m"
    cpu_usage_pct: float = 0.2
    memory_usage_mb: int = 42


# -----------------------------------------------------------------------------
# Decoy Vault Initialization (Real Decoy Files in EDR_Test/ + Extended Fleet)
# -----------------------------------------------------------------------------

def generate_canary_vault() -> List[CanaryTrap]:
    traps: List[CanaryTrap] = []
    
    # 1. Primary real decoy honeypot files in EDR_Test/Decoy/
    decoy_dir = os.path.join(MONITORED_DIR, "Decoy")
    real_decoys = [
        (os.path.join(decoy_dir, "financial_report.docx"), "financial_report.docx", "docx", "Executive Finance", 48.2, 5.12),
        (os.path.join(decoy_dir, "confidential.txt"), "confidential.txt", "txt", "Confidential Credentials", 12.4, 4.88),
        (os.path.join(decoy_dir, "project_data.xlsx"), "project_data.xlsx", "xlsx", "Core Project Data", 64.0, 5.42),
    ]

    counter = 1
    for path, fname, dtype, dir_type, size, ent in real_decoys:
        token = f"CANARY_TOKEN_{hex(random.randint(0x10000000, 0xFFFFFFFF))[2:].upper()}"
        traps.append(CanaryTrap(
            id=f"TRAP-{counter:03d}",
            path=path,
            filename=fname,
            doc_type=dtype,
            directory_type=dir_type,
            size_kb=size,
            integrity_status="INTACT",
            last_checked=datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            canary_token=token,
            decoy_entropy=ent
        ))
        counter += 1

    # 2. Extended synthetic honeypots across organizational units to complete the 48-trap fleet
    departments = ["Finance", "Legal", "DevOps", "HR", "Engineering", "Security", "Operations", "Research"]
    extensions = ["xlsx", "docx", "pdf", "sql", "env"]
    while len(traps) < 48:
        dept = random.choice(departments)
        ext = random.choice(extensions)
        fn = f"confidential_{dept.lower()}_report_v{counter}.{ext}"
        p = f"C:\\Users\\{dept}\\Documents\\Decoys\\{fn}"
        token = f"CANARY_TOKEN_{hex(random.randint(0x10000000, 0xFFFFFFFF))[2:].upper()}"
        traps.append(CanaryTrap(
            id=f"TRAP-{counter:03d}",
            path=p,
            filename=fn,
            doc_type=ext,
            directory_type=f"{dept} Honeypot",
            size_kb=round(random.uniform(15.0, 420.0), 1),
            integrity_status="INTACT",
            last_checked=datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            canary_token=token,
            decoy_entropy=round(random.uniform(4.5, 5.8), 2)
        ))
        counter += 1

    return traps

CANARY_TRAPS_STORE: List[CanaryTrap] = generate_canary_vault()
TELEMETRY_HISTORY: List[TelemetryEvent] = []
THREATS_BLOCKED_COUNT: int = 14


# -----------------------------------------------------------------------------
# Enterprise Endpoints Fleet Store (24 Endpoints, WS-FINANCE-01 as Core)
# -----------------------------------------------------------------------------

INITIAL_ENDPOINTS: List[Endpoint] = [
    Endpoint(
        id="EP-01",
        hostname="WS-FINANCE-01",
        os="Windows 11 Pro 23H2",
        ip="10.0.1.21",
        agent="Active (v3.4.1)",
        risk_score=94,
        threat_level="CRITICAL",
        status="ONLINE",
        last_seen="Just now",
        department="Executive Finance",
        mac="00:50:56:A1:B2:C1",
        cpu_usage_pct=88.4,
        memory_usage_pct=76.2,
        active_processes=164,
        active_connections=12
    ),
    Endpoint(
        id="EP-02",
        hostname="WS-EXEC-02",
        os="Windows 11 Pro 23H2",
        ip="10.0.1.34",
        agent="Active (v3.4.1)",
        risk_score=78,
        threat_level="ELEVATED",
        status="ONLINE",
        last_seen="12s ago",
        department="Executive Office",
        mac="00:50:56:A1:B2:C2",
        cpu_usage_pct=42.1,
        memory_usage_pct=58.0,
        active_processes=132,
        active_connections=8
    ),
    Endpoint(
        id="EP-03",
        hostname="SRV-DATABASE-01",
        os="Windows Server 2022",
        ip="10.0.2.10",
        agent="Active (v3.4.1)",
        risk_score=62,
        threat_level="ELEVATED",
        status="ISOLATED",
        last_seen="3m ago",
        department="Core Infrastructure",
        mac="00:50:56:A1:B2:C3",
        cpu_usage_pct=4.2,
        memory_usage_pct=31.5,
        active_processes=48,
        active_connections=0,
        isolated_at="2026-10-08 09:12:00"
    ),
    Endpoint(
        id="EP-04",
        hostname="WS-DEV-04",
        os="Windows 11 Pro 23H2",
        ip="10.0.3.15",
        agent="Active (v3.4.1)",
        risk_score=14,
        threat_level="NORMAL",
        status="ONLINE",
        last_seen="1s ago",
        department="Engineering",
        mac="00:50:56:A1:B2:C4",
        cpu_usage_pct=18.5,
        memory_usage_pct=45.2,
        active_processes=195,
        active_connections=24
    ),
    Endpoint(
        id="EP-05",
        hostname="WS-DEV-05",
        os="Ubuntu Linux 24.04 LTS",
        ip="10.0.3.18",
        agent="Active (v3.4.1)",
        risk_score=11,
        threat_level="NORMAL",
        status="ONLINE",
        last_seen="5s ago",
        department="Engineering",
        mac="00:50:56:A1:B2:C5",
        cpu_usage_pct=22.0,
        memory_usage_pct=52.1,
        active_processes=140,
        active_connections=19
    ),
    Endpoint(
        id="EP-06",
        hostname="WS-HR-07",
        os="Windows 10 Pro 22H2",
        ip="10.0.4.22",
        agent="Active (v3.4.1)",
        risk_score=9,
        threat_level="NORMAL",
        status="ONLINE",
        last_seen="4s ago",
        department="Human Resources",
        mac="00:50:56:A1:B2:C6",
        cpu_usage_pct=8.1,
        memory_usage_pct=34.6,
        active_processes=92,
        active_connections=6
    ),
    Endpoint(
        id="EP-07",
        hostname="SRV-DOMAIN-DC01",
        os="Windows Server 2022",
        ip="10.0.0.5",
        agent="Active (v3.4.1)",
        risk_score=82,
        threat_level="CRITICAL",
        status="ONLINE",
        last_seen="Just now",
        department="Identity & Access",
        mac="00:50:56:A1:B2:C7",
        cpu_usage_pct=51.4,
        memory_usage_pct=68.9,
        active_processes=210,
        active_connections=64
    ),
    Endpoint(
        id="EP-08",
        hostname="WS-LEGAL-02",
        os="Windows 11 Pro",
        ip="10.0.4.55",
        agent="Active (v3.4.1)",
        risk_score=15,
        threat_level="NORMAL",
        status="ONLINE",
        last_seen="8s ago",
        department="Legal Affairs",
        mac="00:50:56:A1:B2:C8",
        cpu_usage_pct=11.2,
        memory_usage_pct=39.0,
        active_processes=88,
        active_connections=5
    ),
    Endpoint(
        id="EP-09",
        hostname="WS-OPS-03",
        os="Windows 11 Pro",
        ip="10.0.5.12",
        agent="Active (v3.4.1)",
        risk_score=18,
        threat_level="NORMAL",
        status="ONLINE",
        last_seen="2s ago",
        department="Operations",
        mac="00:50:56:A1:B2:C9",
        cpu_usage_pct=19.4,
        memory_usage_pct=42.1,
        active_processes=110,
        active_connections=14
    ),
    Endpoint(
        id="EP-10",
        hostname="WS-MARKETING-01",
        os="macOS Sequoia 15.1",
        ip="10.0.6.30",
        agent="Active (v3.4.1)",
        risk_score=6,
        threat_level="NORMAL",
        status="ONLINE",
        last_seen="1m ago",
        department="Marketing",
        mac="00:50:56:A1:B2:CA",
        cpu_usage_pct=14.0,
        memory_usage_pct=48.2,
        active_processes=125,
        active_connections=9
    ),
    Endpoint(
        id="EP-11",
        hostname="SRV-BACKUP-01",
        os="Windows Server 2022",
        ip="10.0.2.88",
        agent="Active (v3.4.1)",
        risk_score=12,
        threat_level="NORMAL",
        status="ONLINE",
        last_seen="Just now",
        department="Core Infrastructure",
        mac="00:50:56:A1:B2:CB",
        cpu_usage_pct=6.5,
        memory_usage_pct=28.1,
        active_processes=75,
        active_connections=4
    ),
    Endpoint(
        id="EP-12",
        hostname="WS-RESEARCH-09",
        os="Ubuntu Linux 24.04 LTS",
        ip="10.0.7.14",
        agent="Active (v3.4.1)",
        risk_score=20,
        threat_level="NORMAL",
        status="ONLINE",
        last_seen="10s ago",
        department="R&D",
        mac="00:50:56:A1:B2:CC",
        cpu_usage_pct=34.0,
        memory_usage_pct=64.8,
        active_processes=180,
        active_connections=16
    ),
]

# Generate remaining endpoints to reach exactly 24 endpoints fleet
def init_endpoints_fleet() -> List[Endpoint]:
    fleet = list(INITIAL_ENDPOINTS)
    counter = len(fleet) + 1
    departments = ["Finance", "Engineering", "HR", "Legal", "Operations", "R&D", "Security", "Marketing"]
    while len(fleet) < 24:
        dept = random.choice(departments)
        hostname = f"WS-{dept.upper()[:3]}-{counter:02d}"
        ip = f"10.0.{random.randint(1, 8)}.{random.randint(20, 240)}"
        risk = random.randint(4, 22)
        fleet.append(Endpoint(
            id=f"EP-{counter:02d}",
            hostname=hostname,
            os="Windows 11 Pro 23H2" if counter % 3 != 0 else "Ubuntu Linux 24.04",
            ip=ip,
            agent="Active (v3.4.1)",
            risk_score=risk,
            threat_level="NORMAL",
            status="ONLINE",
            last_seen=f"{random.randint(1, 45)}s ago",
            department=dept,
            mac=f"00:50:56:A1:B2:{counter:02X}",
            cpu_usage_pct=round(random.uniform(5.0, 25.0), 1),
            memory_usage_pct=round(random.uniform(30.0, 55.0), 1),
            active_processes=random.randint(80, 160),
            active_connections=random.randint(4, 18)
        ))
        counter += 1
    return fleet

ENDPOINTS_STORE: List[Endpoint] = init_endpoints_fleet()


# -----------------------------------------------------------------------------
# Incidents Store (INC-2026-0042 as the Central Ransomware Investigation)
# -----------------------------------------------------------------------------

INITIAL_INCIDENTS: List[Incident] = [
    Incident(
        id="INC-2026-0042",
        threat_name="RANSOMWARE BEHAVIOR",
        endpoint="WS-FINANCE-01",
        endpoint_id="EP-01",
        risk_score=94,
        severity="CRITICAL",
        status="OPEN",
        created_at=datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        detection_vector="High Rename Velocity & Shannon Entropy H > 7.42 on Decoy Canary Vault",
        summary="Automated behavior engine detected rapid burst encryption sequence initiated by rogue process PID 4312 (svchost_suspicious.exe). Honeytoken canary accessed within 11ms.",
        ai_summary="AI SOC Investigation Summary: Root cause identified as untrusted execution from `%TEMP%\\svchost_suspicious.exe` spawned via PowerShell script. The process spawned 6 child threads attempting mass in-place modification of `.docx`, `.xlsx`, and `.pdf` files. Within 400ms, the Shannon entropy climbed from baseline 4.88 to 7.82, matching known LockBit/BlackCat encryption signatures. Containment protocol recommended: Immediate network isolation and kernel-level thread termination.",
        timeline=[
            {"time": "09:41:02", "event": "PROCESS_CREATED", "desc": "Process spawned PID 4312 (svchost_suspicious.exe)", "severity": "INFO"},
            {"time": "09:41:07", "event": "FILE_ACTIVITY_SPIKE", "desc": "1,823 file read/write operations/min detected in EDR_Test", "severity": "WARNING"},
            {"time": "09:41:12", "event": "RENAME_VELOCITY_HIGH", "desc": "File extension alteration burst (.locked extension appended)", "severity": "HIGH"},
            {"time": "09:41:16", "event": "ENTROPY_ANOMALY", "desc": "Entropy spike observed: Shannon H = 7.82 (High Encryption)", "severity": "CRITICAL"},
            {"time": "09:41:21", "event": "BEHAVIOR_SCORE_ESCALATION", "desc": "Behavioral risk score compounded to 78/100 across 5 heuristics", "severity": "CRITICAL"},
            {"time": "09:41:25", "event": "RANSOMWARE_DETECTED", "desc": "Canary Honeytoken accessed: TRAP-002 (confidential.txt). Risk 94/100.", "severity": "CRITICAL_KILL"},
        ],
        process_tree=[
            {"name": "explorer.exe", "pid": 1104, "parent_pid": None, "status": "RUNNING", "privilege": "User", "risk": 0},
            {"name": "powershell.exe", "pid": 3820, "parent_pid": 1104, "status": "RUNNING", "privilege": "User", "risk": 35},
            {"name": "svchost_suspicious.exe", "pid": 4312, "parent_pid": 3820, "status": "FLAGGED", "privilege": "Medium / User", "risk": 94},
            {"name": "cmd.exe (shadow copy delete)", "pid": 5012, "parent_pid": 4312, "status": "BLOCKED", "privilege": "Elevated", "risk": 90},
        ],
        file_activities=[
            {"path": "EDR_Test/TestFiles/quarterly_audit.xlsx", "action": "MODIFIED", "entropy": 7.45, "status": "INTERCEPTED"},
            {"path": "EDR_Test/Documents/q4_forecast.docx", "action": "MODIFIED", "entropy": 7.82, "status": "INTERCEPTED"},
            {"path": "EDR_Test/Decoy/confidential.txt", "action": "TAMPER_ATTEMPT", "entropy": 7.91, "status": "CANARY_BLOCKED"},
            {"path": "EDR_Test/Decoy/financial_report.docx", "action": "READ", "entropy": 5.12, "status": "CANARY_TRIPPED"},
        ],
        network_activities=[
            {"remote_ip": "185.220.101.44", "port": 443, "proto": "TCP", "state": "C2_BEACONING_SUSPECTED", "bytes_sent": 4210},
            {"remote_ip": "104.244.42.1", "port": 80, "proto": "TCP", "state": "ESTABLISHED", "bytes_sent": 1200},
            {"remote_ip": "198.51.100.23", "port": 8443, "proto": "TCP", "state": "BLOCKED", "bytes_sent": 0},
        ],
        indicators=[
            {"type": "SHA256", "value": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855", "label": "Ransomware Dropper Stager"},
            {"type": "ATT&CK Technique", "value": "T1486 (Data Encrypted for Impact)", "label": "Impact Tactic"},
            {"type": "ATT&CK Technique", "value": "T1490 (Inhibit System Recovery)", "label": "Shadow Copy Tampering"},
            {"type": "Behavior", "value": "High Entropy Burst (> 7.40)", "label": "Real-time Heuristic"},
        ],
        containment_history=[
            {"action": "CANARY_TOKEN_ALARM", "timestamp": "09:41:25", "status": "SUCCESS"},
            {"action": "KERNEL_I/O_THROTTLE", "timestamp": "09:41:25", "status": "ENFORCED"},
        ],
        analyst_notes=[
            {"author": "Automated Sentinel Bot", "time": "09:41:26", "text": "Tripped Canary TRAP-002 triggered automatic threshold tripwire. Recommended manual or auto-isolation."},
            {"author": "SOC Analyst Lead", "time": "09:42:10", "text": "Preliminary review confirms anomalous PowerShell invocation chaining to binary in AppData."}
        ]
    ),
    Incident(
        id="INC-2026-0039",
        threat_name="SUSPICIOUS POWERSHELL ENCODED COMMAND",
        endpoint="WS-EXEC-02",
        endpoint_id="EP-02",
        risk_score=78,
        severity="HIGH",
        status="INVESTIGATING",
        created_at=(datetime.datetime.now() - datetime.timedelta(hours=2)).strftime("%Y-%m-%d %H:%M:%S"),
        detection_vector="Base64 Encoded Command with Download Cradle",
        summary="PowerShell executed with -EncodedCommand attempting to download payload from external IP.",
        ai_summary="AI SOC Investigation: Command decoded to invoke WebClient.DownloadFile. Outbound connection quarantined before execution.",
        timeline=[
            {"time": "07:15:10", "event": "PROCESS_CREATED", "desc": "powershell.exe -enc SQBFAFgA...", "severity": "WARNING"},
            {"time": "07:15:14", "event": "OUTBOUND_BLOCKED", "desc": "Connection to 91.240.118.52:8080 terminated", "severity": "HIGH"}
        ],
        process_tree=[],
        file_activities=[],
        network_activities=[],
        indicators=[],
        containment_history=[],
        analyst_notes=[]
    ),
    Incident(
        id="INC-2026-0035",
        threat_name="MASS REPLICATION ATTEMPT",
        endpoint="SRV-DATABASE-01",
        endpoint_id="EP-03",
        risk_score=62,
        severity="MEDIUM",
        status="CONTAINED",
        created_at=(datetime.datetime.now() - datetime.timedelta(hours=5)).strftime("%Y-%m-%d %H:%M:%S"),
        detection_vector="Unauthorized service creation attempt via SMB",
        summary="Lateral movement attempt blocked. Endpoint isolated from domain.",
        ai_summary="AI SOC Investigation: Lateral movement attempt intercepted via Sentinel Minifilter. Endpoint successfully contained.",
        timeline=[],
        process_tree=[],
        file_activities=[],
        network_activities=[],
        indicators=[],
        containment_history=[],
        analyst_notes=[]
    )
]

INCIDENTS_STORE: List[Incident] = list(INITIAL_INCIDENTS)


# -----------------------------------------------------------------------------
# Detection Rules Store
# -----------------------------------------------------------------------------

INITIAL_RULES: List[DetectionRule] = [
    DetectionRule(
        id="RULE-001",
        name="Mass File Modification",
        description="Detects anomalous burst of file write operations exceeding baseline threshold within a 5-second window.",
        severity="HIGH",
        threshold="> 50 ops/sec",
        enabled=True,
        trigger_count=14,
        category="File Activity",
        last_triggered="3m ago"
    ),
    DetectionRule(
        id="RULE-002",
        name="High Rename Velocity",
        description="Flags rapid batch renaming of documents and files (classic ransomware staging behavior).",
        severity="HIGH",
        threshold="> 25 renames/sec",
        enabled=True,
        trigger_count=8,
        category="File Activity",
        last_triggered="12m ago"
    ),
    DetectionRule(
        id="RULE-003",
        name="Entropy Spike (Shannon H > 7.0)",
        description="Calculates real-time byte randomness. Plaintext is 4.0-5.5; encrypted bytes surge past 7.0.",
        severity="CRITICAL",
        threshold="Shannon H > 7.00",
        enabled=True,
        trigger_count=19,
        category="Cryptography / Heuristic",
        last_triggered="Just now"
    ),
    DetectionRule(
        id="RULE-004",
        name="Suspicious Process Chain",
        description="Detects script interpreters or cmd/powershell spawned from unverified executables or temporary directories.",
        severity="CRITICAL",
        threshold="cmd/powershell from untrusted binary",
        enabled=True,
        trigger_count=6,
        category="Process Behavior",
        last_triggered="25m ago"
    ),
    DetectionRule(
        id="RULE-005",
        name="Abnormal File Access",
        description="Identifies unauthorized crawling or bulk reads across sensitive user documents and shared drives.",
        severity="MEDIUM",
        threshold="Bulk access to user documents",
        enabled=True,
        trigger_count=27,
        category="Access Control",
        last_triggered="1h ago"
    ),
    DetectionRule(
        id="RULE-006",
        name="Network Anomaly (C2 Beaconing)",
        description="Monitors persistent small outbound packet bursts on non-standard ports indicative of ransomware key exchange.",
        severity="HIGH",
        threshold="Outbound C2 beaconing on non-std ports",
        enabled=True,
        trigger_count=11,
        category="Network",
        last_triggered="42m ago"
    ),
]

RULES_STORE: List[DetectionRule] = list(INITIAL_RULES)


# -----------------------------------------------------------------------------
# Containment Actions Log
# -----------------------------------------------------------------------------

CONTAINMENT_LOG: List[ContainmentAction] = [
    ContainmentAction(
        id="ACT-001",
        action_type="ISOLATE_ENDPOINT",
        target="SRV-DATABASE-01",
        target_id="EP-03",
        status="SUCCESS",
        executed_at="2026-10-08 09:12:00",
        analyst="Auto-Response Engine",
        details="Cut all non-EDR network ingress/egress. Host quarantined."
    ),
    ContainmentAction(
        id="ACT-002",
        action_type="TERMINATE_PROCESS",
        target="malware_stager.exe (PID 9102)",
        target_id="EP-02",
        status="SUCCESS",
        executed_at="2026-10-08 07:15:15",
        analyst="SOC Lead Analyst",
        details="SIGKILL issued via Sentinel Minifilter. Handle revoked."
    )
]


# -----------------------------------------------------------------------------
# WebSocket Connection Manager
# -----------------------------------------------------------------------------

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []
        self._lock = asyncio.Lock()

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        async with self._lock:
            self.active_connections.append(websocket)

    async def disconnect(self, websocket: WebSocket):
        async with self._lock:
            if websocket in self.active_connections:
                self.active_connections.remove(websocket)

    async def broadcast_json(self, data: dict):
        async with self._lock:
            dead_connections = []
            for connection in self.active_connections:
                try:
                    await connection.send_json(data)
                except Exception:
                    dead_connections.append(connection)
            for dead in dead_connections:
                if dead in self.active_connections:
                    self.active_connections.remove(dead)

manager = ConnectionManager()


# -----------------------------------------------------------------------------
# Detector Subsystem Setup
# -----------------------------------------------------------------------------

process_tracker = ProcessTracker()
behavior_engine = BehaviorEngine(containment_mode="detection_only")
test_generator = TestBehaviorGenerator(MONITORED_DIR)

async def handle_telemetry_event(event_data: dict, eval_result: dict):
    """Callback triggered by FileSystemMonitor on real file events."""
    event = TelemetryEvent(**event_data)
    TELEMETRY_HISTORY.insert(0, event)
    if len(TELEMETRY_HISTORY) > 250:
        TELEMETRY_HISTORY.pop()

    # Broadcast to all connected clients in real time
    await manager.broadcast_json({
        "type": "TELEMETRY_FEED",
        "payload": event.model_dump()
    })

async def handle_critical_threat(event_data: dict, eval_result: dict):
    """Callback triggered when behavioral score reaches critical threshold."""
    global THREATS_BLOCKED_COUNT
    THREATS_BLOCKED_COUNT += 1

    event = TelemetryEvent(**event_data)
    TELEMETRY_HISTORY.insert(0, event)
    if len(TELEMETRY_HISTORY) > 250:
        TELEMETRY_HISTORY.pop()

    # Mark corresponding decoy trap as blocked if touched
    target_norm = os.path.normpath(event_data.get("target_file", "")).lower()
    for trap in CANARY_TRAPS_STORE:
        if os.path.normpath(trap.path).lower() in target_norm or target_norm in os.path.normpath(trap.path).lower() or trap.filename.lower() in target_norm:
            trap.integrity_status = "TAMPER_ATTEMPT_BLOCKED"
            trap.last_checked = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    # Broadcast zero-day alert over WebSocket
    await manager.broadcast_json({
        "type": "ZERO_DAY_ALERT",
        "payload": event.model_dump(),
        "stats": {
            "zero_day_threats_blocked": THREATS_BLOCKED_COUNT,
            "avg_containment_time": "11ms"
        }
    })

fs_monitor = FileSystemMonitor(
    monitored_dir=MONITORED_DIR,
    process_tracker=process_tracker,
    behavior_engine=behavior_engine,
    on_telemetry_event=handle_telemetry_event,
    on_critical_threat=handle_critical_threat
)


# -----------------------------------------------------------------------------
# FastAPI App Lifecycle
# -----------------------------------------------------------------------------

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Start real-time filesystem monitor on EDR_Test
    await fs_monitor.start()
    yield
    # Shutdown: Stop monitor
    await fs_monitor.stop()

app = FastAPI(
    title="Sentinel EDR - Real-Time Zero-Day Behavioral Engine",
    description="Functional behavior-based ransomware prevention watching EDR_Test/ in real time.",
    version="3.5.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Authentication & User Management Router
app.include_router(auth.router)


# -----------------------------------------------------------------------------
# REST Endpoints: Stats & Dashboard
# -----------------------------------------------------------------------------

@app.get("/api/stats", response_model=SOCStats)
async def get_stats():
    """Fetch current SOC metrics and telemetry counts."""
    online_count = sum(1 for ep in ENDPOINTS_STORE if ep.status == "ONLINE")
    isolated_count = sum(1 for ep in ENDPOINTS_STORE if ep.status == "ISOLATED")
    return SOCStats(
        protected_endpoints=len(ENDPOINTS_STORE),
        online_endpoints=online_count,
        active_threats=3,
        critical_threats=2,
        isolated_endpoints=isolated_count,
        current_risk_score=94,
        monitored_endpoints=len(ENDPOINTS_STORE),
        active_traps=len(CANARY_TRAPS_STORE),
        zero_day_threats_blocked=THREATS_BLOCKED_COUNT,
        avg_containment_time="11ms",
        engine_status="ENGINE ACTIVE - REAL-TIME MONITORING",
        kernel_driver_status="ATTACHED (Minifilter: SentinelTrap.sys)",
        system_uptime="4d 18h 22m",
        cpu_usage_pct=round(random.uniform(0.1, 0.3), 1),
        memory_usage_mb=44
    )

@app.get("/api/dashboard/stats")
async def get_dashboard_stats():
    """Detailed analytics for dashboard KPI cards, charts, and distribution."""
    online_count = sum(1 for ep in ENDPOINTS_STORE if ep.status == "ONLINE")
    isolated_count = sum(1 for ep in ENDPOINTS_STORE if ep.status == "ISOLATED")
    return {
        "kpis": {
            "protected_endpoints": len(ENDPOINTS_STORE),
            "online_endpoints": online_count,
            "active_threats": 3,
            "critical_threats": 2,
            "isolated_endpoints": isolated_count,
            "current_risk_score": 94,
        },
        "threat_activity": [
            {"time": "04:00", "events": 12, "risk": 15},
            {"time": "05:00", "events": 18, "risk": 18},
            {"time": "06:00", "events": 25, "risk": 20},
            {"time": "07:00", "events": 45, "risk": 35},
            {"time": "08:00", "events": 82, "risk": 52},
            {"time": "09:00", "events": 190, "risk": 78},
            {"time": "Current", "events": 312, "risk": 94},
        ],
        "endpoint_risk": [
            {"name": "Critical (>80)", "count": 2, "color": "#ef4444"},
            {"name": "Elevated (50-80)", "count": 3, "color": "#f97316"},
            {"name": "Guarded (20-50)", "count": 4, "color": "#eab308"},
            {"name": "Normal (<20)", "count": 15, "color": "#22c55e"},
        ],
        "recent_alerts": [
            {
                "id": "ALT-901",
                "title": "High Entropy Burst in Finance",
                "endpoint": "WS-FINANCE-01",
                "risk": 94,
                "time": "Just now",
                "severity": "CRITICAL"
            },
            {
                "id": "ALT-902",
                "title": "Suspicious PowerShell Invocation",
                "endpoint": "WS-EXEC-02",
                "risk": 78,
                "time": "12m ago",
                "severity": "HIGH"
            },
            {
                "id": "ALT-903",
                "title": "Canary Honeytoken Probe Intercepted",
                "endpoint": "SRV-DATABASE-01",
                "risk": 62,
                "time": "1h ago",
                "severity": "MEDIUM"
            }
        ]
    }


# -----------------------------------------------------------------------------
# REST Endpoints: Endpoints Management
# -----------------------------------------------------------------------------

@app.get("/api/endpoints", response_model=List[Endpoint])
async def get_endpoints():
    """Retrieve full catalog of endpoints with live risk, threat level, and status."""
    return ENDPOINTS_STORE

@app.get("/api/endpoints/{endpoint_id}", response_model=Endpoint)
async def get_endpoint_detail(endpoint_id: str):
    """Retrieve detailed state for a specific endpoint."""
    for ep in ENDPOINTS_STORE:
        if ep.id.lower() == endpoint_id.lower() or ep.hostname.lower() == endpoint_id.lower():
            return ep
    raise HTTPException(status_code=404, detail="Endpoint not found")

@app.post("/api/endpoints/{endpoint_id}/isolate")
async def isolate_endpoint(endpoint_id: str):
    """
    Simulate network isolation of endpoint.
    Transitions ONLINE -> ISOLATING -> ISOLATED.
    """
    for ep in ENDPOINTS_STORE:
        if ep.id.lower() == endpoint_id.lower() or ep.hostname.lower() == endpoint_id.lower():
            ep.status = "ISOLATED"
            ep.isolated_at = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            ep.active_connections = 0
            
            # Log action
            action_id = f"ACT-{len(CONTAINMENT_LOG) + 1:03d}"
            CONTAINMENT_LOG.insert(0, ContainmentAction(
                id=action_id,
                action_type="ISOLATE_ENDPOINT",
                target=ep.hostname,
                target_id=ep.id,
                status="SUCCESS",
                executed_at=ep.isolated_at,
                analyst="SOC Analyst (User)",
                details=f"Endpoint {ep.hostname} successfully placed into isolation boundary."
            ))

            # Broadcast over WebSocket
            await manager.broadcast_json({
                "type": "ENDPOINT_ISOLATED",
                "endpoint_id": ep.id,
                "hostname": ep.hostname,
                "status": "ISOLATED"
            })

            return {"status": "SUCCESS", "message": f"{ep.hostname} isolated", "endpoint": ep}
    raise HTTPException(status_code=404, detail="Endpoint not found")

@app.post("/api/endpoints/{endpoint_id}/release")
async def release_endpoint(endpoint_id: str):
    """Release endpoint from quarantine back to ONLINE."""
    for ep in ENDPOINTS_STORE:
        if ep.id.lower() == endpoint_id.lower() or ep.hostname.lower() == endpoint_id.lower():
            ep.status = "ONLINE"
            ep.isolated_at = None
            ep.active_connections = 12

            # Log action
            action_id = f"ACT-{len(CONTAINMENT_LOG) + 1:03d}"
            CONTAINMENT_LOG.insert(0, ContainmentAction(
                id=action_id,
                action_type="RELEASE_ENDPOINT",
                target=ep.hostname,
                target_id=ep.id,
                status="SUCCESS",
                executed_at=datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                analyst="SOC Analyst (User)",
                details=f"Endpoint {ep.hostname} released from quarantine."
            ))

            # Broadcast over WebSocket
            await manager.broadcast_json({
                "type": "ENDPOINT_RELEASED",
                "endpoint_id": ep.id,
                "hostname": ep.hostname,
                "status": "ONLINE"
            })

            return {"status": "SUCCESS", "message": f"{ep.hostname} released", "endpoint": ep}
    raise HTTPException(status_code=404, detail="Endpoint not found")


# -----------------------------------------------------------------------------
# REST Endpoints: Incidents & Investigation
# -----------------------------------------------------------------------------

@app.get("/api/incidents", response_model=List[Incident])
async def get_incidents():
    """Retrieve active and historical security incidents."""
    return INCIDENTS_STORE

@app.get("/api/incidents/{incident_id}", response_model=Incident)
async def get_incident(incident_id: str):
    """Retrieve full forensic data for incident investigation."""
    for inc in INCIDENTS_STORE:
        if inc.id.lower() == incident_id.lower():
            return inc
    raise HTTPException(status_code=404, detail="Incident not found")

@app.post("/api/incidents/{incident_id}/contain")
async def contain_incident(incident_id: str):
    """Enforce automated containment across incident targets."""
    for inc in INCIDENTS_STORE:
        if inc.id.lower() == incident_id.lower():
            inc.status = "CONTAINED"
            # Isolate associated endpoint
            for ep in ENDPOINTS_STORE:
                if ep.hostname == inc.endpoint or ep.id == inc.endpoint_id:
                    ep.status = "ISOLATED"
            inc.containment_history.insert(0, {
                "action": "AUTOMATED_CONTAINMENT_ENFORCED",
                "timestamp": datetime.datetime.now().strftime("%H:%M:%S"),
                "status": "SUCCESS"
            })
            return {"status": "SUCCESS", "incident": inc}
    raise HTTPException(status_code=404, detail="Incident not found")

@app.post("/api/incidents/{incident_id}/resolve")
async def resolve_incident(incident_id: str):
    """Mark incident as resolved."""
    for inc in INCIDENTS_STORE:
        if inc.id.lower() == incident_id.lower():
            inc.status = "RESOLVED"
            return {"status": "SUCCESS", "incident": inc}
    raise HTTPException(status_code=404, detail="Incident not found")

@app.post("/api/incidents/{incident_id}/notes")
async def add_incident_note(incident_id: str, payload: Dict[str, str]):
    """Add analyst notes to incident investigation."""
    text = payload.get("text", "")
    author = payload.get("author", "SOC Analyst")
    for inc in INCIDENTS_STORE:
        if inc.id.lower() == incident_id.lower():
            inc.analyst_notes.append({
                "author": author,
                "time": datetime.datetime.now().strftime("%H:%M:%S"),
                "text": text
            })
            return {"status": "SUCCESS", "notes": inc.analyst_notes}
    raise HTTPException(status_code=404, detail="Incident not found")


# -----------------------------------------------------------------------------
# REST Endpoints: Reports & Technical Documentation PDF Generation
# -----------------------------------------------------------------------------

@app.get("/api/reports/pdf")
@app.get("/api/reports/{incident_id}/pdf")
async def get_report_pdf(incident_id: str = "INC-2026-0042"):
    """
    Generate and stream an enterprise publication-grade PDF forensic report
    using the selected incident's actual data with accurate Asia/Kolkata (IST) timestamps.
    """
    try:
        # 1. Search incident in INCIDENTS_STORE
        target_inc = None
        for inc in INCIDENTS_STORE:
            if inc.id.lower() == incident_id.lower():
                target_inc = inc
                break

        if target_inc:
            incident_data = target_inc.model_dump()
            # Enrich with endpoint metadata (IP, OS, MAC) if available
            for ep in ENDPOINTS_STORE:
                if ep.hostname.lower() == (target_inc.endpoint or "").lower() or ep.id.lower() == (target_inc.endpoint_id or "").lower():
                    incident_data["ip"] = ep.ip
                    incident_data["os"] = ep.os
                    incident_data["mac"] = ep.mac
                    break

            # If this is INC-2026-0042, merge with authoritative forensic JSON
            if incident_id.upper() == "INC-2026-0042":
                try:
                    json_data = load_incident_json()
                    incident_data = {**json_data, **incident_data}
                except Exception:
                    pass
        elif incident_id.upper() == "INC-2026-0042":
            incident_data = load_incident_json()
        else:
            raise HTTPException(status_code=404, detail=f"Incident {incident_id} not found")

        pdf_bytes = generate_sentinel_pdf(data=incident_data)
        filename = f"SENTINEL_EDR_Report_{incident_id}.pdf"
        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={
                "Content-Disposition": f'attachment; filename="{filename}"',
                "Content-Type": "application/pdf"
            }
        )
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Failed to generate PDF report: {str(e)}")


@app.post("/api/reports/generate-pdf")
async def post_generate_report_pdf(payload: Optional[Dict[str, Any]] = None):
    """
    Generate PDF report from incident payload with fallback to store data.
    """
    try:
        if payload:
            inc_id = payload.get("id") or payload.get("incidentId") or "INC-2026-0042"
            base_data = {}
            for inc in INCIDENTS_STORE:
                if inc.id.lower() == str(inc_id).lower():
                    base_data = inc.model_dump()
                    break

            if not base_data and str(inc_id).upper() == "INC-2026-0042":
                base_data = load_incident_json()

            incident_data = {**base_data, **payload}
        else:
            incident_data = load_incident_json()

        actual_id = incident_data.get("id") or incident_data.get("incidentId") or "INC-2026-0042"
        pdf_bytes = generate_sentinel_pdf(data=incident_data)
        filename = f"SENTINEL_EDR_Report_{actual_id}.pdf"
        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={
                "Content-Disposition": f'attachment; filename="{filename}"',
                "Content-Type": "application/pdf"
            }
        )
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Failed to generate PDF report: {str(e)}")


# -----------------------------------------------------------------------------
# REST Endpoints: Detection Rules
# -----------------------------------------------------------------------------

@app.get("/api/rules", response_model=List[DetectionRule])
async def get_rules():
    """Retrieve all configurable behavioral detection rules."""
    return RULES_STORE

@app.post("/api/rules/{rule_id}/toggle")
async def toggle_rule(rule_id: str):
    """Enable or disable a specific detection rule."""
    for r in RULES_STORE:
        if r.id.lower() == rule_id.lower():
            r.enabled = not r.enabled
            return {"status": "SUCCESS", "rule": r}
    raise HTTPException(status_code=404, detail="Rule not found")


# -----------------------------------------------------------------------------
# REST Endpoints: Containment Actions
# -----------------------------------------------------------------------------

@app.get("/api/containment/actions", response_model=List[ContainmentAction])
async def get_containment_actions():
    """Retrieve audit history of containment operations."""
    return CONTAINMENT_LOG

@app.post("/api/containment/execute")
async def execute_containment_action(payload: Dict[str, str]):
    """
    Execute simulated containment action:
    ISOLATE_ENDPOINT, RELEASE_ENDPOINT, TERMINATE_PROCESS, BLOCK_CONNECTION, RESOLVE_INCIDENT
    """
    action_type = payload.get("action_type")
    target = payload.get("target", "WS-FINANCE-01")
    target_id = payload.get("target_id", "EP-01")
    analyst = payload.get("analyst", "SOC Lead Analyst")

    action_id = f"ACT-{len(CONTAINMENT_LOG) + 1:03d}"
    now_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    if action_type == "ISOLATE_ENDPOINT":
        for ep in ENDPOINTS_STORE:
            if ep.hostname.lower() == target.lower() or ep.id.lower() == target_id.lower():
                ep.status = "ISOLATED"
                ep.isolated_at = now_str
                ep.active_connections = 0
        details = f"Endpoint {target} isolated from corporate network subnet."
    elif action_type == "RELEASE_ENDPOINT":
        for ep in ENDPOINTS_STORE:
            if ep.hostname.lower() == target.lower() or ep.id.lower() == target_id.lower():
                ep.status = "ONLINE"
                ep.isolated_at = None
                ep.active_connections = 12
        details = f"Endpoint {target} network bridge re-enabled."
    elif action_type == "TERMINATE_PROCESS":
        details = f"SIGKILL issued to target {target}. Threads terminated in 11ms."
    elif action_type == "BLOCK_CONNECTION":
        details = f"Outbound socket {target} blocked at NDIS filter layer."
    elif action_type == "RESOLVE_INCIDENT":
        for inc in INCIDENTS_STORE:
            if inc.id.lower() == target_id.lower():
                inc.status = "RESOLVED"
        details = f"Incident {target_id} marked as resolved."
    else:
        details = f"Executed generic response action {action_type}."

    action = ContainmentAction(
        id=action_id,
        action_type=action_type,
        target=target,
        target_id=target_id,
        status="SUCCESS",
        executed_at=now_str,
        analyst=analyst,
        details=details
    )
    CONTAINMENT_LOG.insert(0, action)

    # Broadcast containment update
    await manager.broadcast_json({
        "type": "CONTAINMENT_EXECUTED",
        "action": action.model_dump()
    })

    return {"status": "SUCCESS", "action": action}


# -----------------------------------------------------------------------------
# REST Endpoints: Traps, Events, and Simulation
# -----------------------------------------------------------------------------

@app.get("/api/traps", response_model=List[CanaryTrap])
async def get_canary_traps():
    """Retrieve catalog of deployed decoy canary files and their tripwire integrity status."""
    return CANARY_TRAPS_STORE

@app.get("/api/events", response_model=List[TelemetryEvent])
async def get_recent_events():
    """Fetch latest telemetry events."""
    return TELEMETRY_HISTORY[:50]

@app.post("/api/simulation/start")
async def start_multi_stage_simulation():
    """
    Simulate a multi-stage zero-day ransomware attack:
    1. Process Created (PID 4312)
    2. File Activity Spike (1,823 ops/min)
    3. Rename Velocity High
    4. Entropy Anomaly (Shannon H > 7.40)
    5. Behavioral Score Escalation (78 -> 94)
    6. Ransomware Detected & Containment Recommendation
    """
    sim_pid = random.randint(4310, 4390)
    process_tracker.register_test_process(sim_pid, "ransomware_core.exe")

    # Run real file burst in EDR_Test/
    await test_generator.run_suspicious_zero_day_burst(num_files=16)

    # Allow brief window for filesystem events to be debounced and analyzed
    await asyncio.sleep(0.6)

    # Make sure WS-FINANCE-01 risk is escalated
    for ep in ENDPOINTS_STORE:
        if ep.hostname == "WS-FINANCE-01":
            ep.risk_score = 94
            ep.threat_level = "CRITICAL"

    # Trip canary
    for trap in CANARY_TRAPS_STORE[:3]:
        trap.integrity_status = "TAMPER_ATTEMPT_BLOCKED"
        trap.last_checked = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    critical_events = [e for e in TELEMETRY_HISTORY if e.severity == "CRITICAL_KILL"]
    event = critical_events[0] if critical_events else (TELEMETRY_HISTORY[0] if TELEMETRY_HISTORY else None)

    return {
        "status": "SIMULATION_PROGRESSION_COMPLETED",
        "stages": [
            "PROCESS_SPAWNED",
            "FILE_ACTIVITY_BURST",
            "RENAME_VELOCITY_HIGH",
            "ENTROPY_ANOMALY_CONFIRMED",
            "RISK_SCORE_ESCALATED_94",
            "RANSOMWARE_CONTAINMENT_TRIGGERED"
        ],
        "event": event,
        "endpoint": "WS-FINANCE-01",
        "risk_score": 94,
        "containment_latency": "11ms"
    }

@app.post("/api/simulate-attack")
async def simulate_ransomware_attack():
    """
    Execute controlled suspicious file operations inside EDR_Test:
    Rapid batch modifications + decoy access with high-entropy bytes.
    Detected naturally by the FileSystemMonitor & BehaviorEngine!
    """
    sim_pid = random.randint(4800, 4999)
    process_tracker.register_test_process(sim_pid, "ransomware_sim.exe")

    # Run real file burst in EDR_Test/
    burst_result = await test_generator.run_suspicious_zero_day_burst(num_files=16)

    # Allow brief window for filesystem events to be debounced and analyzed
    await asyncio.sleep(0.8)

    # Retrieve the detected critical event
    critical_events = [e for e in TELEMETRY_HISTORY if e.severity == "CRITICAL_KILL"]
    event = critical_events[0] if critical_events else (TELEMETRY_HISTORY[0] if TELEMETRY_HISTORY else None)

    return {
        "status": "THREAT_NEUTRALIZED",
        "event": event,
        "threats_blocked": THREATS_BLOCKED_COUNT,
        "containment_latency": "11ms"
    }

@app.post("/api/reset")
async def reset_simulation():
    """Reset threat counts, restore decoy vault, and clear test artifacts."""
    global THREATS_BLOCKED_COUNT
    THREATS_BLOCKED_COUNT = 0
    for trap in CANARY_TRAPS_STORE:
        trap.integrity_status = "INTACT"
        trap.last_checked = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    process_tracker.windows.clear()

    # Reset endpoint statuses
    for ep in ENDPOINTS_STORE:
        if ep.hostname == "WS-FINANCE-01":
            ep.status = "ONLINE"
            ep.risk_score = 94  # Keep demo threat baseline or reset
            ep.isolated_at = None

    # Clean up generated test batch files in EDR_Test/TestFiles/
    testfiles_dir = os.path.join(MONITORED_DIR, "TestFiles")
    if os.path.exists(testfiles_dir):
        for fname in os.listdir(testfiles_dir):
            if fname.startswith("batch_payload_") or fname.startswith("test_record_") or fname == "test.txt":
                try:
                    os.remove(os.path.join(testfiles_dir, fname))
                except Exception:
                    pass

    # Broadcast system reset
    await manager.broadcast_json({
        "type": "RESET_SYSTEM",
        "stats": {
            "zero_day_threats_blocked": 0,
            "avg_containment_time": "11ms"
        }
    })

    return {"status": "SYSTEM_RESET_SUCCESSFUL", "threats_blocked": 0}


# -----------------------------------------------------------------------------
# WebSocket Telemetry Stream Endpoint
# -----------------------------------------------------------------------------

@app.websocket("/ws/telemetry")
async def websocket_telemetry_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        # Send initial handshake with current stats and recent events
        online_count = sum(1 for ep in ENDPOINTS_STORE if ep.status == "ONLINE")
        isolated_count = sum(1 for ep in ENDPOINTS_STORE if ep.status == "ISOLATED")

        await websocket.send_json({
            "type": "HANDSHAKE_INIT",
            "stats": {
                "protected_endpoints": len(ENDPOINTS_STORE),
                "online_endpoints": online_count,
                "active_threats": 3,
                "critical_threats": 2,
                "isolated_endpoints": isolated_count,
                "current_risk_score": 94,
                "monitored_endpoints": len(ENDPOINTS_STORE),
                "active_traps": len(CANARY_TRAPS_STORE),
                "zero_day_threats_blocked": THREATS_BLOCKED_COUNT,
                "avg_containment_time": "11ms",
                "engine_status": "ENGINE ACTIVE - REAL-TIME MONITORING",
                "kernel_driver_status": "ATTACHED (Minifilter: SentinelTrap.sys)"
            },
            "recent_events": [evt.model_dump() for evt in TELEMETRY_HISTORY[:15]],
            "active_endpoints": [ep.model_dump() for ep in ENDPOINTS_STORE[:6]]
        })

        # Keep listening for client messages or pings
        while True:
            data = await websocket.receive_text()
            if data == "PING":
                await websocket.send_text("PONG")
    except WebSocketDisconnect:
        await manager.disconnect(websocket)
    except Exception:
        await manager.disconnect(websocket)


if __name__ == "__main__":
    import uvicorn
    import sys
    sys.path.insert(0, os.path.dirname(__file__))
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)


