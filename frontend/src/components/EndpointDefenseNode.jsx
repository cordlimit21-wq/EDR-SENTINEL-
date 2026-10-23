import React from 'react';
import { Shield, ShieldAlert, Cpu, Eye, Crosshair, Lock, Zap } from 'lucide-react';

export default function EndpointDefenseNode({ hasThreat = false, stats, isSimulating = false }) {
  const isAlert = hasThreat || isSimulating;

  return (
    <div className="relative rounded-2xl bg-gradient-to-b from-slate-900/60 to-slate-950/70 border border-white/[0.06] p-5 backdrop-blur-md overflow-hidden flex flex-col justify-between">
      {/* Background ambient lighting */}
      <div className={`absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl pointer-events-none transition-colors duration-500 ${
        isAlert ? 'bg-rose-500/15' : 'bg-cyan-500/10'
      }`} />
      
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-white/[0.05] pb-3 text-xs font-mono">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isAlert ? 'bg-rose-400 animate-ping' : 'bg-cyan-400'}`} />
          <span className="text-slate-300 font-bold uppercase tracking-wider text-[11px]">
            Endpoint Defense Node
          </span>
        </div>
        <span className="text-[10px] text-slate-500">
          Minifilter Altitude 385200
        </span>
      </div>

      {/* SVG Diagram Canvas */}
      <div className="relative py-4 my-auto flex items-center justify-center">
        <svg viewBox="0 0 420 200" className="w-full max-w-[420px] h-auto overflow-visible select-none">
          <defs>
            <linearGradient id="cyanLine" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.2" />
            </linearGradient>
            <linearGradient id="alertLine" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#e11d48" stopOpacity="0.3" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Connection Lines from Center (210, 100) to Peripheral Nodes */}
          {/* Node 1: Top-Left (70, 45) -> Filesystem */}
          <path
            d="M 210 100 L 95 55"
            stroke={isAlert ? "url(#alertLine)" : "url(#cyanLine)"}
            strokeWidth="1.5"
            strokeDasharray="4 4"
            className="animate-pulse"
          />

          {/* Node 2: Top-Right (325, 55) -> Decoys */}
          <path
            d="M 210 100 L 325 55"
            stroke={isAlert ? "url(#alertLine)" : "url(#cyanLine)"}
            strokeWidth="1.5"
            strokeDasharray="4 4"
            className="animate-pulse"
          />

          {/* Node 3: Bottom-Center (210, 165) -> Process Heuristics */}
          <path
            d="M 210 100 L 210 165"
            stroke={isAlert ? "url(#alertLine)" : "url(#cyanLine)"}
            strokeWidth="1.5"
            strokeDasharray="4 4"
            className="animate-pulse"
          />

          {/* Node 1: File I/O Monitor (Left) */}
          <g transform="translate(45, 30)">
            <rect width="90" height="42" rx="8" className="fill-slate-900/90 stroke-cyan-500/30 stroke-[1]" />
            <text x="45" y="18" textAnchor="middle" className="fill-slate-400 font-mono text-[9px] uppercase font-bold tracking-wider">File System I/O</text>
            <text x="45" y="32" textAnchor="middle" className="fill-cyan-300 font-mono text-[10px] font-extrabold">NTFS Hooked</text>
          </g>

          {/* Node 2: Canary Traps (Right) */}
          <g transform="translate(285, 30)">
            <rect width="90" height="42" rx="8" className={`fill-slate-900/90 stroke-[1] ${isAlert ? 'stroke-rose-500/60' : 'stroke-cyan-500/30'}`} />
            <text x="45" y="18" textAnchor="middle" className="fill-slate-400 font-mono text-[9px] uppercase font-bold tracking-wider">Decoy Traps</text>
            <text x="45" y="32" textAnchor="middle" className={`font-mono text-[10px] font-extrabold ${isAlert ? 'fill-rose-400' : 'fill-emerald-400'}`}>
              {isAlert ? 'Tripwire Alert' : '48 Armed'}
            </text>
          </g>

          {/* Node 3: Behavioral Heuristics (Bottom) */}
          <g transform="translate(160, 150)">
            <rect width="100" height="38" rx="8" className={`fill-slate-900/90 stroke-[1] ${isAlert ? 'stroke-rose-500/60' : 'stroke-cyan-500/30'}`} />
            <text x="50" y="16" textAnchor="middle" className="fill-slate-400 font-mono text-[9px] uppercase font-bold tracking-wider">Process Heuristics</text>
            <text x="50" y="29" textAnchor="middle" className={`font-mono text-[10px] font-extrabold ${isAlert ? 'fill-rose-400' : 'fill-cyan-300'}`}>
              {isAlert ? '11ms SIGKILL' : 'Entropy Watch'}
            </text>
          </g>

          {/* Center: Main Protected Endpoint Core */}
          <g transform="translate(210, 100)">
            {/* Outer Pulse Rings */}
            <circle
              r="34"
              className={`fill-none stroke-[1] ${isAlert ? 'stroke-rose-500/30 animate-ping' : 'stroke-cyan-500/20'}`}
            />
            <circle
              r="28"
              className={`fill-slate-950 stroke-[1.5] ${isAlert ? 'stroke-rose-500 shadow-rose-500' : 'stroke-cyan-400'}`}
              filter="url(#glow)"
            />
            <circle
              r="22"
              className={`fill-slate-900 ${isAlert ? 'fill-rose-950/70' : 'fill-cyan-950/50'}`}
            />
            {/* Center Icon */}
            <g transform="translate(-10, -10)">
              {isAlert ? (
                <path
                  d="M10 2L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-7-3zm-1 5h2v6H9V7zm0 8h2v2H9v-2z"
                  className="fill-rose-400 scale-[0.9]"
                />
              ) : (
                <path
                  d="M10 2L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-7-3zm-1 14l-4-4 1.41-1.41L9 13.17l6.59-6.59L17 8l-8 8z"
                  className="fill-cyan-300 scale-[0.9]"
                />
              )}
            </g>
          </g>
        </svg>
      </div>

      {/* Bottom Sub-Meta */}
      <div className="pt-2 border-t border-white/[0.05] flex items-center justify-between text-[10px] font-mono text-slate-400">
        <span className="flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${isAlert ? 'bg-rose-400 animate-ping' : 'bg-emerald-400'}`} />
          <span>Protection: <strong className={isAlert ? 'text-rose-300' : 'text-emerald-400'}>
            {isAlert ? 'ACTIVE CONTAINMENT' : 'REAL-TIME SHIELDED'}
          </strong></span>
        </span>
        <span className="text-slate-500">14,848 Files Watched</span>
      </div>
    </div>
  );
}
