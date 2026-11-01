import React, { useState, useEffect } from 'react';
import { 
  Play, 
  RefreshCw, 
  ShieldAlert, 
  Lock, 
  CheckCircle2, 
  Zap, 
  Activity, 
  Crosshair, 
  Terminal, 
  FileText,
  AlertTriangle
} from 'lucide-react';
import FeatureExplainer from './FeatureExplainer';

export default function SimulationControl({ 
  onSimulateAttack, 
  isSimulating, 
  latestThreatEvent, 
  stats,
  theme = 'dark'
}) {
  const stages = [
    {
      id: 0,
      label: "FILE ACTIVITY",
      sub: "Rapid directory traversal & write burst in EDR_Test/",
      icon: FileText,
      color: "text-orange-600 dark:text-orange-400",
      activeBg: "bg-orange-100 dark:bg-orange-950/80 border-orange-300 dark:border-orange-500/50 text-orange-800 dark:text-orange-300 shadow-orange-500/20"
    },
    {
      id: 1,
      label: "DECOY TRIGGERED",
      sub: "Honeypot financial_report.docx touched",
      icon: Crosshair,
      color: "text-amber-600 dark:text-amber-400",
      activeBg: "bg-amber-100 dark:bg-amber-950/80 border-amber-300 dark:border-amber-500/50 text-amber-800 dark:text-amber-300 shadow-amber-500/20"
    },
    {
      id: 2,
      label: "SUSPICIOUS PROCESS",
      sub: "Active execution from ransomware_sim.exe",
      icon: Terminal,
      color: "text-amber-600 dark:text-amber-400",
      activeBg: "bg-amber-100 dark:bg-amber-950/80 border-amber-300 dark:border-amber-500/50 text-amber-800 dark:text-amber-300 shadow-amber-500/20"
    },
    {
      id: 3,
      label: "RISK ANALYSIS",
      sub: "Shannon entropy buffer spike H > 7.50 / 8.00",
      icon: Activity,
      color: "text-purple-600 dark:text-purple-400",
      activeBg: "bg-purple-100 dark:bg-purple-950/80 border-purple-300 dark:border-purple-500/50 text-purple-800 dark:text-purple-300 shadow-purple-500/20"
    },
    {
      id: 4,
      label: "THREAT DETECTED",
      sub: "Zero-day ransomware behavior confirmed (Risk >= 80)",
      icon: ShieldAlert,
      color: "text-rose-600 dark:text-rose-400",
      activeBg: "bg-rose-100 dark:bg-rose-950 border-rose-400 dark:border-rose-500 text-rose-800 dark:text-rose-200 shadow-rose-500/30"
    },
    {
      id: 5,
      label: "PROCESS CONTAINED",
      sub: "NtTerminateProcess issued within 11ms SLA",
      icon: Lock,
      color: "text-emerald-600 dark:text-emerald-400",
      activeBg: "bg-emerald-100 dark:bg-emerald-950 border-emerald-400 dark:border-emerald-500 text-emerald-800 dark:text-emerald-200 shadow-emerald-500/30"
    }
  ];

  const [activeStage, setActiveStage] = useState(-1);

  useEffect(() => {
    let timer;
    if (isSimulating) {
      setActiveStage(0);
      let current = 0;
      timer = setInterval(() => {
        current++;
        if (current <= 4) {
          setActiveStage(current);
        } else {
          clearInterval(timer);
        }
      }, 200);
    } else if (latestThreatEvent) {
      setActiveStage(5);
    } else {
      setActiveStage(-1);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isSimulating, latestThreatEvent]);

  return (
    <div className="cyber-card rounded-2xl p-6 space-y-6 font-mono text-xs">
      {/* Simulation Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-white/[0.06] pb-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950/80 border border-orange-200 dark:border-orange-500/30 text-[10px] text-orange-700 dark:text-orange-300 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 dark:bg-orange-400 animate-ping" />
            <span>CONTROLLED ENVIRONMENT SIMULATION</span>
          </div>
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white tracking-wide flex items-center gap-2">
            <span>Zero-Day Ransomware Attack Simulation</span>
            <FeatureExplainer featureKey="simulation-lab" />
          </h2>
          <p className="text-[11px] text-slate-600 dark:text-slate-400">
            Executes real high-frequency, high-entropy write burst inside <code className="text-orange-600 dark:text-orange-400 font-semibold">EDR_Test/</code> to evaluate live detection and containment.
          </p>
        </div>

        <button
          onClick={onSimulateAttack}
          disabled={isSimulating}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white font-bold text-xs uppercase tracking-wider font-mono shadow-xl shadow-orange-500/25 active:scale-95 transition-all disabled:opacity-50"
        >
          <Play className={`w-4 h-4 fill-current ${isSimulating ? 'animate-spin' : ''}`} />
          <span>{isSimulating ? "Simulating Attack..." : "Start Simulation"}</span>
        </button>
      </div>

      {/* 6-Stage Progression Flow (Item 19) */}
      <div className="space-y-3">
        <span className="text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400 font-bold block">
          Simulation Progression Pipeline
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          {stages.map((st, idx) => {
            const Icon = st.icon;
            const isDone = activeStage >= idx;
            const isCurrent = activeStage === idx;

            return (
              <div
                key={st.id}
                className={`p-3.5 rounded-xl border transition-all duration-300 flex flex-col justify-between space-y-2 shadow-sm ${
                  isCurrent
                    ? st.activeBg
                    : isDone
                      ? 'bg-emerald-50 dark:bg-slate-900/90 border-emerald-300 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-300'
                      : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-white/[0.04] text-slate-500 dark:text-slate-500'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold opacity-60">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <Icon className={`w-4 h-4 ${isDone ? st.color : 'text-slate-400 dark:text-slate-600'}`} />
                </div>

                <div>
                  <span className="font-bold text-[11px] block leading-tight">
                    {st.label}
                  </span>
                  <span className="text-[9px] text-slate-600 dark:text-slate-400 block mt-1 leading-snug">
                    {st.sub}
                  </span>
                </div>

                <div className="pt-1">
                  {isCurrent ? (
                    <span className="text-[9px] font-bold text-orange-600 dark:text-orange-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-500 dark:bg-orange-400 animate-ping" />
                      IN PROGRESS
                    </span>
                  ) : isDone ? (
                    <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                      COMPLETED
                    </span>
                  ) : (
                    <span className="text-[9px] text-slate-400 dark:text-slate-600">STANDBY</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Diagnostics Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono pt-2">
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-white/[0.06] space-y-1.5 shadow-sm">
          <span className="text-[10px] text-slate-500 uppercase block font-bold">Simulated Process</span>
          <span className="text-slate-900 dark:text-white font-bold block">ransomware_sim.exe</span>
          <p className="text-[11px] text-slate-600 dark:text-slate-400">
            Real multi-threaded batch writes targeting files inside <code className="text-slate-800 dark:text-slate-300 font-semibold">EDR_Test/</code>.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-white/[0.06] space-y-1.5 shadow-sm">
          <span className="text-[10px] text-slate-500 uppercase block font-bold">Tripwire Honeypot Target</span>
          <span className="text-orange-600 dark:text-orange-400 font-bold block">financial_report.docx</span>
          <p className="text-[11px] text-slate-600 dark:text-slate-400">
            Monitored canary decoy file rigged with integrity audit hooks.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-white/[0.06] space-y-1.5 shadow-sm">
          <span className="text-[10px] text-slate-500 uppercase block font-bold">Containment Latency</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-bold block">11 Milliseconds SLA</span>
          <p className="text-[11px] text-slate-600 dark:text-slate-400">
            Kernel NtTerminateProcess executed before disk commitment.
          </p>
        </div>
      </div>
    </div>
  );
}
