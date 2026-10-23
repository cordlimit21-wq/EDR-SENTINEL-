import React from 'react';
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
  RotateCcw
} from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export default function SettingsView({ 
  stats, 
  theme = 'dark', 
  onToggleTheme,
  onReset 
}) {
  const isDark = theme === 'dark';

  return (
    <div className="space-y-6 font-mono max-w-4xl">
      {/* Header */}
      <div className="cyber-card p-5 rounded-2xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-orange-100 dark:bg-orange-950/60 border border-orange-200 dark:border-orange-500/40 text-orange-700 dark:text-orange-400">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
              CONSOLE CONFIGURATION &amp; AGENT PARAMETERS
            </h1>
            <p className="text-[11px] text-slate-500 dark:text-slate-500">
              Sentinel Kernel Minifilter Driver &amp; Heuristic Engine Settings
            </p>
          </div>
        </div>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
        {/* Card 1: Agent & Driver */}
        <div className="cyber-card p-5 rounded-2xl space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-white/[0.06] pb-3 text-slate-900 dark:text-slate-200 font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Kernel Minifilter Status</span>
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
              <span className="text-slate-500 dark:text-slate-400">Driver State</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
                Attached &amp; Online
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400">Containment Mode</span>
              <span className="text-orange-600 dark:text-orange-400 font-bold">Safe Process Termination</span>
            </div>
          </div>
        </div>

        {/* Card 2: Monitored Scope */}
        <div className="cyber-card p-5 rounded-2xl space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-white/[0.06] pb-3 text-slate-900 dark:text-slate-200 font-bold">
            <FolderLock className="w-4 h-4 text-orange-600 dark:text-orange-400" />
            <span>Monitored Scope</span>
          </div>

          <div className="space-y-3 text-slate-700 dark:text-slate-300">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400">Root Target</span>
              <span className="font-bold text-slate-900 dark:text-white">EDR_Test/</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400">Observer Implementation</span>
              <span className="text-cyan-700 dark:text-cyan-300 font-bold">watchfiles.awatch</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400">Decoy Honeypots</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">48 Active Vault Canaries</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400">Entropy Threshold</span>
              <span className="text-orange-600 dark:text-orange-400 font-bold">H &gt; 7.00 (8.00 Max)</span>
            </div>
          </div>
        </div>

        {/* Card 3: Theme & Interface */}
        <div className="cyber-card p-5 rounded-2xl space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-white/[0.06] pb-3 text-slate-900 dark:text-slate-200 font-bold">
            {isDark ? <Moon className="w-4 h-4 text-purple-600 dark:text-purple-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
            <span>Interface Theme</span>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div>
              <span className="text-slate-900 dark:text-slate-200 font-bold block">
                {isDark ? "Dark Cinematic Mode" : "Light Enterprise Mode"}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-500">
                {isDark 
                  ? "Near-black & deep navy foundation with orange and purple accents." 
                  : "Pure white and soft gray with high-contrast cybersecurity accents."}
              </span>
            </div>
            <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          </div>
        </div>

        {/* Card 4: System Reset & Telemetry Clear */}
        <div className="cyber-card p-5 rounded-2xl space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-white/[0.06] pb-3 text-slate-900 dark:text-slate-200 font-bold">
            <RotateCcw className="w-4 h-4 text-rose-600 dark:text-rose-400" />
            <span>Reset Telemetry &amp; Vault</span>
          </div>

          <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
            Restores all tripped decoy honeypot files to `INTACT`, clears incident history, and removes simulation files from `EDR_Test/`.
          </p>

          <button
            onClick={onReset}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-rose-50 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-300 dark:border-white/[0.08] hover:border-rose-400 dark:hover:border-rose-500/40 text-rose-700 dark:text-rose-300 hover:text-rose-800 dark:hover:text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset System State</span>
          </button>
        </div>
      </div>
    </div>
  );
}
