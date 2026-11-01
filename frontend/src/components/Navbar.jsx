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
  Lock,
  LogOut,
  Building,
  KeyRound,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../context/AuthContext';

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
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef(null);

  const { user, logout } = useAuth();

  // Close profile dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    }
    if (showProfileMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showProfileMenu]);

  // Compute initials from user.full_name
  const initials = React.useMemo(() => {
    if (!user || !user.full_name) return "SO";
    const parts = user.full_name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }, [user]);

  const handleLogout = async () => {
    setShowProfileMenu(false);
    await logout();
    if (onNavigateHome) {
      onNavigateHome();
    }
  };

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

        {/* Center: Environment Status Badge & Live Stream Status */}
        <div className="hidden lg:flex items-center gap-4">
          {/* Connection & Mode Status */}
          <div className="px-3 py-1 rounded-full bg-[#101A2B] border border-[#152238] flex items-center gap-2 text-[11px]">
            {isSimulating ? (
              <>
                <span className="w-2 h-2 rounded-full bg-orange-400 animate-ping" />
                <span className="text-orange-400 font-bold uppercase tracking-wider">SIMULATION LAB ACTIVE</span>
              </>
            ) : wsConnected ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-bold text-emerald-400">LIVE WEBSOCKET STREAM</span>
                <span className="text-slate-600">•</span>
                <span className="text-cyan-400 font-bold">EDR_Test/ ACTIVE</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span className="font-bold text-amber-400">RECONNECTING BACKEND...</span>
              </>
            )}
          </div>

          {/* SLA Latency */}
          <div className="text-slate-400 text-[11px] flex items-center gap-1.5">
            <span className="text-slate-500 font-bold">LATENCY:</span>
            <span className="text-cyan-400 font-mono font-bold">&lt; 10.8ms</span>
          </div>

          <div className="text-slate-400 text-[11px] flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>{timeStr}</span>
          </div>
        </div>

        {/* Right: Simulation trigger, Notifications, Theme Toggle */}
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

          {/* User Profile / Account Section */}
          <div className="relative pl-2 border-l border-slate-200 dark:border-white/[0.08]" ref={profileMenuRef}>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors cursor-pointer text-left focus:outline-none"
              title="View Analyst Account Details & Session"
            >
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-500 via-amber-400 to-cyan-500 flex items-center justify-center text-slate-950 font-bold text-xs shadow-md">
                  {initials}
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#090e1c]" />
              </div>

              <div className="hidden xl:block text-left">
                <div className="font-bold text-slate-900 dark:text-white text-[11px] leading-tight truncate max-w-[130px]">
                  {user?.full_name || "SOC Analyst"}
                </div>
                <div className="text-[9px] text-slate-400 leading-tight truncate max-w-[130px]">
                  {user?.role || "Tier-3 Authorized"}
                </div>
              </div>

              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 hidden xl:block ${showProfileMenu ? 'rotate-180 text-orange-400' : ''}`} />
            </button>

            {/* Profile Dropdown Card */}
            {showProfileMenu && (
              <div className="absolute right-0 top-full mt-2 w-80 p-4 rounded-2xl bg-white dark:bg-[#0A1020] border border-slate-200 dark:border-white/[0.1] shadow-2xl z-50 space-y-4 animate-in fade-in zoom-in-95 duration-150 font-mono text-xs">
                
                {/* Header Profile Identity */}
                <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-white/[0.06]">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-orange-500 to-cyan-500 flex items-center justify-center text-slate-950 font-extrabold text-sm shadow-md shrink-0">
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-slate-900 dark:text-white text-xs truncate">
                      {user?.full_name || "Security Analyst"}
                    </h4>
                    <p className="text-[10px] text-slate-400 truncate">
                      {user?.email || "analyst@sentinel.defense"}
                    </p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded text-[9px] font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                      {user?.role || "SOC Lead Architect"}
                    </span>
                  </div>
                </div>

                {/* Account Details Specs */}
                <div className="space-y-2 text-[11px]">
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/[0.04] flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Department:</span>
                    <span className="text-slate-800 dark:text-slate-200 font-semibold truncate max-w-[160px]">
                      {user?.department || "Cyber Defense Operations"}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/[0.04] flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Clearance:</span>
                    <span className="text-emerald-500 font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Level 3 • Full Control
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/[0.04] flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Account ID:</span>
                    <span className="text-cyan-400 font-mono text-[10px]">
                      {user?.id || "USR-AUTHORIZED"}
                    </span>
                  </div>
                </div>

                {/* Logout Button */}
                <div className="pt-2 border-t border-slate-100 dark:border-white/[0.06]">
                  <button
                    onClick={handleLogout}
                    className="w-full py-2.5 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 border border-rose-500/30 hover:border-rose-500/50 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm active:scale-98"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out &amp; Lock Session</span>
                  </button>
                </div>

              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
}
