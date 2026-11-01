import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  ShieldCheck, 
  Cpu, 
  HardDrive, 
  FolderLock, 
  Moon, 
  Sun, 
  Layers, 
  Lock,
  RotateCcw,
  Sliders,
  CheckCircle2,
  Save,
  Radio,
  Clock,
  Zap,
  Activity,
  AlertTriangle,
  Globe
} from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import FeatureExplainer from './FeatureExplainer';

export default function SettingsView({ 
  stats, 
  theme = 'dark', 
  onToggleTheme,
  onReset 
}) {
  const isDark = theme === 'dark';

  // Configurable thresholds with localStorage persistence
  const [entropyThreshold, setEntropyThreshold] = useState(() => {
    return parseFloat(localStorage.getItem('sentinel_entropy_threshold') || '7.00');
  });
  const [writeBurstThreshold, setWriteBurstThreshold] = useState(() => {
    return parseInt(localStorage.getItem('sentinel_write_burst') || '15', 10);
  });
  const [renameVelocityThreshold, setRenameVelocityThreshold] = useState(() => {
    return parseInt(localStorage.getItem('sentinel_rename_velocity') || '10', 10);
  });
  const [riskAlertThreshold, setRiskAlertThreshold] = useState(() => {
    return parseInt(localStorage.getItem('sentinel_risk_cutoff') || '80', 10);
  });
  const [containmentMode, setContainmentMode] = useState(() => {
    return localStorage.getItem('sentinel_containment_mode') || 'AUTONOMOUS';
  });
  const [streamInterval, setStreamInterval] = useState(() => {
    return localStorage.getItem('sentinel_stream_interval') || '1000';
  });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveSettings = () => {
    localStorage.setItem('sentinel_entropy_threshold', entropyThreshold.toString());
    localStorage.setItem('sentinel_write_burst', writeBurstThreshold.toString());
    localStorage.setItem('sentinel_rename_velocity', renameVelocityThreshold.toString());
    localStorage.setItem('sentinel_risk_cutoff', riskAlertThreshold.toString());
    localStorage.setItem('sentinel_containment_mode', containmentMode);
    localStorage.setItem('sentinel_stream_interval', streamInterval);

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleResetDefaults = () => {
    setEntropyThreshold(7.00);
    setWriteBurstThreshold(15);
    setRenameVelocityThreshold(10);
    setRiskAlertThreshold(80);
    setContainmentMode('AUTONOMOUS');
    setStreamInterval('1000');

    localStorage.removeItem('sentinel_entropy_threshold');
    localStorage.removeItem('sentinel_write_burst');
    localStorage.removeItem('sentinel_rename_velocity');
    localStorage.removeItem('sentinel_risk_cutoff');
    localStorage.removeItem('sentinel_containment_mode');
    localStorage.removeItem('sentinel_stream_interval');

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 font-mono max-w-5xl">
      {/* Header */}
      <div className="cyber-card p-5 rounded-2xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-orange-100 dark:bg-orange-950/60 border border-orange-200 dark:border-orange-500/40 text-orange-700 dark:text-orange-400">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 flex items-center gap-2">
              CONSOLE CONFIGURATION &amp; AGENT PARAMETERS
              <span className="px-2 py-0.5 text-[9px] rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-semibold">
                ACTIVE HEURISTICS
              </span>
              <FeatureExplainer featureKey="settings" />
            </h1>
            <p className="text-[11px] text-slate-500 dark:text-slate-500">
              Sentinel Kernel Minifilter Driver &amp; Multi-Vector Heuristic Engine Thresholds
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {savedSuccess && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold animate-pulse">
              <CheckCircle2 className="w-4 h-4" />
              <span>Runtime Cache Updated</span>
            </div>
          )}
          <button
            onClick={handleSaveSettings}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Configuration</span>
          </button>
        </div>
      </div>

      {/* Main Settings Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
        {/* Section 1: Detection Heuristics Tuning */}
        <div className="cyber-card p-5 rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/[0.06] pb-3 text-slate-900 dark:text-slate-200 font-bold">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-orange-500" />
              <span>Multi-Vector Heuristics Thresholds</span>
            </div>
            <span className="text-[10px] text-slate-500">Dynamic Heuristic Sliders</span>
          </div>

          <div className="space-y-4 text-slate-700 dark:text-slate-300">
            {/* Entropy Cutoff */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Shannon Entropy Threshold (&theta;<sub>H</sub>)</span>
                <span className="font-bold text-orange-400 font-mono">
                  {entropyThreshold.toFixed(2)} / 8.00 bits/byte
                </span>
              </div>
              <input 
                type="range"
                min="6.00"
                max="7.95"
                step="0.05"
                value={entropyThreshold}
                onChange={(e) => setEntropyThreshold(parseFloat(e.target.value))}
                className="w-full accent-orange-500 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
              />
              <span className="text-[10px] text-slate-500 block">
                Blocks file writes exceeding this entropy value (typical encrypted payload &gt; 7.20).
              </span>
            </div>

            {/* Write Burst Rate */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Write Burst Velocity Limit (W<sub>burst</sub>)</span>
                <span className="font-bold text-cyan-400 font-mono">
                  {writeBurstThreshold} files/sec
                </span>
              </div>
              <input 
                type="range"
                min="5"
                max="50"
                step="1"
                value={writeBurstThreshold}
                onChange={(e) => setWriteBurstThreshold(parseInt(e.target.value, 10))}
                className="w-full accent-cyan-500 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
              />
              <span className="text-[10px] text-slate-500 block">
                Triggers mass-write alarm if a single PID writes more than this volume per sliding second.
              </span>
            </div>

            {/* Rename Velocity Limit */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Extension Masquerade Velocity</span>
                <span className="font-bold text-purple-400 font-mono">
                  {renameVelocityThreshold} renames/sec
                </span>
              </div>
              <input 
                type="range"
                min="2"
                max="30"
                step="1"
                value={renameVelocityThreshold}
                onChange={(e) => setRenameVelocityThreshold(parseInt(e.target.value, 10))}
                className="w-full accent-purple-500 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
              />
              <span className="text-[10px] text-slate-500 block">
                Detects bulk extension replacements (.locked, .enc, .crypto) across directory branches.
              </span>
            </div>

            {/* Critical Risk Score Cutoff */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Critical Containment Cutoff (Risk &ge;)</span>
                <span className="font-bold text-rose-400 font-mono">
                  {riskAlertThreshold} / 100
                </span>
              </div>
              <input 
                type="range"
                min="60"
                max="95"
                step="1"
                value={riskAlertThreshold}
                onChange={(e) => setRiskAlertThreshold(parseInt(e.target.value, 10))}
                className="w-full accent-rose-500 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
              />
              <span className="text-[10px] text-slate-500 block">
                Risk score equal to or above this threshold triggers automated endpoint isolation.
              </span>
            </div>
          </div>
        </div>

        {/* Section 2: Containment & Enforcement Mode */}
        <div className="cyber-card p-5 rounded-2xl space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-white/[0.06] pb-3 text-slate-900 dark:text-slate-200 font-bold">
            <Lock className="w-4 h-4 text-emerald-500" />
            <span>Autonomous Containment &amp; Policy</span>
          </div>

          <div className="space-y-3">
            <span className="text-slate-400 block text-[11px]">ENFORCEMENT MODE:</span>
            
            <div 
              onClick={() => setContainmentMode('AUTONOMOUS')}
              className={`p-3 rounded-xl border cursor-pointer transition-all ${
                containmentMode === 'AUTONOMOUS' 
                  ? 'bg-rose-500/10 border-rose-500/40 text-rose-300' 
                  : 'bg-slate-100 dark:bg-slate-900/40 border-slate-200 dark:border-white/[0.06] text-slate-400 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-xs text-rose-400">
                  <Zap className="w-3.5 h-3.5" />
                  <span>AUTONOMOUS ZERO-DAY INTERCEPT (RECOMMENDED)</span>
                </div>
                {containmentMode === 'AUTONOMOUS' && (
                  <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
                )}
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                Sub-15ms automated network quarantine and process termination as soon as Behavioral Risk &ge; {riskAlertThreshold}.
              </p>
            </div>

            <div 
              onClick={() => setContainmentMode('HUMAN_APPROVAL')}
              className={`p-3 rounded-xl border cursor-pointer transition-all ${
                containmentMode === 'HUMAN_APPROVAL' 
                  ? 'bg-amber-500/10 border-amber-500/40 text-amber-300' 
                  : 'bg-slate-100 dark:bg-slate-900/40 border-slate-200 dark:border-white/[0.06] text-slate-400 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-xs text-amber-400">
                  <Activity className="w-3.5 h-3.5" />
                  <span>ANALYST CONFIRMATION ONLY (HUMAN-IN-THE-LOOP)</span>
                </div>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                Generates high-priority SOC alerts but defers network isolation until confirmed via Containment Dispatcher.
              </p>
            </div>

            <div className="pt-2 border-t border-slate-200 dark:border-white/[0.06] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Telemetry Stream Rate</span>
                <select 
                  value={streamInterval}
                  onChange={(e) => setStreamInterval(e.target.value)}
                  className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-white/[0.08] text-slate-900 dark:text-white text-xs"
                >
                  <option value="500">Ultra-Fast (500ms WS polling)</option>
                  <option value="1000">Standard SOC (1000ms WebSocket)</option>
                  <option value="2500">Low-Bandwidth (2500ms)</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Report Timezone Display</span>
                <span className="text-cyan-400 font-bold flex items-center gap-1">
                  <Globe className="w-3 h-3" />
                  Asia/Kolkata (IST, UTC+05:30)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Kernel Minifilter Driver Info & Telemetry Scope */}
        <div className="cyber-card p-5 rounded-2xl space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-white/[0.06] pb-3 text-slate-900 dark:text-slate-200 font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Driver Architecture &amp; Monitored Target</span>
          </div>

          <div className="space-y-3 text-slate-700 dark:text-slate-300">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400">Driver Binary</span>
              <span className="font-bold text-slate-900 dark:text-white">SentinelTrap.sys</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400">Filter Altitude</span>
              <span className="text-cyan-700 dark:text-cyan-300 font-bold">385200 (FSFilter Anti-Virus)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400">Local Watch Scope</span>
              <span className="font-bold text-orange-400">EDR_Test/</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400">Observer Engine</span>
              <span className="text-cyan-700 dark:text-cyan-300 font-bold">watchfiles.awatch (Async Kernel API)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400">Decoy Traps Loaded</span>
              <span className="text-emerald-500 font-bold">48 Active Vault Canaries</span>
            </div>
          </div>
        </div>

        {/* Section 4: Theme, Reset & Cache */}
        <div className="cyber-card p-5 rounded-2xl space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-white/[0.06] pb-3 text-slate-900 dark:text-slate-200 font-bold">
            {isDark ? <Moon className="w-4 h-4 text-purple-600 dark:text-purple-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
            <span>Interface &amp; System Maintenance</span>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div>
              <span className="text-slate-900 dark:text-slate-200 font-bold block">
                {isDark ? "Dark Midnight Obsidian" : "Light Enterprise Mode"}
              </span>
              <span className="text-[11px] text-slate-500">
                High-contrast cybersecurity color tokens.
              </span>
            </div>
            <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          </div>

          <div className="pt-3 border-t border-slate-200 dark:border-white/[0.06] space-y-2">
            <button
              onClick={handleResetDefaults}
              className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-300 dark:border-white/[0.08] text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restore Heuristics Defaults</span>
            </button>

            <button
              onClick={onReset}
              className="w-full py-2 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 hover:border-rose-500/50 text-rose-400 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Live Telemetry &amp; Re-arm Decoys</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
