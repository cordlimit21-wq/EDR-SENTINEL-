import React from 'react';
import { Activity, ShieldCheck, ShieldAlert, AlertTriangle, Crosshair, Cpu, FileText } from 'lucide-react';

export default function RiskScoreGauge({ stats, latestThreatEvent, warningCount = 0 }) {
  const hasCriticalThreat = (stats?.zero_day_threats_blocked || 0) > 0 || latestThreatEvent?.severity === 'CRITICAL_KILL';
  
  let riskScore = 12;
  let classification = "LOW RISK";
  let statusColor = "text-cyan-400";
  let strokeColor = "#06b6d4";
  let badgeClass = "bg-cyan-950/60 border-cyan-500/40 text-cyan-300";

  // Factor statuses
  let fileModStatus = "Baseline Activity";
  let fileModSub = "Nominal I/O rate";
  let decoyStatus = "0 Access Attempts";
  let decoySub = "All 48 traps intact";
  let procStatus = "Normal Entropy";
  let procSub = "H < 4.5 / 8.0";

  if (hasCriticalThreat) {
    riskScore = 94;
    classification = "CRITICAL RISK";
    statusColor = "text-rose-400";
    strokeColor = "#f43f5e";
    badgeClass = "bg-rose-950/80 border-rose-500/50 text-rose-300";

    fileModStatus = "Rapid File Modification";
    fileModSub = "Burst write pattern";
    decoyStatus = "Decoy Trap Accessed";
    decoySub = "Tripwire triggered";
    procStatus = "Suspicious Process";
    procSub = "Entropy surge H = 7.98";
  } else if (warningCount > 0) {
    riskScore = Math.min(68, 32 + warningCount * 6);
    classification = "ELEVATED RISK";
    statusColor = "text-amber-400";
    strokeColor = "#f59e0b";
    badgeClass = "bg-amber-950/60 border-amber-500/40 text-amber-300";

    fileModStatus = "Elevated File I/O";
    fileModSub = "Sequential access burst";
    decoyStatus = "0 Access Attempts";
    decoySub = "Canaries unaccessed";
    procStatus = "Heuristic Watch";
    procSub = "Entropy H ~ 5.8 / 8.0";
  }

  // Radial gauge SVG calculations
  const size = 150;
  const strokeWidth = 10;
  const center = size / 2;
  const radius = center - strokeWidth - 4;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (riskScore / 100) * circumference;

  return (
    <div className="relative rounded-2xl bg-gradient-to-b from-slate-900/70 to-slate-950/80 border border-white/[0.07] p-5 backdrop-blur-xl shadow-xl flex flex-col justify-between h-full font-mono">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 text-xs">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-slate-900/80 border border-white/[0.08] text-cyan-400">
            <Activity className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-slate-300 font-bold uppercase tracking-wider text-[11px] block">
              Risk Status
            </span>
            <span className="text-[10px] text-slate-500 block">
              Real-Time Behavioral Score
            </span>
          </div>
        </div>

        <span className={`px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider ${badgeClass}`}>
          {classification}
        </span>
      </div>

      {/* Main Metric: Radial Meter */}
      <div className="flex items-center justify-center gap-6 py-3 my-auto">
        <div className="relative flex items-center justify-center shrink-0">
          <svg width={size} height={size} className="transform -rotate-90">
            {/* Background circle track */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              stroke="rgba(255, 255, 255, 0.05)"
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            {/* Animated risk progress stroke */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              style={{
                transition: "stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1), stroke 0.5s ease"
              }}
            />
          </svg>

          {/* Central Number & Category */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${statusColor}`}>
              {riskScore}
            </span>
            <span className="text-[9px] text-slate-400 uppercase tracking-widest font-bold mt-0.5">
              {classification}
            </span>
          </div>
        </div>
      </div>

      {/* Contributing Factors Beneath Risk Score */}
      <div className="space-y-2 pt-2 border-t border-white/[0.05] text-[11px]">
        <div className="text-[10px] uppercase text-slate-500 font-bold tracking-wider mb-1">
          Contributing Factors
        </div>

        {/* Factor 1: Rapid file modification */}
        <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/50 border border-white/[0.04]">
          <div className="flex items-center gap-2 truncate">
            <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-slate-300 truncate">Rapid File Modification</span>
          </div>
          <span className={`text-[10px] font-bold ${hasCriticalThreat ? 'text-rose-400' : 'text-slate-400'}`}>
            {fileModStatus}
          </span>
        </div>

        {/* Factor 2: Decoy access */}
        <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/50 border border-white/[0.04]">
          <div className="flex items-center gap-2 truncate">
            <Crosshair className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-slate-300 truncate">Decoy File Access</span>
          </div>
          <span className={`text-[10px] font-bold ${hasCriticalThreat ? 'text-rose-400' : 'text-emerald-400'}`}>
            {decoyStatus}
          </span>
        </div>

        {/* Factor 3: Suspicious process activity */}
        <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/50 border border-white/[0.04]">
          <div className="flex items-center gap-2 truncate">
            <Cpu className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-slate-300 truncate">Suspicious Process</span>
          </div>
          <span className={`text-[10px] font-bold ${hasCriticalThreat ? 'text-rose-400' : 'text-cyan-400'}`}>
            {procStatus}
          </span>
        </div>
      </div>
    </div>
  );
}
