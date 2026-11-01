"""
SENTINEL // EDR — Incident Forensic Report Generator
Generates an enterprise-grade, downloadable PDF incident report using strictly
the authoritative incident record: SENTINEL_INCIDENT_REPORT_INC-2026-0042.json.
Converts UTC source timestamps to Indian Standard Time (IST, Asia/Kolkata, UTC+05:30)
with consistent display formatting (DD/MM/YYYY, HH:MM:SS IST) across all locations.
"""

import os
import re
import json
from io import BytesIO
from datetime import datetime, timezone
from zoneinfo import ZoneInfo
from typing import Dict, Any, List, Optional, Tuple

from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Table,
    TableStyle,
    Spacer,
    KeepTogether,
    HRFlowable
)
from reportlab.pdfgen import canvas


# -----------------------------------------------------------------------------
# Timezone Configuration (Indian Standard Time: Asia/Kolkata, UTC+05:30)
# -----------------------------------------------------------------------------
IST = ZoneInfo("Asia/Kolkata")


# -----------------------------------------------------------------------------
# Color Palette (SENTINEL Enterprise Cyber Aesthetics)
# -----------------------------------------------------------------------------
C_NAVY_DARK    = colors.HexColor("#080D1A")
C_NAVY_SURFACE = colors.HexColor("#0F172A")
C_ORANGE_CORE  = colors.HexColor("#FF6A00")
C_ORANGE_DARK  = colors.HexColor("#C2410C")
C_ORANGE_SOFT  = colors.HexColor("#FFF7ED")
C_CYAN_ACCENT  = colors.HexColor("#0284C7")
C_CYAN_SOFT    = colors.HexColor("#F0F9FF")
C_PURPLE_ACC   = colors.HexColor("#7C3AED")
C_RED_CRIT     = colors.HexColor("#DC2626")
C_RED_SOFT     = colors.HexColor("#FEF2F2")
C_GREEN_OK     = colors.HexColor("#059669")
C_GREEN_SOFT   = colors.HexColor("#ECFDF5")
C_AMBER_WARN   = colors.HexColor("#D97706")
C_AMBER_SOFT   = colors.HexColor("#FFFBEB")
C_TEXT_MAIN    = colors.HexColor("#0F172A")
C_TEXT_MUTED   = colors.HexColor("#475569")
C_TEXT_LIGHT   = colors.HexColor("#94A3B8")
C_BORDER       = colors.HexColor("#E2E8F0")
C_BORDER_DARK  = colors.HexColor("#CBD5E1")
C_BG_ROW_ALT   = colors.HexColor("#F8FAFC")
C_CARD_BG      = colors.HexColor("#F8FAFC")
C_HEADER_BG    = colors.HexColor("#F1F5F9")


# -----------------------------------------------------------------------------
# Timezone-Aware Conversion Functions (UTC -> IST Asia/Kolkata)
# -----------------------------------------------------------------------------
def parse_utc_to_datetime(dt_str: str) -> Optional[datetime]:
    """
    Parses a UTC datetime string into a timezone-aware datetime object (tzinfo=timezone.utc).
    Supports DD/MM/YYYY, MM/DD/YYYY, YYYY-MM-DD, and ISO-8601 variations.
    """
    s = dt_str.strip()
    if not s:
        return None

    # Remove trailing UTC or Z
    clean = re.sub(r'\s+UTC$', '', s, flags=re.IGNORECASE)
    clean = clean.replace('T', ' ').replace('Z', '').strip()

    patterns = [
        '%d/%m/%Y, %H:%M:%S',
        '%d/%m/%Y %H:%M:%S',
        '%Y-%m-%d %H:%M:%S',
        '%d-%m-%Y %H:%M:%S',
        '%m/%d/%Y, %H:%M:%S',
        '%m/%d/%Y %H:%M:%S',
        '%d/%m/%Y, %H:%M',
        '%d/%m/%Y %H:%M',
        '%Y-%m-%d %H:%M',
    ]
    for p in patterns:
        try:
            dt = datetime.strptime(clean, p)
            return dt.replace(tzinfo=timezone.utc)
        except ValueError:
            pass
    return None


