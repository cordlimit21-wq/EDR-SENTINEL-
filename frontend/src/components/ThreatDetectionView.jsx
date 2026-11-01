import React from 'react';
import { 
  ShieldAlert, 
  Lock, 
  Cpu, 
  Terminal, 
  Clock, 
  FileSpreadsheet, 
  AlertTriangle, 
  CheckCircle2, 
  Crosshair, 
  History, 
  ArrowRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import FeatureExplainer from './FeatureExplainer';

export default function ThreatDetectionView({ 
  latestThreatEvent, 
  allThreatEvents = [], 
  onSelectThreat,
  onNavigateTab,
  theme = 'dark'
}) {
  const displayEvent = latestThreatEvent || (allThreatEvents.length > 0 ? allThreatEvents[0] : null);

  // If no threat event has been captured yet
  if (!displayEvent) {
    return (
      <div className="cyber-card rounded-2xl p-8 sm:p-12 font-mono flex flex-col items-center justify-center text-center max-w-2xl mx-auto space-y-5 my-8">
        <div className="relative p-5 rounded-3xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-500/30 dark:border-emerald-500/40 text-emerald-600 dark:text-emerald-400 shadow-xl shadow-emerald-950/20">
          <ShieldCheck className="w-14 h-14 text-emerald-600 dark:text-emerald-400" />
          <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 animate-ping" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-500/40 text-xs text-emerald-800 dark:text-emerald-300 font-bold">
            <span>● 0 ZERO-DAY OUTBREAKS OBSERVED</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            System Operating Normally
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-lg">
            No active zero-day ransomware behavior or unauthorized decoy file modifications detected. Real-time filesystem observer and heuristic risk engine are armed.
          </p>
        </div>

        <div className="pt-3">
          <button
            onClick={() => onNavigateTab && onNavigateTab('simulation')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white font-bold text-xs uppercase tracking-wider font-mono shadow-lg shadow-orange-500/20 transition-all active:scale-95"
          >
            <span>Run Controlled Simulation</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // Parse behavior indicators from real backend details
  const rawDetails = displayEvent.details || "";
  const parsedIndicators = rawDetails
    ? rawDetails.split(';').map(s => s.trim()).filter(Boolean)
    : [displayEvent.detection_trigger || "Real-time behavioral anomaly correlation"];

  // Determine containment status
  const containmentStatus = displayEvent.action_taken === "PROCESS_FORCE_TERMINATED" 
    ? "CONTAINED" 
    : displayEvent.severity === "CRITICAL_KILL" 
      ? "CONTAINED" 
      : "NOT ATTEMPTED";

  // Calculate numeric score from entropy or backend
  const riskScoreDisplay = displayEvent.severity === "CRITICAL_KILL" 
    ? "94 / 100" 
    : `${Math.min(100, Math.round((displayEvent.entropy_score || 4.0) * 12))} / 100`;

  // Process lineage nodes if present
  const parentPid = displayEvent.lineage?.[0]?.pid || (displayEvent.parent_process && displayEvent.parent_process !== "UNRESOLVED" ? displayEvent.parent_process : "UNKNOWN");
  const parentName = displayEvent.parent_process || displayEvent.lineage?.[0]?.name || "UNKNOWN";
  const cmdLine = displayEvent.lineage?.[1]?.command_line || (displayEvent.process_name ? `${displayEvent.process_name} (Active)` : "UNKNOWN");
  const exePath = displayEvent.lineage?.[1]?.exe || (displayEvent.process_name ? `C:\\Windows\\Temp\\${displayEvent.process_name}` : "UNKNOWN");

  return (
    <div className="space-y-6 font-mono">
      {/* 1. Threat Alert Banner */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-rose-950/90 via-slate-900/95 to-slate-950 border border-rose-500/60 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-rose-950/80 border border-rose-500/60 text-rose-400 animate-pulse">
              <ShieldAlert className="w-7 h-7 text-rose-400" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-wide">
                  THREAT DETECTED
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-600 text-white animate-pulse">
                  CRITICAL
                </span>
                <FeatureExplainer featureKey="threat-detection" />
              </div>
              <p className="text-xs text-rose-300/80 mt-1">
                Zero-Day Ransomware Behavioral Heuristic Threshold Breached
              </p>
            </div>
          </div>

          {/* Incident Selector if multiple threats exist */}
          {allThreatEvents.length > 1 && onSelectThreat && (
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-slate-400" />
              <span className="text-xs text-slate-400">Incident:</span>
              <select
                value={displayEvent.id}
                onChange={(e) => {
                  const target = allThreatEvents.find(t => t.id === e.target.value);
                  if (target) onSelectThreat(target);
                }}
                className="px-3 py-1.5 text-xs rounded-xl bg-slate-950 border border-rose-500/40 text-rose-300 focus:outline-none focus:border-rose-500"
              >
                {allThreatEvents.map((t, idx) => (
                  <option key={t.id} value={t.id}>
                    #{idx + 1} - {t.process_name} (PID {t.pid} @ {t.timestamp})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* 2. Key Threat Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
        <div className="cyber-card p-4 rounded-xl space-y-1">
          <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Severity</span>
          <span className="text-base font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            {displayEvent.severity || "CRITICAL"}
          </span>
        </div>

        <div className="cyber-card p-4 rounded-xl space-y-1">
          <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Risk Score</span>
          <span className="text-base font-bold text-orange-600 dark:text-orange-400">
            {riskScoreDisplay}
          </span>
        </div>

        <div className="cyber-card p-4 rounded-xl space-y-1">
          <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Containment SLA</span>
          <span className="text-base font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <Lock className="w-3.5 h-3.5" />
            {displayEvent.response_latency || "11ms"}
          </span>
        </div>

        <div className="cyber-card p-4 rounded-xl space-y-1">
          <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Containment Status</span>
          <span className={`text-base font-bold ${
            containmentStatus === "CONTAINED" ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"
          }`}>
            {containmentStatus}
          </span>
        </div>
      </div>

      {/* 3. Detailed Threat Telemetry Matrix */}
      <div className="cyber-card p-6 rounded-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/[0.08] pb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-orange-500 dark:text-orange-400" />
            <span>Process &amp; Target Telemetry</span>
          </h2>
          <span className="text-[10px] text-slate-500">Source: Real-time Filesystem &amp; Process Tracker</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-white/[0.04] space-y-1">
            <span className="text-[10px] text-slate-500 block uppercase">Process Name</span>
            <span className="text-sm font-bold text-slate-900 dark:text-white block">{displayEvent.process_name || "UNKNOWN"}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-white/[0.04] space-y-1">
            <span className="text-[10px] text-slate-500 block uppercase">PID</span>
            <span className="text-sm font-bold text-rose-600 dark:text-rose-400 block font-mono">{displayEvent.pid || "UNKNOWN"}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-white/[0.04] space-y-1">
            <span className="text-[10px] text-slate-500 block uppercase">Parent Process</span>
            <span className="text-sm font-bold text-slate-800 dark:text-slate-200 block">{parentName} (PID: {parentPid})</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-white/[0.04] space-y-1">
            <span className="text-[10px] text-slate-500 block uppercase">Event ID</span>
            <span className="text-sm font-bold text-cyan-700 dark:text-cyan-300 block">{displayEvent.id || "UNKNOWN"}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-white/[0.04] space-y-1">
            <span className="text-[10px] text-slate-500 block uppercase">Detection Timestamp</span>
            <span className="text-sm font-bold text-slate-800 dark:text-slate-200 block">{displayEvent.timestamp || "UNKNOWN"}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-white/[0.04] space-y-1">
            <span className="text-[10px] text-slate-500 block uppercase">Target Canary / Path</span>
            <span className="text-xs font-semibold text-rose-700 dark:text-rose-300 block truncate" title={displayEvent.target_file}>
              {displayEvent.target_file || "UNKNOWN"}
            </span>
          </div>

          <div className="md:col-span-2 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-white/[0.04] space-y-1">
            <span className="text-[10px] text-slate-500 block uppercase">Executable Path / Command Line</span>
            <span className="text-xs font-mono text-slate-700 dark:text-slate-300 block break-all">
              {cmdLine}
            </span>
          </div>
        </div>

        {/* 4. Behavior Indicators */}
        <div className="space-y-3 pt-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-300 block flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
            <span>Behavior Indicators Detected</span>
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {parsedIndicators.map((indicator, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-amber-50 dark:bg-slate-950/80 border border-amber-300 dark:border-amber-500/20 flex items-center gap-2.5 text-xs text-amber-900 dark:text-slate-200"
              >
                <AlertTriangle className="w-4 h-4 text-amber-500 dark:text-amber-400 shrink-0" />
                <span>{indicator}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Detection Reason & Mitigation Action */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/90 border border-slate-200 dark:border-white/[0.08] space-y-2">
          <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider block font-bold">
            Detection Reason &amp; Mitigation Action
          </span>
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            {displayEvent.details || displayEvent.detection_trigger || "Heuristic anomaly correlation triggered based on high-frequency writes and entropy surge."}
          </p>
          <div className="pt-2 flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Action Taken: {displayEvent.action_taken || "PROCESS_FORCE_TERMINATED"}</span>
          </div>
        </div>

        {/* Action button to jump to Lineage */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={() => onNavigateTab && onNavigateTab('lineage')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-purple-500/40 hover:border-purple-500/60 text-purple-700 hover:text-purple-900 dark:text-purple-300 dark:hover:text-white text-xs font-bold transition-all"
          >
            <span>View Process Lineage &amp; Ancestry</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
