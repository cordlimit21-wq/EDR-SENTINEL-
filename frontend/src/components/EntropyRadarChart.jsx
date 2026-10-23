import React, { useState } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, ReferenceLine, CartesianGrid, AreaChart, Area } from 'recharts';
import { Activity, Zap, TrendingUp, ShieldAlert } from 'lucide-react';

export default function EntropyRadarChart({ telemetryHistory = [] }) {
  const [metricMode, setMetricMode] = useState('entropy'); // 'entropy' | 'risk'

  // Take the last 18 events in chronological order for plotting
  const chartData = [...telemetryHistory].slice(0, 18).reverse().map((evt, idx) => {
    let computedRisk = Math.round(evt.entropy_score * 12);
    if (evt.severity === 'CRITICAL_KILL') computedRisk = 96;
    else if (evt.severity === 'WARNING') computedRisk = Math.min(78, Math.max(54, Math.round(evt.entropy_score * 10)));
    else computedRisk = Math.min(28, Math.max(12, Math.round(evt.entropy_score * 3.2)));

    return {
      name: evt.timestamp?.split('.')[0] || `T-${idx}`,
      entropy: evt.entropy_score,
      riskScore: computedRisk,
      latency: parseFloat(evt.response_latency?.replace('ms', '')) || 0.4,
      process: evt.process_name,
      targetFile: evt.target_file,
      isThreat: evt.severity === 'CRITICAL_KILL',
      severity: evt.severity
    };
  });

  // Synthetic baseline points if empty
  const displayData = chartData.length >= 2 ? chartData : [
    { name: '12:00:01', entropy: 4.12, riskScore: 14, latency: 0.4, process: 'excel.exe', isThreat: false },
    { name: '12:00:04', entropy: 4.45, riskScore: 18, latency: 0.5, process: 'WINWORD.EXE', isThreat: false },
    { name: '12:00:08', entropy: 4.89, riskScore: 22, latency: 0.3, process: 'chrome.exe', isThreat: false },
    { name: '12:00:12', entropy: 4.71, riskScore: 19, latency: 0.4, process: 'Code.exe', isThreat: false },
  ];

  return (
    <div className="cyber-card rounded-2xl p-5 flex flex-col shadow-lg space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-slate-900/80 border border-white/[0.08] text-cyan-400">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
              BEHAVIORAL ENTROPY &amp; RISK SCORE TREND
              <span className="text-[10px] font-normal px-2 py-0.2 rounded-full bg-slate-900 text-cyan-300 border border-cyan-500/30 font-mono">
                {metricMode === 'entropy' ? 'SHANNON (0.0 - 8.0)' : 'RISK PROBABILITY (0 - 100)'}
              </span>
            </h3>
            <p className="text-[10px] text-slate-500 font-mono">
              Temporal Heuristic Fluctuation vs Kernel Ransomware Interception Threshold
            </p>
          </div>
        </div>

        {/* Controls & Indicators */}
        <div className="flex items-center gap-2.5 font-mono text-xs">
          {/* Mode Switcher */}
          <div className="flex rounded-lg bg-slate-950/80 p-0.5 border border-white/[0.06] text-xs">
            <button
              onClick={() => setMetricMode('entropy')}
              className={`px-2.5 py-1 rounded text-[10px] uppercase font-bold transition-all ${
                metricMode === 'entropy'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Shannon Entropy
            </button>
            <button
              onClick={() => setMetricMode('risk')}
              className={`px-2.5 py-1 rounded text-[10px] uppercase font-bold transition-all ${
                metricMode === 'risk'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Risk Score
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-slate-400 pl-2 border-l border-white/[0.08]">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span>Normal Baseline</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-rose-400">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span className="font-semibold">Kill Threshold</span>
          </div>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-52 w-full font-mono text-[11px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={displayData} margin={{ top: 12, right: 15, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="cyanGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00f0ff" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#00f0ff" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="roseGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="2 4" stroke="rgba(255, 255, 255, 0.05)" />
            <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 10 }} />
            <YAxis 
              domain={metricMode === 'entropy' ? [0, 8.5] : [0, 105]} 
              stroke="#64748b" 
              tick={{ fontSize: 10 }} 
            />

            <Tooltip
              contentStyle={{
                backgroundColor: '#07090e',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                fontSize: '11px',
                fontFamily: 'monospace',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.6)'
              }}
              formatter={(value, name) => [
                name === 'entropy' 
                  ? `${value} (Shannon H)` 
                  : name === 'riskScore' 
                  ? `${value} / 100 Index` 
                  : `${value} ms`,
                name === 'entropy' ? 'Entropy' : name === 'riskScore' ? 'Risk Score' : 'Latency'
              ]}
              labelFormatter={(label, payload) => {
                if (payload && payload.length > 0) {
                  return `${label} • Process: ${payload[0].payload.process}`;
                }
                return label;
              }}
            />

            {/* Threshold Reference Line */}
            {metricMode === 'entropy' ? (
              <ReferenceLine 
                y={7.0} 
                stroke="#ef4444" 
                strokeDasharray="4 4" 
                label={{ value: 'RANSOMWARE KILL THRESHOLD (H = 7.00)', fill: '#ef4444', fontSize: 10, position: 'top' }} 
              />
            ) : (
              <ReferenceLine 
                y={75} 
                stroke="#ef4444" 
                strokeDasharray="4 4" 
                label={{ value: 'CRITICAL CONTAINMENT THRESHOLD (75)', fill: '#ef4444', fontSize: 10, position: 'top' }} 
              />
            )}

            <Area
              type="monotone"
              dataKey={metricMode === 'entropy' ? 'entropy' : 'riskScore'}
              stroke={metricMode === 'entropy' ? '#00f0ff' : '#38bdf8'}
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#cyanGradient)"
              dot={(props) => {
                const { cx, cy, payload } = props;
                if (payload.isThreat) {
                  return (
                    <circle cx={cx} cy={cy} r={6} fill="#ef4444" stroke="#ffffff" strokeWidth={2} className="animate-ping" key={`dot-${props.index}`} />
                  );
                }
                return <circle cx={cx} cy={cy} r={2.5} fill="#00f0ff" key={`dot-${props.index}`} />;
              }}
              activeDot={{ r: 5, fill: '#00f0ff' }}
              name={metricMode === 'entropy' ? 'entropy' : 'riskScore'}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Footer Info */}
      <div className="pt-2 border-t border-white/[0.04] flex flex-wrap items-center justify-between text-[10px] font-mono text-slate-500 gap-2">
        <span>Minifilter Sampling Frequency: <strong className="text-cyan-400">0.4ms Polling Window</strong></span>
        <span>Peak Observed Entropy: <strong className="text-rose-400">7.98 (Sigkill Triggered)</strong></span>
      </div>
    </div>
  );
}
