import React from 'react';
import { ShieldAlert, AlertTriangle, Skull, CheckCircle2, ShieldCheck, ArrowRight, ExternalLink, X, Clock } from 'lucide-react';

export default function AlertPanel({ events, onViewForensics, onDismissAlert }) {
  // Filter for alerts (CRITICAL_KILL and WARNING events)
  const alertEvents = events.filter(e => e.severity === 'CRITICAL_KILL' || e.severity === 'WARNING');

  return (
    <div className="cyber-card rounded-2xl p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-rose-950/60 border border-rose-500/30 text-rose-400">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
              REAL-TIME SECURITY ALERTS
              <span className={`text-[10px] font-mono px-2 py-0.2 rounded-full border ${
                alertEvents.some(e => e.severity === 'CRITICAL_KILL')
                  ? 'bg-rose-950 text-rose-300 border-rose-500/40 animate-pulse'
                  : 'bg-slate-900 text-slate-400 border-white/[0.06]'
              }`}>
                {alertEvents.length} active
              </span>
            </h3>
            <p className="text-[10px] text-slate-500 font-mono">
              Prioritized Notifications for Behavioral Anomaly Interceptions
            </p>
          </div>
        </div>

        {alertEvents.length > 0 && (
          <span className="text-[10px] font-mono text-slate-500">
            Auto-Triaged by Sentinel Minifilter
          </span>
        )}
      </div>

      {/* Alerts List */}
      <div className="space-y-3 font-mono">
        {alertEvents.length === 0 ? (
          <div className="p-6 rounded-xl bg-slate-950/40 border border-white/[0.04] text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-emerald-950/50 border border-emerald-500/30 text-emerald-400 mx-auto flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-bold text-slate-200">NO ACTIVE THREAT ALERTS</h4>
            <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
              Operating system telemetry is nominal. Canary decoy tripwires report 100% integrity.
            </p>
          </div>
        ) : (
          alertEvents.slice(0, 4).map((alert) => {
            const isCritical = alert.severity === 'CRITICAL_KILL';
            const riskScore = isCritical ? 94 : Math.min(78, Math.round(alert.entropy_score * 10));

            return (
              <div
                key={alert.id}
                className={`p-4 rounded-xl border transition-all ${
                  isCritical 
                    ? "bg-rose-950/30 border-rose-500/60 shadow-lg shadow-rose-950/40 glow-crimson" 
                    : "bg-amber-950/20 border-amber-500/40"
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      isCritical 
                        ? "bg-rose-600 text-white shadow-sm" 
                        : "bg-amber-600 text-white"
                    }`}>
                      {isCritical ? "CRITICAL" : "WARNING"}
                    </span>
                    <h4 className="text-xs font-bold text-slate-100">
                      {isCritical 
                        ? "Unauthorized mass file modification detected" 
                        : "High-entropy process burst observed"}
                    </h4>
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                    <Clock className="w-3 h-3 text-slate-500" />
                    <span>{alert.timestamp}</span>
                  </div>
                </div>

                {/* Structured Metadata matching user example */}
                <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="bg-slate-950/80 p-2 rounded-lg border border-white/[0.05]">
                    <span className="text-[10px] text-slate-500 block">PROCESS / PID</span>
                    <span className="text-slate-200 font-semibold truncate block">
                      {alert.process_name} <span className="text-slate-400 font-normal">({alert.pid})</span>
                    </span>
                  </div>

                  <div className="bg-slate-950/80 p-2 rounded-lg border border-white/[0.05]">
                    <span className="text-[10px] text-slate-500 block">RISK SCORE</span>
                    <span className={`font-bold ${isCritical ? 'text-rose-400' : 'text-amber-400'}`}>
                      {riskScore} / 100
                    </span>
                  </div>

                  <div className="bg-slate-950/80 p-2 rounded-lg border border-white/[0.05] col-span-2 sm:col-span-2">
                    <span className="text-[10px] text-slate-500 block">ACTION TAKEN</span>
                    <span className={`font-bold truncate block ${isCritical ? 'text-rose-300' : 'text-amber-300'}`}>
                      {isCritical ? "PROCESS CONTAINED (11ms SIGKILL)" : "HEURISTIC OBSERVATION ACTIVE"}
                    </span>
                  </div>
                </div>

                {/* Target File & Forensics Link */}
                <div className="mt-2.5 pt-2 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-2 text-[11px]">
                  <div className="truncate max-w-md text-slate-400">
                    Target: <code className="text-slate-300">{alert.target_file}</code>
                  </div>

                  {isCritical && onViewForensics && (
                    <button
                      onClick={() => onViewForensics(alert)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-rose-300 hover:text-white transition-colors"
                    >
                      <span>Investigate Process Ancestry</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
