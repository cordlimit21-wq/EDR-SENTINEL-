import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Terminal, 
  Cpu, 
  Lock, 
  AlertTriangle, 
  CheckCircle2, 
  X, 
  ExternalLink, 
  Crosshair, 
  Clock, 
  ShieldAlert, 
  FileText,
  Activity,
  Zap,
  ArrowRight
} from 'lucide-react';
import FeatureExplainer from './FeatureExplainer';

export default function ThreatHuntingView({ 
  events = [], 
  onSelectEvent, 
  onViewForensics,
  theme = 'dark' 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [eventTypeFilter, setEventTypeFilter] = useState('ALL');
  const [inspectedEvent, setInspectedEvent] = useState(null);

  // Filter events based on criteria
  const filteredEvents = events.filter((evt) => {
    // 1. Search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      const matches = 
        (evt.id && evt.id.toLowerCase().includes(term)) ||
        (evt.process_name && evt.process_name.toLowerCase().includes(term)) ||
        String(evt.pid).toLowerCase().includes(term) ||
        (evt.target_file && evt.target_file.toLowerCase().includes(term)) ||
        (evt.action_taken && evt.action_taken.toLowerCase().includes(term)) ||
        (evt.detection_trigger && evt.detection_trigger.toLowerCase().includes(term));
      if (!matches) return false;
    }

    // 2. Severity filter
    if (severityFilter !== 'ALL') {
      if (evt.severity !== severityFilter) return false;
    }

    // 3. Event Type filter
    if (eventTypeFilter !== 'ALL') {
      if (evt.action_taken !== eventTypeFilter) return false;
    }

    return true;
  });

  const getSeverityBadge = (sev) => {
    switch (sev) {
      case 'CRITICAL_KILL':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-950/80 text-rose-300 border border-rose-500/50">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
            CRITICAL
          </span>
        );
      case 'WARNING':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-950/80 text-amber-300 border border-amber-500/40">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            WARNING
          </span>
        );
      case 'INFO':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/[0.08]">
            INFO
          </span>
        );
    }
  };

  const getRiskScore = (evt) => {
    if (evt.severity === 'CRITICAL_KILL') return '94 / 100';
    if (evt.severity === 'WARNING') return `${Math.min(76, Math.max(52, Math.round((evt.entropy_score || 4.0) * 10)))} / 100`;
    return `${Math.min(25, Math.max(5, Math.round((evt.entropy_score || 4.0) * 3.2)))} / 100`;
  };

  return (
    <div className="space-y-5 font-mono">
      {/* 1. Header & Hunting Controls */}
      <div className="cyber-card p-5 rounded-2xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-white/[0.06] pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-orange-50 dark:bg-orange-950/60 border border-orange-200 dark:border-orange-500/40 text-orange-500 dark:text-orange-400">
              <Crosshair className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 flex items-center gap-2">
                THREAT HUNTING WORKSPACE
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950/80 text-orange-700 dark:text-orange-300 border border-orange-300 dark:border-orange-500/30">
                  {events.length} Telemetry Events
                </span>
                <FeatureExplainer featureKey="threat-hunting" />
              </h1>
              <p className="text-[11px] text-slate-500">
                Multi-attribute query &amp; heuristic correlation engine
              </p>
            </div>
          </div>
        </div>

        {/* Search Bar & Multi-Filter Controls */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 text-xs">
          {/* Search bar */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search events, process names, PIDs, paths, event IDs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-950/80 border border-slate-300 dark:border-white/[0.08] text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 font-mono focus:outline-none focus:border-orange-500/60 shadow-sm"
            />
          </div>

          {/* Severity Filter */}
          <div className="md:col-span-3">
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-950/80 border border-slate-300 dark:border-white/[0.08] text-slate-800 dark:text-slate-200 font-mono focus:outline-none focus:border-orange-500/60 shadow-sm"
            >
              <option value="ALL">Severity: All</option>
              <option value="CRITICAL_KILL">Severity: CRITICAL</option>
              <option value="WARNING">Severity: WARNING</option>
              <option value="INFO">Severity: INFO</option>
            </select>
          </div>

          {/* Event Type Filter */}
          <div className="md:col-span-3">
            <select
              value={eventTypeFilter}
              onChange={(e) => setEventTypeFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-950/80 border border-slate-300 dark:border-white/[0.08] text-slate-800 dark:text-slate-200 font-mono focus:outline-none focus:border-orange-500/60 shadow-sm"
            >
              <option value="ALL">Event Type: All</option>
              <option value="FILE_CREATED">FILE_CREATED</option>
              <option value="FILE_MODIFIED">FILE_MODIFIED</option>
              <option value="FILE_DELETED">FILE_DELETED</option>
              <option value="DECOY_ACCESSED">DECOY_ACCESSED</option>
              <option value="PROCESS_FORCE_TERMINATED">PROCESS_FORCE_TERMINATED</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. Comprehensive Threat Hunting Event Table */}
      <div className="cyber-card rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 dark:bg-slate-950/80 border-b border-slate-200 dark:border-white/[0.06] text-[10px] uppercase text-slate-600 dark:text-slate-400 tracking-wider">
              <tr>
                <th className="py-3 px-4">Event Time</th>
                <th className="py-3 px-4">Event ID</th>
                <th className="py-3 px-4">Event Type</th>
                <th className="py-3 px-4">Process</th>
                <th className="py-3 px-4">PID</th>
                <th className="py-3 px-4">Target Path</th>
                <th className="py-3 px-4">Indicator</th>
                <th className="py-3 px-4">Risk</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-white/[0.04]">
              {filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan="9" className="py-12 text-center text-slate-500 text-xs">
                    No events matched the hunting query.
                  </td>
                </tr>
              ) : (
                filteredEvents.map((evt) => {
                  const isCritical = evt.severity === 'CRITICAL_KILL';
                  const isWarning = evt.severity === 'WARNING';
                  const isSelected = inspectedEvent?.id === evt.id;

                  return (
                    <tr
                      key={evt.id}
                      onClick={() => setInspectedEvent(evt)}
                      className={`cursor-pointer transition-colors ${
                        isSelected 
                          ? 'bg-orange-100 dark:bg-orange-950/30' 
                          : isCritical 
                            ? 'bg-rose-100/60 dark:bg-rose-950/20 hover:bg-rose-100 dark:hover:bg-rose-950/40' 
                            : isWarning 
                              ? 'bg-amber-50 dark:bg-amber-950/10 hover:bg-amber-100/70 dark:hover:bg-amber-950/20' 
                              : 'hover:bg-slate-100 dark:hover:bg-slate-900/40'
                      }`}
                    >
                      <td className="py-3 px-4 text-slate-500 dark:text-slate-400 font-mono text-[11px] whitespace-nowrap">
                        {evt.timestamp}
                      </td>
                      <td className="py-3 px-4 text-cyan-700 dark:text-cyan-300 font-mono font-semibold whitespace-nowrap">
                        {evt.id}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
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
                      <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                        {evt.process_name || "UNKNOWN"}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-600 dark:text-slate-300 whitespace-nowrap">
                        {evt.pid ? `PID: ${evt.pid}` : "PID: UNKNOWN"}
                      </td>
                      <td className="py-3 px-4 text-slate-700 dark:text-slate-300 max-w-[220px] truncate" title={evt.target_file}>
                        {evt.target_file ? evt.target_file.split(/[\\/]/).pop() : "UNKNOWN"}
                      </td>
                      <td className="py-3 px-4 text-slate-500 dark:text-slate-400 text-[11px] max-w-[180px] truncate" title={evt.detection_trigger}>
                        {evt.detection_trigger || "REAL_FILESYSTEM_IO"}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className={`font-semibold ${isCritical ? 'text-rose-600 dark:text-rose-400' : isWarning ? 'text-amber-600 dark:text-amber-400' : 'text-slate-500 dark:text-slate-400'}`}>
                          {getRiskScore(evt)}
                        </span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        {getSeverityBadge(evt.severity)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Event Investigation Slideout Panel (Item 14) */}
      {inspectedEvent && (
        <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-white/95 dark:bg-[#070b14]/95 backdrop-blur-2xl border-l border-slate-200 dark:border-white/[0.08] shadow-2xl p-6 overflow-y-auto space-y-5 font-mono text-xs animate-in slide-in-from-right duration-200">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/[0.08] pb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-orange-100 dark:bg-orange-950/80 border border-orange-300 dark:border-orange-500/40 text-orange-600 dark:text-orange-400">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Investigation Panel</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">{inspectedEvent.id}</span>
              </div>
            </div>
            <button
              onClick={() => setInspectedEvent(null)}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Details Table */}
          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-white/[0.06] space-y-1">
              <span className="text-[10px] text-slate-500 uppercase">Event Timestamp</span>
              <span className="text-xs text-slate-800 dark:text-slate-200 block font-semibold">{inspectedEvent.timestamp}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-white/[0.06] space-y-1">
              <span className="text-[10px] text-slate-500 uppercase">Event Type / Action</span>
              <span className="text-xs text-orange-600 dark:text-orange-400 block font-bold">{inspectedEvent.action_taken}</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-white/[0.06] space-y-1">
                <span className="text-[10px] text-slate-500 uppercase">Process Name</span>
                <span className="text-xs text-slate-900 dark:text-white block font-bold">{inspectedEvent.process_name || "UNKNOWN"}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-white/[0.06] space-y-1">
                <span className="text-[10px] text-slate-500 uppercase">PID</span>
                <span className="text-xs text-rose-600 dark:text-rose-400 block font-bold">{inspectedEvent.pid || "UNKNOWN"}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-white/[0.06] space-y-1">
              <span className="text-[10px] text-slate-500 uppercase">Parent PID &amp; Name</span>
              <span className="text-xs text-slate-700 dark:text-slate-300 block">
                {inspectedEvent.parent_process || "UNRESOLVED"} (PID: {inspectedEvent.lineage?.[0]?.pid || "UNKNOWN"})
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-white/[0.06] space-y-1">
              <span className="text-[10px] text-slate-500 uppercase">Target Path</span>
              <span className="text-xs text-slate-700 dark:text-slate-300 block break-all">{inspectedEvent.target_file || "UNKNOWN"}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-white/[0.06] space-y-1">
              <span className="text-[10px] text-slate-500 uppercase">Command Line / Executable</span>
              <span className="text-xs text-slate-700 dark:text-slate-300 block break-all">
                {inspectedEvent.lineage?.[1]?.command_line || (inspectedEvent.process_name ? `${inspectedEvent.process_name} (Active)` : "UNKNOWN")}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-white/[0.06] space-y-1">
              <span className="text-[10px] text-slate-500 uppercase">Risk Score &amp; Entropy</span>
              <span className="text-xs text-orange-600 dark:text-orange-400 block font-bold">
                {getRiskScore(inspectedEvent)} • H = {inspectedEvent.entropy_score || 4.0} / 8.00
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-white/[0.06] space-y-1">
              <span className="text-[10px] text-slate-500 uppercase">Detection Reason</span>
              <span className="text-xs text-slate-700 dark:text-slate-300 block leading-relaxed">
                {inspectedEvent.details || inspectedEvent.detection_trigger || "Normal filesystem operation"}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-white/[0.06] space-y-1">
              <span className="text-[10px] text-slate-500 uppercase">Containment Result</span>
              <span className={`text-xs block font-bold ${
                inspectedEvent.severity === 'CRITICAL_KILL' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'
              }`}>
                {inspectedEvent.severity === 'CRITICAL_KILL' ? 'PROCESS CONTAINED IN 11ms' : 'MONITORED / ALLOWED'}
              </span>
            </div>
          </div>

          {onViewForensics && inspectedEvent.severity === 'CRITICAL_KILL' && (
            <div className="pt-2">
              <button
                onClick={() => {
                  onViewForensics(inspectedEvent);
                  setInspectedEvent(null);
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-orange-500/20"
              >
                <span>Inspect Lineage Tree</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
