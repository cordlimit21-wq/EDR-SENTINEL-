import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Clock, 
  Cpu, 
  HardDrive, 
  Network, 
  FileText, 
  Terminal, 
  Sparkles, 
  Lock, 
  CheckCircle2, 
  Plus, 
  Send,
  AlertTriangle,
  RotateCw,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

const API_BASE = "http://localhost:8000";

export default function IncidentsView({ theme = 'dark' }) {
  const [incidents, setIncidents] = useState([]);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [activeTab, setActiveTab] = useState('summary'); // 'summary' | 'timeline' | 'process-tree' | 'files' | 'network' | 'indicators' | 'notes' | 'containment'
  const [loading, setLoading] = useState(true);
  const [noteInput, setNoteInput] = useState('');
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);

  const fetchIncidents = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/incidents`);
      if (res.ok) {
        const data = await res.json();
        setIncidents(data);
        if (!selectedIncident && data.length > 0) {
          setSelectedIncident(data[0]);
        } else if (selectedIncident) {
          const updated = data.find(i => i.id === selectedIncident.id);
          if (updated) setSelectedIncident(updated);
        }
      }
    } catch (e) {
      console.error("Error fetching incidents:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, []);

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!noteInput.trim() || !selectedIncident) return;
    setIsSubmittingNote(true);
    try {
      const res = await fetch(`${API_BASE}/api/incidents/${selectedIncident.id}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ author: "SOC Analyst (User)", text: noteInput.trim() })
      });
      if (res.ok) {
        setNoteInput('');
        fetchIncidents();
      }
    } catch (err) {
      console.error("Failed to add note:", err);
    } finally {
      setIsSubmittingNote(false);
    }
  };

  const handleContainIncident = async () => {
    if (!selectedIncident) return;
    try {
      const res = await fetch(`${API_BASE}/api/incidents/${selectedIncident.id}/contain`, { method: 'POST' });
      if (res.ok) fetchIncidents();
    } catch (err) {
      console.error("Contain failed:", err);
    }
  };

  const handleResolveIncident = async () => {
    if (!selectedIncident) return;
    try {
      const res = await fetch(`${API_BASE}/api/incidents/${selectedIncident.id}/resolve`, { method: 'POST' });
      if (res.ok) fetchIncidents();
    } catch (err) {
      console.error("Resolve failed:", err);
    }
  };

  const tabs = [
    { id: 'summary', label: 'Summary' },
    { id: 'timeline', label: 'Timeline' },
    { id: 'process-tree', label: 'Process Tree' },
    { id: 'files', label: 'File Activity' },
    { id: 'network', label: 'Network Activity' },
    { id: 'indicators', label: 'Indicators & Evidence' },
    { id: 'notes', label: 'Analyst Notes' },
    { id: 'containment', label: 'Containment Actions' },
  ];

  if (!selectedIncident) {
    return <div className="p-8 text-center font-mono text-slate-500">Loading incidents...</div>;
  }

  return (
    <div className="space-y-6 font-sans">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/[0.08] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-rose-500 font-bold uppercase tracking-widest">INCIDENT INVESTIGATION CONSOLE</span>
            <span className="text-slate-400">•</span>
            <span className="text-xs font-mono text-slate-500">CASE ID: {selectedIncident.id}</span>
          </div>
          <h2 className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1 flex items-center gap-2">
            {selectedIncident.threat_name}
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40 uppercase">
              {selectedIncident.severity}
            </span>
          </h2>
        </div>

        {/* Quick Top Actions */}
        <div className="flex items-center gap-3 font-mono text-xs">
          {selectedIncident.status !== 'RESOLVED' && (
            <button
              onClick={handleContainIncident}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold transition-all shadow-md shadow-rose-900/30"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>ISOLATE & CONTAIN</span>
            </button>
          )}
          {selectedIncident.status !== 'RESOLVED' ? (
            <button
              onClick={handleResolveIncident}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>MARK RESOLVED</span>
            </button>
          ) : (
            <div className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold">
              STATUS: RESOLVED
            </div>
          )}
        </div>
      </div>

      {/* Primary KPI Ribbon for Incident */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
        <div className="p-4 rounded-xl bg-white dark:bg-[#070b14] border border-slate-200 dark:border-white/[0.08] shadow-sm">
          <div className="text-[10px] text-slate-400 uppercase">AFFECTED ENDPOINT</div>
          <div className="text-base font-bold text-slate-900 dark:text-white mt-1">
            {selectedIncident.endpoint}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#070b14] border border-slate-200 dark:border-white/[0.08] shadow-sm">
          <div className="text-[10px] text-slate-400 uppercase">DYNAMIC RISK SCORE</div>
          <div className="text-base font-bold text-rose-500 mt-1">
            {selectedIncident.risk_score} / 100 (CRITICAL)
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#070b14] border border-slate-200 dark:border-white/[0.08] shadow-sm">
          <div className="text-[10px] text-slate-400 uppercase">INCIDENT STATUS</div>
          <div className="text-base font-bold text-orange-400 mt-1 uppercase">
            {selectedIncident.status}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#070b14] border border-slate-200 dark:border-white/[0.08] shadow-sm">
          <div className="text-[10px] text-slate-400 uppercase">DETECTION VECTOR</div>
          <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-1 truncate">
            {selectedIncident.detection_vector}
          </div>
        </div>
      </div>

      {/* AI Investigation Summary Box */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-purple-950/40 via-[#0d1222] to-slate-900/60 border border-purple-500/30 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-purple-400 font-mono text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>AI INVESTIGATION SUMMARY</span>
          </div>
          <span className="text-[10px] font-mono text-purple-300/80">GENERATED VIA TELEMETRY SYNTHESIS</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
          {selectedIncident.ai_summary}
        </p>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-white/[0.08] overflow-x-auto pb-1 font-mono text-xs">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
              activeTab === t.id 
                ? 'bg-orange-500 text-slate-950 font-bold' 
                : 'text-slate-600 dark:text-slate-400 hover:text-orange-500 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div className="rounded-2xl bg-white dark:bg-[#070b14] border border-slate-200 dark:border-white/[0.08] shadow-lg p-6 font-mono text-xs">
        
        {/* TAB 1: SUMMARY */}
        {activeTab === 'summary' && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase">EXECUTIVE SUMMARY</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-sans leading-relaxed">
                {selectedIncident.summary}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/[0.06] space-y-2">
                <span className="text-[11px] font-bold text-slate-900 dark:text-white uppercase">INITIAL INGRESS</span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-sans">
                  PowerShell download cradle invoked by user context executing in %TEMP% directory.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/[0.06] space-y-2">
                <span className="text-[11px] font-bold text-slate-900 dark:text-white uppercase">HONEYTOKEN TRIPPED</span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-sans">
                  Canary trap TRAP-002 (confidential.txt) was accessed in Decoy vault, initiating automated kernel defense.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TIMELINE */}
        {activeTab === 'timeline' && (
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase mb-4">CHRONOLOGICAL EVENT LOG</h4>
            <div className="space-y-3">
              {selectedIncident.timeline.map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/[0.06] flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400 font-bold">{item.time}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      item.severity === 'CRITICAL_KILL' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' :
                      item.severity === 'CRITICAL' ? 'bg-rose-950 text-rose-300' :
                      item.severity === 'HIGH' ? 'bg-orange-950 text-orange-400' :
                      'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}>
                      {item.event}
                    </span>
                    <span className="text-slate-700 dark:text-slate-300 font-sans">{item.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: PROCESS TREE */}
        {activeTab === 'process-tree' && (
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase mb-4">EXECUTION LINEAGE & HIERARCHY</h4>
            <div className="space-y-2.5">
              {selectedIncident.process_tree.map((node, i) => (
                <div 
                  key={i} 
                  className={`p-3 rounded-xl border flex items-center justify-between ${
                    node.risk >= 80 
                      ? 'bg-rose-500/10 border-rose-500/40 text-rose-400' 
                      : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-white/[0.06] text-slate-700 dark:text-slate-300'
                  }`}
                  style={{ marginLeft: `${i * 24}px` }}
                >
                  <div className="flex items-center gap-3 font-mono">
                    <Cpu className="w-4 h-4 text-orange-500" />
                    <span className="font-bold text-slate-900 dark:text-white">{node.name}</span>
                    <span className="text-slate-400">PID {node.pid}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-500">{node.privilege}</span>
                  </div>
                  <div className="font-bold">
                    Risk: {node.risk} / 100
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: FILE ACTIVITY */}
        {activeTab === 'files' && (
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase mb-4">TOUCHED FILE AUDIT (EDR_TEST)</h4>
            <div className="space-y-2">
              {selectedIncident.file_activities.map((f, i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/[0.06] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <HardDrive className="w-4 h-4 text-orange-500" />
                    <span className="font-bold text-slate-900 dark:text-white">{f.path}</span>
                    <span className="text-slate-400">• Action: {f.action}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-rose-400 font-bold">Shannon H: {f.entropy}</span>
                    <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 font-bold text-[10px]">{f.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: NETWORK ACTIVITY */}
        {activeTab === 'network' && (
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase mb-4">OUTBOUND C2 SOCKET TRACKING</h4>
            <div className="space-y-2">
              {selectedIncident.network_activities.map((net, i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/[0.06] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Network className="w-4 h-4 text-cyan-400" />
                    <span className="font-bold text-slate-900 dark:text-white">{net.remote_ip}:{net.port}</span>
                    <span className="text-slate-400">({net.proto})</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-400">{net.state}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: INDICATORS & EVIDENCE */}
        {activeTab === 'indicators' && (
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase mb-4">INDICATORS OF COMPROMISE (IOCS)</h4>
            <div className="space-y-2.5">
              {selectedIncident.indicators.map((ind, i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/[0.06] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block">{ind.type}</span>
                    <span className="font-bold text-slate-900 dark:text-white">{ind.value}</span>
                  </div>
                  <span className="px-2 py-1 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold">{ind.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: ANALYST NOTES */}
        {activeTab === 'notes' && (
          <div className="space-y-6">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase">ANALYST AUDIT LOG</h4>
            
            {/* Existing Notes */}
            <div className="space-y-3">
              {selectedIncident.analyst_notes.map((note, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/[0.06] space-y-1">
                  <div className="flex items-center justify-between text-slate-400 text-[10px]">
                    <span className="font-bold text-orange-500">{note.author}</span>
                    <span>{note.time}</span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-200 font-sans text-xs">
                    {note.text}
                  </p>
                </div>
              ))}
            </div>

            {/* Add Note Form */}
            <form onSubmit={handleAddNote} className="flex gap-3">
              <input 
                type="text" 
                placeholder="Add analyst observation or hypothesis..."
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/[0.08] text-xs font-mono text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-orange-500"
              />
              <button
                type="submit"
                disabled={isSubmittingNote || !noteInput.trim()}
                className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-slate-950 font-bold font-mono text-xs uppercase flex items-center gap-1.5 transition-all disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>POST NOTE</span>
              </button>
            </form>
          </div>
        )}

        {/* TAB 8: CONTAINMENT ACTIONS */}
        {activeTab === 'containment' && (
          <div className="space-y-6">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase">CONTAINMENT ACTIONS & STATUS</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button 
                onClick={handleContainIncident}
                className="p-4 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/40 text-left space-y-1.5 transition-all"
              >
                <div className="text-rose-500 font-bold flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  <span>ISOLATE HOST FROM NETWORK</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-sans">
                  Instantly quarantine WS-FINANCE-01 while keeping the Sentinel EDR tunnel open.
                </p>
              </button>

              <button 
                onClick={handleResolveIncident}
                className="p-4 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/40 text-left space-y-1.5 transition-all"
              >
                <div className="text-emerald-500 font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>RESOLVE & CLOSE INCIDENT</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-sans">
                  Mark threat as eradicated, release locks, and archive forensic evidence.
                </p>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
