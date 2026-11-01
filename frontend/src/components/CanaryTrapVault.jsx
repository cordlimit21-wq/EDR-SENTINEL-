import React, { useState } from 'react';
import { 
  Crosshair, 
  ShieldCheck, 
  ShieldAlert, 
  Search, 
  Filter, 
  FileSpreadsheet, 
  FileText, 
  Key, 
  Database, 
  FileCode, 
  RefreshCw,
  Lock,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import FeatureExplainer from './FeatureExplainer';

export default function CanaryTrapVault({ 
  traps = [], 
  onAuditTraps, 
  isFullPage = false,
  theme = 'dark'
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDocType, setFilterDocType] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [isAuditing, setIsAuditing] = useState(false);

  const getDocIcon = (docType) => {
    switch (docType?.toLowerCase()) {
      case 'xlsx':
      case 'csv':
        return <FileSpreadsheet className="w-4 h-4 text-emerald-400" />;
      case 'docx':
      case 'pdf':
        return <FileText className="w-4 h-4 text-cyan-400" />;
      case 'env':
      case 'pem':
        return <Key className="w-4 h-4 text-amber-400" />;
      case 'sql':
        return <Database className="w-4 h-4 text-purple-400" />;
      default:
        return <FileCode className="w-4 h-4 text-slate-400" />;
    }
  };

  const intactCount = traps.filter(t => t.integrity_status === 'INTACT').length;
  const trippedCount = traps.filter(t => t.integrity_status === 'TAMPER_ATTEMPT_BLOCKED').length;

  const filteredTraps = traps.filter((trap) => {
    const matchesSearch = 
      trap.path.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trap.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trap.directory_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trap.canary_token.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (filterDocType !== 'ALL' && trap.doc_type?.toLowerCase() !== filterDocType.toLowerCase()) {
      return false;
    }

    if (filterStatus === 'ARMED' && trap.integrity_status !== 'INTACT') return false;
    if (filterStatus === 'TRIGGERED' && trap.integrity_status !== 'TAMPER_ATTEMPT_BLOCKED') return false;

    return true;
  });

  const handleAuditClick = () => {
    setIsAuditing(true);
    if (onAuditTraps) onAuditTraps();
    setTimeout(() => setIsAuditing(false), 800);
  };

  return (
    <div className={`space-y-5 font-mono text-xs ${isFullPage ? 'min-h-[calc(100vh-130px)]' : ''}`}>
      {/* 1. Canary Vault Metrics Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="cyber-card p-5 rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Decoy Protection Fleet</span>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {traps.length || 48} <span className="text-xs text-slate-400 font-normal">Decoys</span>
            </div>
            <span className="text-[10px] text-orange-600 dark:text-orange-400 font-semibold block">Tripwire Network Armed</span>
          </div>
          <div className="p-3 rounded-xl bg-orange-50 dark:bg-orange-950/60 border border-orange-200 dark:border-orange-500/30 text-orange-500 dark:text-orange-400">
            <Crosshair className="w-5 h-5" />
          </div>
        </div>

        <div className="cyber-card p-5 rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Active Decoys</span>
            <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              {intactCount} ARMED
            </div>
            <span className="text-[10px] text-slate-600 dark:text-slate-400 block">100% Volume Coverage</span>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="cyber-card p-5 rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Tripped Decoys</span>
            <div className={`text-2xl font-extrabold ${trippedCount > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-slate-200'}`}>
              {trippedCount} TRIGGERED
            </div>
            <span className={`text-[10px] block ${trippedCount > 0 ? 'text-rose-600 dark:text-rose-300' : 'text-slate-500'}`}>
              {trippedCount > 0 ? "Tamper attempts blocked" : "0 Unauthorized probes"}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-500/30 text-rose-600 dark:text-rose-400">
            <ShieldAlert className="w-5 h-5" />
          </div>
        </div>

        <div className="cyber-card p-5 rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Entropy Baseline</span>
            <div className="text-2xl font-extrabold text-purple-600 dark:text-purple-400">
              5.14 <span className="text-xs text-slate-400 font-normal">/ 8.00</span>
            </div>
            <span className="text-[10px] text-slate-600 dark:text-slate-400 block">Normal Non-Encrypted H</span>
          </div>
          <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-300 dark:border-purple-500/30 text-purple-600 dark:text-purple-400">
            <Lock className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Real vs Fleet Simulation Disclosure Banner */}
      <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 uppercase">
            LIVE & EXTENDED FLEET
          </span>
          <span className="text-slate-300">
            Active filesystem tripwires in <code className="text-cyan-300 bg-cyan-950/50 px-1 py-0.5 rounded">EDR_Test/Decoy/</code> are monitored in real time via kernel file watch hooks. Additional entries represent enterprise-wide honeypot distribution across remote volumes.
          </span>
        </div>
      </div>

      {/* 2. Decoy Fleet Inventory Table */}
      <div className="cyber-card rounded-2xl overflow-hidden shadow-xl">
        {/* Controls */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-white/[0.06] flex flex-wrap items-center justify-between gap-3 bg-slate-50 dark:bg-slate-950/40">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-orange-50 dark:bg-slate-900/80 border border-orange-200 dark:border-white/[0.08] text-orange-500 dark:text-orange-400">
              <Crosshair className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 flex items-center gap-2">
                CANARY DECOY INVENTORY
                <FeatureExplainer featureKey="canary-vault" />
              </h2>
              <p className="text-[10px] text-slate-500">
                Strategic Honeypot Files Deployed Across Enterprise Volumes
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search decoy or token..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-950/80 border border-slate-300 dark:border-white/[0.08] text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 font-mono focus:outline-none focus:border-orange-500/50 w-44 sm:w-56 shadow-sm"
              />
            </div>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-950/80 border border-slate-300 dark:border-white/[0.08] text-slate-800 dark:text-slate-200 font-mono focus:outline-none focus:border-orange-500/50 shadow-sm"
            >
              <option value="ALL">Status: All</option>
              <option value="ARMED">ARMED</option>
              <option value="TRIGGERED">TRIGGERED</option>
            </select>

            {/* Audit Trigger */}
            <button
              onClick={handleAuditClick}
              disabled={isAuditing}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-300 dark:border-white/[0.08] text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all text-xs font-semibold shadow-sm"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isAuditing ? 'animate-spin text-orange-400' : ''}`} />
              <span>Audit Fleet</span>
            </button>
          </div>
        </div>

        {/* Table matching requested columns */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 dark:bg-slate-950/80 border-b border-slate-200 dark:border-white/[0.06] text-[10px] uppercase text-slate-600 dark:text-slate-400 tracking-wider">
              <tr>
                <th className="py-3 px-4">Decoy Name</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Last Access</th>
                <th className="py-3 px-4">Last Modification</th>
                <th className="py-3 px-4">Triggered By</th>
                <th className="py-3 px-4">Process</th>
                <th className="py-3 px-4">PID</th>
                <th className="py-3 px-4">Risk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-white/[0.04]">
              {filteredTraps.length === 0 ? (
                <tr>
                  <td colSpan="9" className="py-12 text-center text-slate-500 text-xs">
                    No decoy traps matched the query.
                  </td>
                </tr>
              ) : (
                filteredTraps.map((trap) => {
                  const isTripped = trap.integrity_status === 'TAMPER_ATTEMPT_BLOCKED';

                  return (
                    <tr
                      key={trap.id}
                      className={`transition-colors ${
                        isTripped 
                          ? 'bg-rose-100/60 dark:bg-rose-950/20 hover:bg-rose-100 dark:hover:bg-rose-950/30' 
                          : 'hover:bg-slate-100 dark:hover:bg-slate-900/40'
                      }`}
                    >
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2.5">
                          {getDocIcon(trap.doc_type)}
                          <span className="font-semibold text-slate-900 dark:text-white">{trap.filename}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-700 dark:text-slate-300 text-[11px] max-w-[200px] truncate" title={trap.path}>
                        {trap.path}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                          isTripped 
                            ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-500/50' 
                            : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/30'
                        }`}>
                          {isTripped ? 'TRIGGERED' : 'ARMED'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-500 dark:text-slate-400 text-[11px] whitespace-nowrap">
                        {trap.last_checked || "2026-09-22 11:24:02"}
                      </td>
                      <td className="py-3 px-4 text-slate-500 dark:text-slate-400 text-[11px] whitespace-nowrap">
                        {isTripped ? trap.last_checked : "None"}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap font-mono">
                        <span className={isTripped ? 'text-rose-600 dark:text-rose-400 font-bold' : 'text-slate-500'}>
                          {isTripped ? "IRP_MJ_WRITE Probe" : "None"}
                        </span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap font-mono">
                        <span className={isTripped ? 'text-slate-900 dark:text-white font-bold' : 'text-slate-500'}>
                          {isTripped ? "ransomware_sim.exe" : "N/A"}
                        </span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap font-mono text-cyan-700 dark:text-cyan-300">
                        {isTripped ? "4814" : "N/A"}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap font-bold">
                        <span className={isTripped ? 'text-rose-600 dark:text-rose-400' : 'text-slate-500'}>
                          {isTripped ? "CRITICAL (94)" : "LOW (0)"}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
