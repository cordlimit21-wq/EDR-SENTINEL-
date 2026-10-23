import React, { useState } from 'react';
import { 
  Network, 
  ShieldAlert, 
  Lock, 
  Unlock, 
  RotateCw, 
  Search, 
  ArrowUpRight, 
  ArrowDownLeft,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export default function NetworkActivityView({ theme = 'dark' }) {
  const [connections, setConnections] = useState([
    { id: 1, local: "10.0.1.21:49822", remote: "185.220.101.44:443", proto: "TCP", pid: 4312, process: "svchost_suspicious.exe", state: "C2_BEACONING_SUSPECTED", bytesSent: "4.2 KB", bytesRecv: "1.1 KB", status: "QUARANTINED" },
    { id: 2, local: "10.0.1.21:50114", remote: "198.51.100.23:8443", proto: "TCP", pid: 4312, process: "svchost_suspicious.exe", state: "OUTBOUND_BLOCKED", bytesSent: "0 B", bytesRecv: "0 B", status: "BLOCKED" },
    { id: 3, local: "10.0.1.21:44320", remote: "104.244.42.1:443", proto: "TCP", pid: 1104, process: "explorer.exe", state: "ESTABLISHED", bytesSent: "142 KB", bytesRecv: "890 KB", status: "NORMAL" },
    { id: 4, local: "10.0.1.21:135", remote: "10.0.0.5:49152", proto: "TCP", pid: 884, process: "services.exe", state: "ESTABLISHED", bytesSent: "12 KB", bytesRecv: "15 KB", status: "INTERNAL" },
    { id: 5, local: "10.0.1.34:52102", remote: "91.240.118.52:8080", proto: "TCP", pid: 3820, process: "powershell.exe", state: "TERMINATED", bytesSent: "512 B", bytesRecv: "0 B", status: "BLOCKED" },
    { id: 6, local: "10.0.3.15:44301", remote: "140.82.121.4:443", proto: "TCP", pid: 2190, process: "git.exe", state: "ESTABLISHED", bytesSent: "1.8 MB", bytesRecv: "12.4 MB", status: "NORMAL" },
  ]);

  const [search, setSearch] = useState('');

  const filtered = connections.filter(c => 
    c.remote.includes(search) || 
    c.process.toLowerCase().includes(search.toLowerCase()) ||
    c.state.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/[0.08] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-cyan-400 font-bold uppercase tracking-widest">NETWORK TELEMETRY MONITOR</span>
            <span className="text-slate-400">•</span>
            <span className="text-xs font-mono text-slate-500">ACTIVE SOCKETS & C2 INTERCEPTION</span>
          </div>
          <h2 className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1">
            NETWORK ACTIVITY
          </h2>
        </div>

        <div className="w-full sm:w-64">
          <input 
            type="text"
            placeholder="Filter IP, process, state..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#070b14] border border-slate-200 dark:border-white/[0.08] text-xs font-mono text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Network Sockets Table */}
      <div className="rounded-2xl bg-white dark:bg-[#070b14] border border-slate-200 dark:border-white/[0.08] shadow-md overflow-hidden font-mono text-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-white/[0.08] text-slate-400 text-[10px] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Local Address</th>
                <th className="py-3 px-3">Remote Address</th>
                <th className="py-3 px-3">Process / PID</th>
                <th className="py-3 px-3">Protocol</th>
                <th className="py-3 px-3">State</th>
                <th className="py-3 px-3">Traffic (Tx/Rx)</th>
                <th className="py-3 px-3 text-right">Protection</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/[0.04]">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 text-slate-700 dark:text-slate-300">
                    {c.local}
                  </td>
                  <td className="py-3 px-3 font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Network className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{c.remote}</span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-bold text-slate-900 dark:text-white">{c.process}</span>
                    <span className="text-slate-400 ml-1.5 text-[11px]">(PID {c.pid})</span>
                  </td>
                  <td className="py-3 px-3 text-slate-500">
                    {c.proto}
                  </td>
                  <td className="py-3 px-3">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      c.state.includes('C2') || c.state.includes('BLOCKED') ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' :
                      'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}>
                      {c.state}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-500 text-[11px]">
                    {c.bytesSent} / {c.bytesRecv}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      c.status === 'QUARANTINED' ? 'bg-rose-600 text-white' :
                      c.status === 'BLOCKED' ? 'bg-orange-500 text-slate-950' :
                      'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
