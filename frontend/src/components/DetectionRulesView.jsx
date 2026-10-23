import React, { useState, useEffect } from 'react';
import { 
  Sliders, 
  CheckCircle2, 
  XCircle, 
  ShieldAlert, 
  RotateCw, 
  Activity, 
  SlidersHorizontal,
  Info
} from 'lucide-react';

const API_BASE = "http://localhost:8000";

export default function DetectionRulesView({ theme = 'dark' }) {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState(null);

  const fetchRules = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/rules`);
      if (res.ok) {
        setRules(await res.json());
      }
    } catch (e) {
      console.error("Error fetching rules:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRules();
  }, []);

  const handleToggle = async (ruleId) => {
    setTogglingId(ruleId);
    try {
      const res = await fetch(`${API_BASE}/api/rules/${ruleId}/toggle`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setRules(prev => prev.map(r => r.id === ruleId ? data.rule : r));
      }
    } catch (e) {
      console.error("Error toggling rule:", e);
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/[0.08] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-orange-500 font-bold uppercase tracking-widest">BEHAVIORAL POLICY ENGINE</span>
            <span className="text-slate-400">•</span>
            <span className="text-xs font-mono text-slate-500">{rules.length} ACTIVE RULES</span>
          </div>
          <h2 className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1">
            DETECTION RULES
          </h2>
        </div>

        <button 
          onClick={fetchRules}
          className="p-2 rounded-xl border border-slate-200 dark:border-white/[0.1] hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
          title="Refresh Rules"
        >
          <RotateCw className="w-4 h-4" />
        </button>
      </div>

      {/* Rules Table */}
      <div className="rounded-2xl bg-white dark:bg-[#070b14] border border-slate-200 dark:border-white/[0.08] shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-white/[0.08] text-slate-400 text-[10px] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Rule Name</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Severity</th>
                <th className="py-3 px-3">Threshold</th>
                <th className="py-3 px-3 text-center">Trigger Count</th>
                <th className="py-3 px-3 text-right">Status / Toggle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/[0.04]">
              {rules.map((rule) => {
                return (
                  <tr key={rule.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 px-4">
                      <div className="font-bold text-slate-900 dark:text-white text-sm">
                        {rule.name}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 font-sans mt-0.5">
                        {rule.description}
                      </div>
                    </td>
                    <td className="py-4 px-3 text-slate-600 dark:text-slate-400 text-[11px]">
                      {rule.category}
                    </td>
                    <td className="py-4 px-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        rule.severity === 'CRITICAL' ? 'bg-rose-500/20 text-rose-400' :
                        rule.severity === 'HIGH' ? 'bg-orange-500/20 text-orange-400' :
                        'bg-amber-500/20 text-amber-400'
                      }`}>
                        {rule.severity}
                      </span>
                    </td>
                    <td className="py-4 px-3 font-bold text-slate-700 dark:text-slate-300">
                      {rule.threshold}
                    </td>
                    <td className="py-4 px-3 text-center">
                      <span className="font-bold px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-orange-500">
                        {rule.trigger_count}
                      </span>
                    </td>
                    <td className="py-4 px-3 text-right">
                      <button
                        onClick={() => handleToggle(rule.id)}
                        disabled={togglingId === rule.id}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-all ${
                          rule.enabled 
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-rose-500/20 hover:text-rose-400 hover:border-rose-500/40' 
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-500 hover:bg-emerald-500/20 hover:text-emerald-400'
                        }`}
                      >
                        {rule.enabled ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span>ENABLED</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3.5 h-3.5 text-slate-400" />
                            <span>DISABLED</span>
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
