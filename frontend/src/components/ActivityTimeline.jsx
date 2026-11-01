import React, { useState } from 'react';
import { 
  Activity, 
  ShieldAlert, 
  CheckCircle2, 
  Lock, 
  Terminal, 
  Clock, 
  Filter, 
  AlertTriangle,
  Radio,
  FileText
} from 'lucide-react';
import FeatureExplainer from './FeatureExplainer';

export default function ActivityTimeline({ 
  events = [], 
  onSelectEvent, 
  onViewForensics,
  isFullPage = false,
  theme = 'dark'
}) {
  const [filter, setFilter] = useState('ALL'); // 'ALL' | 'CRITICAL' | 'WARNING' | 'INFO'

  const filteredEvents = events.filter(evt => {
    if (filter === 'CRITICAL') return evt.severity === 'CRITICAL_KILL';
    if (filter === 'WARNING') return evt.severity === 'WARNING';
    if (filter === 'INFO') return evt.severity === 'INFO';
    return true;
  });

  const getRiskLabel = (evt) => {
    if (evt.severity === 'CRITICAL_KILL') return { text: 'CRITICAL', color: 'text-rose-400' };
    if (evt.severity === 'WARNING') return { text: 'HIGH', color: 'text-amber-400' };
    return { text: 'LOW', color: 'text-slate-400' };
  };

  const getStatusLabel = (evt) => {
    if (evt.action_taken === 'PROCESS_FORCE_TERMINATED' || evt.severity === 'CRITICAL_KILL') {
      return { text: 'CONTAINED', style: 'bg-rose-950 text-rose-300 border-rose-500/50' };
    }
    if (evt.status === 'TAMPER_ATTEMPT_BLOCKED') {
      return { text: 'BLOCKED', style: 'bg-rose-950 text-rose-300 border-rose-500/50' };
    }
    if (evt.severity === 'WARNING' || evt.status === 'SUSPICIOUS') {
      return { text: 'SUSPICIOUS', style: 'bg-amber-950/80 text-amber-300 border-amber-500/40' };
    }
    return { text: 'OBSERVED', style: 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/[0.06]' };
  };

  return (
    <div className={`cyber-card rounded-2xl p-5 flex flex-col justify-between font-mono text-xs ${
      isFullPage ? 'min-h-[calc(100vh-140px)]' : 'h-full'
    }`}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-white/[0.06] pb-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-white/[0.08] text-orange-500 dark:text-orange-400">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 flex items-center gap-2">
              LIVE ACTIVITY STREAM
              <span className="inline-flex items-center gap-1 text-[10px] font-normal px-2 py-0.2 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Live WebSocket
              </span>
              <FeatureExplainer featureKey="live-activity" />
            </h2>
            <p className="text-[10px] text-slate-500">
              Real-time NTFS filesystem I/O and process execution events
            </p>
          </div>
        </div>

        {/* Severity Filter Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-950/80 p-1 rounded-xl border border-slate-200 dark:border-white/[0.06] text-[10px]">
          {['ALL', 'CRITICAL', 'WARNING', 'INFO'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                filter === tab
                  ? 'bg-orange-500/20 text-orange-600 dark:text-orange-300 font-bold border border-orange-500/30'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Real-time Activity Table */}
      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-100 dark:bg-slate-950/80 border-b border-slate-200 dark:border-white/[0.06] text-[10px] uppercase text-slate-600 dark:text-slate-400 tracking-wider">
            <tr>
              <th className="py-2.5 px-3">Time</th>
              <th className="py-2.5 px-3">Event ID</th>
              <th className="py-2.5 px-3">Event Type</th>
              <th className="py-2.5 px-3">Process</th>
              <th className="py-2.5 px-3">PID</th>
              <th className="py-2.5 px-3">Path / Target</th>
              <th className="py-2.5 px-3">Risk</th>
              <th className="py-2.5 px-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-white/[0.04]">
            {filteredEvents.length === 0 ? (
              <tr>
                <td colSpan="8" className="py-12 text-center text-slate-500 text-xs">
                  Awaiting real-time filesystem activity in EDR_Test/ ...
                </td>
              </tr>
            ) : (
              filteredEvents.map((evt) => {
                const risk = getRiskLabel(evt);
                const status = getStatusLabel(evt);
                const isCritical = evt.severity === 'CRITICAL_KILL';

                return (
                  <tr
                    key={evt.id}
                    onClick={() => {
                      if (onSelectEvent) onSelectEvent(evt);
                      if (isCritical && onViewForensics) onViewForensics(evt);
                    }}
                    className={`cursor-pointer transition-colors ${
                      isCritical 
                        ? 'bg-rose-100/60 dark:bg-rose-950/20 hover:bg-rose-100 dark:hover:bg-rose-950/40' 
                        : evt.severity === 'WARNING'
                          ? 'bg-amber-50 dark:bg-amber-950/10 hover:bg-amber-100/70 dark:hover:bg-amber-950/20'
                          : 'hover:bg-slate-100 dark:hover:bg-slate-900/40'
                    }`}
                  >
                    <td className="py-2.5 px-3 font-mono text-slate-500 dark:text-slate-400 text-[11px] whitespace-nowrap">
                      {evt.timestamp}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-cyan-700 dark:text-cyan-300 font-semibold whitespace-nowrap">
                      {evt.id}
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        evt.action_taken === 'PROCESS_FORCE_TERMINATED'
                          ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-500/50'
                          : evt.action_taken === 'FILE_DELETED'
                            ? 'bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300'
                            : evt.action_taken === 'FILE_MODIFIED'
                              ? 'bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300'
                              : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                      }`}>
                        {evt.action_taken}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                      {evt.process_name || "UNKNOWN"}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-600 dark:text-slate-300 whitespace-nowrap">
                      {evt.pid && evt.pid !== "UNKNOWN" ? `PID: ${evt.pid}` : "PID: UNKNOWN"}
                    </td>
                    <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300 max-w-[240px] truncate" title={evt.target_file}>
                      {evt.target_file || "UNKNOWN"}
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap font-bold">
                      <span className={risk.color}>{risk.text}</span>
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${status.style}`}>
                        {status.text}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Note */}
      <div className="pt-3 border-t border-slate-200 dark:border-white/[0.04] text-[10px] text-slate-500 flex items-center justify-between">
        <span>Displaying {filteredEvents.length} events received over WebSocket</span>
        <span className="text-slate-500 dark:text-slate-400">NTFS Driver Altitude: 385200</span>
      </div>
    </div>
  );
}
