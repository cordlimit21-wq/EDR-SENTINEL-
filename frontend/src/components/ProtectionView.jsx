import React from 'react';
import { 
  Shield, 
  Activity, 
  Cpu, 
  HardDrive, 
  Network, 
  Lock, 
  Sliders, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle,
  Zap,
  Eye,
  FileSearch,
  Crosshair,
  Server
} from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export default function ProtectionView({ onNavigateHome, onLaunchEDR, theme = 'dark', onToggleTheme }) {
  const isDark = theme === 'dark';

  const capabilities = [
    {
      title: "Behavior-Based Detection",
      icon: Activity,
      tag: "CORE HEURISTIC",
      color: "text-orange-500",
      borderColor: "hover:border-orange-500/50",
      desc: "Detects malware by what it DOES, not what it LOOKS LIKE. Operates without signature updates to stop novel and polymorphic zero-day ransomware strains in under 11ms.",
      points: [
        "In-place rapid overwrite detection",
        "Shannon entropy spike analysis (H > 7.00)",
        "Shadow volume copy deletion intercept",
        "Multi-threaded encryption burst tracking"
      ]
    },
    {
      title: "Real-Time Telemetry",
      icon: Eye,
      tag: "KERNEL MINIFILTER",
      color: "text-cyan-400",
      borderColor: "hover:border-cyan-500/50",
      desc: "Hooks deep into the Windows I/O stack via SentinelTrap.sys minifilter driver. Streams raw file, process, and socket operations into the userspace engine with near-zero CPU overhead (<0.2%).",
      points: [
        "Pre-operation and post-operation filtering",
        "Sub-millisecond event dispatching",
        "Memory footprint under 45 MB",
        "Zero disruption to legitimate productivity apps"
      ]
    },
    {
      title: "Multi-Factor Risk Scoring",
      icon: Sliders,
      tag: "DYNAMIC ACCUMULATOR",
      color: "text-purple-400",
      borderColor: "hover:border-purple-500/50",
      desc: "Aggregates fractional risk scores across 6 distinct vectors. When accumulated risk breaches the safety envelope (80/100), automated containment is triggered instantaneously.",
      points: [
        "File modification velocity (+25)",
        "Rename velocity (+15)",
        "Shannon entropy variance (+20)",
        "Suspicious process lineage (+15)"
      ]
    },
    {
      title: "Instant Endpoint Isolation",
      icon: Lock,
      tag: "CONTAINMENT",
      color: "text-rose-500",
      borderColor: "hover:border-rose-500/50",
      desc: "Sever all inbound and outbound network connectivity while preserving the secure Sentinel telemetry tunnel. Prevents lateral movement across domain subnets.",
      points: [
        "One-click SOC quarantine",
        "Instant TCP/UDP socket termination",
        "C2 beaconing severing",
        "Reversible without host reboot"
      ]
    },
    {
      title: "Process Lineage & Analysis",
      icon: Cpu,
      tag: "EXECUTION TREE",
      color: "text-amber-400",
      borderColor: "hover:border-amber-500/50",
      desc: "Traces parent, child, and grand-child execution trees. Detects living-off-the-land binaries (powershell.exe, cmd.exe, wmic.exe) attempting evasion.",
      points: [
        "Complete ancestor PID correlation",
        "Command-line parameter inspection",
        "Process token elevation tracking",
        "Instant thread suspension"
      ]
    },
    {
      title: "Decoy / Honeytoken Trap Vault",
      icon: Shield,
      tag: "EARLY TRIPWIRE",
      color: "text-emerald-400",
      borderColor: "hover:border-emerald-500/50",
      desc: "Deploys 48 high-value canary documents across executive, finance, and engineering folders. Any touch by an unapproved process triggers an instant kill hook.",
      points: [
        "Executive financial & credential honeypots",
        "Cryptographic canary token inspection",
        "Tamper-evident tripwire logic",
        "Immediate alert generation"
      ]
    },
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
                SENTINEL <span className="text-orange-500">// PROTECTION</span>
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
        
        {/* Page Hero */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-600 dark:text-orange-400 text-xs font-mono font-bold uppercase tracking-widest">
            <Shield className="w-3.5 h-3.5" />
            MULTI-LAYERED DEFENSE SPECIFICATION
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight font-mono text-slate-900 dark:text-white">
            COMPREHENSIVE RANSOMWARE PROTECTION
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 font-sans leading-relaxed">
            Sentinel provides deep defense across every phase of the ransomware execution lifecycle. From kernel minifilter telemetry collection to automated endpoint isolation.
          </p>
        </div>

        {/* 6 Core Capabilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {capabilities.map((cap, i) => {
            const Icon = cap.icon;
            return (
              <div 
                key={i} 
                className={`p-6 rounded-2xl bg-white dark:bg-[#090e1c] border border-slate-200 dark:border-white/[0.08] shadow-lg flex flex-col justify-between space-y-5 transition-all duration-200 ${cap.borderColor}`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {cap.tag}
                    </span>
                    <div className={`p-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 ${cap.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold font-mono text-slate-900 dark:text-white">
                    {cap.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-sans leading-relaxed">
                    {cap.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-white/[0.06] space-y-1.5 font-mono text-[11px] text-slate-600 dark:text-slate-300">
                  {cap.points.map((pt, pIdx) => (
                    <div key={pIdx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Comparison Callout: Traditional AV vs Sentinel EDR */}
        <div className="p-8 rounded-3xl bg-white dark:bg-[#070d1a] border border-slate-200 dark:border-white/[0.08] shadow-xl space-y-6 font-mono">
          <div className="border-b border-slate-200 dark:border-white/[0.08] pb-4">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase">
              ARCHITECTURAL ADVANTAGE: TRADITIONAL AV VS. SENTINEL // EDR
            </h3>
            <p className="text-xs text-slate-500 font-sans mt-1">
              Why static signature checks fail against zero-day ransomware attacks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs">
            <div className="p-5 rounded-xl bg-rose-500/5 border border-rose-500/20 space-y-3">
              <div className="text-rose-500 font-bold uppercase flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                TRADITIONAL ANTIVIRUS & EPP
              </div>
              <ul className="space-y-2 text-slate-600 dark:text-slate-400 font-sans">
                <li>• Relies on static SHA256 hashes and known threat database signatures.</li>
                <li>• Easily bypassed by simple recompilation, packing, or obfuscation.</li>
                <li>• High scanning CPU overhead (15%–40% system penalty).</li>
                <li>• Fails completely against novel zero-day attacks.</li>
              </ul>
            </div>

            <div className="p-5 rounded-xl bg-emerald-500/5 border border-emerald-500/30 space-y-3">
              <div className="text-emerald-500 font-bold uppercase flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                SENTINEL BEHAVIOR-BASED EDR
              </div>
              <ul className="space-y-2 text-slate-600 dark:text-slate-400 font-sans">
                <li>• Evaluates runtime behavioral entropy, I/O velocity, and rename frequency.</li>
                <li>• 100% immune to signature obfuscation or unknown binary packers.</li>
                <li>• Kernel minifilter optimization ensures &lt;0.2% CPU overhead.</li>
                <li>• Sub-11ms automated containment preserves critical files from encryption.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center pt-8">
          <button
            onClick={onLaunchEDR}
            className="px-8 py-3.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-slate-950 font-bold font-mono text-xs uppercase tracking-wider shadow-xl shadow-orange-500/30 transition-all"
          >
            OPEN SOC DASHBOARD TO TEST DEFENSES →
          </button>
        </div>

      </main>
    </div>
  );
}
