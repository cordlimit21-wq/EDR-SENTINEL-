import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  Unlock, 
  XCircle, 
  Network, 
  CheckCircle2, 
  RotateCw, 
  Clock, 
  ShieldAlert,
  Terminal,
  Activity
} from 'lucide-react';

const API_BASE = "http://localhost:8000";

export default function ContainmentView({ theme = 'dark' }) {
  const [actionsLog, setActionsLog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTarget, setSelectedTarget] = useState('WS-FINANCE-01');
  const [targetId, setTargetId] = useState('EP-01');
  const [isExecuting, setIsExecuting] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState(null);

  const fetchActions = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/containment/actions`);
      if (res.ok) setActionsLog(await res.json());
    } catch (e) {
      console.error("Error fetching containment actions:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActions();
  }, []);

  const handleExecuteAction = async (actionType, customTarget = null) => {
    setIsExecuting(true);
    setFeedbackMsg(null);
    try {
      const res = await fetch(`${API_BASE}/api/containment/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action_type: actionType,
          target: customTarget || selectedTarget,
          target_id: targetId,
          analyst: "SOC Lead Analyst"
        })
      });
      if (res.ok) {
        const data = await res.json();
        setFeedbackMsg(`Action ${actionType} executed successfully on ${customTarget || selectedTarget}.`);
        fetchActions();
      }
    } catch (err) {
      console.error("Containment execution failed:", err);
    } finally {
      setIsExecuting(false);
    }
  };

  const actionButtons = [
    {
      type: "ISOLATE_ENDPOINT",
      title: "ISOLATE ENDPOINT",
      icon: Lock,
      color: "bg-rose-600 hover:bg-rose-700 text-white",
      desc: "Quarantines host network stack. Only Sentinel telemetry tunnel remains open."
    },
    {
      type: "RELEASE_ENDPOINT",
      title: "RELEASE ENDPOINT",
      icon: Unlock,
      color: "bg-emerald-600 hover:bg-emerald-700 text-white",
      desc: "Restores normal network ingress and egress connectivity to the endpoint."
    },
    {
      type: "TERMINATE_PROCESS",
      title: "TERMINATE PROCESS",
      icon: XCircle,
      color: "bg-orange-600 hover:bg-orange-700 text-white",
      desc: "Issues kernel SIGKILL to rogue process PID 4312 via Minifilter driver."
    },
    {
      type: "BLOCK_CONNECTION",
      title: "BLOCK CONNECTION",
      icon: Network,
      color: "bg-cyan-600 hover:bg-cyan-700 text-white",
      desc: "Drops outbound C2 socket connection to 185.220.101.44 at NDIS layer."
    },
    {
      type: "RESOLVE_INCIDENT",
      title: "RESOLVE INCIDENT",
      icon: CheckCircle2,
      color: "bg-purple-600 hover:bg-purple-700 text-white",
      desc: "Marks INC-2026-0042 as resolved, archives telemetry, and releases locks."
    },
  ];

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/[0.08] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-emerald-500 font-bold uppercase tracking-widest">ACTIVE MITIGATION DISPATCHER</span>
            <span className="text-slate-400">•</span>
            <span className="text-xs font-mono text-slate-500">SIMULATED ZERO-DESTRUCTIVE RESPONSES</span>
          </div>
          <h2 className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1">
            CONTAINMENT ACTIONS
          </h2>
        </div>

        <button 
          onClick={fetchActions}
          className="p-2 rounded-xl border border-slate-200 dark:border-white/[0.1] hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
          title="Refresh Log"
        >
          <RotateCw className="w-4 h-4" />
        </button>
      </div>

      {feedbackMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Target Selector */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#070b14] border border-slate-200 dark:border-white/[0.08] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs">
        <div className="flex items-center gap-3">
          <span className="text-slate-500">ACTIVE QUARANTINE TARGET:</span>
          <select 
            value={selectedTarget}
            onChange={(e) => {
              setSelectedTarget(e.target.value);
              setTargetId(e.target.value === 'WS-FINANCE-01' ? 'EP-01' : 'EP-02');
            }}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white font-bold focus:outline-none"
          >
            <option value="WS-FINANCE-01">WS-FINANCE-01 (10.0.1.21) [CRITICAL 94]</option>
            <option value="WS-EXEC-02">WS-EXEC-02 (10.0.1.34) [ELEVATED 78]</option>
            <option value="SRV-DATABASE-01">SRV-DATABASE-01 (10.0.2.10) [ISOLATED]</option>
          </select>
        </div>

        <div className="text-slate-400 text-[11px]">
          Target ID: <span className="text-orange-500 font-bold">{targetId}</span>
        </div>
      </div>

      {/* Response Action Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {actionButtons.map((btn) => {
          const Icon = btn.icon;
          return (
            <div 
              key={btn.type}
              className="p-5 rounded-2xl bg-white dark:bg-[#070b14] border border-slate-200 dark:border-white/[0.08] shadow-md flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-orange-500">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">READY</span>
                </div>
                <h3 className="text-sm font-bold font-mono text-slate-900 dark:text-white">
                  {btn.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-sans leading-relaxed">
                  {btn.desc}
                </p>
              </div>

              <button
                onClick={() => handleExecuteAction(btn.type)}
                disabled={isExecuting}
                className={`w-full py-2.5 rounded-xl font-bold font-mono text-xs uppercase tracking-wider transition-all shadow-sm ${btn.color} disabled:opacity-50`}
              >
                EXECUTE ACTION
              </button>
            </div>
          );
        })}
      </div>

      {/* Containment Audit Log */}
      <div className="rounded-2xl bg-white dark:bg-[#070b14] border border-slate-200 dark:border-white/[0.08] shadow-md overflow-hidden font-mono text-xs">
        <div className="p-4 bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-white/[0.08] flex items-center justify-between">
          <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-orange-500" />
            <span>CONTAINMENT EXECUTION AUDIT TRAIL</span>
          </div>
          <span className="text-[10px] text-slate-400">{actionsLog.length} RECORDS</span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-white/[0.04]">
          {actionsLog.map((log) => (
            <div key={log.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
              <div className="flex items-start sm:items-center gap-3">
                <span className="text-slate-400 text-[11px] whitespace-nowrap">{log.executed_at}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white">{log.action_type}</span>
                    <span className="text-slate-400">• Target: {log.target}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-sans mt-0.5">
                    {log.details}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 self-end sm:self-center">
                <span className="text-[10px] text-slate-400">{log.analyst}</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">
                  {log.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
