import React from 'react';
import { Skull, ShieldAlert, Lock, CheckCircle2, FileSpreadsheet, Timer, ExternalLink, X } from 'lucide-react';

export default function ThreatDetectionCard({ threatEvent, onViewForensics, onDismiss }) {
  if (!threatEvent) return null;

  return (
    <div className="cyber-card p-6 rounded-2xl border border-rose-500/50 relative overflow-hidden space-y-4">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-400">
            <Skull className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-extrabold font-mono uppercase tracking-wider text-rose-300">
                THREAT DETECTED
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-rose-600 text-white">
                CRITICAL ZERO-DAY
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              Unauthorized write on high-value canary decoy file intercepted
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-500/40">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            PROCESS CONTAINED (11ms)
          </span>

          {onDismiss && (
            <button
              onClick={onDismiss}
              className="p-1 rounded-lg hover:bg-slate-800 text-slate-500 hover:text-slate-300 transition-colors"
              title="Acknowledge alert"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Structured Threat Details Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
        <div className="p-3 rounded-xl bg-slate-950/80 border border-white/[0.06]">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Threat Type</span>
          <span className="font-bold text-rose-300 block truncate">Zero-Day Ransomware</span>
          <span className="text-[10px] text-slate-500">Canary Tripwire Alert</span>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/80 border border-white/[0.06]">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Process Name / PID</span>
          <span className="font-bold text-slate-100 block truncate">{threatEvent.process_name}</span>
          <span className="text-[10px] text-slate-400">PID: #{threatEvent.pid}</span>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/80 border border-white/[0.06]">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Risk Score</span>
          <span className="text-xl font-extrabold text-rose-400 block">94 <span className="text-xs text-slate-500 font-normal">/ 100</span></span>
          <span className="text-[10px] text-rose-400">CRITICAL LEVEL</span>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/80 border border-white/[0.06]">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Files Affected</span>
          <span className="font-bold text-emerald-400 block">0 Files Encrypted</span>
          <span className="text-[10px] text-slate-500">Decoy Preserved</span>
        </div>
      </div>

      {/* Detection Reason & Target Decoy */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
        <div className="p-3 rounded-xl bg-slate-950/60 border border-white/[0.06] space-y-1">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Detection Reason</span>
          <div className="text-amber-300 font-semibold truncate">
            {threatEvent.detection_trigger || "UNAUTHORIZED_DECOY_WRITE_ATTEMPT"}
          </div>
          <span className="text-[10px] text-slate-400 block">Shannon buffer entropy spike (H = 7.98)</span>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/60 border border-white/[0.06] space-y-1">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Target Canary File</span>
          <div className="text-slate-200 font-semibold truncate" title={threatEvent.target_file}>
            {threatEvent.target_file}
          </div>
          <span className="text-[10px] text-emerald-400 block">Status: 100% Intact (Write Blocked)</span>
        </div>
      </div>

      {/* Footer / Link to Forensics */}
      <div className="pt-2 border-t border-white/[0.06] flex flex-wrap items-center justify-between text-xs font-mono text-slate-400 gap-2">
        <span>Timestamp: <strong className="text-slate-300">{threatEvent.timestamp}</strong></span>

        {onViewForensics && (
          <button
            onClick={() => onViewForensics(threatEvent)}
            className="flex items-center gap-1.5 text-rose-300 hover:text-white font-bold transition-colors"
          >
            <span>View Process Kinematics &amp; Lineage Tree</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
