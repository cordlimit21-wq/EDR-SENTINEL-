import React, { useState, useEffect } from 'react';
import NetworkBackground from './NetworkBackground';
import EndpointThreatCoreGraphic from './EndpointThreatCoreGraphic';
import ThemeToggle from './ThemeToggle';
import { 
  Shield, 
  ArrowRight, 
  Activity, 
  Play, 
  Terminal, 
  Cpu, 
  HardDrive, 
  Network, 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  Lock, 
  Zap, 
  Eye, 
  Radio, 
  Server, 
  Database, 
  Layers, 
  ChevronRight,
  Sliders,
  ExternalLink
} from 'lucide-react';

export default function LandingPage({ 
  onLaunchEDR, 
  onNavigateView, 
  stats, 
  theme = 'dark', 
  onToggleTheme 
}) {
  const isDark = theme === 'dark';

  // Live Telemetry simulation events for "See The Attack" section
  const [activeTelemetryTab, setActiveTelemetryTab] = useState('ALL');
  const [telemetryEvents, setTelemetryEvents] = useState([
    { id: 1, time: "09:41:02", type: "PROCESS_CREATED", detail: "PID 4312 (svchost_suspicious.exe) spawned via powershell.exe", tag: "PROCESS", severity: "INFO", score: "+10" },
    { id: 2, time: "09:41:07", type: "FILE_ACTIVITY_SPIKE", detail: "1,823 operations/min recorded in EDR_Test/Documents", tag: "FILESYSTEM", severity: "WARNING", score: "+25" },
    { id: 3, time: "09:41:12", type: "RENAME_VELOCITY", detail: "Batch alteration: .docx -> .locked within 40ms window", tag: "VELOCITY", severity: "HIGH", score: "+15" },
    { id: 4, time: "09:41:16", type: "ENTROPY_ANOMALY", detail: "Shannon entropy surge H = 7.82 on TRAP-002 (confidential.txt)", tag: "ENTROPY", severity: "CRITICAL", score: "+20" },
    { id: 5, time: "09:41:21", type: "BEHAVIOR_SCORE", detail: "Dynamic composite risk crossed threshold -> 78/100", tag: "CORRELATION", severity: "CRITICAL", score: "+15" },
    { id: 6, time: "09:41:25", type: "RANSOMWARE_DETECTED", detail: "CANARY HONEYTOKEN TRIPPED -> RISK 94/100 -> AUTO-CONTAINMENT", tag: "DEFENSE", severity: "CRITICAL_KILL", score: "ACTION" },
  ]);

  // Dynamic Risk Engine Score demonstration
  const [demoRiskScore, setDemoRiskScore] = useState(94);
  const [selectedSignal, setSelectedSignal] = useState(null);

  const signalsList = [
    { name: "File Modification", val: "+25", desc: "Mass file write bursts exceeding 50 ops/sec", color: "text-orange-400" },
    { name: "Rename Velocity", val: "+15", desc: "Rapid bulk file extension substitution", color: "text-amber-400" },
    { name: "Entropy Anomaly", val: "+20", desc: "Shannon byte randomness exceeding H > 7.0", color: "text-rose-400" },
    { name: "Process Behavior", val: "+15", desc: "Untrusted parent-child chain with shadow copy probe", color: "text-purple-400" },
    { name: "Network Anomaly", val: "+10", desc: "Outbound C2 beaconing on port 8443", color: "text-cyan-400" },
    { name: "System Behavior", val: "+9", desc: "Volume Shadow Copy deletion attempt via vssadmin", color: "text-red-400" },
  ];

  const handleSmoothScroll = (sectionId) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen bg-[#f8fafc] dark:bg-[#05070d] text-slate-900 dark:text-slate-100 font-sans selection:bg-orange-500 selection:text-black overflow-x-hidden">
      {/* Background Animated Digital Network */}
      <div className="fixed inset-0 pointer-events-none opacity-10 dark:opacity-20 z-0">
        <NetworkBackground />
      </div>

      {/* Cinematic Sweeping Orange Light Trail in Corner */}
      <div className="fixed -bottom-24 -left-20 w-[600px] h-[300px] rounded-full bg-gradient-to-r from-orange-600/20 via-orange-500/10 to-transparent blur-3xl pointer-events-none transform -rotate-12 z-0" />

      {/* ========================================================================= */}
      {/* 1. TOP NAVBAR                                                             */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-white/[0.08] bg-white/90 dark:bg-[#05070d]/90 backdrop-blur-xl px-6 lg:px-12 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Left: Brand Icon + Title + Zero-Day Defense Badge */}
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-orange-500/10 border border-orange-500/35 text-orange-500 shadow-md shadow-orange-500/15">
              <Shield className="w-5 h-5 text-orange-500 fill-orange-500/20" />
            </div>
            <div className="flex items-center gap-2.5">
              <span className="text-base font-extrabold tracking-wider text-slate-900 dark:text-white font-mono">
                SENTINEL <span className="text-orange-500 font-bold">// EDR</span>
              </span>
              <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full border border-orange-500/40 text-orange-600 dark:text-orange-400 bg-orange-500/10 font-bold hidden sm:inline-block">
                ZERO-DAY DEFENSE
              </span>
            </div>
          </div>

          {/* Center: Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium font-mono">
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
              className="relative text-orange-500 dark:text-orange-400 font-semibold transition-colors pb-1"
            >
              <span>Home</span>
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-500 rounded-full" />
            </button>
            <button 
              onClick={() => handleSmoothScroll('how-it-works')} 
              className="text-slate-600 dark:text-slate-400 hover:text-orange-500 dark:hover:text-white transition-colors"
            >
              How It Works
            </button>
            <button 
              onClick={() => onNavigateView ? onNavigateView('protection') : handleSmoothScroll('risk-engine')} 
              className="text-slate-600 dark:text-slate-400 hover:text-orange-500 dark:hover:text-white transition-colors"
            >
              Protection
            </button>
            <button 
              onClick={() => onNavigateView ? onNavigateView('architecture') : handleSmoothScroll('live-detection')} 
              className="text-slate-600 dark:text-slate-400 hover:text-orange-500 dark:hover:text-white transition-colors"
            >
              Architecture
            </button>
          </nav>

          {/* Right: Theme Toggle + LAUNCH EDR */}
          <div className="flex items-center gap-4">
            <ThemeToggle theme={theme} onToggle={onToggleTheme} />

            <button
              onClick={onLaunchEDR}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-slate-950 font-extrabold text-xs uppercase tracking-wider font-mono shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:brightness-105 active:scale-95 transition-all"
            >
              <span>LAUNCH EDR</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-950 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. CRITICAL HERO SECTION (Split Layout with Live Endpoint Detection Core)  */}
      {/* ========================================================================= */}
      <section className="relative z-10 px-6 lg:px-12 max-w-7xl mx-auto w-full pt-8 pb-16 lg:pt-14 lg:pb-24">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-14 w-full">
          
          {/* Left Column (Hero Content) */}
          <div className="w-full lg:w-[48%] space-y-6">
            {/* Top Status Badge */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-900/90 dark:bg-[#070d18]/95 border border-emerald-500/40 text-xs font-mono backdrop-blur-md shadow-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400 tracking-wider text-[11px] uppercase">
                REAL-TIME PROTECTION ACTIVE
              </span>
              <span className="text-slate-600 dark:text-slate-700">•</span>
              <span className="text-slate-500 dark:text-slate-400 text-[11px] flex items-center gap-1.5 font-bold">
                <Activity className="w-3 h-3 text-cyan-400" />
                0% CPU OVERHEAD
              </span>
            </div>

            {/* Headline */}
            <div className="space-y-2">
              <div className="text-4xl sm:text-5xl lg:text-[58px] xl:text-[64px] font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.05] font-mono">
                ZERO-DAY <br />
                RANSOMWARE <br />
                <span className="bg-gradient-to-r from-[#ff6a00] via-[#f43f5e] to-[#a855f7] bg-clip-text text-transparent" style={{ WebkitTextFillColor: 'transparent' }}>
                  BEHAVIOR-BASED
                </span> <br />
                DEFENSE
              </div>
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 font-normal pt-2 max-w-lg leading-relaxed font-sans">
                Detect, investigate, and contain ransomware behavior before critical systems are compromised.
              </p>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onLaunchEDR}
                className="group flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-slate-950 font-extrabold font-mono text-xs sm:text-sm uppercase tracking-wider shadow-xl shadow-orange-500/35 hover:shadow-orange-500/50 hover:scale-[1.02] active:scale-95 transition-all duration-200"
              >
                <span>LAUNCH EDR</span>
                <ArrowRight className="w-4 h-4 text-slate-950 stroke-[2.5] group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => handleSmoothScroll('how-it-works')}
                className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 dark:bg-[#090e1a]/90 dark:hover:bg-[#12192b] border border-slate-300 dark:border-white/[0.18] hover:border-slate-400 dark:hover:border-white/40 text-slate-800 dark:text-slate-200 font-mono text-xs sm:text-sm font-bold transition-all duration-200 shadow-sm"
              >
                <div className="w-4 h-4 rounded-full border border-slate-400/60 dark:border-slate-400 flex items-center justify-center">
                  <Play className="w-2.5 h-2.5 fill-slate-700 dark:fill-slate-200 text-slate-700 dark:text-slate-200 ml-0.5" />
                </div>
                <span>HOW IT WORKS →</span>
              </button>
            </div>

            {/* Quick Fleet Metrics summary */}
            <div className="pt-4 grid grid-cols-3 gap-3 border-t border-slate-200 dark:border-white/[0.08] max-w-md">
              <div>
                <div className="text-[10px] font-mono text-slate-500 uppercase">Fleet Size</div>
                <div className="text-lg font-bold font-mono text-slate-900 dark:text-white">24 Endpoints</div>
              </div>
              <div>
                <div className="text-[10px] font-mono text-slate-500 uppercase">Detection SLA</div>
                <div className="text-lg font-bold font-mono text-orange-500">&lt; 11ms</div>
              </div>
              <div>
                <div className="text-[10px] font-mono text-slate-500 uppercase">Tripwire Traps</div>
                <div className="text-lg font-bold font-mono text-emerald-500">48 Armed</div>
              </div>
            </div>
          </div>

          {/* Right Column: Live Endpoint Threat Detection Core (REPLACES GLOBE) */}
          <div className="w-full lg:w-[52%] flex items-center justify-center relative">
            <EndpointThreatCoreGraphic theme={theme} />
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. HOW IT WORKS SECTION (Full-Width 5-Step Visual Workflow)                */}
      {/* ========================================================================= */}
      <section id="how-it-works" className="relative z-10 py-20 px-6 lg:px-12 border-t border-slate-200 dark:border-white/[0.08] bg-slate-100/60 dark:bg-[#070b14]/70">
        <div className="max-w-7xl mx-auto space-y-12">
          
          {/* Section Header */}
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-600 dark:text-orange-400 text-xs font-mono font-bold uppercase tracking-widest">
              <Sliders className="w-3.5 h-3.5" />
              DETECTION PIPELINE
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-mono text-slate-900 dark:text-white">
              HOW SENTINEL DETECTS RANSOMWARE
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-400 font-sans">
              From endpoint telemetry to automated containment in milliseconds.
            </p>
          </div>

          {/* 5-Step Visual Flow Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
            {/* Step 1: COLLECT */}
            <div className="p-5 rounded-2xl bg-white dark:bg-[#090e1c] border border-slate-200 dark:border-white/[0.08] shadow-lg flex flex-col justify-between space-y-4 relative group hover:border-cyan-500/50 transition-all">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-cyan-500">01</span>
                  <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
                    <Activity className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-base font-bold font-mono text-slate-900 dark:text-white uppercase">COLLECT</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
                  Endpoint telemetry is continuously observed in user and kernel space.
                </p>
              </div>
              <div className="pt-2 border-t border-slate-100 dark:border-white/[0.06] space-y-1 text-[11px] font-mono text-slate-500 dark:text-slate-400">
                <div>• Process activity</div>
                <div>• File read/writes</div>
                <div>• Network sockets</div>
                <div>• System behaviors</div>
              </div>
            </div>

            {/* Step 2: ANALYZE */}
            <div className="p-5 rounded-2xl bg-white dark:bg-[#090e1c] border border-slate-200 dark:border-white/[0.08] shadow-lg flex flex-col justify-between space-y-4 relative group hover:border-purple-500/50 transition-all">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-purple-500">02</span>
                  <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400">
                    <Cpu className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-base font-bold font-mono text-slate-900 dark:text-white uppercase">ANALYZE</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
                  Behavioral engine correlates multi-threaded patterns and Shannon entropy.
                </p>
              </div>
              <div className="pt-2 border-t border-slate-100 dark:border-white/[0.06] space-y-1 text-[11px] font-mono text-purple-400/90">
                <div>• Shannon H &gt; 7.0</div>
                <div>• In-place overwrite</div>
                <div>• Parent lineage check</div>
                <div>• Volume shadow probe</div>
              </div>
            </div>

            {/* Step 3: SCORE */}
            <div className="p-5 rounded-2xl bg-white dark:bg-[#090e1c] border border-slate-200 dark:border-white/[0.08] shadow-lg flex flex-col justify-between space-y-4 relative group hover:border-orange-500/50 transition-all">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-orange-500">03</span>
                  <div className="p-1.5 rounded-lg bg-orange-500/10 text-orange-400">
                    <Sliders className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-base font-bold font-mono text-slate-900 dark:text-white uppercase">SCORE</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
                  Multiple indicators contribute to a dynamic risk score.
                </p>
              </div>
              <div className="pt-2 border-t border-slate-100 dark:border-white/[0.06] space-y-1 text-[10px] font-mono">
                <div className="flex justify-between text-slate-600 dark:text-slate-400"><span>FILE ACT</span><span className="font-bold text-orange-400">+25</span></div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400"><span>RENAME VEL</span><span className="font-bold text-amber-400">+15</span></div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400"><span>ENTROPY</span><span className="font-bold text-rose-400">+20</span></div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400"><span>PROCESS</span><span className="font-bold text-purple-400">+15</span></div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400"><span>NETWORK</span><span className="font-bold text-cyan-400">+10</span></div>
                <div className="mt-1 pt-1 border-t border-slate-200 dark:border-white/[0.1] font-bold text-rose-500 flex justify-between">
                  <span>TOTAL RISK</span>
                  <span>94 / 100</span>
                </div>
              </div>
            </div>

            {/* Step 4: DETECT */}
            <div className="p-5 rounded-2xl bg-white dark:bg-[#090e1c] border-2 border-rose-500/60 shadow-lg shadow-rose-950/20 flex flex-col justify-between space-y-4 relative group">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-rose-500">04</span>
                  <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 animate-pulse">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-base font-bold font-mono text-rose-500 uppercase">DETECT</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
                  When the combined behavioral score crosses threshold (80):
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-[11px] font-mono text-rose-400 font-bold text-center">
                CRITICAL RANSOMWARE BEHAVIOR DETECTED
              </div>
            </div>

            {/* Step 5: CONTAIN */}
            <div className="p-5 rounded-2xl bg-white dark:bg-[#090e1c] border border-emerald-500/50 shadow-lg flex flex-col justify-between space-y-4 relative group hover:border-emerald-400 transition-all">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-emerald-500">05</span>
                  <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-base font-bold font-mono text-emerald-500 uppercase">CONTAIN</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
                  Automated or analyst response action executed in 11ms:
                </p>
              </div>
              <div className="pt-2 border-t border-slate-100 dark:border-white/[0.06] space-y-1 text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                <div>✓ ISOLATE ENDPOINT</div>
                <div>✓ TERMINATE PROCESS</div>
                <div>✓ BLOCK CONNECTION</div>
                <div>✓ INCIDENT CREATED</div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. LIVE DETECTION SECTION ("See The Attack Before It Becomes A Breach")   */}
      {/* ========================================================================= */}
      <section id="live-detection" className="relative z-10 py-20 px-6 lg:px-12 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Text Explanation */}
          <div className="lg:col-span-5 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-600 dark:text-cyan-400 text-xs font-mono font-bold uppercase tracking-widest">
              <Terminal className="w-3.5 h-3.5" />
              LIVE TELEMETRY STREAM
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-mono text-slate-900 dark:text-white leading-tight">
              SEE THE ATTACK BEFORE IT BECOMES A BREACH
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed font-sans">
              Sentinel observes individual micro-actions at the filesystem and process layers. While generic antivirus waits for known signatures, Sentinel catches the live encryption sequence in seconds.
            </p>

            <div className="p-4 rounded-xl bg-slate-900/90 dark:bg-[#070d1a] border border-slate-200 dark:border-white/[0.08] space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between text-slate-400">
                <span>Active Target:</span>
                <span className="font-bold text-white">WS-FINANCE-01 (10.0.1.21)</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Trigger Mechanism:</span>
                <span className="font-bold text-orange-400">Multi-factor correlation</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Total Response Latency:</span>
                <span className="font-bold text-emerald-400">11 milliseconds</span>
              </div>
            </div>

            <button
              onClick={onLaunchEDR}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider transition-all"
            >
              <span>INSPECT FULL AUDIT IN EDR</span>
              <ChevronRight className="w-4 h-4 stroke-[3]" />
            </button>
          </div>

          {/* Right Live Telemetry Terminal View */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl overflow-hidden font-mono text-xs">
              {/* Terminal Titlebar */}
              <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                  <span className="text-slate-400 text-[11px] ml-2">sentinel_live_telemetry_feed.log</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>MONITORING ACTIVE</span>
                </div>
              </div>

              {/* Terminal Telemetry Events */}
              <div className="p-4 sm:p-5 space-y-3 max-h-[420px] overflow-y-auto">
                {telemetryEvents.map((evt) => (
                  <div 
                    key={evt.id} 
                    className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div className="flex items-start sm:items-center gap-3">
                      <span className="text-slate-500 text-[11px] whitespace-nowrap">{evt.time}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            evt.severity === 'CRITICAL_KILL' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' :
                            evt.severity === 'CRITICAL' ? 'bg-rose-950 text-rose-300' :
                            evt.severity === 'HIGH' ? 'bg-orange-950 text-orange-400' :
                            evt.severity === 'WARNING' ? 'bg-amber-950 text-amber-300' :
                            'bg-slate-800 text-cyan-300'
                          }`}>
                            {evt.type}
                          </span>
                        </div>
                        <div className="text-slate-300 text-[11px] mt-1 font-mono">
                          {evt.detail}
                        </div>
                      </div>
                    </div>
                    <div className="text-right sm:self-center">
                      <span className="text-[10px] font-bold px-2 py-1 rounded bg-slate-800 text-slate-200">
                        {evt.score}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. RISK ENGINE SECTION ("One Signal Isn't Enough")                         */}
      {/* ========================================================================= */}
      <section id="risk-engine" className="relative z-10 py-20 px-6 lg:px-12 border-t border-slate-200 dark:border-white/[0.08] bg-slate-100/60 dark:bg-[#070b14]/70">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-600 dark:text-purple-400 text-xs font-mono font-bold uppercase tracking-widest">
              <Sliders className="w-3.5 h-3.5" />
              MULTI-SIGNAL HEURISTICS
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-mono text-slate-900 dark:text-white">
              ONE SIGNAL ISN'T ENOUGH.
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-400 font-sans">
              Sentinel correlates multiple behavioral signals to eliminate false positives and catch stealth zero-day attacks before mass file encryption occurs.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left 6 Signals Cards */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {signalsList.map((sig, idx) => (
                <div 
                  key={idx}
                  onClick={() => setSelectedSignal(sig)}
                  className="p-4 rounded-xl bg-white dark:bg-[#090e1c] border border-slate-200 dark:border-white/[0.08] shadow-sm hover:border-orange-500/40 cursor-pointer transition-all space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold font-mono text-slate-900 dark:text-white">{sig.name}</span>
                    <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 ${sig.color}`}>
                      {sig.val}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-sans leading-relaxed">
                    {sig.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Right Interactive Risk Gauge Display */}
            <div className="lg:col-span-5">
              <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#090e1c] border border-slate-200 dark:border-white/[0.08] shadow-xl text-center space-y-6">
                <div className="space-y-1">
                  <span className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold">COMPOSITE RISK ACCUMULATOR</span>
                  <div className="text-5xl sm:text-6xl font-extrabold font-mono text-rose-500 tracking-tight">
                    {demoRiskScore} <span className="text-2xl text-slate-400 font-normal">/ 100</span>
                  </div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/40 text-rose-500 font-mono text-xs font-bold uppercase mt-2">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>STATUS: CRITICAL RANSOMWARE</span>
                  </div>
                </div>

                {/* Visual Progress Bar */}
                <div className="space-y-2">
                  <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden relative">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-500 via-orange-500 to-rose-600 rounded-full transition-all duration-500"
                      style={{ width: `${demoRiskScore}%` }}
                    />
                    {/* Threshold Marker at 80 */}
                    <div 
                      className="absolute top-0 bottom-0 w-0.5 bg-white z-10"
                      style={{ left: '80%' }}
                      title="Threshold: 80"
                    />
                  </div>
                  <div className="flex justify-between text-[10px] font-mono text-slate-400">
                    <span>BASELINE (0)</span>
                    <span className="text-orange-500 font-bold">THRESHOLD (80)</span>
                    <span className="text-rose-500 font-bold">KILL HOOK (100)</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/[0.06] text-left text-xs font-mono text-slate-600 dark:text-slate-300">
                  <div className="font-bold text-slate-900 dark:text-white mb-1">AUTOMATED DEFENSE ACTION:</div>
                  <div>At risk &gt; 80, Sentinel's Kernel Minifilter revokes process file handles and cuts network socket without waiting for human approval.</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. ATTACK TIMELINE SECTION (SOC Incident Progression)                     */}
      {/* ========================================================================= */}
      <section id="attack-timeline" className="relative z-10 py-20 px-6 lg:px-12 max-w-7xl mx-auto w-full">
        <div className="space-y-12">
          
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-mono font-bold uppercase tracking-widest">
              <Activity className="w-3.5 h-3.5" />
              FORENSIC CHRONOLOGY
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-mono text-slate-900 dark:text-white">
              ATTACK TIMELINE
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-400 font-sans">
              Reconstruct the exact attack chain from initial process execution to automated endpoint isolation.
            </p>
          </div>

          {/* Connected Horizontal Timeline Stages */}
          <div className="grid grid-cols-1 md:grid-cols-7 gap-3 relative">
            {[
              { step: "01", name: "NORMAL", tag: "Baseline", desc: "Process and I/O rates within safe envelope.", color: "border-slate-300 dark:border-slate-700" },
              { step: "02", name: "SUSPICIOUS PROCESS", tag: "PID 4312", desc: "svchost executed from user temp directory.", color: "border-amber-500/60" },
              { step: "03", name: "FILE SPIKE", tag: "1,823 ops/m", desc: "Rapid traversal across document shares.", color: "border-orange-500/70" },
              { step: "04", name: "ENTROPY ANOMALY", tag: "H > 7.82", desc: "Ciphertext bytes replace plaintext headers.", color: "border-rose-500/80" },
              { step: "05", name: "RISK ESCALATION", tag: "Risk 78/100", desc: "Cross-heuristic correlation confirmed.", color: "border-rose-500" },
              { step: "06", name: "RANSOMWARE DETECTED", tag: "Tripwire Hit", desc: "Canary honeytoken file touched.", color: "border-rose-600" },
              { step: "07", name: "ENDPOINT ISOLATED", tag: "Quarantined", desc: "Host network cut. Zero data leaked.", color: "border-emerald-500" },
            ].map((st, i) => (
              <div 
                key={i} 
                className={`p-4 rounded-xl bg-white dark:bg-[#090e1c] border ${st.color} shadow-sm space-y-2 flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 font-bold">
                    <span>{st.step}</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-orange-400">
                      {st.tag}
                    </span>
                  </div>
                  <div className="text-xs font-bold font-mono text-slate-900 dark:text-white uppercase mt-2">
                    {st.name}
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-sans leading-relaxed">
                  {st.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. BOTTOM CTA & DEMO CALLOUT                                              */}
      {/* ========================================================================= */}
      <section className="relative z-10 py-16 px-6 lg:px-12 max-w-7xl mx-auto w-full">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-slate-900 via-[#0d1527] to-slate-900 border border-slate-800 text-white text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-orange-500/10 blur-3xl pointer-events-none" />
          <div className="max-w-2xl mx-auto space-y-3 relative z-10">
            <span className="text-xs font-mono uppercase tracking-widest text-orange-400 font-bold">LIVE SOC CONSOLE</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-mono tracking-tight">
              LAUNCH SENTINEL // EDR
            </h2>
            <p className="text-slate-300 text-sm font-sans">
              Inspect all 24 monitored endpoints, review active incidents, toggle behavioral detection rules, or simulate an attack in the demo sandbox.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 relative z-10">
            <button
              onClick={onLaunchEDR}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-slate-950 font-extrabold font-mono text-xs uppercase tracking-wider shadow-lg shadow-orange-500/30 hover:scale-[1.02] active:scale-95 transition-all"
            >
              LAUNCH EDR DASHBOARD →
            </button>
            <button
              onClick={() => onNavigateView ? onNavigateView('architecture') : null}
              className="px-6 py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 font-mono text-xs font-bold transition-all"
            >
              EXPLORE ARCHITECTURE
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. ENTERPRISE FOOTER                                                      */}
      {/* ========================================================================= */}
      <footer className="relative z-10 w-full border-t border-slate-200 dark:border-white/[0.06] py-6 px-6 lg:px-12 text-xs font-mono text-slate-500 bg-white/60 dark:bg-transparent backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-orange-500" />
            <span className="font-bold text-slate-800 dark:text-slate-200">SENTINEL // EDR</span>
            <span>• ZERO-DAY BEHAVIOR-BASED RANSOMWARE DEFENSE</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>NTFS Minifilter SentinelTrap.sys</span>
            <span>•</span>
            <span>Shannon Entropy Engine H &gt; 7.00</span>
            <span>•</span>
            <span>24 Endpoints Active</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
