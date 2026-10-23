import React, { useState } from 'react';
import { 
  Shield, 
  ArrowLeft, 
  Layers, 
  Server, 
  Database, 
  Radio, 
  Cpu, 
  HardDrive, 
  Activity, 
  CheckCircle2, 
  Sliders, 
  AlertTriangle,
  Lock,
  ChevronDown,
  ChevronRight,
  Code2
} from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export default function ArchitectureView({ onNavigateHome, onLaunchEDR, theme = 'dark', onToggleTheme }) {
  const isDark = theme === 'dark';
  const [activeStep, setActiveStep] = useState(2); // Default to Behavior Engine

  const pipeline = [
    {
      id: 0,
      title: "ENDPOINT",
      subtitle: "Fleet of 24 Monitored Nodes",
      tech: "Windows / Linux Agents",
      desc: "Lightweight agent installed on endpoints. Injects zero-overhead filesystem minifilter hooks into the kernel I/O manager.",
      color: "border-cyan-500 text-cyan-400 bg-cyan-500/10",
      details: ["Kernel minifilter driver (SentinelTrap.sys)", "Active process monitor & handle interception", "EDR_Test/ filesystem directory observer", "48 decoy canary tripwires armed"]
    },
    {
      id: 1,
      title: "TELEMETRY",
      subtitle: "High-Frequency Event Bus",
      tech: "Async WatchFiles / I/O Stream",
      desc: "Captures micro-operations (file creation, modification, rename, process spawn, entropy variance) and pushes to stream buffer.",
      color: "border-sky-500 text-sky-400 bg-sky-500/10",
      details: ["Pre-write and post-write buffer inspection", "Parent-child PID lineage tagging", "Timestamped event correlation", "Decoy tripwire integrity polling"]
    },
    {
      id: 2,
      title: "BEHAVIOR ENGINE",
      subtitle: "Real-Time Anomaly Correlator",
      tech: "Python Multiprocessing Engine",
      desc: "Analyzes streams against heuristic rules. Evaluates Shannon entropy, rename velocity, and shadow copy deletion patterns.",
      color: "border-orange-500 text-orange-400 bg-orange-500/10",
      details: ["Shannon byte entropy formula: H = -sum(p * log2(p))", "Sliding window rate calculator (ops/second)", "Living-off-the-land script interpreter tracking", "Cryptographic canary token tamper detector"]
    },
    {
      id: 3,
      title: "RISK SCORING",
      subtitle: "Multi-Signal Dynamic Accumulator",
      tech: "Composite Risk Matrix",
      desc: "Weighs fractional points across 6 vectors. When cumulative score crosses threshold 80/100, an immediate threat state is declared.",
      color: "border-purple-500 text-purple-400 bg-purple-500/10",
      details: ["File Activity: +25 points", "Rename Velocity: +15 points", "Entropy Anomaly: +20 points", "Process Lineage: +15 points", "Network Anomaly: +10 points"]
    },
    {
      id: 4,
      title: "DETECTION",
      subtitle: "Zero-Day Threat Confirmation",
      tech: "Threshold Breach Hook",
      desc: "Identifies ransomware behavior within 11ms of initial execution. Emits a CRITICAL_KILL event across the ecosystem.",
      color: "border-rose-500 text-rose-400 bg-rose-500/10",
      details: ["Zero-day detection without signature updates", "Real-time alert dispatch to SOC console", "Automated threat payload tagging", "Canary trap tripwire state change"]
    },
    {
      id: 5,
      title: "INCIDENT",
      subtitle: "Automated Case Generation",
      tech: "Incident Vault (INC-2026-0042)",
      desc: "Binds all telemetry, affected files, process trees, and network sockets into a comprehensive SOC incident record.",
      color: "border-amber-500 text-amber-400 bg-amber-500/10",
      details: ["Chronological execution timeline", "Complete process ancestry lineage", "Modified & encrypted file audit trail", "C2 remote socket tracking"]
    },
    {
      id: 6,
      title: "INVESTIGATION",
      subtitle: "AI Forensic Analysis",
      tech: "Automated SOC Investigator",
      desc: "Generates an instant executive summary, root cause hypothesis, and indicators of compromise (IoCs) for analysts.",
      color: "border-emerald-500 text-emerald-400 bg-emerald-500/10",
      details: ["AI narrative explanation of ransomware attack chain", "MITRE ATT&CK technique mapping (T1486, T1490)", "SHA256 & memory artifact extraction", "Analyst notes & audit logs"]
    },
    {
      id: 7,
      title: "CONTAINMENT",
      subtitle: "Sub-11ms Rapid Response",
      tech: "Kernel Revocation & Quarantine",
      desc: "Executes automated or human-in-the-loop mitigation: endpoint network isolation, process termination, and incident closure.",
      color: "border-emerald-600 text-emerald-300 bg-emerald-600/10",
      details: ["One-click network boundary isolation", "Process termination (SIGKILL via minifilter)", "NDIS network filter blocking", "Zero destructive local disk writes"]
    }
  ];

  const stackComponents = [
    { layer: "Frontend", tech: "React / Vite", icon: Code2, role: "Real-time interactive SOC Command Center, 3D WebGL Canvas, Lucide UI, Tailwind styling" },
    { layer: "Backend", tech: "FastAPI / REST API", icon: Server, role: "High-performance asynchronous API, endpoint management, incident dispatcher, rule configuration" },
    { layer: "Detection", tech: "Python Behavioral Engine", icon: Cpu, role: "Sub-millisecond Shannon entropy calculation, sliding window velocity heuristics, canary token validation" },
    { layer: "Database", tech: "Persistence / Storage", icon: Database, role: "In-memory SOC store with relational schemas for fleet endpoints, incident records, rules, and telemetry" },
    { layer: "Real-Time", tech: "WebSockets (/ws/telemetry)", icon: Radio, role: "Bidirectional streaming pipeline pushing live kernel events and zero-day alerts directly to the frontend" },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#05070d] text-slate-900 dark:text-slate-100 font-sans selection:bg-orange-500 selection:text-black">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-white/[0.08] bg-white/90 dark:bg-[#05070d]/90 backdrop-blur-xl px-6 lg:px-12 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between font-mono">
          <div className="flex items-center gap-3">
            <button 
              onClick={onNavigateHome}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-white/[0.1] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Return Home"
            >
              <ArrowLeft className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            </button>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-orange-500" />
              <span className="text-base font-extrabold tracking-wider text-slate-900 dark:text-white">
                SENTINEL <span className="text-orange-500">// ARCHITECTURE</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle theme={theme} onToggle={onToggleTheme} />
            <button
              onClick={onLaunchEDR}
              className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all"
            >
              LAUNCH EDR →
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 lg:px-12 py-12 lg:py-16 space-y-16">
        
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-600 dark:text-cyan-400 text-xs font-mono font-bold uppercase tracking-widest">
            <Layers className="w-3.5 h-3.5" />
            SYSTEM ARCHITECTURE & PIPELINE
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight font-mono text-slate-900 dark:text-white">
            END-TO-END DETECTION ARCHITECTURE
          </h1>
          <p className="text-base text-slate-600 dark:text-slate-400 font-sans">
            How raw filesystem micro-operations flow through kernel telemetry, multi-vector behavioral scoring, and automated containment.
          </p>
        </div>

        {/* 1. INTERACTIVE PIPELINE FLOW (Endpoint -> Containment) */}
        <div className="space-y-6">
          <div className="flex items-center justify-between font-mono text-xs text-slate-500">
            <span>INTERACTIVE STAGES (CLICK ANY STAGE TO INSPECT ARCHITECTURE)</span>
            <span>STAGE {activeStep + 1} OF {pipeline.length}</span>
          </div>

          {/* Stepper Buttons Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {pipeline.map((step) => {
              const isActive = activeStep === step.id;
              return (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(step.id)}
                  className={`p-3 rounded-xl border text-left font-mono transition-all ${
                    isActive 
                      ? `${step.color} shadow-lg scale-[1.02]` 
                      : 'border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#090e1c] hover:border-slate-300 dark:hover:border-white/20 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <div className="text-[10px] font-bold opacity-75">STEP 0{step.id + 1}</div>
                  <div className="text-xs font-bold truncate mt-1">{step.title}</div>
                </button>
              );
            })}
          </div>

          {/* Detailed Active Step Inspector Card */}
          {pipeline[activeStep] && (
            <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#090e1c] border border-slate-200 dark:border-white/[0.08] shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-white/[0.08] pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-orange-500">STEP 0{activeStep + 1}</span>
                    <span className="text-xs font-mono text-slate-400">• {pipeline[activeStep].tech}</span>
                  </div>
                  <h3 className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1">
                    {pipeline[activeStep].title} — {pipeline[activeStep].subtitle}
                  </h3>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-mono font-bold self-start sm:self-auto border ${pipeline[activeStep].color}`}>
                  PIPELINE PHASE
                </div>
              </div>

              <p className="text-sm text-slate-700 dark:text-slate-300 font-sans leading-relaxed">
                {pipeline[activeStep].desc}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {pipeline[activeStep].details.map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/[0.06] font-mono text-xs flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-orange-500 flex-shrink-0" />
                    <span className="text-slate-800 dark:text-slate-200">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 2. FULL TECH STACK BREAKDOWN */}
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-white/[0.08] pb-4">
            <h2 className="text-2xl font-bold font-mono text-slate-900 dark:text-white uppercase">
              TECHNICAL STACK ARCHITECTURE
            </h2>
            <p className="text-xs text-slate-500 font-sans mt-1">
              Engineered with asynchronous Python micro-services and modern React WebSockets.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {stackComponents.map((st, i) => {
              const Icon = st.icon;
              return (
                <div key={i} className="p-5 rounded-2xl bg-white dark:bg-[#090e1c] border border-slate-200 dark:border-white/[0.08] shadow-md space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="p-2 rounded-xl bg-orange-500/10 text-orange-500">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {st.layer}
                    </span>
                  </div>
                  <h3 className="text-base font-bold font-mono text-slate-900 dark:text-white">
                    {st.tech}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-sans leading-relaxed">
                    {st.role}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. HARDWARE & KERNEL MINIFILTER PERFORMANCE */}
        <div className="p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-2xl space-y-6 font-mono">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs text-orange-400 uppercase font-bold tracking-widest">PERFORMANCE BENCHMARK</span>
              <h3 className="text-xl font-bold mt-1">KERNEL MINIFILTER TELEMETRY EFFICIENCY</h3>
            </div>
            <div className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-bold">
              PRODUCTION VERIFIED
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700">
              <div className="text-2xl font-bold text-emerald-400">&lt; 0.2%</div>
              <div className="text-[10px] text-slate-400 mt-1 uppercase">CPU OVERHEAD</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700">
              <div className="text-2xl font-bold text-orange-400">11ms</div>
              <div className="text-[10px] text-slate-400 mt-1 uppercase">KILL LATENCY</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700">
              <div className="text-2xl font-bold text-cyan-400">44 MB</div>
              <div className="text-[10px] text-slate-400 mt-1 uppercase">MEMORY FOOTPRINT</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700">
              <div className="text-2xl font-bold text-purple-400">0</div>
              <div className="text-[10px] text-slate-400 mt-1 uppercase">FALSE POSITIVES</div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center pt-4">
          <button
            onClick={onLaunchEDR}
            className="px-8 py-3.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-slate-950 font-bold font-mono text-xs uppercase tracking-wider shadow-xl shadow-orange-500/30 transition-all"
          >
            LAUNCH EDR DASHBOARD →
          </button>
        </div>

      </main>
    </div>
  );
}
