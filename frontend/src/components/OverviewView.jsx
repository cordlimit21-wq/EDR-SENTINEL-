import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Laptop, 
  Lock, 
  AlertTriangle, 
  Activity, 
  Play, 
  RotateCw, 
  Clock, 
  ChevronRight, 
  FileText, 
  Cpu, 
  HardDrive,
  Network
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

const API_BASE = "http://localhost:8000";

export default function OverviewView({
  stats,
  events = [],
  traps = [],
  onSimulateAttack,
  isSimulating = false,
  onNavigateTab,
  onSelectEvent,
  latestThreatTimestamp,
  theme = 'dark'
}) {
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/dashboard/stats`);
        if (res.ok) setDashboardData(await res.json());
      } catch (e) {
        console.error("Error fetching dashboard data:", e);
      }
    };
    fetchDashboard();
  }, []);

  const kpis = [
    {
      title: "PROTECTED ENDPOINTS",
      value: stats?.protected_endpoints || 24,
      desc: "Fleet Agent Nodes",
      color: "text-slate-900 dark:text-white",
      badge: "ACTIVE",
      badgeColor: "bg-emerald-500/10 text-emerald-500 border-emerald-500/30"
    },
    {
      title: "ONLINE",
      value: stats?.online_endpoints || 21,
      desc: "Healthy & Communicating",
      color: "text-emerald-500",
      badge: "NOMINAL",
      badgeColor: "bg-emerald-500/10 text-emerald-500 border-emerald-500/30"
    },
    {
      title: "ACTIVE THREATS",
      value: stats?.active_threats ? String(stats.active_threats).padStart(2, '0') : "03",
      desc: "Heuristic Flags",
      color: "text-orange-500",
      badge: "FLAGGED",
      badgeColor: "bg-orange-500/10 text-orange-400 border-orange-500/30"
    },
    {
      title: "CRITICAL",
      value: stats?.critical_threats ? String(stats.critical_threats).padStart(2, '0') : "02",
      desc: "Canary / High Entropy",
      color: "text-rose-500",
      badge: "ATTENTION",
      badgeColor: "bg-rose-500/10 text-rose-400 border-rose-500/30 animate-pulse"
    },
    {
      title: "ISOLATED",
      value: stats?.isolated_endpoints ? String(stats.isolated_endpoints).padStart(2, '0') : "01",
      desc: "Network Boundary Active",
      color: "text-rose-400",
      badge: "QUARANTINED",
      badgeColor: "bg-rose-950 text-rose-300 border-rose-500/40"
    },
    {
      title: "CURRENT RISK",
      value: stats?.current_risk_score || 94,
      desc: "Max Node Composite Risk",
      color: "text-rose-500",
      badge: "ELEVATED",
      badgeColor: "bg-rose-500/20 text-rose-400 border-rose-500/50"
    },
  ];

  const threatChartData = dashboardData?.threat_activity || [
    { time: "04:00", events: 12, risk: 15 },
    { time: "05:00", events: 18, risk: 18 },
    { time: "06:00", events: 25, risk: 20 },
    { time: "07:00", events: 45, risk: 35 },
    { time: "08:00", events: 82, risk: 52 },
    { time: "09:00", events: 190, risk: 78 },
    { time: "Now", events: 312, risk: 94 },
  ];

  const riskDistData = dashboardData?.endpoint_risk || [
    { name: "Critical (>80)", count: 2, fill: "#ef4444" },
    { name: "Elevated (50-80)", count: 3, fill: "#f97316" },
    { name: "Guarded (20-50)", count: 4, fill: "#eab308" },
    { name: "Normal (<20)", count: 15, fill: "#22c55e" },
  ];

  const recentAlerts = dashboardData?.recent_alerts || [
    { id: "ALT-901", title: "High Entropy Burst in Finance", endpoint: "WS-FINANCE-01", risk: 94, time: "Just now", severity: "CRITICAL" },
    { id: "ALT-902", title: "Suspicious PowerShell Invocation", endpoint: "WS-EXEC-02", risk: 78, time: "12m ago", severity: "HIGH" },
    { id: "ALT-903", title: "Canary Honeytoken Probe Intercepted", endpoint: "SRV-DATABASE-01", risk: 62, time: "1h ago", severity: "MEDIUM" },
  ];

  return (
    <div className="space-y-6 font-mono text-xs pb-6">
      
      {/* 1. Engine Banner */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#070b14] border border-slate-200 dark:border-white/[0.08] shadow-md flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-bold text-emerald-500 uppercase tracking-wider">
              SENTINEL SOC MONITORING CENTER
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-500 text-[11px]">{stats?.kernel_driver_status || "ATTACHED (Minifilter: SentinelTrap.sys)"}</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Enterprise Security Operations Overview
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-sans">
            Continuous real-time behavioral correlation across 24 monitored endpoints and 48 armed canary traps.
          </p>
        </div>

        {/* Demo Simulation Trigger */}
        <button
          onClick={onSimulateAttack}
          disabled={isSimulating}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-slate-950 font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-orange-500/25 active:scale-95 transition-all disabled:opacity-50"
        >
          <Play className={`w-4 h-4 fill-current ${isSimulating ? 'animate-spin' : ''}`} />
          <span>{isSimulating ? "SIMULATING ATTACK..." : "SIMULATE RANSOMWARE ATTACK"}</span>
        </button>
      </div>

      {/* 2. SIX KPI CARDS (Exact values from specification) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {kpis.map((kpi, idx) => (
          <div 
            key={idx} 
            className="p-4 rounded-xl bg-white dark:bg-[#070b14] border border-slate-200 dark:border-white/[0.08] shadow-sm flex flex-col justify-between space-y-3"
          >
            <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              <span className="truncate">{kpi.title}</span>
            </div>
            <div>
              <div className={`text-3xl font-extrabold font-mono ${kpi.color}`}>
                {kpi.value}
              </div>
              <div className="text-[10px] text-slate-500 truncate mt-1">
                {kpi.desc}
              </div>
            </div>
            <div className={`px-2 py-0.5 rounded border text-[9px] font-bold text-center uppercase ${kpi.badgeColor}`}>
              {kpi.badge}
            </div>
          </div>
        ))}
      </div>

      {/* 3. CHARTS ROW: Threat Activity Stream + Endpoint Risk Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Threat Activity Stream (8 cols) */}
        <div className="lg:col-span-8 p-5 rounded-2xl bg-white dark:bg-[#070b14] border border-slate-200 dark:border-white/[0.08] shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/[0.06] pb-3">
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">TELEMETRY CORRELATION</div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                Threat Activity & Risk Escalation Curve
              </h3>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-orange-500/10 text-orange-500 font-bold">
              REAL-TIME
            </span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={threatChartData}>
                <defs>
                  <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="eventsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff6a00" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ff6a00" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={10} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#090d16', 
                    borderColor: 'rgba(255,255,255,0.1)', 
                    borderRadius: '0.75rem', 
                    fontSize: '11px',
                    color: '#fff'
                  }} 
                />
                <Area type="monotone" dataKey="risk" stroke="#f43f5e" strokeWidth={2} fillOpacity={1} fill="url(#riskGrad)" name="Risk Score (/100)" />
                <Area type="monotone" dataKey="events" stroke="#ff6a00" strokeWidth={1.5} fillOpacity={1} fill="url(#eventsGrad)" name="File Events / min" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Endpoint Risk Distribution (4 cols) */}
        <div className="lg:col-span-4 p-5 rounded-2xl bg-white dark:bg-[#070b14] border border-slate-200 dark:border-white/[0.08] shadow-md space-y-4">
          <div className="border-b border-slate-100 dark:border-white/[0.06] pb-3">
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">FLEET POSTURE</div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
              Endpoint Risk Distribution
            </h3>
          </div>

          <div className="space-y-3 pt-2">
            {riskDistData.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-600 dark:text-slate-300 font-bold">{item.name}</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">{item.count} Nodes</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div 
                    className="h-full rounded-full" 
                    style={{ 
                      width: `${(item.count / 24) * 100}%`,
                      backgroundColor: item.fill 
                    }} 
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/[0.06] text-[11px] text-slate-500 dark:text-slate-400 font-sans mt-4">
            Total 24 monitored endpoints across Finance, Engineering, Executive, and Core Server subnets.
          </div>
        </div>

      </div>

      {/* 4. RECENT ALERTS & ATTACK TIMELINE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Recent Alerts (6 cols) */}
        <div className="lg:col-span-6 p-5 rounded-2xl bg-white dark:bg-[#070b14] border border-slate-200 dark:border-white/[0.08] shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/[0.06] pb-3">
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">THREAT FEED</div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                Recent Security Alerts
              </h3>
            </div>
            {onNavigateTab && (
              <button 
                onClick={() => onNavigateTab('incidents')} 
                className="text-orange-500 hover:underline text-[11px] font-bold"
              >
                View Incidents →
              </button>
            )}
          </div>

          <div className="space-y-2.5">
            {recentAlerts.map((alt) => (
              <div 
                key={alt.id}
                onClick={() => onNavigateTab && onNavigateTab('incidents')}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/[0.06] hover:border-orange-500/40 cursor-pointer transition-all flex items-center justify-between"
              >
                <div className="flex items-start gap-3">
                  <div className={`p-1.5 rounded-lg ${
                    alt.severity === 'CRITICAL' ? 'bg-rose-500/20 text-rose-500' :
                    alt.severity === 'HIGH' ? 'bg-orange-500/20 text-orange-500' :
                    'bg-amber-500/20 text-amber-500'
                  }`}>
                    <ShieldAlert className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white text-xs">
                      {alt.title}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      Endpoint: <span className="font-bold text-slate-700 dark:text-slate-300">{alt.endpoint}</span> • {alt.time}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    alt.severity === 'CRITICAL' ? 'bg-rose-500/20 text-rose-400' :
                    alt.severity === 'HIGH' ? 'bg-orange-500/20 text-orange-400' :
                    'bg-amber-500/20 text-amber-400'
                  }`}>
                    Risk: {alt.risk}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Attack Timeline (6 cols) */}
        <div className="lg:col-span-6 p-5 rounded-2xl bg-white dark:bg-[#070b14] border border-slate-200 dark:border-white/[0.08] shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/[0.06] pb-3">
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">INC-2026-0042</div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                Attack Progression Timeline
              </h3>
            </div>
            {onNavigateTab && (
              <button 
                onClick={() => onNavigateTab('attack-timeline')} 
                className="text-orange-500 hover:underline text-[11px] font-bold"
              >
                Full Timeline →
              </button>
            )}
          </div>

          <div className="space-y-2">
            {[
              { time: "09:41:02", stage: "NORMAL -> SUSPICIOUS PROCESS", desc: "svchost_suspicious.exe spawned PID 4312", color: "text-amber-400" },
              { time: "09:41:07", stage: "FILE ACTIVITY SPIKE", desc: "1,823 ops/min read burst across documents", color: "text-orange-400" },
              { time: "09:41:16", stage: "ENTROPY ANOMALY", desc: "Shannon byte entropy H = 7.82", color: "text-rose-400" },
              { time: "09:41:21", stage: "RISK ESCALATION", desc: "Behavior score surged to 78/100", color: "text-rose-500" },
              { time: "09:41:25", stage: "RANSOMWARE DETECTED & ISOLATED", desc: "Canary token hit. Host quarantined.", color: "text-emerald-400 font-bold" },
            ].map((st, i) => (
              <div key={i} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/[0.04] flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2.5">
                  <span className="text-slate-400">{st.time}</span>
                  <span className={st.color}>{st.stage}</span>
                </div>
                <span className="text-slate-500 font-sans text-[10px] hidden sm:inline">{st.desc}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
