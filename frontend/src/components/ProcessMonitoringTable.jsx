import React, { useState } from 'react';
import { 
  Terminal, 
  Cpu, 
  Search, 
  X, 
  ShieldCheck, 
  ShieldAlert, 
  Lock, 
  Clock, 
  FileText,
  ArrowRight,
  Zap
} from 'lucide-react';

export default function ProcessMonitoringTable({ 
  events = [], 
  onSelectEvent, 
  onViewForensics,
  isFullPage = false,
  theme = 'dark'
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProcess, setSelectedProcess] = useState(null);

  // Group real events by PID
  const processMap = new Map();
  events.forEach((evt) => {
    const rawPid = evt.pid;
    const pidKey = (rawPid !== undefined && rawPid !== null) ? String(rawPid) : "UNKNOWN";

    if (!processMap.has(pidKey)) {
      const isCritical = evt.severity === 'CRITICAL_KILL';
      const isWarning = evt.severity === 'WARNING';
      const riskScore = isCritical ? '94 / 100' : isWarning ? '68 / 100' : '15 / 100';

      const parentPid = evt.lineage?.[0]?.pid || (evt.parent_process && evt.parent_process !== 'UNRESOLVED' ? evt.parent_process : "UNKNOWN");
      const exePath = evt.lineage?.[1]?.command_line || (evt.process_name && evt.process_name !== 'UNKNOWN' ? `C:\\Windows\\${evt.process_name}` : "UNKNOWN");
      const cmdLine = evt.lineage?.[1]?.command_line || (evt.process_name ? `${evt.process_name}` : "UNKNOWN");

      processMap.set(pidKey, {
        pid: pidKey,
        process_name: evt.process_name || "UNKNOWN",
        parent_pid: parentPid,
        parent_name: evt.parent_process || "UNKNOWN",
        executable: exePath,
        command_line: cmdLine,
        start_time: evt.timestamp || "UNKNOWN",
        activity_count: 1,
        risk_score: riskScore,
        severity: evt.severity,
        status: isCritical ? 'CONTAINED' : isWarning ? 'SUSPICIOUS' : 'ACTIVE',
        associated_files: evt.target_file ? [evt.target_file] : [],
        raw_event: evt
      });
    } else {
      const existing = processMap.get(pidKey);
      existing.activity_count += 1;
      if (evt.target_file && !existing.associated_files.includes(evt.target_file)) {
        existing.associated_files.push(evt.target_file);
      }
      if (evt.severity === 'CRITICAL_KILL') {
        existing.status = 'CONTAINED';
        existing.risk_score = '94 / 100';
        existing.severity = 'CRITICAL_KILL';
        existing.raw_event = evt;
      }
    }
  });

  const processList = Array.from(processMap.values());

  const filteredProcesses = processList.filter(p => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      p.process_name.toLowerCase().includes(term) ||
      String(p.pid).toLowerCase().includes(term) ||
      p.status.toLowerCase().includes(term)
    );
  });

  return (
    <div className={`cyber-card rounded-2xl flex flex-col relative overflow-hidden shadow-xl font-mono text-xs ${
      isFullPage ? 'min-h-[calc(100vh-140px)]' : ''
    }`}>
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-white/[0.06] flex flex-wrap items-center justify-between gap-3 bg-slate-50 dark:bg-slate-950/40">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-cyan-50 dark:bg-slate-900/80 border border-cyan-200 dark:border-white/[0.08] text-cyan-600 dark:text-cyan-400">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 flex items-center gap-2">
              ACTIVE PROCESS MONITORING
              <span className="text-[10px] px-2 py-0.2 rounded-full bg-cyan-100 dark:bg-cyan-950/80 text-cyan-800 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-500/30">
                {processList.length} Observed PIDs
              </span>
            </h2>
            <p className="text-[10px] text-slate-500">
              Live OS process ancestry &amp; file interaction activity
            </p>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filter process or PID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 pr-3 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-950/80 border border-slate-300 dark:border-white/[0.08] text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 font-mono focus:outline-none focus:border-cyan-500/50 w-48 sm:w-60 shadow-sm"
          />
        </div>
      </div>

      {/* Process Table with Requested Columns */}
      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-100 dark:bg-slate-950/80 border-b border-slate-200 dark:border-white/[0.06] text-[10px] uppercase text-slate-600 dark:text-slate-400 tracking-wider">
            <tr>
              <th className="py-3 px-4">Process</th>
              <th className="py-3 px-4">PID</th>
              <th className="py-3 px-4">Parent PID</th>
              <th className="py-3 px-4">Executable</th>
              <th className="py-3 px-4">Start Time</th>
              <th className="py-3 px-4">Activity Count</th>
              <th className="py-3 px-4">Risk</th>
              <th className="py-3 px-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-white/[0.04]">
            {filteredProcesses.length === 0 ? (
              <tr>
                <td colSpan="8" className="py-12 text-center text-slate-500 text-xs">
                  No active processes logged yet.
                </td>
              </tr>
            ) : (
              filteredProcesses.map((p) => {
                const isCritical = p.status === 'CONTAINED';
                const isSelected = selectedProcess?.pid === p.pid;

                return (
                  <tr
                    key={p.pid}
                    onClick={() => setSelectedProcess(p)}
                    className={`cursor-pointer transition-colors ${
                      isSelected 
                        ? 'bg-orange-100 dark:bg-orange-950/30' 
                        : isCritical 
                          ? 'bg-rose-100/60 dark:bg-rose-950/20 hover:bg-rose-100 dark:hover:bg-rose-950/40' 
                          : 'hover:bg-slate-100 dark:hover:bg-slate-900/40'
                    }`}
                  >
                    <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                      {p.process_name}
                    </td>
                    <td className="py-3 px-4 font-mono text-cyan-700 dark:text-cyan-300 font-bold whitespace-nowrap">
                      {p.pid}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600 dark:text-slate-400 whitespace-nowrap">
                      {p.parent_pid}
                    </td>
                    <td className="py-3 px-4 text-slate-700 dark:text-slate-300 text-[11px] max-w-[200px] truncate" title={p.executable}>
                      {p.executable}
                    </td>
                    <td className="py-3 px-4 text-slate-500 dark:text-slate-400 text-[11px] whitespace-nowrap">
                      {p.start_time}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-700 dark:text-slate-300 font-bold whitespace-nowrap">
                      {p.activity_count} ops
                    </td>
                    <td className="py-3 px-4 font-bold whitespace-nowrap">
                      <span className={isCritical ? 'text-rose-600 dark:text-rose-400' : 'text-slate-500 dark:text-slate-400'}>
                        {p.risk_score}
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        isCritical 
                          ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-500/50' 
                          : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/30'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Slideout Process Details Panel */}
      {selectedProcess && (
        <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[460px] bg-white/95 dark:bg-[#070b14]/95 backdrop-blur-2xl border-l border-slate-200 dark:border-white/[0.08] shadow-2xl p-6 overflow-y-auto space-y-5 font-mono text-xs animate-in slide-in-from-right duration-200">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/[0.08] pb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-cyan-100 dark:bg-cyan-950/80 border border-cyan-300 dark:border-cyan-500/40 text-cyan-600 dark:text-cyan-400">
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Process Inspector</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">{selectedProcess.process_name}</span>
              </div>
            </div>
            <button
              onClick={() => setSelectedProcess(null)}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-white/[0.06] space-y-1">
              <span className="text-[10px] text-slate-500 uppercase">Process Name</span>
              <span className="text-xs text-slate-900 dark:text-white block font-bold">{selectedProcess.process_name}</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-white/[0.06] space-y-1">
                <span className="text-[10px] text-slate-500 uppercase">PID</span>
                <span className="text-xs text-cyan-700 dark:text-cyan-300 block font-bold font-mono">{selectedProcess.pid}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-white/[0.06] space-y-1">
                <span className="text-[10px] text-slate-500 uppercase">Parent PID</span>
                <span className="text-xs text-slate-700 dark:text-slate-300 block font-bold font-mono">{selectedProcess.parent_pid}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-white/[0.06] space-y-1">
              <span className="text-[10px] text-slate-500 uppercase">Executable Path</span>
              <span className="text-xs text-slate-700 dark:text-slate-300 block break-all font-mono">{selectedProcess.executable}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-white/[0.06] space-y-1">
              <span className="text-[10px] text-slate-500 uppercase">Command Line</span>
              <span className="text-xs text-slate-700 dark:text-slate-300 block break-all font-mono">{selectedProcess.command_line}</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-white/[0.06] space-y-1">
                <span className="text-[10px] text-slate-500 uppercase">Start Time</span>
                <span className="text-xs text-slate-800 dark:text-slate-200 block font-semibold">{selectedProcess.start_time}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-white/[0.06] space-y-1">
                <span className="text-[10px] text-slate-500 uppercase">Risk Score</span>
                <span className="text-xs text-orange-600 dark:text-orange-400 block font-bold">{selectedProcess.risk_score}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-white/[0.06] space-y-1">
              <span className="text-[10px] text-slate-500 uppercase">Current Status</span>
              <span className={`text-xs block font-bold ${
                selectedProcess.status === 'CONTAINED' ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
              }`}>
                {selectedProcess.status}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-white/[0.06] space-y-2">
              <span className="text-[10px] text-slate-500 uppercase block">Associated Files ({selectedProcess.associated_files.length})</span>
              <div className="space-y-1 max-h-36 overflow-y-auto">
                {selectedProcess.associated_files.map((f, i) => (
                  <div key={i} className="text-[11px] text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-900/60 p-1.5 rounded truncate" title={f}>
                    {f}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {onViewForensics && selectedProcess.status === 'CONTAINED' && (
            <div className="pt-2">
              <button
                onClick={() => {
                  onViewForensics(selectedProcess.raw_event);
                  setSelectedProcess(null);
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-rose-600/25"
              >
                <span>Inspect Process Lineage</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
