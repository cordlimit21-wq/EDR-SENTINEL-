import React, { useState } from 'react';
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
  Award,
  Sparkles
} from 'lucide-react';

export default function ReportsView({ theme = 'dark' }) {
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfSuccess, setPdfSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const reportData = {
    incidentId: "INC-2026-0042",
    title: "Zero-Day Ransomware Behavioral Burst & Quarantine",
    date: "10/08/2026",
    time: "09:41:25 UTC",
    timestamp: "10/08/2026, 09:41:25 UTC",
    severity: "CRITICAL",
    riskScore: "94 / 100",
    finalStatus: "CONTAINED (Quarantine Enforced)",
    endpoint: "WS-FINANCE-01",
    ip: "10.0.1.21",
    os: "Windows 11 Pro 23H2",
    mac: "00:50:56:A1:B2:C1",
    analyst: "SOC Lead Analyst & Sentinel Behavioral Kernel",
    executiveSummary: "At 09:41:02 UTC, Sentinel EDR intercepted a multi-stage zero-day ransomware attack attempting rapid in-place encryption across user documents and decoy honeytokens on WS-FINANCE-01. The rogue process (PID 4312) exhibited an anomalous rename velocity of 1,823 ops/min and surge in Shannon byte entropy to H=7.82. Within 11 milliseconds of touching Canary Trap TRAP-002, Sentinel's minifilter driver revoked the process file handles and placed the endpoint into an isolated network boundary. Zero corporate data was encrypted or exfiltrated.",
    timeline: [
      { time: "09:41:02", event: "Process Spawn", detail: "PID 4312 (svchost_suspicious.exe) executed via PowerShell" },
      { time: "09:41:07", event: "File Burst", detail: "1,823 file read/write operations/min detected in EDR_Test" },
      { time: "09:41:12", event: "Rename Velocity Spike", detail: "Batch alteration (.locked extension appended)" },
      { time: "09:41:16", event: "Entropy Anomaly", detail: "Shannon entropy H = 7.82 observed on honeypot file" },
      { time: "09:41:21", event: "Risk Escalation", detail: "Dynamic composite score escalated to 78/100" },
      { time: "09:41:25", event: "Tripwire Hit & Containment", detail: "Canary TRAP-002 accessed. Score 94/100. Host isolated." },
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

  const handleExportJson = () => {
    const jsonStr = JSON.stringify(reportData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SENTINEL_INCIDENT_REPORT_${reportData.incidentId}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  const handleGeneratePdf = async () => {
    setIsGeneratingPdf(true);
    setErrorMessage(null);
    setPdfSuccess(false);

    try {
      // 1. Try fetching via API route
      let response;
      try {
        response = await fetch(`/api/reports/${reportData.incidentId}/pdf`);
      } catch (e) {
        // Fallback to absolute backend origin if proxy not active
        response = await fetch(`http://localhost:8000/api/reports/${reportData.incidentId}/pdf`);
      }

      if (!response.ok) {
        // Fallback to POST with current report state payload
        const postResp = await fetch('/api/reports/generate-pdf', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(reportData)
        }).catch(() => fetch('http://localhost:8000/api/reports/generate-pdf', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(reportData)
        }));

        if (!postResp || !postResp.ok) {
          throw new Error(`Report generation failed: HTTP ${postResp ? postResp.status : 'No response'}`);
        }
        response = postResp;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `SENTINEL_EDR_Report_${reportData.incidentId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setPdfSuccess(true);
      setTimeout(() => setPdfSuccess(false), 4500);
    } catch (err) {
      console.error('Error generating PDF report:', err);
      setErrorMessage(err.message || 'Failed to generate PDF. Verify backend is running on port 8000.');
      setTimeout(() => setErrorMessage(null), 6000);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/[0.08] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-orange-500 font-bold uppercase tracking-widest">INCIDENT POST-MORTEM & AUDIT</span>
            <span className="text-slate-400">•</span>
            <span className="text-xs font-mono text-slate-500">REPORT NO: {reportData.incidentId}</span>
          </div>
          <h2 className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1">
            EXECUTIVE FORENSIC REPORT
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Behavioral analysis, Shannon byte entropy telemetry, canary tripwires & kernel containment audit.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
          {/* Primary Action: Download Incident Forensic PDF Report */}
          <button
            onClick={handleGeneratePdf}
            disabled={isGeneratingPdf}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-bold transition-all shadow-lg ${
              isGeneratingPdf 
                ? 'bg-orange-600/70 cursor-not-allowed opacity-80' 
                : 'bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 hover:from-orange-600 hover:to-amber-700 shadow-orange-500/25 active:scale-95'
            }`}
            title="Download incident forensic PDF report (INC-2026-0042)"
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
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-white/[0.08] transition-colors"
            title="Export raw JSON incident structure"
          >
            <Download className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span>EXPORT JSON</span>
          </button>

          {/* Tertiary Action: Print View */}
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-white/[0.08] transition-colors"
            title="Print current page"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span>PRINT</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {pdfSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs flex items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span><b>Success:</b> Incident report PDF downloaded as <code>SENTINEL_EDR_Report_{reportData.incidentId}.pdf</code>.</span>
          </div>
          <span className="text-[10px] text-emerald-500/80 uppercase tracking-widest font-bold">INC-2026-0042</span>
        </div>
      )}

      {downloadSuccess && (
        <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-xs flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Incident report exported successfully as raw JSON.</span>
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
            className="underline hover:text-white font-bold ml-2 shrink-0"
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
              {reportData.title}
            </h3>
            <div className="text-slate-400 text-xs mt-1">
              Incident ID: <span className="font-bold text-slate-900 dark:text-white">{reportData.incidentId}</span> • Incident Timestamp: <span className="font-bold text-slate-900 dark:text-white">{reportData.timestamp}</span>
            </div>
          </div>

          <div className="text-right">
            <span className="inline-block px-3 py-1 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40 font-bold text-xs">
              {reportData.severity}
            </span>
            <div className="text-[11px] text-emerald-400 font-bold mt-2">
              {reportData.finalStatus}
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
            {reportData.executiveSummary}
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
              <div className="font-bold text-slate-900 dark:text-white mt-0.5">{reportData.endpoint}</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/[0.06]">
              <span className="text-[10px] text-slate-400 uppercase">IP ADDRESS</span>
              <div className="font-bold text-slate-900 dark:text-white mt-0.5">{reportData.ip}</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/[0.06]">
              <span className="text-[10px] text-slate-400 uppercase">OPERATING SYSTEM</span>
              <div className="font-bold text-slate-900 dark:text-white mt-0.5">{reportData.os}</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/[0.06]">
              <span className="text-[10px] text-slate-400 uppercase">COMPOSITE RISK</span>
              <div className="font-bold text-rose-500 mt-0.5">{reportData.riskScore}</div>
            </div>
          </div>
        </div>

        {/* 3. Chronological Attack Timeline */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-4 h-4 text-orange-500" />
            <span>3. ATTACK CHAIN TIMELINE</span>
          </h4>
          <div className="space-y-2">
            {reportData.timeline.map((item, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/[0.06] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-slate-400 font-bold">{reportData.date} {item.time} UTC</span>
                  <span className="font-bold text-slate-900 dark:text-white">{item.event}</span>
                  <span className="text-slate-600 dark:text-slate-400 font-sans">• {item.detail}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Detection Indicators */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            4. DETECTION INDICATORS (IOCS)
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {reportData.indicators.map((ind, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/[0.06]">
                <span className="text-[10px] text-slate-400 uppercase block">{ind.type}</span>
                <span className="font-bold text-slate-900 dark:text-white mt-0.5 truncate block">{ind.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Containment Actions Taken */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            5. CONTAINMENT ACTIONS TAKEN
          </h4>
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-1.5 text-emerald-400">
            {reportData.containmentActions.map((act, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{act}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 6. Strategic Recommendations */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            6. REMEDIATION RECOMMENDATIONS
          </h4>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/[0.06] space-y-2 text-slate-700 dark:text-slate-300 font-sans">
            {reportData.recommendations.map((rec, idx) => (
              <div key={idx}>
                {rec}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
