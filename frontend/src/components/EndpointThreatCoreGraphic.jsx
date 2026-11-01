import React, { useState, useEffect } from 'react';
import { 
  Laptop, 
  Cpu, 
  HardDrive, 
  Network, 
  ShieldAlert, 
  Activity, 
  CheckCircle2, 
  AlertTriangle,
  Zap,
  Lock,
  Layers,
  Radio
} from 'lucide-react';

export default function EndpointThreatCoreGraphic({ theme = 'dark' }) {
  const isDark = theme === 'dark';
  const [pulseTick, setPulseTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulseTick(prev => (prev + 1) % 100);
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full max-w-[660px] aspect-square mx-auto flex items-center justify-center select-none font-mono">
      {/* Background Multi-spectrum Radial Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[22%] left-[22%] w-[56%] h-[56%] rounded-full bg-gradient-to-tr from-orange-500/15 via-red-500/10 to-cyan-500/15 blur-3xl" />
        <div className="absolute bottom-[10%] left-[25%] w-[50%] h-[30%] rounded-full bg-orange-600/15 blur-2xl" />
      </div>

      {/* Main SVG Visualization Layer */}
      <svg 
        viewBox="0 0 640 640" 
        className="w-full h-full relative z-10 overflow-visible"
      >
        <defs>
          {/* Gradients using SENTINEL design system */}
          <linearGradient id="cyanDataStream" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#39E7FF" stopOpacity="0.1" />
            <stop offset="70%" stopColor="#39E7FF" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#39E7FF" stopOpacity="1" />
          </linearGradient>

          <linearGradient id="threatDataStream" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF7548" stopOpacity="0.1" />
            <stop offset="60%" stopColor="#FF7548" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#FF5268" stopOpacity="1" />
          </linearGradient>

          <linearGradient id="purpleAnalyticStream" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#A78BFA" stopOpacity="0.1" />
            <stop offset="70%" stopColor="#A78BFA" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#C084FC" stopOpacity="1" />
          </linearGradient>

          <radialGradient id="endpointCoreGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FF7548" stopOpacity="0.35" />
            <stop offset="60%" stopColor="#FF5268" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#39E7FF" stopOpacity="0" />
          </radialGradient>

          <linearGradient id="radarSweepGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#39E7FF" stopOpacity="0" />
            <stop offset="85%" stopColor="#39E7FF" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#39E7FF" stopOpacity="0.4" />
          </linearGradient>

          {/* Filter for subtle cyber glow */}
          <filter id="cyberGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 1. OUTER CONTAINMENT BOUNDARY RING */}
        <circle 
          cx="320" 
          cy="310" 
          r="230" 
          fill="none" 
          stroke={isDark ? "rgba(255, 106, 0, 0.2)" : "rgba(255, 106, 0, 0.3)"}
          strokeWidth="1.2" 
          strokeDasharray="4 8"
          className="animate-[spin_120s_linear_infinite]"
        />
        <circle 
          cx="320" 
          cy="310" 
          r="245" 
          fill="none" 
          stroke={isDark ? "rgba(0, 200, 255, 0.12)" : "rgba(0, 200, 255, 0.25)"}
          strokeWidth="1" 
          strokeDasharray="12 18"
          className="animate-[spin_90s_linear_infinite_reverse]"
        />

        {/* 2. CIRCULAR BEHAVIOR ANALYSIS SCANNING RINGS */}
        <circle 
          cx="320" 
          cy="310" 
          r="170" 
          fill="none" 
          stroke={isDark ? "rgba(0, 200, 255, 0.25)" : "rgba(2, 132, 199, 0.35)"}
          strokeWidth="1.5"
        />
        <circle 
          cx="320" 
          cy="310" 
          r="135" 
          fill="none" 
          stroke={isDark ? "rgba(155, 92, 255, 0.3)" : "rgba(147, 51, 234, 0.35)"}
          strokeWidth="1" 
          strokeDasharray="6 6"
        />

        {/* 3. ROTATING RADAR SWEEP LINE */}
        <g className="origin-[320px_310px] animate-[spin_6s_linear_infinite]">
          <line 
            x1="320" 
            y1="310" 
            x2="320" 
            y2="140" 
            stroke="url(#cyanDataStream)" 
            strokeWidth="2" 
            filter="url(#cyberGlow)"
          />
          <path 
            d="M 320 310 L 320 140 A 170 170 0 0 1 440 190 Z" 
            fill="url(#radarSweepGrad)"
          />
        </g>

        {/* 4. VERTICAL SCANNING BEAM ACROSS ENDPOINT */}
        <g className="animate-pulse">
          <line 
            x1="220" 
            y1="310" 
            x2="420" 
            y2="310" 
            stroke="#ff6a00" 
            strokeWidth="1" 
            strokeOpacity="0.4"
            strokeDasharray="4 4"
          />
        </g>

        {/* 5. INCOMING DATA STREAMS MOVING TOWARDS ENDPOINT */}
        {/* Stream 1: Suspicious Process (Top-Left -> Center) */}
        <path 
          d="M 120 120 C 200 120, 220 220, 290 280" 
          fill="none" 
          stroke="url(#threatDataStream)" 
          strokeWidth="2" 
          strokeDasharray="6 4"
          className="animate-[dash_2s_linear_infinite]"
        />
        <circle cx="200" cy="180" r="3" fill="#ff4500" filter="url(#cyberGlow)">
          <animate attributeName="opacity" values="0.2;1;0.2" dur="1.5s" repeatCount="indefinite" />
        </circle>

        {/* Stream 2: File Activity Burst (Top-Right -> Center) */}
        <path 
          d="M 520 120 C 440 120, 420 220, 350 280" 
          fill="none" 
          stroke="url(#threatDataStream)" 
          strokeWidth="2" 
          strokeDasharray="8 4"
        />
        <circle cx="440" cy="180" r="3.5" fill="#ff6a00" filter="url(#cyberGlow)">
          <animate attributeName="opacity" values="0.4;1;0.4" dur="1.2s" repeatCount="indefinite" />
        </circle>

        {/* Stream 3: Behavior Analysis (Mid-Right -> Center) */}
        <path 
          d="M 540 310 C 460 310, 440 310, 370 310" 
          fill="none" 
          stroke="url(#purpleAnalyticStream)" 
          strokeWidth="2" 
          strokeDasharray="5 3"
        />

        {/* Stream 4: Normal Telemetry (Bottom-Left -> Center) */}
        <path 
          d="M 110 480 C 190 480, 230 400, 290 340" 
          fill="none" 
          stroke="url(#cyanDataStream)" 
          strokeWidth="1.8" 
          strokeDasharray="6 6"
        />
        <circle cx="210" cy="430" r="3" fill="#00c8ff" filter="url(#cyberGlow)">
          <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" />
        </circle>

        {/* Stream 5: Risk Aggregation (Bottom-Right -> Center) */}
        <path 
          d="M 530 480 C 450 480, 410 400, 350 340" 
          fill="none" 
          stroke="url(#threatDataStream)" 
          strokeWidth="2.2"
        />

        {/* 6. CENTER ENDPOINT / DEVICE SILHOUETTE & DEFENSE CORE */}
        {/* Outer Endpoint Halo */}
        <circle 
          cx="320" 
          cy="310" 
          r="92" 
          fill="url(#endpointCoreGlow)" 
        />
        <circle 
          cx="320" 
          cy="310" 
          r="78" 
          fill={isDark ? "#060a14" : "#f8fafc"} 
          stroke={isDark ? "#1e293b" : "#cbd5e1"}
          strokeWidth="2"
        />

        {/* Futuristic Terminal / Endpoint Silhouette Matrix */}
        <g transform="translate(275, 265)">
          {/* Workstation Screen Bezel */}
          <rect 
            x="0" 
            y="0" 
            width="90" 
            height="62" 
            rx="8" 
            fill={isDark ? "#080e1e" : "#0f172a"}
            stroke="#ff6a00" 
            strokeWidth="1.8" 
            filter="url(#cyberGlow)"
          />
          {/* Inner Display Screen */}
          <rect 
            x="5" 
            y="5" 
            width="80" 
            height="52" 
            rx="5" 
            fill={isDark ? "#04070f" : "#020617"} 
          />

          {/* Real-time Telemetry Grid Lines inside screen */}
          <line x1="12" y1="18" x2="78" y2="18" stroke="#00c8ff" strokeWidth="1" strokeOpacity="0.4" />
          <line x1="12" y1="28" x2="78" y2="28" stroke="#ff6a00" strokeWidth="1" strokeOpacity="0.5" />
          <line x1="12" y1="38" x2="58" y2="38" stroke="#9b5cff" strokeWidth="1" strokeOpacity="0.6" />

          {/* Central Sentinel Core Icon inside screen */}
          <circle cx="45" cy="30" r="14" fill="rgba(255, 106, 0, 0.15)" stroke="#ff6a00" strokeWidth="1.2" />
          <polygon points="45,21 53,27 50,38 40,38 37,27" fill="#ff4500" opacity="0.9" />

          {/* Workstation Base / Keyboard Stand */}
          <path 
            d="M 35 62 L 55 62 L 62 76 L 28 76 Z" 
            fill={isDark ? "#0d1527" : "#1e293b"} 
            stroke={isDark ? "#334155" : "#475569"} 
            strokeWidth="1.2"
          />
          {/* Activity Status Bar on Base */}
          <rect x="36" y="73" width="18" height="2" rx="1" fill="#00e5ff" />
        </g>

        {/* Dynamic Threat Containment Shield Ring immediately surrounding the device */}
        <circle 
          cx="320" 
          cy="310" 
          r="86" 
          fill="none" 
          stroke="#ff6a00" 
          strokeWidth="1.6" 
          strokeDasharray="16 8"
          className="animate-[spin_40s_linear_infinite]"
        />

        {/* 7. CONNECTED TELEMETRY INDICATORS (Exact Labels from Specification) */}

        {/* CALLOUT 1: PROCESS MONITOR (Upper-Left) */}
        <g>
          {/* Connector Leader Line */}
          <polyline 
            points="180,120 220,120 270,250" 
            fill="none" 
            stroke="#ff6a00" 
            strokeWidth="1.4"
            strokeDasharray="3 3"
          />
          <circle cx="270" cy="250" r="3.5" fill="#ff6a00" />
        </g>

        {/* CALLOUT 2: FILE ACTIVITY (Upper-Right) */}
        <g>
          <polyline 
            points="460,120 420,120 370,250" 
            fill="none" 
            stroke="#ff4500" 
            strokeWidth="1.4"
            strokeDasharray="3 3"
          />
          <circle cx="370" cy="250" r="3.5" fill="#ff4500" />
        </g>

        {/* CALLOUT 3: BEHAVIOR ENGINE (Mid-Right) */}
        <g>
          <polyline 
            points="480,290 440,290 395,305" 
            fill="none" 
            stroke="#9b5cff" 
            strokeWidth="1.4"
            strokeDasharray="3 3"
          />
          <circle cx="395" cy="305" r="3.5" fill="#9b5cff" />
        </g>

        {/* CALLOUT 4: NETWORK (Lower-Left) */}
        <g>
          <polyline 
            points="180,470 230,470 270,360" 
            fill="none" 
            stroke="#00c8ff" 
            strokeWidth="1.4"
            strokeDasharray="3 3"
          />
          <circle cx="270" cy="360" r="3.5" fill="#00c8ff" />
        </g>

        {/* CALLOUT 5: RISK SCORE (Lower-Right) */}
        <g>
          <polyline 
            points="460,470 410,470 370,360" 
            fill="none" 
            stroke="#ff0055" 
            strokeWidth="1.6"
          />
          <circle cx="370" cy="360" r="4" fill="#ff0055" filter="url(#cyberGlow)" />
        </g>

        {/* CALLOUT 6: THREAT STATUS (Center-Top) */}
        <g>
          <line 
            x1="320" 
            y1="190" 
            x2="320" 
            y2="235" 
            stroke="#ff0055" 
            strokeWidth="1.6" 
          />
          <circle cx="320" cy="235" r="4" fill="#ff0055" filter="url(#cyberGlow)" />
        </g>
      </svg>

      {/* HTML TELEMETRY BADGES (Precise connected HUD cards) */}
      {/* 1. PROCESS MONITOR (Upper-Left) */}
      <div className="absolute top-[8%] left-[0%] z-20 pointer-events-none">
        <div className="p-2 sm:p-2.5 rounded-lg bg-slate-900/90 dark:bg-[#070c17]/95 border border-orange-500/40 shadow-lg backdrop-blur-md text-left max-w-[145px]">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-orange-400 uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-ping" />
            PROCESS MONITOR
          </div>
          <div className="text-[11px] font-mono text-slate-100 font-bold mt-0.5">
            PID 4312
          </div>
          <div className="text-[9px] font-mono text-rose-400 font-semibold flex items-center justify-between">
            <span>RISK</span>
            <span className="px-1 rounded bg-rose-500/20 text-rose-300 font-bold">+18</span>
          </div>
        </div>
      </div>

      {/* 2. FILE ACTIVITY (Upper-Right) */}
      <div className="absolute top-[8%] right-[0%] z-20 pointer-events-none">
        <div className="p-2 sm:p-2.5 rounded-lg bg-slate-900/90 dark:bg-[#070c17]/95 border border-rose-500/40 shadow-lg backdrop-blur-md text-left max-w-[155px]">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-rose-400 uppercase tracking-wider">
            <Activity className="w-3 h-3 text-rose-500" />
            FILE ACTIVITY
          </div>
          <div className="text-[11px] font-mono text-slate-100 font-bold mt-0.5">
            2,431 EVENTS/MIN
          </div>
          <div className="text-[9px] font-mono text-rose-300">
            RAPID BURST DETECTED
          </div>
        </div>
      </div>

      {/* 3. THREAT CRITICAL (Top-Center) */}
      <div className="absolute top-[18%] left-1/2 -translate-x-1/2 z-20 pointer-events-none">
        <div className="px-3 py-1 rounded-full bg-rose-950/90 border border-rose-500/80 text-rose-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-rose-950/50">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          <span>THREAT: CRITICAL</span>
        </div>
      </div>

      {/* 4. BEHAVIOR ENGINE (Mid-Right) */}
      <div className="absolute top-[42%] right-[2%] z-20 pointer-events-none">
        <div className="p-2 sm:p-2.5 rounded-lg bg-slate-900/90 dark:bg-[#070c17]/95 border border-purple-500/40 shadow-lg backdrop-blur-md text-left max-w-[155px]">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-purple-400 uppercase tracking-wider">
            <Cpu className="w-3 h-3 text-purple-400" />
            BEHAVIOR ENGINE
          </div>
          <div className="text-[10px] font-mono text-purple-200 font-bold mt-0.5">
            ANOMALY DETECTED
          </div>
          <div className="text-[9px] font-mono text-purple-400/80">
            SHANNON H &gt; 7.82
          </div>
        </div>
      </div>

      {/* 5. NETWORK (Lower-Left) */}
      <div className="absolute bottom-[16%] left-[2%] z-20 pointer-events-none">
        <div className="p-2 sm:p-2.5 rounded-lg bg-slate-900/90 dark:bg-[#070c17]/95 border border-cyan-500/40 shadow-lg backdrop-blur-md text-left max-w-[150px]">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
            <Network className="w-3 h-3 text-cyan-400" />
            NETWORK
          </div>
          <div className="text-[11px] font-mono text-slate-100 font-bold mt-0.5">
            12 CONNECTIONS
          </div>
          <div className="text-[9px] font-mono text-cyan-300">
            OUTBOUND QUARANTINED
          </div>
        </div>
      </div>

      {/* 6. RISK SCORE (Lower-Right) */}
      <div className="absolute bottom-[16%] right-[2%] z-20 pointer-events-none">
        <div className="p-2 sm:p-2.5 rounded-lg bg-slate-900/95 dark:bg-[#070c17]/95 border-2 border-rose-500/60 shadow-xl shadow-rose-950/40 backdrop-blur-md text-left max-w-[150px]">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>RISK SCORE</span>
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
          </div>
          <div className="text-xl font-extrabold font-mono text-rose-500 mt-0.5 leading-none">
            94 <span className="text-xs text-slate-400 font-normal">/ 100</span>
          </div>
          <div className="text-[9px] font-mono text-rose-400 font-bold mt-1 uppercase">
            THRESHOLD BREACHED
          </div>
        </div>
      </div>

      {/* 8. VISUAL ATTACK PROGRESSION PIPELINE BAR (Bottom Section) */}
      <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 z-20 w-[95%] sm:w-[90%] pointer-events-none">
        <div className="p-2 rounded-xl bg-slate-950/90 dark:bg-[#060a14]/95 border border-slate-700/60 dark:border-white/[0.1] shadow-2xl backdrop-blur-xl">
          <div className="text-[8px] sm:text-[9px] uppercase tracking-widest text-slate-400 font-bold mb-1.5 text-center flex items-center justify-center gap-2">
            <Radio className="w-2.5 h-2.5 text-orange-500 animate-pulse" />
            <span>LIVE ATTACK PROGRESSION CORRELATION</span>
          </div>
          <div className="grid grid-cols-5 gap-1 text-[8px] sm:text-[9px] font-mono text-center font-bold">
            <div className="p-1 rounded bg-slate-800/80 text-cyan-300 border border-cyan-500/30">
              PROCESS
            </div>
            <div className="p-1 rounded bg-slate-800/80 text-orange-400 border border-orange-500/30">
              FILE ACT
            </div>
            <div className="p-1 rounded bg-slate-800/80 text-purple-400 border border-purple-500/30">
              BEHAVIOR
            </div>
            <div className="p-1 rounded bg-rose-950/80 text-rose-300 border border-rose-500/60 animate-pulse">
              DETECTED
            </div>
            <div className="p-1 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/50">
              CONTAIN
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
