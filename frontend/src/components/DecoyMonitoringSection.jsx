import React from 'react';
import { Crosshair, ShieldCheck, ShieldAlert, FileSpreadsheet, Lock, Key, Database, FileText, ArrowRight, Activity } from 'lucide-react';

export default function DecoyMonitoringSection({ traps, onNavigateVault, latestThreatEvent }) {
  const totalDecoys = traps.length || 48;
  const trippedTraps = traps.filter(t => t.integrity_status === 'TAMPER_ATTEMPT_BLOCKED');
  const decoyFilesAccessed = trippedTraps.length;
  const suspiciousAttempts = trippedTraps.length;
  const lastDetectedAccess = trippedTraps.length > 0 
    ? trippedTraps[0].last_checked 
    : (latestThreatEvent?.timestamp ? `Today at ${latestThreatEvent.timestamp}` : "None (Clean Baseline)");
  const currentProtectionStatus = trippedTraps.length > 0 
    ? "TRIPWIRE TRIPPED // ATTACK MITIGATED" 
    : "100% INTACT & ARMED";

  // Selected featured honeypots to preview
  const featuredDecoys = [
    {
      name: "q3_financials.xlsx",
      path: "C:\\Users\\Documents\\Decoys\\q3_financials.xlsx",
      dept: "Executive Finance",
      type: "Primary Bait",
      icon: FileSpreadsheet,
      iconColor: "text-emerald-400",
      status: trippedTraps.some(t => t.filename === 'q3_financials.xlsx') ? "TAMPER BLOCKED" : "INTACT",
      isPrimary: true
    },
    {
      name: "board_minutes_2026.docx",
      path: "C:\\Users\\CEO\\Documents\\Vault\\board_minutes_2026.docx",
      dept: "Executive Vault",
      type: "Executive Bait",
      icon: FileText,
      iconColor: "text-cyan-400",
      status: "INTACT"
    },
    {
      name: "prod_aws_credentials.env",
      path: "C:\\DevOps\\Keys\\prod_aws_credentials.env",
      dept: "Cloud Infrastructure",
      type: "Secrets Bait",
      icon: Key,
      iconColor: "text-amber-400",
      status: "INTACT"
    },
    {
      name: "customer_vault_dump.sql",
      path: "C:\\Database\\Backups\\customer_vault_dump.sql",
      dept: "Core Database",
      type: "Database Bait",
      icon: Database,
      iconColor: "text-indigo-400",
      status: "INTACT"
    },
  ];

  return (
    <div className="cyber-card rounded-2xl p-5 space-y-5">
      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-950/60 border border-cyan-500/30 text-cyan-400">
            <Crosshair className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-slate-100">
                DECOY CANARY FILE MONITORING
              </h3>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
                BEHAVIORAL TRIPWIRES
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              High-Entropy Decoy Files Strategically Placed to Lure and Intercept Ransomware Encryptors
            </p>
          </div>
        </div>

        <button
          onClick={onNavigateVault}
          className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-white/[0.08] hover:border-cyan-500/40 transition-all"
        >
          <span>Canary Vault Inventory ({totalDecoys})</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 5 Core Status Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 font-mono">
        {/* Metric 1 */}
        <div className="p-3.5 rounded-xl bg-slate-950/70 border border-white/[0.06] space-y-1">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Total Decoy Files</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-extrabold text-slate-100">{totalDecoys}</span>
            <span className="text-[10px] text-cyan-400">ARMED</span>
          </div>
          <span className="text-[10px] text-slate-500 block truncate">Across all system drives</span>
        </div>

        {/* Metric 2 */}
        <div className="p-3.5 rounded-xl bg-slate-950/70 border border-white/[0.06] space-y-1">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Decoy Files Accessed</span>
          <div className="flex items-baseline gap-1.5">
            <span className={`text-2xl font-extrabold ${decoyFilesAccessed > 0 ? 'text-rose-400' : 'text-slate-100'}`}>
              {decoyFilesAccessed}
            </span>
            <span className="text-[10px] text-slate-500">CANARIES</span>
          </div>
          <span className="text-[10px] text-slate-500 block truncate">
            {decoyFilesAccessed > 0 ? "1 Tamper caught" : "0 Unauthorized"}
          </span>
        </div>

        {/* Metric 3 */}
        <div className="p-3.5 rounded-xl bg-slate-950/70 border border-white/[0.06] space-y-1">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Suspicious Access Attempts</span>
          <div className="flex items-baseline gap-1.5">
            <span className={`text-2xl font-extrabold ${suspiciousAttempts > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {suspiciousAttempts}
            </span>
            <span className="text-[10px] text-slate-500">ATTEMPTS</span>
          </div>
          <span className="text-[10px] text-slate-500 block truncate">
            {suspiciousAttempts > 0 ? "Minifilter blocked" : "Clean baseline"}
          </span>
        </div>

        {/* Metric 4 */}
        <div className="p-3.5 rounded-xl bg-slate-950/70 border border-white/[0.06] space-y-1">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Last Detected Access</span>
          <div className="text-xs font-bold text-slate-200 truncate pt-1">
            {lastDetectedAccess}
          </div>
          <span className="text-[10px] text-slate-500 block">Kernel write hook check</span>
        </div>

        {/* Metric 5 */}
        <div className="p-3.5 rounded-xl bg-slate-950/70 border border-white/[0.06] space-y-1 col-span-2 sm:col-span-1">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Protection Status</span>
          <div className="flex items-center gap-1.5 pt-1">
            <span className={`w-2 h-2 rounded-full ${trippedTraps.length > 0 ? 'bg-rose-400 animate-pulse' : 'bg-emerald-400'}`} />
            <span className={`text-xs font-bold ${trippedTraps.length > 0 ? 'text-rose-300' : 'text-emerald-400'}`}>
              {currentProtectionStatus}
            </span>
          </div>
          <span className="text-[10px] text-slate-500 block">DACL lockdown active</span>
        </div>
      </div>

      {/* Featured Strategic Tripwire Traps Preview */}
      <div className="space-y-2">
        <div className="text-xs font-mono font-semibold text-slate-400 flex items-center justify-between">
          <span>Strategic Decoy Traps In Root Folders</span>
          <span className="text-[11px] text-slate-500">Honeypot Decoy Tripwire Matrix</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {featuredDecoys.map((decoy, idx) => {
            const Icon = decoy.icon;
            const isTripped = decoy.status === "TAMPER BLOCKED";

            return (
              <div
                key={idx}
                className={`p-3.5 rounded-xl bg-slate-950/80 border transition-all ${
                  isTripped 
                    ? "border-rose-500/60 bg-rose-950/30 glow-crimson" 
                    : "border-white/[0.06] hover:border-cyan-500/30"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg bg-slate-900 border border-white/[0.06] ${decoy.iconColor}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-200 font-mono truncate max-w-[130px]" title={decoy.name}>
                        {decoy.name}
                      </h4>
                      <span className="text-[10px] text-slate-500 font-mono block">{decoy.dept}</span>
                    </div>
                  </div>

                  <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border uppercase ${
                    isTripped 
                      ? "bg-rose-900 text-rose-200 border-rose-500 animate-pulse" 
                      : "bg-emerald-950/80 text-emerald-300 border-emerald-500/30"
                  }`}>
                    {decoy.status}
                  </span>
                </div>

                <div className="mt-2.5 pt-2 border-t border-white/[0.04] flex items-center justify-between text-[10px] font-mono text-slate-500">
                  <span className="truncate max-w-[140px]" title={decoy.path}>{decoy.path}</span>
                  <span className="text-cyan-400 font-medium">{decoy.type}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
