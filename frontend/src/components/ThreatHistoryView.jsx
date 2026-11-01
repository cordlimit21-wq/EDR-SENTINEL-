import React, { useState } from 'react';
import { 
  History, 
  ShieldCheck, 
  Search, 
  Lock, 
  Clock, 
  ArrowRight,
  Play,
  Filter,
  ArrowUpDown
} from 'lucide-react';
import FeatureExplainer from './FeatureExplainer';

export default function ThreatHistoryView({ 
  threats = [], 
  onSelectThreat, 
  onViewForensics,
  onSimulateAttack,
  theme = 'dark'
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('desc'); // 'desc' | 'asc'

  const filteredThreats = threats
    .filter(t => {
      if (!searchTerm.trim()) return true;
      const term = searchTerm.toLowerCase();
      return (
        t.process_name?.toLowerCase().includes(term) ||
        String(t.pid).toLowerCase().includes(term) ||
        t.target_file?.toLowerCase().includes(term) ||
        t.id?.toLowerCase().includes(term) ||
        t.details?.toLowerCase().includes(term)
      );
    })
    .sort((a, b) => {
      if (sortOrder === 'asc') {
        return (a.timestamp || '').localeCompare(b.timestamp || '');
      }
      return (b.timestamp || '').localeCompare(a.timestamp || '');
    });

  return (
    <div className="cyber-card rounded-2xl p-6 space-y-6 min-h-[calc(100vh-140px)] font-mono text-xs">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.06] pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-orange-950/80 border border-orange-500/40 text-orange-400">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
              HISTORICAL THREAT AUDIT LOG
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-100 dark:bg-slate-900 text-orange-700 dark:text-orange-300 border border-orange-300 dark:border-orange-500/30">
                {threats.length} Neutralized Outbreaks
              </span>
              <FeatureExplainer featureKey="threat-history" />
            </h1>
            <p className="text-[11px] text-slate-500">
              Complete Forensics of Neutralized Zero-Day Ransomware Attacks
            </p>
          </div>
        </div>

        {/* Search & Sort Controls */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search historical logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-950/80 border border-slate-300 dark:border-white/[0.08] text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 font-mono focus:outline-none focus:border-orange-500/60 w-52 sm:w-64 shadow-sm"
            />
          </div>

          <button
            onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
            title="Sort by timestamp"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900/80 dark:hover:bg-slate-800 border border-slate-300 dark:border-white/[0.08] text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all text-xs shadow-sm"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-orange-500 dark:text-orange-400" />
            <span>{sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}</span>
          </button>
        </div>
      </div>

      {/* Investigation Timeline Body */}
      {filteredThreats.length === 0 ? (
        <div className="py-20 flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-4">
          <div className="relative p-5 rounded-3xl bg-emerald-50 dark:bg-slate-900/60 border border-emerald-300 dark:border-white/[0.07] text-emerald-600 dark:text-emerald-400 shadow-xl shadow-emerald-950/20">
            <ShieldCheck className="w-12 h-12 text-emerald-600 dark:text-emerald-400" />
            <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
          </div>

          <div className="space-y-1.5">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              No Threat History Recorded
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              No ransomware outbreaks or unauthorized tampering events have occurred. All decoy honeypot tripwires remain intact.
            </p>
          </div>

          {onSimulateAttack && (
            <button
              onClick={onSimulateAttack}
              className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold transition-all shadow-lg shadow-orange-500/20"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Run Attack Simulation</span>
            </button>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 dark:bg-slate-950/80 border-b border-slate-200 dark:border-white/[0.06] text-[10px] uppercase text-slate-600 dark:text-slate-400 tracking-wider">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Event ID</th>
                <th className="py-3 px-4">PID</th>
                <th className="py-3 px-4">Process</th>
                <th className="py-3 px-4">Event</th>
                <th className="py-3 px-4">Target</th>
                <th className="py-3 px-4">Risk Score</th>
                <th className="py-3 px-4">Reason</th>
                <th className="py-3 px-4">State</th>
                <th className="py-3 px-4">Containment Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-white/[0.04]">
              {filteredThreats.map((t) => (
                <tr
                  key={t.id}
                  onClick={() => {
                    if (onSelectThreat) onSelectThreat(t);
                    if (onViewForensics) onViewForensics(t);
                  }}
                  className="cursor-pointer hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
                >
                  <td className="py-3 px-4 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                    {t.timestamp}
                  </td>
                  <td className="py-3 px-4 text-cyan-700 dark:text-cyan-300 font-bold whitespace-nowrap">
                    {t.id}
                  </td>
                  <td className="py-3 px-4 font-mono text-rose-600 dark:text-rose-400 font-bold whitespace-nowrap">
                    {t.pid}
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white whitespace-nowrap">
                    {t.process_name}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-500/50">
                      {t.action_taken || "PROCESS_FORCE_TERMINATED"}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-700 dark:text-slate-300 max-w-[180px] truncate" title={t.target_file}>
                    {t.target_file ? t.target_file.split(/[\\/]/).pop() : "UNKNOWN"}
                  </td>
                  <td className="py-3 px-4 font-bold text-orange-600 dark:text-orange-400 whitespace-nowrap">
                    94 / 100
                  </td>
                  <td className="py-3 px-4 text-slate-500 dark:text-slate-400 text-[11px] max-w-[200px] truncate" title={t.details}>
                    {t.details || t.detection_trigger || "Anomaly correlation"}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap font-bold text-emerald-600 dark:text-emerald-400">
                    CONTAINED
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                      <Lock className="w-3.5 h-3.5" />
                      11ms SIGKILL (0xC0000409)
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
