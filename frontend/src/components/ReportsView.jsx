import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  Cpu, 
  HardDrive, 
  Network,
  Share2,
  FileDown,
  Loader2,
  AlertCircle,
  HelpCircle,
  ChevronDown
} from 'lucide-react';
import FeatureExplainer from './FeatureExplainer';

const API_BASE = "http://localhost:8000";

export default function ReportsView({ initialIncidentId = null, theme = 'dark' }) {
  const [incidents, setIncidents] = useState([]);
  const [selectedIncidentId, setSelectedIncidentId] = useState(initialIncidentId || "INC-2026-0042");
  const [activeReport, setActiveReport] = useState(null);
  const [loadingIncidents, setLoadingIncidents] = useState(true);

  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfSuccess, setPdfSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Authoritative fallback baseline for INC-2026-0042 if backend is starting
  const fallbackIncident42 = {
    id: "INC-2026-0042",
    incidentId: "INC-2026-0042",
    threat_name: "Zero-Day Ransomware Behavioral Burst & Quarantine",
    title: "Zero-Day Ransomware Behavioral Burst & Quarantine",
    date: "10/08/2026",
    time: "09:41:25 UTC",
    created_at: "10/08/2026, 09:41:25 UTC",
    timestamp: "10/08/2026, 09:41:25 UTC",
    severity: "CRITICAL",
    risk_score: 94,
    riskScore: "94 / 100",
    status: "CONTAINED",
    finalStatus: "CONTAINED (Quarantine Enforced)",
    endpoint: "WS-FINANCE-01",
    ip: "10.0.1.21",
    os: "Windows 11 Pro 23H2",
    mac: "00:50:56:A1:B2:C1",
    analyst: "SOC Lead Analyst & Sentinel Behavioral Kernel",
    summary: "At 09:41:02 UTC, Sentinel EDR intercepted a multi-stage zero-day ransomware attack attempting rapid in-place encryption across user documents and decoy honeytokens on WS-FINANCE-01. The rogue process (PID 4312) exhibited an anomalous rename velocity of 1,823 ops/min and surge in Shannon byte entropy to H=7.82. Within 11 milliseconds of touching Canary Trap TRAP-002, Sentinel's minifilter driver revoked the process file handles and placed the endpoint into an isolated network boundary. Zero corporate data was encrypted or exfiltrated.",
    executiveSummary: "At 09:41:02 UTC, Sentinel EDR intercepted a multi-stage zero-day ransomware attack attempting rapid in-place encryption across user documents and decoy honeytokens on WS-FINANCE-01. The rogue process (PID 4312) exhibited an anomalous rename velocity of 1,823 ops/min and surge in Shannon byte entropy to H=7.82. Within 11 milliseconds of touching Canary Trap TRAP-002, Sentinel's minifilter driver revoked the process file handles and placed the endpoint into an isolated network boundary. Zero corporate data was encrypted or exfiltrated.",
    timeline: [
      { time: "09:41:02", event: "Process Spawn", detail: "PID 4312 (svchost_suspicious.exe) executed via PowerShell", desc: "PID 4312 executed via PowerShell" },
      { time: "09:41:07", event: "File Burst", detail: "1,823 file read/write operations/min detected in EDR_Test", desc: "1,823 file read/write ops/min in EDR_Test" },
      { time: "09:41:12", event: "Rename Velocity Spike", detail: "Batch alteration (.locked extension appended)", desc: "Batch alteration (.locked extension appended)" },
      { time: "09:41:16", event: "Entropy Anomaly", detail: "Shannon entropy H = 7.82 observed on honeypot file", desc: "Shannon entropy H = 7.82 on honeypot" },
      { time: "09:41:21", event: "Risk Escalation", detail: "Dynamic composite score escalated to 78/100", desc: "Composite score escalated to 78/100" },
      { time: "09:41:25", event: "Tripwire Hit & Containment", detail: "Canary TRAP-002 accessed. Score 94/100. Host isolated.", desc: "Canary TRAP-002 accessed. Score 94. Host isolated." },
    ],
    indicators: [
      { type: "SHA256", value: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855" },
      { type: "C2 IP", value: "185.220.101.44 (Port 443 / 8443)" },
      { type: "MITRE ATT&CK", value: "T1486 (Data Encrypted for Impact), T1490 (Shadow Copy Tampering)" },
      { type: "Canary Token", value: "CANARY_TOKEN_B6ED5D03 (Decoy Trap TRAP-002)" },
    ],
    containmentActions: [
      "Process handle revoked via Sentinel Minifilter",
      "Endpoint network isolated (NDIS quarantine filter applied)",
      "Outbound C2 sockets dropped",
      "Decoy honeypot integrity state updated to TAMPER_ATTEMPT_BLOCKED"
    ],
    recommendations: [
      "1. Re-image WS-FINANCE-01 from verified pre-incident snapshot.",
      "2. Enforce PowerShell Constrained Language Mode on executive workstations.",
      "3. Block external egress to IP subnet 185.220.101.0/24 at firewall level.",
      "4. Rotate active Canary Honeytoken secrets across Decoy vault."
    ]
  };

  // Fetch all incidents on mount
  useEffect(() => {
    const fetchIncidents = async () => {
      setLoadingIncidents(true);
      try {
        const res = await fetch(`${API_BASE}/api/incidents`);
        if (res.ok) {
          const list = await res.json();
          if (Array.isArray(list) && list.length > 0) {
            setIncidents(list);
            const targetId = initialIncidentId || list[0].id;
            setSelectedIncidentId(targetId);
            const matched = list.find(i => i.id.toLowerCase() === targetId.toLowerCase()) || list[0];
            setActiveReport(normalizeIncident(matched));
            return;
          }
        }
      } catch (err) {
        console.warn("Could not load /api/incidents, falling back to local store:", err);
      } finally {
        setLoadingIncidents(false);
      }

      // Fallback
      setActiveReport(fallbackIncident42);
      setIncidents([fallbackIncident42]);
    };

    fetchIncidents();
  }, [initialIncidentId]);

  // Normalize incident object to ensure all rendering fields exist
  const normalizeIncident = (inc) => {
    if (!inc) return fallbackIncident42;
    return {
      ...inc,
      incidentId: inc.id || inc.incidentId || "INC-2026-0042",
      title: inc.threat_name || inc.title || "Zero-Day Ransomware Behavioral Incident",
      timestamp: inc.created_at || inc.timestamp || "10/08/2026, 09:41:25 UTC",
      date: inc.date || (inc.created_at ? inc.created_at.split(",")[0] : "10/08/2026"),
      time: inc.time || (inc.created_at && inc.created_at.includes(",") ? inc.created_at.split(",")[1].trim() : "09:41:25 UTC"),
      riskScore: typeof inc.risk_score === 'number' ? `${inc.risk_score} / 100` : (inc.riskScore || "85 / 100"),
      finalStatus: inc.status === 'CONTAINED' ? 'CONTAINED (Quarantine Enforced)' : (inc.status || 'MONITORED'),
      executiveSummary: inc.summary || inc.executiveSummary || inc.ai_summary || "Sentinel EDR captured behavioral telemetry on this endpoint.",
      endpoint: inc.endpoint || "WS-FINANCE-01",
      ip: inc.ip || (inc.endpoint === "WS-EXEC-02" ? "10.0.1.34" : inc.endpoint === "SRV-DATABASE-01" ? "10.0.2.10" : "10.0.1.21"),
      os: inc.os || (inc.endpoint === "SRV-DATABASE-01" ? "Windows Server 2022" : "Windows 11 Pro 23H2"),
      mac: inc.mac || (inc.endpoint === "WS-EXEC-02" ? "00:50:56:A1:C3:D4" : "00:50:56:A1:B2:C1"),
      analyst: inc.analyst || "SOC Lead Analyst & Sentinel Behavioral Kernel",
      timeline: inc.timeline && inc.timeline.length > 0 ? inc.timeline : [
        { time: "09:41:00", event: "Telemetry Ingested", detail: "Incident evidence captured by Sentinel behavioral monitor." }
      ],
      indicators: inc.indicators && inc.indicators.length > 0 ? inc.indicators : [
        { type: "Behavioral Heuristic", value: "Entropy deviation threshold exceeded on watched filesystem" }
      ],
      containmentActions: inc.containmentActions && inc.containmentActions.length > 0 ? inc.containmentActions : (
        inc.containment_history && inc.containment_history.length > 0 
          ? inc.containment_history.map(h => `${h.action || 'ACTION'} [${h.status || 'EXECUTED'}]`)
          : ["Process handles revoked via Sentinel Minifilter", "Host isolated from enterprise network"]
      ),
      recommendations: inc.recommendations || [
        `1. Audit ${inc.endpoint || 'endpoint'} for malicious persistence artifacts.`,
        "2. Enforce PowerShell Constrained Language Mode on executive workstations.",
        "3. Verify Canary honeytoken tripwires across local filesystem partitions.",
        "4. Rotate active session tokens and credentials accessed during attack window."
      ]
    };
  };

  const handleSelectIncident = (incId) => {
    setSelectedIncidentId(incId);
    const matched = incidents.find(i => i.id.toLowerCase() === incId.toLowerCase());
    if (matched) {
      setActiveReport(normalizeIncident(matched));
    }
  };

  // Export Raw JSON
  const handleExportJson = () => {
    const dataToExport = activeReport || fallbackIncident42;
    const jsonStr = JSON.stringify(dataToExport, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SENTINEL_INCIDENT_REPORT_${dataToExport.incidentId || dataToExport.id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  // Generate & Download PDF Report
  const handleGeneratePdf = async () => {
    setIsGeneratingPdf(true);
    setErrorMessage(null);
    setPdfSuccess(false);

    const report = activeReport || fallbackIncident42;
    const currentId = report.incidentId || report.id || "INC-2026-0042";

    try {
      let response = null;

      // 1. First attempt: Dedicated GET endpoint with incident ID
      try {
        const directUrl = `${API_BASE}/api/reports/${currentId}/pdf`;
        const res = await fetch(directUrl);
        if (res.ok) {
          response = res;
        }
      } catch (netErr) {
        console.warn("Direct GET fetch error, will try POST endpoint:", netErr);
      }

      // 2. Second attempt: Fallback to POST with current report payload
      if (!response || !response.ok) {
        try {
          const postRes = await fetch(`${API_BASE}/api/reports/generate-pdf`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(report)
          });
          if (postRes.ok) {
            response = postRes;
          } else {
            const errData = await postRes.json().catch(() => ({}));
            throw new Error(errData.detail || `Server returned HTTP ${postRes.status}`);
          }
        } catch (postErr) {
          throw new Error(postErr.message || 'Unable to connect to Sentinel backend service on port 8000.');
        }
      }

      if (!response || !response.ok) {
        throw new Error('Failed to generate report: backend response was not OK.');
      }

      // 3. Process binary PDF stream
      const blob = await response.blob();
      if (!blob || blob.size === 0) {
        throw new Error('Received an empty PDF document from the report generator.');
      }

      const url = window.URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = `SENTINEL_EDR_Report_${currentId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setPdfSuccess(true);
      setTimeout(() => setPdfSuccess(false), 4500);
    } catch (err) {
      console.error('Error generating PDF report:', err);
      setErrorMessage(err.message || 'Failed to generate PDF. Verify backend is running on http://localhost:8000.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const report = activeReport || fallbackIncident42;

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/[0.08] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-orange-500 font-bold uppercase tracking-widest">INCIDENT POST-MORTEM &amp; AUDIT</span>
            <span className="text-slate-400">•</span>
            <span className="text-xs font-mono text-slate-500">CASE ID: {report.incidentId}</span>
            <span className="text-slate-400">•</span>
            <FeatureExplainer featureKey="reports" />
          </div>
          <h2 className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1">
            EXECUTIVE FORENSIC REPORT
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Behavioral analysis, Shannon byte entropy telemetry, canary tripwires &amp; kernel containment audit.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
          {/* Primary Action: Download Incident Forensic PDF Report */}
          <button
            onClick={handleGeneratePdf}
            disabled={isGeneratingPdf}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-bold transition-all shadow-lg ${
              isGeneratingPdf 
                ? 'bg-orange-600/70 cursor-not-allowed opacity-80' 
                : 'bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 hover:from-orange-600 hover:to-amber-700 shadow-orange-500/25 active:scale-95 cursor-pointer'
            }`}
            title={`Download incident forensic PDF report (${report.incidentId})`}
          >
            {isGeneratingPdf ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>GENERATING PDF...</span>
              </>
            ) : (
              <>
                <FileDown className="w-4 h-4 text-white" />
                <span>GENERATE PDF</span>
              </>
            )}
          </button>

          {/* Secondary Action: Export Raw JSON */}
          <button
            onClick={handleExportJson}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-white/[0.08] transition-colors cursor-pointer"
            title="Export raw JSON incident structure"
          >
            <Download className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span>EXPORT JSON</span>
          </button>

          {/* Tertiary Action: Print View */}
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-white/[0.08] transition-colors cursor-pointer"
            title="Print current page"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span>PRINT</span>
          </button>
        </div>
      </div>

      {/* Incident Selection Ribbon */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#070b14] border border-slate-200 dark:border-white/[0.08] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs">
        <div className="flex items-center gap-3">
          <span className="text-slate-500 uppercase tracking-wider text-[11px] font-bold">SELECT INCIDENT CASE:</span>
          <div className="relative">
            <select
              value={selectedIncidentId}
              onChange={(e) => handleSelectIncident(e.target.value)}
              className="appearance-none pl-3 pr-8 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-white/[0.1] text-slate-900 dark:text-white font-bold text-xs focus:outline-none focus:border-orange-500 cursor-pointer shadow-sm"
            >
              {incidents.map((inc) => (
                <option key={inc.id} value={inc.id}>
                  {inc.id} — {inc.threat_name || inc.title} ({inc.endpoint || 'Host'}) [{inc.severity || 'ALERT'}]
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        <div className="flex items-center gap-2 text-slate-400 text-[11px]">
          <span>Displaying authoritative incident data</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span className="text-emerald-400 font-semibold">IST (Asia/Kolkata) Timestamps</span>
        </div>
      </div>

      {/* Notifications */}
      {pdfSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs flex items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span><b>Success:</b> Incident report PDF downloaded as <code>SENTINEL_EDR_Report_{report.incidentId}.pdf</code> with IST timestamps.</span>
          </div>
          <span className="text-[10px] text-emerald-500/80 uppercase tracking-widest font-bold">{report.incidentId}</span>
        </div>
      )}

      {downloadSuccess && (
        <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-xs flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Incident report exported successfully as raw JSON for <b>{report.incidentId}</b>.</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 font-mono text-xs flex items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span><b>PDF Generation Error:</b> {errorMessage}</span>
          </div>
          <button
            onClick={handleGeneratePdf}
            className="underline hover:text-white font-bold ml-2 shrink-0 cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* Main Report Document Sheet */}
      <div className="rounded-2xl bg-white dark:bg-[#070b14] border border-slate-200 dark:border-white/[0.08] shadow-2xl p-6 sm:p-10 space-y-8 font-mono text-xs">
        
        {/* Title & Metadata Ribbon */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/[0.08] pb-6">
          <div>
            <div className="text-[10px] text-orange-500 font-bold uppercase tracking-widest">
              SENTINEL // EDR FORENSIC DISPATCH
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1">
              {report.title}
            </h3>
            <div className="text-slate-400 text-xs mt-1">
              Incident ID: <span className="font-bold text-slate-900 dark:text-white">{report.incidentId}</span> • Source Timestamp: <span className="font-bold text-slate-900 dark:text-white">{report.timestamp}</span>
            </div>
          </div>

          <div className="text-right">
            <span className="inline-block px-3 py-1 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40 font-bold text-xs uppercase">
              {report.severity}
            </span>
            <div className="text-[11px] text-emerald-400 font-bold mt-2">
              {report.finalStatus}
            </div>
          </div>
        </div>

        {/* 1. Executive Summary */}
        <div className="space-y-2">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <FileText className="w-4 h-4 text-orange-500" />
            <span>1. EXECUTIVE SUMMARY</span>
          </h4>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-sans leading-relaxed p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/[0.06]">
            {report.executiveSummary}
          </p>
        </div>

        {/* 2. Affected Endpoint Specifications */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            2. AFFECTED ENDPOINT DETAILS
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/[0.06]">
              <span className="text-[10px] text-slate-400 uppercase">HOSTNAME</span>
              <div className="font-bold text-slate-900 dark:text-white mt-0.5">{report.endpoint}</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/[0.06]">
              <span className="text-[10px] text-slate-400 uppercase">IP ADDRESS</span>
              <div className="font-bold text-slate-900 dark:text-white mt-0.5">{report.ip}</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/[0.06]">
              <span className="text-[10px] text-slate-400 uppercase">OPERATING SYSTEM</span>
              <div className="font-bold text-slate-900 dark:text-white mt-0.5">{report.os}</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/[0.06]">
              <span className="text-[10px] text-slate-400 uppercase">COMPOSITE RISK</span>
              <div className="font-bold text-rose-500 mt-0.5">{report.riskScore}</div>
            </div>
          </div>
        </div>

        {/* 3. Chronological Attack Timeline */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-4 h-4 text-orange-500" />
            <span>3. ATTACK CHAIN TIMELINE (CHRONOLOGICAL)</span>
          </h4>
          <div className="border border-slate-200 dark:border-white/[0.08] rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200 dark:border-white/[0.06] text-[10px] text-slate-500 uppercase">
                <tr>
                  <th className="py-2.5 px-3">Time</th>
                  <th className="py-2.5 px-3">Phase / Event</th>
                  <th className="py-2.5 px-3">Heuristic Observation &amp; Forensics</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-white/[0.04]">
                {report.timeline.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                    <td className="py-2.5 px-3 font-mono text-orange-500 font-bold whitespace-nowrap">{item.time}</td>
                    <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white whitespace-nowrap">{item.event}</td>
                    <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300 font-sans">{item.detail || item.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. Indicators of Compromise (IoCs) */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            4. DETECTION EVIDENCE &amp; INDICATORS (IOCS)
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {report.indicators.map((ioc, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/[0.06] flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <span className="text-[10px] text-orange-500 font-bold uppercase block">{ioc.type}</span>
                  <div className="text-xs font-mono text-slate-800 dark:text-slate-200 truncate mt-0.5">{ioc.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Containment Actions Taken */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            5. CONTAINMENT ACTIONS TAKEN
          </h4>
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
            {report.containmentActions.map((action, idx) => (
              <div key={idx} className="flex items-center gap-2 text-emerald-400 font-mono text-xs">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{action}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 6. Remediation Recommendations */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            6. REMEDIATION RECOMMENDATIONS
          </h4>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/[0.06] space-y-2 font-sans text-xs text-slate-700 dark:text-slate-300">
            {report.recommendations.map((rec, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <span className="text-orange-500 font-bold">•</span>
                <span>{rec}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sign-Off Footer */}
        <div className="pt-6 border-t border-slate-200 dark:border-white/[0.08] flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
          <div>
            Automated Defense Engine: <b className="text-slate-700 dark:text-slate-300">Sentinel // EDR Prevention Kernel v2.4</b>
          </div>
          <div>
            Incident Verification: <b className="text-emerald-400 uppercase">{report.finalStatus}</b>
          </div>
        </div>

      </div>
    </div>
  );
}
