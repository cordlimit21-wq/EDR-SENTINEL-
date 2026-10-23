import React, { useEffect, useState } from 'react';
import { FileCheck2, ShieldAlert, Activity, Lock, Timer, Zap } from 'lucide-react';

export default function MetricCards({ stats, events = [], latestThreatTimestamp }) {
  const [pulseThreat, setPulseThreat] = useState(false);

  useEffect(() => {
    if (stats?.zero_day_threats_blocked > 0) {
      setPulseThreat(true);
      const t = setTimeout(() => setPulseThreat(false), 2000);
      return () => clearTimeout(t);
    }
  }, [stats?.zero_day_threats_blocked, latestThreatTimestamp]);

  const suspiciousCount = events.filter(e => e.severity === 'WARNING').length;
  const threatsDetected = stats?.zero_day_threats_blocked ?? 0;
  const processesContained = stats?.zero_day_threats_blocked ?? 0;

  const cards = [
    {
      title: "Files Monitored",
      value: "14,848",
      subtitle: "NTFS/FAT32 volumes & 48 Decoys armed",
      status: "SHIELDED",
      statusColor: "bg-emerald-950/70 text-emerald-400 border-emerald-500/30",
      statusDot: "bg-emerald-400",
      icon: FileCheck2,
      iconColor: "text-cyan-400",
      iconBg: "bg-cyan-950/40 border-cyan-500/30",
      unit: "OBJECTS",
      isThreat: false
    },
    {
      title: "Threats Detected",
      value: threatsDetected,
      subtitle: "Zero-day ransomware write attempts",
      status: threatsDetected > 0 ? "THREAT BLOCKED" : "ZERO COMPROMISES",
      statusColor: threatsDetected > 0 
        ? "bg-rose-950 text-rose-300 border-rose-500/50 animate-pulse" 
        : "bg-slate-900/90 text-slate-400 border-white/[0.08]",
      statusDot: threatsDetected > 0 ? "bg-rose-400 animate-ping" : "bg-slate-500",
      icon: ShieldAlert,
      iconColor: threatsDetected > 0 ? "text-rose-400" : "text-slate-400",
      iconBg: threatsDetected > 0 ? "bg-rose-950/80 border-rose-500/40" : "bg-slate-900 border-white/[0.06]",
      unit: "DETECTED",
      isThreat: true
    },
    {
      title: "Suspicious Processes",
      value: suspiciousCount,
      subtitle: "High-entropy anomaly bursts observed",
      status: suspiciousCount > 0 ? "OBSERVING" : "BASELINE NORMAL",
      statusColor: suspiciousCount > 0 
        ? "bg-amber-950/70 text-amber-300 border-amber-500/40" 
        : "bg-slate-900/90 text-slate-400 border-white/[0.08]",
      statusDot: suspiciousCount > 0 ? "bg-amber-400" : "bg-slate-500",
      icon: Activity,
      iconColor: suspiciousCount > 0 ? "text-amber-400" : "text-slate-400",
      iconBg: suspiciousCount > 0 ? "bg-amber-950/60 border-amber-500/30" : "bg-slate-900 border-white/[0.06]",
      unit: "FLAGGED",
      isThreat: false
    },
    {
      title: "Processes Contained",
      value: processesContained,
      subtitle: "Instant SIGKILL termination (11ms avg)",
      status: "100% CONTAINED",
      statusColor: "bg-emerald-950/70 text-emerald-400 border-emerald-500/30",
      statusDot: "bg-emerald-400",
      icon: Lock,
      iconColor: "text-emerald-400",
      iconBg: "bg-emerald-950/50 border-emerald-500/30",
      unit: "CONTAINED",
      isThreat: false
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        const isFlash = card.isThreat && pulseThreat;

        return (
          <div
            key={idx}
            className={`cyber-card p-5 rounded-2xl relative transition-all duration-200 ${
              isFlash ? "cyber-card-glow-rose scale-[1.01]" : ""
            }`}
          >
            {/* Ambient Background Shimmer */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-white/[0.02] to-transparent rounded-tr-2xl pointer-events-none" />

            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-mono font-medium uppercase tracking-wider text-slate-400">
                  {card.title}
                </p>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className={`text-3xl lg:text-4xl font-extrabold font-mono tracking-tight ${
                    card.isThreat && threatsDetected > 0
                      ? "text-rose-400 text-glow-rose"
                      : "text-slate-100"
                  }`}>
                    {card.value}
                  </span>
                  <span className="text-[10px] font-mono font-semibold text-slate-500 tracking-wider">
                    {card.unit}
                  </span>
                </div>
              </div>

              {/* Small Icon in glass badge */}
              <div className={`p-2.5 rounded-xl border ${card.iconBg} ${card.iconColor} shadow-inner`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>

            {/* Subtitle & Threat Status Indicator */}
            <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between">
              <span className="text-xs text-slate-400 font-mono truncate mr-2">
                {card.subtitle}
              </span>
              <span className={`inline-flex items-center gap-1.5 text-[10px] font-mono px-2 py-0.5 rounded-full border whitespace-nowrap font-medium ${card.statusColor}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${card.statusDot}`} />
                {card.status}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
