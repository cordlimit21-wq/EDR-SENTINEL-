import React, { useState, useRef, useEffect } from 'react';
import { HelpCircle, X, Shield, Info, Database, Clock, Sparkles } from 'lucide-react';

export const FEATURE_GUIDES = {
  "overview": {
    title: "Executive Overview & SOC Dashboard",
    what: "Provides a high-level operational summary of your protected endpoints, intercepted threats, honeypot decoy integrity, and real-time behavioral risk scores.",
    how: "Pulls real-time metrics over a WebSocket connection from the Python FastAPI backend on port 8000. It computes overall fleet risk by correlating filesystem activity in EDR_Test/ with active endpoint telemetry.",
    when: "Check this first at the start of your shift or demonstration to see if any system requires urgent investigation or containment.",
    why: "Gives immediate situational awareness without overwhelming you with raw log entries, allowing fast triage of high-risk workstations.",
    status: "LIVE + SIMULATED (WebSocket stream connected to local EDR_Test/ monitor and simulated fleet nodes)"
  },
  "live-activity": {
    title: "Live Activity & Filesystem Stream",
    what: "Streams every file creation, modification, deletion, and process event happening across monitored folders in chronological order.",
    how: "Uses the Python watchfiles library to listen for kernel-level filesystem events inside the EDR_Test/ folder. As files change, the backend measures Shannon byte entropy and pushes events live over WebSockets.",
    when: "Open this when you suspect an attack is currently unfolding and want to watch file I/O operations in real time.",
    why: "Ransomware attacks alter dozens or hundreds of files per second. Watching the stream lets you catch velocity spikes and unauthorized batch renames early.",
    status: "LIVE (Real-time NTFS file changes in EDR_Test/ pushed instantly via WebSocket)"
  },
  "threat-detection": {
    title: "Behavioral Threat Detection",
    what: "Highlights specific behavioral warning signs (heuristics) that suggest malicious activity, such as rapid file renaming, high entropy file writes, or decoy file tampering.",
    how: "Instead of looking for traditional virus signatures, Sentinel evaluates behavioral indicators against configurable thresholds (e.g., Shannon entropy H >= 7.00, write burst > 15 files/sec). A dynamic risk score from 0 to 100 is calculated.",
    when: "Review this when an alert sounds or when the risk gauge rises above normal baseline levels.",
    why: "Zero-day ransomware uses novel code that antivirus signatures cannot recognize. Detecting malicious behavior stops ransomware even before it has a public signature. Note: A single indicator is not proof of ransomware; Sentinel looks for multiple correlated vectors.",
    status: "LIVE ENGINE (BehaviorEngine evaluates real entropy and velocity on monitored filesystem)"
  },
  "threat-hunting": {
    title: "Threat Hunting Workspace",
    what: "Provides a searchable search-and-filter workspace to query raw telemetry events by process name, PID, file extension, event type, or risk severity.",
    how: "Queries in-memory telemetry buffers and past forensic snapshots. You can filter by severity (CRITICAL, WARNING, INFO) or action taken (PROCESS_FORCE_TERMINATED, DECOY_ACCESSED, FILE_MODIFIED).",
    when: "Use this during an active investigation when you need to know which process touched a specific file path or which PID triggered a risk elevation.",
    why: "Threat hunting allows an analyst to proactively uncover stealthy attacker behavior that may not yet have triggered an automated block rule.",
    status: "HYBRID (In-memory telemetry buffer populated by live events and past attack snapshots)"
  },
  "processes": {
    title: "Active Process Monitoring",
    what: "Lists active system and background processes, showing their process ID (PID), executable name, CPU usage, and current execution status.",
    how: "A process is an actively running computer program. Sentinel tracks processes that interact with monitored storage volumes and checks their integrity status and privileges.",
    when: "Check this list when an alert identifies a suspicious process name (like svchost_suspicious.exe or an unexpected powershell.exe instance).",
    why: "Ransomware usually runs as a hidden or masquerading process. Identifying the rogue PID allows the EDR system to target and terminate only the attacker without crashing the entire operating system.",
    status: "SIMULATED / PROTOTYPE (Process lineage and tracking model for test demonstration)"
  },
  "process-lineage": {
    title: "Parent-Child Process Lineage",
    what: "Displays an interactive tree showing parent-child process relationships (which program launched another program).",
    how: "When a program executes a sub-command (for example, Microsoft Word spawning cmd.exe or powershell.exe), an execution chain is recorded. Sentinel maps this hierarchy into a visual tree with risk flags on rogue child nodes.",
    when: "Open this immediately after identifying a malicious process to find the initial compromise vector (patient zero).",
    why: "Legitimate processes rarely spawn command shells to write encrypted files. Process lineage helps analysts prove whether a script was launched by a compromised user document, phishing macro, or unauthorized script cradle.",
    status: "FORENSIC GRAPH (Constructed from attack chain timeline and test execution logs)"
  },
  "canary-vault": {
    title: "Canary / Decoy Honeypot Vault",
    what: "Manages hidden decoy honeypot files strategically placed throughout directory paths. If ransomware tries to encrypt them, an instant silent alarm is tripped.",
    how: "Real decoy files (such as financial_report.docx and confidential.txt in EDR_Test/Decoy/) are monitored with filesystem hooks. Ransomware typically scans directories alphabetically or recursively and encrypts decoys before reaching user data.",
    when: "Inspect the vault to verify that your decoy tripwires are armed (INTACT) and to audit which decoys have been probed or altered.",
    why: "Legitimate users have no reason to modify hidden honeypot files. Any unauthorized modification to a canary file is one of the highest-confidence behavioral indicators of automated ransomware.",
    status: "LIVE + EXTENDED (Live kernel hooks on EDR_Test/Decoy/ + extended simulated multi-volume fleet)"
  },
  "threat-history": {
    title: "Threat & Incident History Archive",
    what: "Archives previous security incidents, past containment actions, and historical attack simulations for long-term review.",
    how: "Stores chronological case snapshots with root-cause summaries, detection vectors, timestamps, and resolution states.",
    when: "Open this to review past security trends, compare repeated attack patterns, or prepare audit compliance reports.",
    why: "Understanding how previous attacks attempted infiltration helps engineers tune heuristic thresholds and evaluate defense effectiveness over time.",
    status: "HISTORICAL ARCHIVE (Loaded from backend case store and incident JSON records)"
  },
  "simulation-lab": {
    title: "Safe Threat Simulation Lab",
    what: "Lets you safely simulate ransomware-like actions (rapid file writes, high entropy data generation, decoy file access) in a strictly controlled sandbox.",
    how: "Executes safe test generators that write benign pseudorandom data strictly inside the EDR_Test/ folder. No real ransomware code or real malware is used, ensuring complete host system safety.",
    when: "Use this during demonstrations, testing, or academic evaluations to verify that Sentinel's heuristic triggers, risk scoring, and containment hooks respond within milliseconds.",
    why: "Testing security systems against real malware on production machines is dangerous. The simulation lab provides safe, repeatable, zero-destructive validation of detection logic.",
    status: "CONTROLLED SANDBOX (Safe Python test generator writing benign test files to EDR_Test/)"
  },
  "reports": {
    title: "Incident Forensic Reports & PDF Generation",
    what: "Generates and downloads official, publication-quality PDF incident forensic reports formatted with Indian Standard Time (Asia/Kolkata, IST, UTC+05:30) timestamps.",
    how: "Extracts authoritative case evidence (incident ID, affected endpoint, Shannon entropy levels, attack timeline, detection indicators, and response status) and renders an enterprise PDF via ReportLab. You can also export raw JSON.",
    when: "Generate a report immediately following an incident investigation to archive digital evidence for post-mortem reviews, management briefings, or academic evaluations.",
    why: "Legal and compliance regulations require immutable, timestamped documentation of security incidents, root cause discoveries, and containment timelines.",
    status: "FUNCTIONAL PDF ENGINE (ReportLab backend generation with timezone-converted IST timestamps)"
  },
  "endpoints": {
    title: "Endpoint Fleet Management",
    what: "Displays an inventory of all protected workstations and servers, their current operational state (ONLINE, ISOLATED, OFFLINE), IP addresses, and dynamic risk scores.",
    how: "Tracks heartbeats and network connectivity state. In this prototype, isolating an endpoint updates its status in the SOC console and triggers simulated network boundary locks.",
    when: "Check this view to locate compromised host machines or verify that an isolated computer has been successfully released back to the corporate LAN.",
    why: "Ransomware spreads rapidly across local networks. Quickly identifying and cordoning off a compromised computer prevents lateral movement to database servers.",
    status: "PROTOTYPE FLEET (Local machine connection + simulated multi-workstation enterprise inventory)"
  },
  "containment": {
    title: "Response & Automated Containment",
    what: "Provides an active response dashboard to execute mitigation actions: isolating endpoints, killing rogue processes, dropping C2 network connections, and resolving incident tickets.",
    how: "In this prototype, clicking an action updates the incident status, dispatches WebSocket events, and records the action in the forensic audit log. Low-level Windows kernel driver detachment is simulated for developer safety.",
    when: "Use this when an analyst confirms an active threat and needs to manually isolate the host or terminate a rogue PID before data damage occurs.",
    why: "Rapid containment is the difference between losing a few decoy files and suffering enterprise-wide data encryption. Sentinel's automated containment operates with sub-15ms response latency.",
    status: "SIMULATED ENFORCEMENT (Prototype updates SOC state and WebSocket feeds; OS driver unbind is simulated for safety)"
  },
  "settings": {
    title: "Console Settings & Runtime Parameters",
    what: "Allows you to adjust heuristic detection thresholds, autonomous containment policies, and telemetry refresh rates.",
    how: "Controls parameters such as the Shannon Entropy cutoff (H >= 7.00), write burst velocity limit (15 files/sec), rename velocity, and critical risk cutoff (80/100). Changes are persisted to the browser's runtime cache.",
    when: "Tune these settings if your environment produces false positives (e.g., video editing software creating high-entropy files) or when demonstrating stricter containment thresholds.",
    why: "No single security threshold fits every environment. Configurable thresholds allow administrators to balance security sensitivity against user productivity.",
    status: "INTERACTIVE RUNTIME (Stored in browser localStorage and applied across SOC console)"
  }
};

