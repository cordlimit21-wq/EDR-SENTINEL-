import React, { useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp, ShieldAlert, CheckCircle2, FileDown, Search, Activity, Lock, AlertTriangle, Info } from 'lucide-react';

export default function InvestigationGuide() {
  const [isExpanded, setIsExpanded] = useState(false);

  const steps = [
    {
      num: 1,
      title: "Open Alert & Read Severity and Risk Score",
      icon: ShieldAlert,
      desc: "Open the incident or alert card and check its assigned severity (CRITICAL, HIGH, WARNING, INFO) and composite dynamic risk score (0 to 100).",
      caution: "Important: A risk score is a heuristic severity ranking, not a mathematical probability of infection. A score of 85 means multiple suspicious anomalies coincided, requiring analyst review."
    },
    {
      num: 2,
      title: "Check Triggering Evidence",
      icon: Search,
      desc: "Identify which specific behavioral rule or tripwire triggered the detection: a sudden spike in Shannon byte entropy (H >= 7.00), a write burst velocity (> 15 ops/sec), rapid extension renaming (.locked), or access to a canary decoy file in EDR_Test/Decoy/."
    },
    {
      num: 3,
      title: "Review Related Events and Process Ancestry",
      icon: Activity,
      desc: "Look up the responsible process ID (PID) and inspect its parent-child lineage in the Process Lineage tree. Legitimate software rarely uses PowerShell download cradles or cmd.exe shells to perform batch file alterations."
    },
    {
      num: 4,
      title: "Determine Telemetry Origin (Live vs. Simulated)",
      icon: Info,
      desc: "Verify whether the event originated from real filesystem modifications inside EDR_Test/ or from a safe test scenario launched in the Simulation Lab. Live events show real file paths and timestamps, whereas synthetic runs carry lab tags."
    },
    {
      num: 5,
      title: "Review Current Response State",
      icon: Lock,
      desc: "Check if the endpoint is already in an isolated quarantine state (status: ISOLATED / CONTAINED) or if manual analyst approval is required to sever rogue network connections."
    },
    {
      num: 6,
      title: "Execute Safe Mitigation Actions",
      icon: CheckCircle2,
      desc: "If the threat is confirmed, click ISOLATE HOST or TERMINATE PROCESS in the Containment view. In this prototype, enforcement updates the security boundary and logs audit trails without detaching real OS drivers."
    },
    {
      num: 7,
      title: "Generate Incident Forensic Report",
      icon: FileDown,
      desc: "Navigate to the Incident Reports view (or click Generate PDF in the incident console). Download the official incident post-mortem PDF with Indian Standard Time (IST) timestamps for audit records and academic documentation."
    }
  ];

  return (
    <div className="rounded-2xl bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-slate-900/40 border border-orange-500/30 overflow-hidden shadow-lg font-sans">
      {/* Collapsible Header */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 sm:p-5 flex items-center justify-between gap-3 text-left hover:bg-orange-500/5 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-orange-500/20 border border-orange-500/40 text-orange-400 shrink-0">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-orange-500 font-bold uppercase tracking-wider">
                BEGINNER SOC PLAYBOOK
              </span>
              <span className="text-slate-400 text-xs">•</span>
              <span className="text-[11px] text-slate-400 font-mono">7-Step Investigation Workflow</span>
            </div>
            <h3 className="text-sm sm:text-base font-bold font-mono text-slate-900 dark:text-white mt-0.5">
              How to Investigate an EDR Alert (Step-by-Step Guide)
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="hidden sm:inline-block text-xs font-mono text-orange-400 font-semibold">
            {isExpanded ? "Collapse Guide" : "View Playbook"}
          </span>
          <div className="p-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400">
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </div>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="p-4 sm:p-6 pt-0 space-y-4 border-t border-orange-500/20 text-xs">
          
          {/* Important Disclaimers Banner */}
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-[11px] space-y-1">
            <div className="flex items-center gap-2 font-bold text-amber-400">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>KEY INVESTIGATION PRINCIPLES:</span>
            </div>
            <p className="text-slate-300 font-sans leading-relaxed">
              • <b>Risk Score is not Infection Probability:</b> A dynamic score (e.g. 85/100) reflects anomaly density, not certainty. Always verify evidence before taking drastic containment actions.<br/>
              • <b>Suspicious Behavior is not automatically Ransomware:</b> Legitimate software (like disk defragmenters, archive tools, or backup agents) can generate rapid file writes. Correlate process lineage to distinguish benign software from threats.
            </p>
          </div>

          {/* 7 Chronological Steps */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            {steps.map((s) => {
              const Icon = s.icon;
              return (
                <div 
                  key={s.num} 
                  className="p-3.5 rounded-xl bg-white/60 dark:bg-slate-950/70 border border-slate-200 dark:border-white/[0.06] space-y-1.5 shadow-sm"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-orange-500 text-slate-950 font-bold font-mono text-[10px] flex items-center justify-center shrink-0">
                      {s.num}
                    </span>
                    <h4 className="font-bold font-mono text-slate-900 dark:text-white text-xs">
                      {s.title}
                    </h4>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 font-sans text-[11.5px] leading-relaxed">
                    {s.desc}
                  </p>
                  {s.caution && (
                    <p className="text-[10px] text-amber-500 dark:text-amber-400/90 font-mono italic">
                      {s.caution}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      )}
    </div>
  );
}
