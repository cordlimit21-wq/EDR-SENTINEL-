import React, { useState, useRef } from 'react';
import { Terminal, Shield, AlertTriangle, Skull, Search, Trash2, Pause, Play, Download, ExternalLink, Lock, CheckCircle2 } from 'lucide-react';

export default function LiveTelemetryFeed({ 
  events, 
  onSelectEvent, 
  selectedEventId, 
  onClearFeed,
  onViewForensics,
  isFullPage = false 
}) {
  const [filterSeverity, setFilterSeverity] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef(null);

  // Compute risk score helper
  const getRiskScore = (evt) => {
    if (evt.severity === 'CRITICAL_KILL') return 94;
    if (evt.severity === 'WARNING') return Math.min(78, Math.max(52, Math.round(evt.entropy_score * 10)));
    return Math.min(26, Math.max(10, Math.round(evt.entropy_score * 3.2)));
  };

  // Determine threat severity badge (LOW, MEDIUM, HIGH, CRITICAL, CONTAINED)
  const getThreatBadge = (evt) => {
    if (evt.action_taken === 'PROCESS_FORCE_TERMINATED' || evt.severity === 'CRITICAL_KILL') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-600 text-white shadow-sm shadow-rose-950 uppercase tracking-wider">
          <Lock className="w-2.5 h-2.5" />
          CONTAINED
        </span>
      );
    }
    if (evt.severity === 'WARNING') {
      const risk = getRiskScore(evt);
      if (risk > 65) {
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-amber-950 text-amber-300 border border-amber-500/50 uppercase">
            <AlertTriangle className="w-2.5 h-2.5 text-amber-400" />
            HIGH
          </span>
        );
      }
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-sky-950 text-sky-300 border border-sky-500/40 uppercase">
          MEDIUM
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 uppercase">
        <Shield className="w-2.5 h-2.5 text-emerald-400" />
        LOW
      </span>
    );
  };

  const filteredEvents = events.filter((e) => {
    // Severity Filter
    if (filterSeverity === 'CRITICAL' && e.severity !== 'CRITICAL_KILL') return false;
    if (filterSeverity === 'WARNING' && e.severity !== 'WARNING') return false;
    if (filterSeverity === 'INFO' && e.severity !== 'INFO') return false;

    // Search Filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      const matchProc = e.process_name.toLowerCase().includes(term);
      const matchFile = e.target_file.toLowerCase().includes(term);
      const matchPid = String(e.pid).includes(term);
      const matchTrigger = e.detection_trigger.toLowerCase().includes(term);
      if (!matchProc && !matchFile && !matchPid && !matchTrigger) return false;
    }

    return true;
  });

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(events, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `sentinel_threat_telemetry_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className={`cyber-card rounded-2xl flex flex-col shadow-lg overflow-hidden ${
      isFullPage ? 'h-[calc(100vh-130px)]' : 'h-full'
    }`}>
      {/* Header & Controls */}
      <div className="p-4 border-b border-white/[0.06] flex flex-wrap items-center justify-between gap-3 bg-slate-950/70">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-slate-900/80 border border-white/[0.08] text-cyan-400">
            <Terminal className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold font-mono tracking-wide text-slate-100 flex items-center gap-2">
              REAL-TIME THREAT MONITORING STREAM
              <span className="text-[10px] font-normal px-2 py-0.2 rounded-full bg-slate-900 text-cyan-300 border border-cyan-500/30 font-mono">
                {filteredEvents.length} events
              </span>
            </h2>
            <p className="text-[10px] text-slate-500 font-mono">
              Live Minifilter Telemetry, Heuristic Anomaly Tracing & Tripwire Traps
            </p>
          </div>
        </div>

        {/* Search & Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search process, file, PID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1 text-xs rounded-lg bg-slate-950/80 border border-white/[0.08] text-slate-200 placeholder-slate-500 font-mono focus:outline-none focus:border-cyan-500/60 w-44 sm:w-56"
            />
          </div>

          {/* Severity Filter Tabs */}
          <div className="flex rounded-lg bg-slate-950/90 p-0.5 border border-white/[0.06] text-xs font-mono">
            {['ALL', 'CRITICAL', 'WARNING', 'INFO'].map((sev) => (
              <button
                key={sev}
                onClick={() => setFilterSeverity(sev)}
                className={`px-2.5 py-1 rounded text-[10px] transition-all ${
                  filterSeverity === sev
                    ? sev === 'CRITICAL'
                      ? 'bg-rose-600 text-white font-bold'
                      : sev === 'WARNING'
                      ? 'bg-amber-600 text-white font-bold'
                      : 'bg-cyan-600 text-white font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>

          {/* Export JSON */}
          <button
            onClick={handleExportJson}
            title="Export telemetry events as JSON"
            className="p-1.5 rounded-lg bg-slate-900 border border-white/[0.08] text-slate-400 hover:text-cyan-300 hover:border-cyan-500/40 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          {/* Pause / Resume */}
          <button
            onClick={() => setIsPaused(!isPaused)}
            title={isPaused ? "Resume feed" : "Pause feed"}
            className={`p-1.5 rounded-lg border text-xs font-mono transition-all ${
              isPaused 
                ? "bg-amber-950/60 border-amber-500/50 text-amber-300" 
                : "bg-slate-900 border-white/[0.08] text-slate-300 hover:bg-slate-800"
            }`}
          >
            {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
          </button>

          {/* Clear Feed */}
          <button
            onClick={onClearFeed}
            title="Clear display logs"
            className="p-1.5 rounded-lg bg-slate-900 border border-white/[0.08] text-slate-400 hover:text-rose-400 hover:border-rose-500/40 transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Telemetry Table */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto divide-y divide-white/[0.04] font-mono text-xs select-text min-h-0"
      >
        {filteredEvents.length === 0 ? (
          <div className="py-20 text-center text-slate-500 font-mono">
            <Terminal className="w-10 h-10 mx-auto mb-2 opacity-30 text-slate-400" />
            <p className="text-sm text-slate-400">No telemetry events matching filter '{filterSeverity}'</p>
            <p className="text-xs text-slate-600 mt-1">Listening for kernel I/O signals...</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 z-10 bg-slate-950/95 border-b border-white/[0.06] text-[10px] text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="py-2.5 px-3.5">Timestamp</th>
                <th className="py-2.5 px-3.5">Threat Severity</th>
                <th className="py-2.5 px-3.5">Process Name</th>
                <th className="py-2.5 px-3.5">PID</th>
                <th className="py-2.5 px-3.5">Risk Score</th>
                <th className="py-2.5 px-3.5">Detection Reason</th>
                <th className="py-2.5 px-3.5">Target Decoy Path</th>
                <th className="py-2.5 px-3.5">Status</th>
                <th className="py-2.5 px-3.5 text-right">Forensics</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filteredEvents.map((evt) => {
                const isCritical = evt.severity === 'CRITICAL_KILL';
                const isSelected = selectedEventId === evt.id;
                const riskScore = getRiskScore(evt);

                return (
                  <tr
                    key={evt.id}
                    onClick={() => onSelectEvent(evt)}
                    className={`cursor-pointer transition-colors ${
                      isCritical
                        ? "bg-rose-950/20 hover:bg-rose-950/30 border-l-2 border-rose-500 text-rose-200"
                        : evt.severity === 'WARNING'
                        ? "bg-amber-950/15 hover:bg-amber-950/25 border-l-2 border-amber-500 text-amber-200"
                        : "hover:bg-slate-900/40 border-l-2 border-transparent text-slate-300"
                    } ${isSelected ? "ring-1 ring-cyan-400 bg-cyan-950/20" : ""}`}
                  >
                    {/* Timestamp */}
                    <td className="py-2.5 px-3.5 whitespace-nowrap text-slate-400 font-mono text-[11px]">
                      {evt.timestamp}
                    </td>

                    {/* Threat Severity Badge (LOW, MEDIUM, HIGH, CRITICAL, CONTAINED) */}
                    <td className="py-2.5 px-3.5 whitespace-nowrap">
                      {getThreatBadge(evt)}
                    </td>

                    {/* Process Name */}
                    <td className="py-2.5 px-3.5 whitespace-nowrap font-semibold">
                      <div className="flex items-center gap-1.5">
                        {isCritical ? (
                          <Skull className="w-3.5 h-3.5 text-rose-400" />
                        ) : evt.severity === 'WARNING' ? (
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                        ) : (
                          <Shield className="w-3.5 h-3.5 text-cyan-400" />
                        )}
                        <span className={isCritical ? 'text-rose-300 font-bold' : 'text-slate-200'}>
                          {evt.process_name}
                        </span>
                      </div>
                    </td>

                    {/* PID */}
                    <td className="py-2.5 px-3.5 whitespace-nowrap text-slate-400 text-[11px]">
                      #{evt.pid}
                    </td>

                    {/* Risk Score */}
                    <td className="py-2.5 px-3.5 whitespace-nowrap">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        riskScore >= 80 
                          ? 'bg-rose-950 text-rose-300 border border-rose-500/40' 
                          : riskScore >= 50 
                          ? 'bg-amber-950 text-amber-300 border border-amber-500/30' 
                          : 'bg-slate-900 text-cyan-400 border border-white/[0.06]'
                      }`}>
                        {riskScore} / 100
                      </span>
                    </td>

                    {/* Detection Reason */}
                    <td className="py-2.5 px-3.5 whitespace-nowrap text-slate-300 text-[11px]">
                      <span className={isCritical ? 'text-rose-300 font-medium' : 'text-slate-400'}>
                        {evt.detection_trigger}
                      </span>
                    </td>

                    {/* Target Decoy Path */}
                    <td className="py-2.5 px-3.5 max-w-[200px] lg:max-w-[300px] truncate text-slate-400 text-[11px]" title={evt.target_file}>
                      <span className={isCritical ? 'text-rose-300 underline underline-offset-2 decoration-rose-500/40' : ''}>
                        {evt.target_file}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-2.5 px-3.5 whitespace-nowrap">
                      <span className={`text-[10px] uppercase font-bold ${
                        evt.status === 'TAMPER_ATTEMPT_BLOCKED'
                          ? 'text-rose-400'
                          : evt.status === 'SUSPICIOUS'
                          ? 'text-amber-400'
                          : 'text-emerald-400'
                      }`}>
                        {evt.status === 'TAMPER_ATTEMPT_BLOCKED' ? 'BLOCKED' : evt.status}
                      </span>
                    </td>

                    {/* Forensics Action */}
                    <td className="py-2.5 px-3.5 whitespace-nowrap text-right">
                      {isCritical && onViewForensics && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectEvent(evt);
                            onViewForensics(evt);
                          }}
                          className="px-2 py-0.5 rounded bg-rose-900/80 hover:bg-rose-800 border border-rose-500/60 text-rose-200 text-[10px] font-bold inline-flex items-center gap-1 transition-colors"
                        >
                          <span>Forensics</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-white/[0.06] bg-slate-950/80 flex flex-wrap items-center justify-between text-[10px] text-slate-500 font-mono gap-2">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Minifilter Hook: <code className="text-cyan-400">IRP_MJ_CREATE / IRP_MJ_WRITE</code>
        </span>
        <span>Click any row to inspect process lineage • Filter by severity or search</span>
      </div>
    </div>
  );
}
