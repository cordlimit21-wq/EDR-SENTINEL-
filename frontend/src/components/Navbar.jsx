import React, { useState, useEffect, useRef } from 'react';
import { 
  Shield, 
  Menu, 
  Radio, 
  Clock, 
  RotateCcw, 
  ArrowLeft,
  Search,
  Bell,
  User,
  Activity,
  Play,
  CheckCircle2,
  AlertTriangle,
  Lock
} from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export default function Navbar({ 
  onSimulateAttack, 
  onReset, 
  isSimulating, 
  wsConnected, 
  stats,
  currentTab,
  onSelectTab,
  onToggleSidebar,
  isSidebarCollapsed,
  onNavigateHome,
  theme = 'dark',
  onToggleTheme
}) {
  const [timeStr, setTimeStr] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toTimeString().split(' ')[0] + ' UTC');
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const notifications = [
    { id: 1, title: "Canary Trap Accessed", detail: "TRAP-002 touched on WS-FINANCE-01", time: "Just now", type: "CRITICAL" },
    { id: 2, title: "Isolation Enforced", detail: "SRV-DATABASE-01 placed in quarantine", time: "12m ago", type: "SUCCESS" },
    { id: 3, title: "Rule Triggered", detail: "High Rename Velocity (> 25 renames/s)", time: "25m ago", type: "WARNING" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-white/[0.06] bg-white/95 dark:bg-[#05070d]/90 backdrop-blur-xl px-4 sm:px-6 py-2.5 select-none font-mono text-xs">
      <div className="flex items-center justify-between gap-4">
        
        {/* Left: Sidebar toggle + Global Search */}
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <button
            onClick={onToggleSidebar}
            title="Toggle Sidebar"
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-white/[0.08] text-slate-700 dark:text-slate-300 transition-all flex items-center justify-center flex-shrink-0"
          >
            <Menu className="w-4 h-4 text-orange-500" />
          </button>

          {/* Global Search Bar */}
          <div className="relative w-full">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="Search endpoints, PIDs, incidents, rules... (Press /)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/[0.08] text-xs font-mono text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-orange-500"
            />
          </div>
        </div>

        {/* Center: Environment Status Badge & UTC Clock */}
        <div className="hidden lg:flex items-center gap-4">
          {/* Environment Status */}
          <div className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/[0.08] flex items-center gap-2 text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold text-slate-700 dark:text-slate-200">DEMO ENVIRONMENT</span>
            <span className="text-slate-400">•</span>
            <span className="text-orange-500 font-bold">ACTIVE MONITORING</span>
          </div>

          <div className="text-slate-400 text-[11px] flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>{timeStr}</span>
          </div>
        </div>

        {/* Right: Simulation trigger, Notifications, Theme Toggle, User Profile */}
        <div className="flex items-center gap-3">
          
          {/* Simulation CTA */}
          {onSimulateAttack && (
            <button
              onClick={onSimulateAttack}
              disabled={isSimulating}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 text-orange-500 dark:text-orange-400 border border-orange-500/30 font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50"
            >
              <Play className="w-3 h-3 fill-orange-500" />
              <span>{isSimulating ? 'SIMULATING...' : 'SIMULATE ATTACK'}</span>
            </button>
          )}

          {/* Reset System */}
          {onReset && (
            <button
              onClick={onReset}
              title="Reset System"
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-white/[0.08] text-slate-500 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-white/[0.08] text-slate-700 dark:text-slate-300 relative transition-colors"
            >
              <Bell className="w-3.5 h-3.5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500" />
            </button>

            {/* Notifications Popover */}
            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-72 p-3 rounded-2xl bg-white dark:bg-[#090e1c] border border-slate-200 dark:border-white/[0.1] shadow-2xl z-50 space-y-2 animate-in fade-in duration-150">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-white/[0.06] text-[11px] font-bold text-slate-900 dark:text-white">
                  <span>NOTIFICATIONS</span>
                  <span className="text-[10px] text-orange-500 font-normal">3 UNREAD</span>
                </div>
                <div className="space-y-1.5">
                  {notifications.map((n) => (
                    <div key={n.id} className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/[0.04] space-y-0.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 dark:text-white text-[11px]">{n.title}</span>
                        <span className="text-[9px] text-slate-400">{n.time}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 font-sans">{n.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <ThemeToggle theme={theme} onToggle={onToggleTheme} />

          {/* User Profile Avatar */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-white/[0.08]">
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-orange-500 to-purple-600 flex items-center justify-center text-slate-950 font-bold text-[11px] shadow-sm">
              SO
            </div>
            <div className="hidden xl:block text-left">
              <div className="font-bold text-slate-900 dark:text-white text-[11px] leading-tight">SOC Lead</div>
              <div className="text-[9px] text-slate-400 leading-tight">Tier-3 Analyst</div>
            </div>
          </div>

        </div>

      </div>
    </header>
  );
}
