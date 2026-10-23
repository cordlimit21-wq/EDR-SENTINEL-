import React, { useEffect, useState } from 'react';
import { Skull, ShieldAlert, CheckCircle, Zap, X, ShieldCheck, Timer, FileSpreadsheet } from 'lucide-react';

export default function ThreatAlertModal({ alertEvent, onClose }) {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!alertEvent) return;
    setProgress(100);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1.5;
      });
    }, 100);

    const timer = setTimeout(() => {
      onClose();
    }, 7500);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [alertEvent, onClose]);

  if (!alertEvent) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-full p-0 rounded-2xl overflow-hidden shadow-2xl bg-white/95 dark:bg-[#080b11]/95 backdrop-blur-2xl border border-rose-500/60 cyber-card-glow-rose transition-all">
      {/* Top Banner Alert Bar */}
      <div className="bg-gradient-to-r from-rose-600 via-rose-700 to-rose-800 dark:from-rose-900/90 dark:via-rose-800/80 dark:to-rose-950/90 px-4 py-3 flex items-center justify-between text-white border-b border-rose-500/30">
        <div className="flex items-center gap-2.5">
          <div className="p-1 rounded-lg bg-black/20 dark:bg-black/40 border border-white/20">
            <Skull className="w-4 h-4 animate-pulse text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold font-mono text-xs tracking-wider uppercase">
                CRITICAL THREAT CONTAINED
              </span>
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-black/20 dark:bg-black/40 border border-white/30 text-rose-100 dark:text-rose-200">
                11ms KERNEL KILL
              </span>
            </div>
            <p className="text-[10px] text-rose-100 dark:text-rose-200 font-mono">
              Unauthorized Decoy Honeypot Write Attempt
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-white/20 text-rose-100 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Body Details */}
      <div className="p-4 space-y-3 font-mono text-xs">
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-slate-50 dark:bg-slate-950/80 p-2.5 rounded-xl border border-slate-200 dark:border-white/[0.06] shadow-sm">
            <span className="text-[10px] text-slate-500 uppercase block font-medium">MALICIOUS PROCESS</span>
            <span className="text-rose-600 dark:text-rose-400 font-bold text-xs">{alertEvent.process_name}</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5 font-medium">PID: #{alertEvent.pid}</span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-950/80 p-2.5 rounded-xl border border-slate-200 dark:border-white/[0.06] shadow-sm">
            <span className="text-[10px] text-slate-500 uppercase block font-medium">CONTAINMENT SPEED</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold text-xs flex items-center gap-1">
              <Timer className="w-3.5 h-3.5" /> {alertEvent.response_latency || "11ms"}
            </span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-500/80 block mt-0.5">Sub-millisecond SLA</span>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-950/80 p-2.5 rounded-xl border border-slate-200 dark:border-white/[0.06] space-y-1.5 shadow-sm">
          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 text-[10px]">
            <FileSpreadsheet className="w-3 h-3 text-cyan-700 dark:text-cyan-400" />
            <span className="font-medium">Target Decoy Canary File:</span>
          </div>
          <p className="text-rose-700 dark:text-rose-300 font-semibold break-all text-[11px] bg-slate-100 dark:bg-black/40 p-1.5 rounded-lg border border-slate-200 dark:border-white/[0.04]">
            {alertEvent.target_file}
          </p>
        </div>

        <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-300 text-[11px] shadow-sm">
          <span className="flex items-center gap-1.5 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            Decoy Preserved: 100% Intact
          </span>
          <span className="font-bold text-white uppercase text-[9px] bg-rose-600 px-2 py-0.5 rounded-md">
            SIGKILL 0xC0000409
          </span>
        </div>
      </div>

      {/* Auto-dismiss progress bar */}
      <div className="w-full h-1 bg-slate-200 dark:bg-slate-900">
        <div
          className="h-full bg-rose-500 transition-all duration-100 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