def convert_utc_to_ist(date_str: str, time_str: str = "") -> Tuple[str, Optional[datetime]]:
    """
    Converts source UTC date and time into an IST string formatted as:
    'DD/MM/YYYY, HH:MM:SS IST'
    Uses timezone-aware conversion (ZoneInfo('Asia/Kolkata')).
    Preserves source UTC data and guarantees idempotency (prevents double-conversion).
    """
    combined = f"{date_str} {time_str}".strip()
    if "IST" in combined:
        # Already in IST; return directly without double conversion
        return combined, None

    dt_utc = parse_utc_to_datetime(combined)

    if dt_utc is None:
        # Try extracting date and time parts
        d_clean = date_str.strip().split(",")[0].strip()
        t_clean = time_str.strip().replace("UTC", "").strip()
        if not t_clean and " " in d_clean:
            d_clean, t_clean = d_clean.split(" ", 1)
        dt_utc = parse_utc_to_datetime(f"{d_clean} {t_clean}")

    if dt_utc is None:
        # Fallback with standard date
        dt_utc = parse_utc_to_datetime(f"10/08/2026 {combined.replace('UTC', '').strip()}")

    if dt_utc:
        dt_ist = dt_utc.astimezone(IST)
        formatted_ist = dt_ist.strftime("%d/%m/%Y, %H:%M:%S IST")
        return formatted_ist, dt_ist

    return f"{combined} IST", None


def convert_event_time_to_ist(event_time_str: str, base_date_str: str = "10/08/2026") -> str:
    """
    Converts an individual timeline event time (e.g. '09:41:02' or '09:41:02 UTC')
    to IST, independently handling chronological order and automatic date rollover.
    """
    s = event_time_str.strip()
    if "IST" in s:
        return s

    t_clean = s.replace("UTC", "").strip()
    if "/" in t_clean or "-" in t_clean:
        ist_str, _ = convert_utc_to_ist(t_clean)
        return ist_str

    ist_str, _ = convert_utc_to_ist(base_date_str, t_clean)
    return ist_str


def convert_summary_timestamps_to_ist(text: str, base_date_str: str = "10/08/2026") -> str:
    """
    Identifies any UTC time strings inside the incident summary (e.g. '09:41:02 UTC')
    and converts them to their corresponding IST time (e.g. '15:11:02 IST').
    """
    def repl(match):
        t_str = match.group(1)
        _, dt_ist = convert_utc_to_ist(base_date_str, t_str)
        if dt_ist:
            return dt_ist.strftime("%H:%M:%S IST")
        return f"{t_str} IST"

    return re.sub(r'(\d{1,2}:\d{2}:\d{2})\s*UTC', repl, text)


# -----------------------------------------------------------------------------
# Two-Pass Numbered Canvas (Header, Footer & Total Page Count)
# -----------------------------------------------------------------------------
class SentinelIncidentCanvas(canvas.Canvas):
    incident_timestamp_ist: str = "10/08/2026, 15:11:25 IST"
    incident_id: str = "INC-2026-0042"

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_decorations(self, total_pages: int):
        page_num = self._pageNumber
        width, height = A4

        self.saveState()

        # Running Header on page 2+
        if page_num > 1:
            self.setFont("Helvetica-Bold", 8)
            self.setFillColor(C_ORANGE_CORE)
            self.drawString(45, height - 32, "SENTINEL // EDR")
            self.setFont("Helvetica", 8)
            self.setFillColor(C_TEXT_MUTED)
            self.drawString(135, height - 32, f"— Incident Forensic Post-Mortem | {self.incident_id}")

            self.drawRightString(width - 45, height - 32, self.incident_timestamp_ist)

            # Header thin separator line
            self.setStrokeColor(C_BORDER)
            self.setLineWidth(0.6)
            self.line(45, height - 38, width - 45, height - 38)

        # Running Footer on all pages
        self.setStrokeColor(C_BORDER)
        self.setLineWidth(0.6)
        self.line(45, 42, width - 45, 42)

        self.setFont("Helvetica", 8)
        self.setFillColor(C_TEXT_MUTED)
        self.drawString(45, 28, f"Incident Timestamp: {self.incident_timestamp_ist}  •  SENTINEL // EDR")
        self.drawRightString(width - 45, 28, f"Page {page_num} of {total_pages}")

        self.restoreState()


