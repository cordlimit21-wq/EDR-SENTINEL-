import React, { useState, useEffect } from 'react';
import { 
  Laptop, 
  ShieldAlert, 
  CheckCircle2, 
  Lock, 
  Unlock, 
  Search, 
  Filter, 
  ChevronRight, 
  Activity, 
  Cpu, 
  HardDrive, 
  Network, 
  Clock, 
  AlertTriangle,
  RotateCw,
  Server
} from 'lucide-react';

const API_BASE = "http://localhost:8000";

export default function EndpointsView({ theme = 'dark' }) {
  const [endpoints, setEndpoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedEndpoint, setSelectedEndpoint] = useState(null);
  const [actionInProgress, setActionInProgress] = useState(null); // endpoint id

  const fetchEndpoints = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/endpoints`);
      if (res.ok) {
        const data = await res.json();
        setEndpoints(data);
        if (!selectedEndpoint && data.length > 0) {
          // Select WS-FINANCE-01 by default if available
          const financeEp = data.find(e => e.hostname === 'WS-FINANCE-01') || data[0];
          setSelectedEndpoint(financeEp);
        } else if (selectedEndpoint) {
          // Refresh selected endpoint details
          const updated = data.find(e => e.id === selectedEndpoint.id);
          if (updated) setSelectedEndpoint(updated);
        }
      }
    } catch (e) {
      console.error("Error fetching endpoints:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEndpoints();
    const interval = setInterval(fetchEndpoints, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleIsolate = async (ep) => {
    setActionInProgress(ep.id);
    // Optimistic UI state transition: ONLINE -> ISOLATING -> ISOLATED
    setEndpoints(prev => prev.map(item => item.id === ep.id ? { ...item, status: 'ISOLATING' } : item));
    if (selectedEndpoint && selectedEndpoint.id === ep.id) {
      setSelectedEndpoint(prev => ({ ...prev, status: 'ISOLATING' }));
    }

    try {
      // Allow brief moment for isolating state animation
      await new Promise(r => setTimeout(r, 600));
      const res = await fetch(`${API_BASE}/api/endpoints/${ep.id}/isolate`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setEndpoints(prev => prev.map(item => item.id === ep.id ? data.endpoint : item));
        if (selectedEndpoint && selectedEndpoint.id === ep.id) {
          setSelectedEndpoint(data.endpoint);
        }
      }
    } catch (e) {
      console.error("Isolate error:", e);
    } finally {
      setActionInProgress(null);
    }
  };

  const handleRelease = async (ep) => {
    setActionInProgress(ep.id);
    try {
      const res = await fetch(`${API_BASE}/api/endpoints/${ep.id}/release`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setEndpoints(prev => prev.map(item => item.id === ep.id ? data.endpoint : item));
        if (selectedEndpoint && selectedEndpoint.id === ep.id) {
          setSelectedEndpoint(data.endpoint);
        }
      }
    } catch (e) {
      console.error("Release error:", e);
    } finally {
      setActionInProgress(null);
    }
  };

  const filteredEndpoints = endpoints.filter(ep => {
    const matchesSearch = 
      ep.hostname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ep.ip.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ep.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || ep.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 font-sans">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/[0.08] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-orange-500 font-bold uppercase tracking-widest">ENDPOINT MANAGEMENT</span>
            <span className="text-slate-400">•</span>
            <span className="text-xs font-mono text-slate-500">FLEET SIZE: {endpoints.length} NODES</span>
          </div>
          <h2 className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1">
            PROTECTED ENDPOINTS
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={fetchEndpoints}
            className="p-2 rounded-xl border border-slate-200 dark:border-white/[0.1] hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
            title="Refresh Fleet"
          >
            <RotateCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search hostname, IP, department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-[#070d18] border border-slate-200 dark:border-white/[0.08] text-xs font-mono text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-orange-500"
          />
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto font-mono text-xs">
          {['ALL', 'ONLINE', 'ISOLATED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl border transition-all ${
                statusFilter === st 
                  ? 'bg-orange-500 text-slate-950 font-bold border-orange-500' 
                  : 'bg-white dark:bg-[#070d18] border-slate-200 dark:border-white/[0.08] text-slate-600 dark:text-slate-400 hover:border-slate-300'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Endpoints Table + Endpoint Detail Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Endpoints Table (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl bg-white dark:bg-[#070b14] border border-slate-200 dark:border-white/[0.08] shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-white/[0.08] text-slate-400 text-[10px] uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Hostname</th>
                  <th className="py-3 px-3">OS</th>
                  <th className="py-3 px-3">IP</th>
                  <th className="py-3 px-3">Risk</th>
                  <th className="py-3 px-3">Threat</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/[0.04]">
                {filteredEndpoints.map((ep) => {
                  const isSelected = selectedEndpoint && selectedEndpoint.id === ep.id;
                  return (
                    <tr 
                      key={ep.id}
                      onClick={() => setSelectedEndpoint(ep)}
                      className={`hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer transition-colors ${
                        isSelected ? 'bg-orange-500/10 dark:bg-orange-950/20' : ''
                      }`}
                    >
                      <td className="py-3 px-4 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Laptop className="w-3.5 h-3.5 text-orange-500" />
                        <span>{ep.hostname}</span>
                      </td>
                      <td className="py-3 px-3 text-slate-500 dark:text-slate-400 text-[11px] truncate max-w-[100px]">
                        {ep.os}
                      </td>
                      <td className="py-3 px-3 text-slate-700 dark:text-slate-300">
                        {ep.ip}
                      </td>
                      <td className="py-3 px-3">
                        <span className={`font-bold ${
                          ep.risk_score >= 80 ? 'text-rose-500' :
                          ep.risk_score >= 50 ? 'text-orange-500' :
                          'text-emerald-500'
                        }`}>
                          {ep.risk_score}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          ep.threat_level === 'CRITICAL' ? 'bg-rose-500/20 text-rose-400' :
                          ep.threat_level === 'ELEVATED' ? 'bg-orange-500/20 text-orange-400' :
                          'bg-emerald-500/20 text-emerald-400'
                        }`}>
                          {ep.threat_level}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 w-max ${
                          ep.status === 'ONLINE' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/30' :
                          ep.status === 'ISOLATING' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/30 animate-pulse' :
                          'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            ep.status === 'ONLINE' ? 'bg-emerald-500' :
                            ep.status === 'ISOLATING' ? 'bg-amber-500' : 'bg-rose-500'
                          }`} />
                          {ep.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <ChevronRight className="w-4 h-4 text-slate-400 ml-auto" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Endpoint Detail Drawer (5 cols) */}
        {selectedEndpoint ? (
          <div className="lg:col-span-5 rounded-2xl bg-white dark:bg-[#070b14] border border-slate-200 dark:border-white/[0.08] shadow-xl p-6 space-y-6 font-mono text-xs">
            {/* Header info */}
            <div className="flex items-start justify-between border-b border-slate-100 dark:border-white/[0.08] pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-slate-900 dark:text-white">
                    {selectedEndpoint.hostname}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    selectedEndpoint.status === 'ONLINE' ? 'bg-emerald-500/20 text-emerald-400' :
                    selectedEndpoint.status === 'ISOLATING' ? 'bg-amber-500/20 text-amber-400 animate-pulse' :
                    'bg-rose-500/20 text-rose-400'
                  }`}>
                    {selectedEndpoint.status}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  {selectedEndpoint.department} • IP: {selectedEndpoint.ip}
                </div>
              </div>

              {/* ISOLATE / RELEASE BUTTON */}
              {selectedEndpoint.status === 'ISOLATED' ? (
                <button
                  onClick={() => handleRelease(selectedEndpoint)}
                  disabled={actionInProgress === selectedEndpoint.id}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50"
                >
                  <Unlock className="w-3.5 h-3.5" />
                  <span>RELEASE</span>
                </button>
              ) : (
                <button
                  onClick={() => handleIsolate(selectedEndpoint)}
                  disabled={actionInProgress === selectedEndpoint.id || selectedEndpoint.status === 'ISOLATING'}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>{selectedEndpoint.status === 'ISOLATING' ? 'ISOLATING...' : 'ISOLATE ENDPOINT'}</span>
                </button>
              )}
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/[0.06]">
                <div className="text-[10px] text-slate-400 uppercase">RISK SCORE</div>
                <div className={`text-2xl font-bold mt-0.5 ${
                  selectedEndpoint.risk_score >= 80 ? 'text-rose-500' :
                  selectedEndpoint.risk_score >= 50 ? 'text-orange-500' : 'text-emerald-500'
                }`}>
                  {selectedEndpoint.risk_score} <span className="text-xs font-normal text-slate-400">/ 100</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/[0.06]">
                <div className="text-[10px] text-slate-400 uppercase">THREAT LEVEL</div>
                <div className={`text-xl font-bold mt-1 ${
                  selectedEndpoint.threat_level === 'CRITICAL' ? 'text-rose-500' :
                  selectedEndpoint.threat_level === 'ELEVATED' ? 'text-orange-500' : 'text-emerald-500'
                }`}>
                  {selectedEndpoint.threat_level}
                </div>
              </div>
            </div>

            {/* System Info Breakdown */}
            <div className="space-y-2">
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                SYSTEM SPECIFICATIONS
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/[0.06] space-y-1.5 text-[11px]">
                <div className="flex justify-between"><span className="text-slate-500">Operating System:</span><span className="text-slate-900 dark:text-white font-bold">{selectedEndpoint.os}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">MAC Address:</span><span className="text-slate-900 dark:text-white">{selectedEndpoint.mac}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Agent Version:</span><span className="text-emerald-500 font-bold">{selectedEndpoint.agent}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Active Processes:</span><span className="text-slate-900 dark:text-white">{selectedEndpoint.active_processes}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Network Sockets:</span><span className="text-cyan-400 font-bold">{selectedEndpoint.active_connections}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">CPU Overhead:</span><span className="text-slate-900 dark:text-white">{selectedEndpoint.cpu_usage_pct}%</span></div>
              </div>
            </div>

            {/* Live Threat Alert on Node if Critical */}
            {selectedEndpoint.risk_score >= 80 && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 space-y-1">
                <div className="flex items-center gap-2 font-bold">
                  <AlertTriangle className="w-4 h-4" />
                  <span>ACTIVE RANSOMWARE SEQUENCE INTERCEPTED</span>
                </div>
                <p className="text-[10px] text-slate-300 font-sans">
                  Process PID 4312 engaged in high rename velocity against honeypots. Containment recommended immediately.
                </p>
              </div>
            )}
          </div>
        ) : null}

      </div>
    </div>
  );
}
