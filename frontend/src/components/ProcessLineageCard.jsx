import React from 'react';
import { 
  GitCommit, 
  ShieldAlert, 
  Cpu, 
  ArrowRight, 
  Terminal, 
  Lock, 
  AlertTriangle, 
  CheckCircle2, 
  Crosshair, 
  History, 
  FileText,
  Zap,
  Activity
} from 'lucide-react';
import FeatureExplainer from './FeatureExplainer';

export default function ProcessLineageCard({ 
  selectedEvent, 
  latestThreatEvent, 
  allThreatEvents = [], 
  onSelectThreat,
  isFullPage = false,
  theme = 'dark'
}) {
  const displayEvent = selectedEvent || latestThreatEvent;
  const isCritical = displayEvent?.severity === 'CRITICAL_KILL';

  const parentName = displayEvent?.parent_process || displayEvent?.lineage?.[0]?.name || "UNKNOWN";
  const parentPid = displayEvent?.lineage?.[0]?.pid || (displayEvent?.parent_process && displayEvent?.parent_process !== "UNRESOLVED" ? displayEvent?.parent_process : "UNKNOWN");
  const procName = displayEvent?.process_name || "UNKNOWN";
  const procPid = displayEvent?.pid || "UNKNOWN";
  const cmdLine = displayEvent?.lineage?.[1]?.command_line || (procName !== "UNKNOWN" ? `${procName} --encrypt EDR_Test\\` : "UNKNOWN");

  return (
    <div className={`cyber-card rounded-2xl flex flex-col shadow-xl overflow-hidden font-mono text-xs ${
      isFullPage ? 'min-h-[calc(100vh-130px)]' : 'h-full'
    }`}>
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-white/[0.06] flex flex-wrap items-center justify-between gap-3 bg-slate-50 dark:bg-slate-950/60">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-purple-100 dark:bg-purple-950/80 border border-purple-200 dark:border-purple-500/40 text-purple-700 dark:text-purple-400">
            <GitCommit className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs sm:text-sm font-bold tracking-wide text-slate-900 dark:text-slate-100 flex items-center gap-2">
              PROCESS LINEAGE &amp; HEURISTIC GRAPH
              {isCritical && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-600 text-white animate-pulse">
                  ZERO-DAY CONTAINMENT
                </span>
              )}
              <FeatureExplainer featureKey="process-lineage" />
            </h2>
            <p className="text-[10px] text-slate-500 dark:text-slate-500">
              Visual parent-child ancestry and behavioral impact branches
            </p>
          </div>
        </div>

        {/* Incident Selector */}
        {allThreatEvents.length > 0 && onSelectThreat && (
          <div className="flex items-center gap-2">
            <History className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span className="text-[11px] text-slate-600 dark:text-slate-400">Incident:</span>
            <select
              value={displayEvent?.id || ''}
              onChange={(e) => {
                const found = allThreatEvents.find(t => t.id === e.target.value);
                if (found) onSelectThreat(found);
              }}
              className="px-2.5 py-1 text-xs rounded-xl bg-white dark:bg-slate-950/90 border border-slate-200 dark:border-white/[0.1] text-rose-700 dark:text-rose-300 font-mono focus:outline-none focus:border-rose-500 shadow-sm"
            >
              {allThreatEvents.map((t, idx) => (
                <option key={t.id} value={t.id}>
                  #{idx + 1} - {t.process_name} (PID #{t.pid} @ {t.timestamp})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Visual Relationship Tree */}
      <div className="p-6 sm:p-8 space-y-6 flex-1 flex flex-col justify-center max-w-3xl mx-auto w-full">
        {/* Node 1: Parent Process */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-white/[0.08] shadow-sm relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Terminal className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-widest block font-medium">Parent Process</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">{parentName}</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-500 block">PID</span>
              <span className="text-xs font-bold text-cyan-700 dark:text-cyan-300 font-mono">{parentPid}</span>
            </div>
          </div>
        </div>

        {/* Tree Connector Vector */}
        <div className="flex justify-center -my-2">
          <div className="w-0.5 h-8 bg-gradient-to-b from-slate-400 dark:from-slate-600 via-orange-500 to-orange-400" />
        </div>

        {/* Node 2: Suspicious Process */}
        <div className={`p-4 rounded-xl border shadow-lg relative ${
          isCritical 
            ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-500/60 cyber-card-glow-rose' 
            : 'bg-orange-50 dark:bg-slate-950/90 border-orange-300 dark:border-orange-500/40'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Cpu className="w-4 h-4 text-orange-600 dark:text-orange-400 animate-pulse" />
              <div>
                <span className="text-[10px] text-orange-600 dark:text-orange-400 uppercase tracking-widest block font-bold">
                  Suspicious Process (Evaluated)
                </span>
                <span className="text-base font-extrabold text-slate-900 dark:text-white">{procName}</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-500 block font-medium">PID</span>
              <span className="text-sm font-bold text-rose-600 dark:text-rose-400 font-mono">{procPid}</span>
            </div>
          </div>

          <div className="mt-2.5 pt-2.5 border-t border-slate-200 dark:border-white/[0.06] text-[11px] text-slate-700 dark:text-slate-300">
            <span className="text-slate-500 block text-[10px] uppercase font-medium">Command Execution</span>
            <span className="font-mono break-all">{cmdLine}</span>
          </div>
        </div>

        {/* Tree Connector Vector to Multiple Branches */}
        <div className="flex justify-center -my-2">
          <div className="w-0.5 h-8 bg-gradient-to-b from-orange-500 via-purple-500 to-purple-400" />
        </div>

        {/* Node 3: Behavioral Branches (File Activity, Decoy Access, Containment) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Branch A: File Activity */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-white/[0.06] space-y-1.5 shadow-sm">
            <div className="flex items-center gap-2 text-cyan-700 dark:text-cyan-400 font-bold text-xs">
              <Activity className="w-3.5 h-3.5" />
              <span>File Activity Burst</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
              Rapid sequential writes across <code className="text-slate-800 dark:text-slate-300 font-semibold">EDR_Test/</code> directories.
            </p>
            <span className="text-[10px] text-orange-600 dark:text-orange-400 font-bold block">
              Shannon Entropy: H = {displayEvent?.entropy_score || 7.8} / 8.00
            </span>
          </div>

          {/* Branch B: Decoy Access */}
          <div className="p-3.5 rounded-xl bg-rose-50/70 dark:bg-slate-950/80 border border-rose-200 dark:border-rose-500/30 space-y-1.5 shadow-sm">
            <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-bold text-xs">
              <Crosshair className="w-3.5 h-3.5" />
              <span>Canary Decoy Probe</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed truncate" title={displayEvent?.target_file}>
              Touched honeypot: {displayEvent?.target_file ? displayEvent.target_file.split(/[\\/]/).pop() : "financial_report.docx"}
            </p>
            <span className="text-[10px] text-rose-700 dark:text-rose-300 font-bold block">
              Tripwire: TAMPER_ATTEMPT_BLOCKED
            </span>
          </div>

          {/* Branch C: Kernel Kill Hook */}
          <div className="p-3.5 rounded-xl bg-emerald-50/70 dark:bg-slate-950/80 border border-emerald-200 dark:border-emerald-500/30 space-y-1.5 shadow-sm">
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-xs">
              <Lock className="w-3.5 h-3.5" />
              <span>Kernel Mitigation</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
              Issued NtTerminateProcess exit code <code className="text-slate-800 dark:text-slate-300 font-semibold">0xC0000409</code>.
            </p>
            <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold block">
              Containment: 11ms SLA
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