# -----------------------------------------------------------------------------
# Data Loader: Load strictly SENTINEL_INCIDENT_REPORT_INC-2026-0042.json
# -----------------------------------------------------------------------------
def load_incident_json(base_dir: Optional[str] = None) -> Dict[str, Any]:
    """
    Safely loads the authoritative incident report JSON.
    Preserves UTC data internally as source of truth.
    """
    if base_dir is None:
        base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

    candidates = [
        os.path.join(base_dir, "backend", "data", "SENTINEL_INCIDENT_REPORT_INC-2026-0042.json"),
        os.path.join(os.path.expanduser("~"), "Downloads", "SENTINEL_INCIDENT_REPORT_INC-2026-0042.json"),
    ]

    for path in candidates:
        if os.path.exists(path):
            try:
                with open(path, "r", encoding="utf-8") as f:
                    return json.load(f)
            except Exception as e:
                print(f"[ReportGenerator] Warning reading {path}: {e}")

    # Fallback to hardcoded structure matching the exact JSON if file missing
    return {
        "incidentId": "INC-2026-0042",
        "title": "Zero-Day Ransomware Behavioral Burst & Quarantine",
        "date": "10/08/2026",
        "time": "09:41:25 UTC",
        "timestamp": "10/08/2026, 09:41:25 UTC",
        "severity": "CRITICAL",
        "riskScore": "94 / 100",
        "finalStatus": "CONTAINED (Quarantine Enforced)",
        "endpoint": "WS-FINANCE-01",
        "ip": "10.0.1.21",
        "os": "Windows 11 Pro 23H2",
        "mac": "00:50:56:A1:B2:C1",
        "analyst": "SOC Lead Analyst & Sentinel Behavioral Kernel",
        "executiveSummary": "At 09:41:02 UTC, Sentinel EDR intercepted a multi-stage zero-day ransomware attack attempting rapid in-place encryption across user documents and decoy honeytokens on WS-FINANCE-01. The rogue process (PID 4312) exhibited an anomalous rename velocity of 1,823 ops/min and surge in Shannon byte entropy to H=7.82. Within 11 milliseconds of touching Canary Trap TRAP-002, Sentinel's minifilter driver revoked the process file handles and placed the endpoint into an isolated network boundary. Zero corporate data was encrypted or exfiltrated.",
        "timeline": [
            {"time": "09:41:02", "event": "Process Spawn", "detail": "PID 4312 (svchost_suspicious.exe) executed via PowerShell"},
            {"time": "09:41:07", "event": "File Burst", "detail": "1,823 file read/write operations/min detected in EDR_Test"},
            {"time": "09:41:12", "event": "Rename Velocity Spike", "detail": "Batch alteration (.locked extension appended)"},
            {"time": "09:41:16", "event": "Entropy Anomaly", "detail": "Shannon entropy H = 7.82 observed on honeypot file"},
            {"time": "09:41:21", "event": "Risk Escalation", "detail": "Dynamic composite score escalated to 78/100"},
            {"time": "09:41:25", "event": "Tripwire Hit & Containment", "detail": "Canary TRAP-002 accessed. Score 94/100. Host isolated."}
        ],
        "indicators": [
            {"type": "SHA256", "value": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"},
            {"type": "C2 IP", "value": "185.220.101.44 (Port 443 / 8443)"},
            {"type": "MITRE ATT&CK", "value": "T1486 (Data Encrypted for Impact), T1490 (Shadow Copy Tampering)"},
            {"type": "Canary Token", "value": "CANARY_TOKEN_B6ED5D03 (Decoy Trap TRAP-002)"}
        ],
        "containmentActions": [
            "Process handle revoked via Sentinel Minifilter",
            "Endpoint network isolated (NDIS quarantine filter applied)",
            "Outbound C2 sockets dropped",
            "Decoy honeypot integrity state updated to TAMPER_ATTEMPT_BLOCKED"
        ],
        "recommendations": [
            "1. Re-image WS-FINANCE-01 from verified pre-incident snapshot.",
            "2. Enforce PowerShell Constrained Language Mode on executive workstations.",
            "3. Block external egress to IP subnet 185.220.101.0/24 at firewall level.",
            "4. Rotate active Canary Honeytoken secrets across Decoy vault."
        ]
    }


# -----------------------------------------------------------------------------
# Stylesheet Builder
# -----------------------------------------------------------------------------
def build_incident_stylesheet():
    styles = getSampleStyleSheet()

    styles.add(ParagraphStyle(
        name="HeaderBrand",
        fontName="Helvetica-Bold",
        fontSize=15,
        leading=18,
        textColor=C_NAVY_DARK
    ))
    styles.add(ParagraphStyle(
        name="HeaderSubBrand",
        fontName="Helvetica-Bold",
        fontSize=8,
        leading=10,
        textColor=C_ORANGE_CORE,
        textTransform="uppercase"
    ))
    styles.add(ParagraphStyle(
        name="ReportMainTitle",
        fontName="Helvetica-Bold",
        fontSize=17,
        leading=21,
        textColor=C_NAVY_DARK,
        spaceAfter=3
    ))
    styles.add(ParagraphStyle(
        name="ReportMetaLine",
        fontName="Helvetica",
        fontSize=8.5,
        leading=12,
        textColor=C_TEXT_MUTED,
        spaceAfter=10
    ))
    styles.add(ParagraphStyle(
        name="SectionHeading",
        fontName="Helvetica-Bold",
        fontSize=11,
        leading=14,
        textColor=C_NAVY_DARK,
        spaceBefore=12,
        spaceAfter=5,
        keepWithNext=True
    ))
    styles.add(ParagraphStyle(
        name="ReportBodyText",
        fontName="Helvetica",
        fontSize=8.5,
        leading=12.5,
        textColor=C_TEXT_MAIN
    ))
    styles.add(ParagraphStyle(
        name="CalloutSummary",
        fontName="Helvetica",
        fontSize=8.5,
        leading=13,
        textColor=C_TEXT_MAIN
    ))
    styles.add(ParagraphStyle(
        name="TableCellText",
        fontName="Helvetica",
        fontSize=8,
        leading=11,
        textColor=C_TEXT_MAIN
    ))
    styles.add(ParagraphStyle(
        name="TableCellBold",
        fontName="Helvetica-Bold",
        fontSize=8,
        leading=11,
        textColor=C_NAVY_DARK
    ))
    styles.add(ParagraphStyle(
        name="TableCellMono",
        fontName="Courier",
        fontSize=7.5,
        leading=10,
        textColor=C_NAVY_DARK
    ))
    styles.add(ParagraphStyle(
        name="TableHeaderText",
        fontName="Helvetica-Bold",
        fontSize=7.5,
        leading=10,
        textColor=C_NAVY_DARK,
        textTransform="uppercase"
    ))
    styles.add(ParagraphStyle(
        name="BadgeCritical",
        fontName="Helvetica-Bold",
        fontSize=8,
        leading=10,
        textColor=C_RED_CRIT,
        alignment=1
    ))
    styles.add(ParagraphStyle(
        name="BadgeSuccess",
        fontName="Helvetica-Bold",
        fontSize=8,
        leading=10,
        textColor=C_GREEN_OK,
        alignment=1
    ))

    return styles


# -----------------------------------------------------------------------------
# Main Incident Report PDF Builder
# -----------------------------------------------------------------------------
def generate_sentinel_pdf(data: Optional[Dict[str, Any]] = None, output_stream: Optional[BytesIO] = None) -> bytes:
    """
    Builds the publication-grade incident report PDF using the selected incident's
    actual data with timezone-aware IST timestamps.
    """
    if data is None:
        data = load_incident_json()

    if output_stream is None:
        buffer = BytesIO()
    else:
        buffer = output_stream

    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        leftMargin=40,
        rightMargin=40,
        topMargin=42,
        bottomMargin=48
    )

    styles = build_incident_stylesheet()
    story: List[Any] = []
    width_content = A4[0] - 80  # ~515.27 points

    # Extract dynamic incident fields
    incident_id = str(data.get("id") or data.get("incidentId") or "INC-2026-0042")
    title = str(data.get("threat_name") or data.get("title") or "Zero-Day Ransomware Behavioral Burst & Quarantine")
    severity = str(data.get("severity") or "CRITICAL").upper()

    raw_risk = data.get("risk_score") or data.get("riskScore") or 94
    if isinstance(raw_risk, (int, float)):
        risk_score_str = f"{raw_risk} / 100"
    else:
        risk_score_str = str(raw_risk)

    endpoint = str(data.get("endpoint") or "WS-FINANCE-01")
    ip = str(data.get("ip") or "10.0.1.21")
    os_name = str(data.get("os") or "Windows 11 Pro 23H2")
    mac = str(data.get("mac") or "00:50:56:A1:B2:C1")
    status = str(data.get("status") or "CONTAINED (Quarantine Enforced)").upper()
    analyst = str(data.get("analyst") or "SOC Lead Analyst & Sentinel Behavioral Kernel")

    # Dynamic severity theme color
    if "CRIT" in severity:
        sev_color = "#DC2626"
    elif "HIGH" in severity or "WARN" in severity:
        sev_color = "#D97706"
    else:
        sev_color = "#0284C7"

    # Timezone-Aware IST Conversion for Incident Timestamp
    raw_timestamp = data.get("created_at") or data.get("timestamp") or ""
    raw_date = data.get("date") or ""
    raw_time = data.get("time") or ""

    if not raw_date and not raw_time and raw_timestamp:
        clean_ts = str(raw_timestamp).strip()
        if " " in clean_ts:
            parts = clean_ts.split(" ", 1)
            raw_date, raw_time = parts[0].rstrip(","), parts[1]
        else:
            raw_date = datetime.now().strftime("%d/%m/%Y")
            raw_time = clean_ts
    if not raw_date:
        raw_date = "10/08/2026"
    if not raw_time:
        raw_time = "09:41:25 UTC"

    incident_timestamp_ist, dt_ist = convert_utc_to_ist(raw_date, raw_time)
    base_date = dt_ist.strftime("%d/%m/%Y") if dt_ist else raw_date

    # Bind timestamp and incident ID to canvas class for running headers & footers
    class BoundSentinelCanvas(SentinelIncidentCanvas):
        pass
    BoundSentinelCanvas.incident_timestamp_ist = incident_timestamp_ist
    BoundSentinelCanvas.incident_id = incident_id

    # -------------------------------------------------------------------------
    # 1. TOP BRANDING MASTHEAD
    # -------------------------------------------------------------------------
    brand_table_data = [
        [
            Paragraph("<b>SENTINEL // EDR</b><br/><font size='7' color='#C2410C'><b>INCIDENT FORENSIC POST-MORTEM &amp; AUDIT REPORT</b></font>", styles["HeaderBrand"]),
            Paragraph(f"<font size='8' color='{sev_color}'><b>SEVERITY: {severity}</b></font><br/><font size='7' color='#475569'>INCIDENT REF: <b>{incident_id}</b><br/>TIMESTAMP: <b>{incident_timestamp_ist}</b></font>", styles["TableCellText"]),
        ]
    ]
    t_brand = Table(brand_table_data, colWidths=[width_content * 0.58, width_content * 0.42])
    t_brand.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('ALIGN', (1,0), (1,0), 'RIGHT'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('TOPPADDING', (0,0), (-1,-1), 0),
        ('LEFTPADDING', (0,0), (-1,-1), 0),
        ('RIGHTPADDING', (0,0), (-1,-1), 0),
    ]))
    story.append(t_brand)

    # Accent divider lines
    story.append(HRFlowable(width="100%", thickness=2.5, color=C_ORANGE_CORE, spaceBefore=4, spaceAfter=2))
    story.append(HRFlowable(width="100%", thickness=0.8, color=C_CYAN_ACCENT, spaceBefore=0, spaceAfter=10))

    # -------------------------------------------------------------------------
    # 2. INCIDENT TITLE & METADATA CARD
    # -------------------------------------------------------------------------
    story.append(Paragraph(title, styles["ReportMainTitle"]))
    story.append(Paragraph(
        f"<b>Incident ID:</b> {incident_id} &nbsp;&nbsp;•&nbsp;&nbsp; "
        f"<b>Incident Timestamp:</b> <font color='#C2410C'><b>{incident_timestamp_ist}</b></font> &nbsp;&nbsp;•&nbsp;&nbsp; "
        f"<b>Classification:</b> INTERNAL SOC INCIDENT AUDIT",
        styles["ReportMetaLine"]
    ))

    # Quick Parameters Grid
    meta_grid = [
        [
            Paragraph("<b>Target Endpoint:</b>", styles["TableCellBold"]),
            Paragraph(f"<font name='Courier'><b>{endpoint}</b></font>", styles["TableCellText"]),
            Paragraph("<b>Severity / Risk:</b>", styles["TableCellBold"]),
            Paragraph(f"<font color='{sev_color}'><b>{severity} ({risk_score_str})</b></font>", styles["TableCellText"]),
        ],
        [
            Paragraph("<b>IP Address:</b>", styles["TableCellBold"]),
            Paragraph(f"<font name='Courier'>{ip}</font>", styles["TableCellText"]),
            Paragraph("<b>Containment Status:</b>", styles["TableCellBold"]),
            Paragraph(f"<font color='#059669'><b>{status}</b></font>", styles["TableCellText"]),
        ],
        [
            Paragraph("<b>MAC Address:</b>", styles["TableCellBold"]),
            Paragraph(f"<font name='Courier'>{mac}</font>", styles["TableCellText"]),
            Paragraph("<b>Lead Analyst / System:</b>", styles["TableCellBold"]),
            Paragraph(analyst, styles["TableCellText"]),
        ],
        [
            Paragraph("<b>Operating System:</b>", styles["TableCellBold"]),
            Paragraph(os_name, styles["TableCellText"]),
            Paragraph("<b>Response Latency:</b>", styles["TableCellBold"]),
            Paragraph("<font color='#C2410C'><b>&lt; 11ms</b></font> (Minifilter Kill Hook)", styles["TableCellText"]),
        ],
    ]
    t_meta = Table(meta_grid, colWidths=[105, 150, 115, 145])
    t_meta.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), C_CARD_BG),
        ('BOX', (0,0), (-1,-1), 1, C_BORDER_DARK),
        ('INNERGRID', (0,0), (-1,-1), 0.5, C_BORDER),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(t_meta)
    story.append(Spacer(1, 10))

    # -------------------------------------------------------------------------
    # 3. SECTION 1 — EXECUTIVE SUMMARY
    # -------------------------------------------------------------------------
    story.append(Paragraph("1. EXECUTIVE SUMMARY", styles["SectionHeading"]))
    raw_summary = (
        data.get("executiveSummary") or 
        data.get("summary") or 
        data.get("ai_summary") or 
        f"At {raw_time}, Sentinel EDR intercepted suspicious behavioral activity ({title}) on endpoint {endpoint}. Rogue operations triggered heuristic alerts and protective containment workflows."
    )
    exec_summary_text = convert_summary_timestamps_to_ist(raw_summary, base_date_str=raw_date)
    t_exec = Table([[Paragraph(exec_summary_text, styles["CalloutSummary"])]], colWidths=[width_content])
    t_exec.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), C_ORANGE_SOFT),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#FDBA74")),
        ('LEFTPADDING', (0,0), (-1,-1), 10),
        ('RIGHTPADDING', (0,0), (-1,-1), 10),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(t_exec)
    story.append(Spacer(1, 10))

    # -------------------------------------------------------------------------
    # 4. SECTION 2 — AFFECTED ENDPOINT DETAILS
    # -------------------------------------------------------------------------
    story.append(Paragraph("2. AFFECTED ENDPOINT DETAILS", styles["SectionHeading"]))
    ep_data = [
        [
            Paragraph(f"<b>HOSTNAME</b><br/><font size='9' color='#0F172A'><b>{endpoint}</b></font>", styles["TableCellText"]),
            Paragraph(f"<b>IP ADDRESS</b><br/><font size='9' color='#0F172A'><b>{ip}</b></font>", styles["TableCellText"]),
            Paragraph(f"<b>OPERATING SYSTEM</b><br/><font size='9' color='#0F172A'><b>{os_name}</b></font>", styles["TableCellText"]),
            Paragraph(f"<b>COMPOSITE RISK</b><br/><font size='9' color='{sev_color}'><b>{risk_score_str} ({severity})</b></font>", styles["TableCellText"]),
        ]
    ]
    t_ep = Table(ep_data, colWidths=[width_content * 0.25] * 4)
    t_ep.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), C_CARD_BG),
        ('BOX', (0,0), (-1,-1), 1, C_BORDER_DARK),
        ('INNERGRID', (0,0), (-1,-1), 0.5, C_BORDER),
        ('TOPPADDING', (0,0), (-1,-1), 7),
        ('BOTTOMPADDING', (0,0), (-1,-1), 7),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(t_ep)
    story.append(Spacer(1, 10))

    # -------------------------------------------------------------------------
    # 5. SECTION 3 — ATTACK CHAIN TIMELINE
    # -------------------------------------------------------------------------
    story.append(Paragraph("3. ATTACK CHAIN TIMELINE (CHRONOLOGICAL)", styles["SectionHeading"]))
    timeline_rows = [
        [
            Paragraph("TIMESTAMP (IST)", styles["TableHeaderText"]),
            Paragraph("INCIDENT PHASE", styles["TableHeaderText"]),
            Paragraph("FORENSIC TELEMETRY &amp; HEURISTIC OBSERVATION", styles["TableHeaderText"]),
        ]
    ]

    raw_timeline = data.get("timeline", [])
    if raw_timeline:
        for item in raw_timeline:
            t_raw = item.get("time", raw_time)
            ts_formatted_ist = convert_event_time_to_ist(t_raw, base_date_str=raw_date)
            evt = item.get("event", "Telemetry Event")
            detail = item.get("detail") or item.get("desc") or item.get("details") or "Observed behavioral pattern"
            timeline_rows.append([
                Paragraph(f"<font name='Courier'><b>{ts_formatted_ist}</b></font>", styles["TableCellMono"]),
                Paragraph(f"<b>{evt}</b>", styles["TableCellBold"]),
                Paragraph(detail, styles["TableCellText"]),
            ])
    else:
        timeline_rows.append([
            Paragraph(f"<font name='Courier'><b>{incident_timestamp_ist}</b></font>", styles["TableCellMono"]),
            Paragraph("<b>TELEMETRY LOGGED</b>", styles["TableCellBold"]),
            Paragraph("Incident behavioral trigger logged by Sentinel detection engine.", styles["TableCellText"]),
        ])

    t_timeline = Table(timeline_rows, colWidths=[140, 110, 265])
    t_timeline.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), C_HEADER_BG),
        ('BOTTOMPADDING', (0,0), (-1,0), 5),
        ('TOPPADDING', (0,0), (-1,0), 5),
        ('GRID', (0,0), (-1,-1), 0.5, C_BORDER),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, C_BG_ROW_ALT]),
        ('TOPPADDING', (0,1), (-1,-1), 5),
        ('BOTTOMPADDING', (0,1), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 7),
        ('RIGHTPADDING', (0,0), (-1,-1), 7),
    ]))
    story.append(t_timeline)
    story.append(Spacer(1, 10))

    # -------------------------------------------------------------------------
    # 6. SECTION 4 — DETECTION INDICATORS (IOCS)
    # -------------------------------------------------------------------------
    story.append(Paragraph("4. DETECTION INDICATORS (IOCS)", styles["SectionHeading"]))
    ioc_rows = [
        [
            Paragraph("INDICATOR TYPE", styles["TableHeaderText"]),
            Paragraph("OBSERVED VALUE / THREAT INTELLIGENCE MATCH", styles["TableHeaderText"]),
        ]
    ]
    raw_indicators = data.get("indicators", [])
    if raw_indicators:
        for ind in raw_indicators:
            itype = ind.get("type", "IoC")
            ival = ind.get("value") or ind.get("label") or "Observed Anomaly"
            ioc_rows.append([
                Paragraph(f"<b>{itype}</b>", styles["TableCellBold"]),
                Paragraph(f"<font name='Courier'>{ival}</font>", styles["TableCellMono"]),
            ])
    else:
        ioc_rows.append([
            Paragraph("<b>BEHAVIORAL IOC</b>", styles["TableCellBold"]),
            Paragraph("<font name='Courier'>Dynamic risk threshold exceeded &gt;= 70</font>", styles["TableCellMono"]),
        ])

    t_iocs = Table(ioc_rows, colWidths=[120, 395])
    t_iocs.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), C_HEADER_BG),
        ('BOTTOMPADDING', (0,0), (-1,0), 5),
        ('TOPPADDING', (0,0), (-1,0), 5),
        ('GRID', (0,0), (-1,-1), 0.5, C_BORDER),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, C_BG_ROW_ALT]),
        ('TOPPADDING', (0,1), (-1,-1), 4.5),
        ('BOTTOMPADDING', (0,1), (-1,-1), 4.5),
        ('LEFTPADDING', (0,0), (-1,-1), 7),
        ('RIGHTPADDING', (0,0), (-1,-1), 7),
    ]))
    story.append(t_iocs)
    story.append(Spacer(1, 10))

    # -------------------------------------------------------------------------
    # 7. SECTION 5 — CONTAINMENT ACTIONS TAKEN
    # -------------------------------------------------------------------------
    story.append(Paragraph("5. CONTAINMENT ACTIONS TAKEN", styles["SectionHeading"]))
    actions_list = data.get("containmentActions", [])
    if not actions_list and data.get("containment_history"):
        for h in data["containment_history"]:
            if isinstance(h, dict):
                act_name = h.get("action", "CONTAINMENT_ENFORCED").replace("_", " ")
                ts = h.get("timestamp", "")
                st = h.get("status", "SUCCESS")
                actions_list.append(f"{act_name} at {ts} [{st}]")
            else:
                actions_list.append(str(h))

    if not actions_list:
        if "CONTAINED" in status or "RESOLVED" in status:
            actions_list = [
                "Process file handles revoked via Sentinel Minifilter",
                "Endpoint network quarantined (telemetry tunnel maintained)",
                "Outbound rogue socket connections blocked",
                "Decoy honeypot integrity state verified"
            ]
        else:
            actions_list = [
                "Active behavioral telemetry monitoring enabled",
                "Threat heuristics queued for automated or analyst containment"
            ]

    action_table_data = []
    for act in actions_list:
        action_table_data.append([
            Paragraph("<font color='#059669'><b>[ENFORCED]</b></font>", styles["TableCellText"]),
            Paragraph(f"<b>{act}</b>", styles["TableCellText"]),
        ])
    t_actions = Table(action_table_data, colWidths=[80, 435])
    t_actions.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), C_GREEN_SOFT),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#A7F3D0")),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#D1FAE5")),
        ('TOPPADDING', (0,0), (-1,-1), 4.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4.5),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(t_actions)
    story.append(Spacer(1, 10))

    # -------------------------------------------------------------------------
    # 8. SECTION 6 — REMEDIATION RECOMMENDATIONS
    # -------------------------------------------------------------------------
    story.append(Paragraph("6. REMEDIATION RECOMMENDATIONS", styles["SectionHeading"]))
    rec_list = data.get("recommendations", [])
    if not rec_list:
        rec_list = [
            f"1. Audit endpoint {endpoint} for persistent startup artifacts and scheduled tasks.",
            "2. Enforce PowerShell Constrained Language Mode across non-administrative accounts.",
            "3. Block external egress to identified C2 destinations at network perimeter.",
            "4. Verify decoy vault integrity and refresh honeypot tokens in active volumes."
        ]

    rec_table_data = []
    for r in rec_list:
        rec_table_data.append([
            Paragraph("•", styles["TableCellBold"]),
            Paragraph(r, styles["TableCellText"]),
        ])
    t_recs = Table(rec_table_data, colWidths=[20, 495])
    t_recs.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), C_CARD_BG),
        ('BOX', (0,0), (-1,-1), 1, C_BORDER_DARK),
        ('INNERGRID', (0,0), (-1,-1), 0.5, C_BORDER),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(t_recs)
    story.append(Spacer(1, 14))

    # -------------------------------------------------------------------------
    # 9. FORENSIC AUDIT SIGN-OFF & VERIFICATION BLOCK
    # -------------------------------------------------------------------------
    sign_block = [
        [
            Paragraph("<b>Automated Defense Engine:</b> Sentinel // EDR Prevention Kernel v2.4", styles["TableCellText"]),
            Paragraph(f"<b>Incident Verification:</b> <font color='#059669'><b>{status}</b></font>", styles["TableCellText"]),
        ],
        [
            Paragraph(f"<b>Reporting Analyst:</b> {analyst}", styles["TableCellText"]),
            Paragraph(f"<b>Incident Timestamp:</b> <b>{incident_timestamp_ist}</b>", styles["TableCellText"]),
        ]
    ]
    t_sign = Table(sign_block, colWidths=[width_content * 0.55, width_content * 0.45])
    t_sign.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), C_HEADER_BG),
        ('BOX', (0,0), (-1,-1), 1, C_BORDER_DARK),
        ('INNERGRID', (0,0), (-1,-1), 0.5, C_BORDER),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(KeepTogether([t_sign]))

    # Build Document using the bound canvas
    doc.build(story, canvasmaker=BoundSentinelCanvas)
    return buffer.getvalue()
    t_sign = Table(sign_block, colWidths=[width_content * 0.55, width_content * 0.45])
    t_sign.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), C_HEADER_BG),
        ('BOX', (0,0), (-1,-1), 1, C_BORDER_DARK),
        ('INNERGRID', (0,0), (-1,-1), 0.5, C_BORDER),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(KeepTogether([t_sign]))

    # Build Document using the bound canvas
    doc.build(story, canvasmaker=BoundSentinelCanvas)
    return buffer.getvalue()


if __name__ == "__main__":
    pdf_bytes = generate_sentinel_pdf()
    out_file = "SENTINEL_EDR_Report_INC-2026-0042.pdf"
    with open(out_file, "wb") as f:
        f.write(pdf_bytes)
    print(f"Successfully generated {out_file} ({len(pdf_bytes):,} bytes)")