export default function FeatureExplainer({ featureKey }) {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef(null);

  const guide = FEATURE_GUIDES[featureKey] || {
    title: "Feature Information",
    what: "This module provides endpoint behavioral monitoring and security telemetry.",
    how: "Correlates filesystem activity, process execution, and anomaly scores.",
    when: "Use during security monitoring and incident investigation.",
    why: "Helps detect, prioritize, and contain ransomware threats.",
    status: "ACTIVE PROTOYPE COMPONENT"
  };

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative inline-block font-sans text-left" ref={popoverRef}>
      {/* Small, non-intrusive 'What is this?' button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 text-orange-400 hover:text-orange-300 text-[11px] font-mono font-semibold transition-all cursor-pointer shadow-sm active:scale-95"
        title="Click for a beginner-friendly explanation of this feature"
      >
        <HelpCircle className="w-3.5 h-3.5 text-orange-400" />
        <span>What is this?</span>
      </button>

      {/* Non-blocking explanation panel popover */}
      {isOpen && (
        <div className="absolute left-0 sm:left-auto sm:right-0 mt-2 z-50 w-[340px] sm:w-[440px] max-w-[95vw] rounded-2xl bg-white dark:bg-[#0a1020] border border-orange-500/40 shadow-2xl p-5 space-y-3.5 text-xs text-slate-800 dark:text-slate-200 animate-in fade-in zoom-in-95 duration-150">
          
          {/* Header */}
          <div className="flex items-start justify-between gap-3 border-b border-slate-200 dark:border-white/[0.08] pb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-orange-500/10 border border-orange-500/30 text-orange-400">
                <Info className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-orange-500 font-bold uppercase tracking-wider block">FEATURE EXPLANATION</span>
                <h4 className="text-sm font-bold font-mono text-slate-900 dark:text-white leading-tight">
                  {guide.title}
                </h4>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-md text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* 4 Core Questions */}
          <div className="space-y-3 text-xs leading-relaxed max-h-[360px] overflow-y-auto pr-1">
            
            {/* 1. WHAT IT DOES */}
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/[0.04] space-y-1">
              <span className="text-[10px] font-mono font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider block">
                WHAT IT DOES
              </span>
              <p className="text-slate-700 dark:text-slate-300 font-sans text-[11.5px]">
                {guide.what}
              </p>
            </div>

            {/* 2. HOW IT WORKS */}
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/[0.04] space-y-1">
              <span className="text-[10px] font-mono font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider block">
                HOW IT WORKS
              </span>
              <p className="text-slate-700 dark:text-slate-300 font-sans text-[11.5px]">
                {guide.how}
              </p>
            </div>

            {/* 3. WHEN TO USE IT */}
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/[0.04] space-y-1">
              <span className="text-[10px] font-mono font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider block">
                WHEN TO USE IT
              </span>
              <p className="text-slate-700 dark:text-slate-300 font-sans text-[11.5px]">
                {guide.when}
              </p>
            </div>

            {/* 4. WHY IT MATTERS */}
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/[0.04] space-y-1">
              <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
                WHY IT MATTERS
              </span>
              <p className="text-slate-700 dark:text-slate-300 font-sans text-[11.5px]">
                {guide.why}
              </p>
            </div>
          </div>

          {/* Implementation Status Banner */}
          <div className="pt-2 border-t border-slate-200 dark:border-white/[0.06] flex items-center justify-between text-[10px] font-mono text-slate-500">
            <span className="uppercase tracking-wider font-semibold">DATA SOURCE:</span>
            <span className="text-slate-700 dark:text-slate-300 text-right truncate max-w-[260px]" title={guide.status}>
              {guide.status}
            </span>
          </div>

        </div>
      )}
    </div>
  );
}
