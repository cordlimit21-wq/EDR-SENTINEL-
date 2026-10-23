import React from 'react';
import { 
  LayoutDashboard, 
  ShieldAlert, 
  Laptop, 
  FileSearch, 
  Clock, 
  Cpu, 
  HardDrive, 
  Network, 
  Sliders, 
  Lock, 
  FileText, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Shield,
  ArrowLeft
} from 'lucide-react';

export default function Sidebar({ 
  currentTab, 
  onSelectTab, 
  isCollapsed = false,
  onToggleCollapse,
  onNavigateHome,
  stats, 
  eventsCount = 0, 
  threatsCount = 0,
  theme = 'dark'
}) {
  const navItems = [
    {
      id: 'overview',
      label: 'Overview',
      icon: LayoutDashboard,
      badge: null,
      color: 'text-orange-500 dark:text-orange-400'
    },
    {
      id: 'live-threats',
      label: 'Live Threats',
      icon: ShieldAlert,
      badge: threatsCount > 0 ? `${threatsCount} ALERT` : '3 ACTIVE',
      badgeColor: 'bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-500/50 animate-pulse',
      color: 'text-rose-500 dark:text-rose-400'
    },
    {
      id: 'endpoints',
      label: 'Endpoints',
      icon: Laptop,
      badge: '24 NODES',
      badgeColor: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
      color: 'text-cyan-500 dark:text-cyan-400'
    },
    {
      id: 'incidents',
      label: 'Incidents',
      icon: FileSearch,
      badge: 'INC-0042',
      badgeColor: 'bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300',
      color: 'text-amber-500 dark:text-amber-400'
    },
    {
      id: 'attack-timeline',
      label: 'Attack Timeline',
      icon: Clock,
      badge: null,
      color: 'text-purple-500 dark:text-purple-400'
    },
    {
      id: 'processes',
      label: 'Processes',
      icon: Cpu,
      badge: null,
      color: 'text-sky-500 dark:text-cyan-400'
    },
    {
      id: 'file-activity',
      label: 'File Activity',
      icon: HardDrive,
      badge: eventsCount > 0 ? `${eventsCount}` : 'EDR_Test',
      badgeColor: 'bg-orange-100 text-orange-700 dark:bg-orange-950/80 dark:text-orange-300',
      color: 'text-orange-500 dark:text-orange-400'
    },
    {
      id: 'network-activity',
      label: 'Network Activity',
      icon: Network,
      badge: null,
      color: 'text-cyan-500 dark:text-cyan-400'
    },
    {
      id: 'detection-rules',
      label: 'Detection Rules',
      icon: Sliders,
      badge: '6 RULES',
      badgeColor: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
      color: 'text-emerald-500 dark:text-emerald-400'
    },
    {
      id: 'containment',
      label: 'Containment',
      icon: Lock,
      badge: 'ARMED',
      badgeColor: 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300',
      color: 'text-rose-500 dark:text-rose-400'
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: FileText,
      badge: null,
      color: 'text-purple-500 dark:text-purple-400'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      badge: null,
      color: 'text-slate-500 dark:text-slate-400'
    },
  ];

  return (
    <aside className={`transition-all duration-250 ease-in-out bg-white dark:bg-[#070b14]/95 border-r border-slate-200 dark:border-white/[0.06] text-slate-900 dark:text-slate-100 flex flex-col justify-between flex-shrink-0 min-h-screen select-none font-mono text-xs z-30 ${
      isCollapsed ? 'w-16' : 'w-60 xl:w-64'
    }`}>
      {/* Brand & Nav items */}
      <div className="flex-1 overflow-y-auto">
        {/* Brand header */}
        <div className={`p-4 border-b border-slate-200 dark:border-white/[0.06] flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          {!isCollapsed ? (
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-white/[0.08] text-orange-500 dark:text-orange-400 shadow-sm">
                <Shield className="w-4 h-4 text-orange-500 dark:text-orange-400" />
              </div>
              <div>
                <span className="text-xs font-extrabold tracking-wider text-slate-900 dark:text-slate-100 block">
                  SENTINEL
                </span>
                <span className="text-[9px] text-slate-500 block uppercase font-bold">EDR CONSOLE</span>
              </div>
            </div>
          ) : (
            <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-white/[0.08] text-orange-500 dark:text-orange-400 shadow-sm">
              <Shield className="w-4 h-4 text-orange-500 dark:text-orange-400" />
            </div>
          )}

          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          )}
        </div>

        {/* Navigation links */}
        <div className="p-2 space-y-1">
          {!isCollapsed && (
            <div className="px-3 py-1 text-[9px] uppercase tracking-widest text-slate-400 dark:text-slate-500 font-bold">
              EDR Console Navigation
            </div>
          )}

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                title={isCollapsed ? item.label : undefined}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-150 ${
                  isActive
                    ? 'bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold border border-orange-500/25 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
                } ${isCollapsed ? 'justify-center px-0' : ''}`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-orange-500 dark:text-orange-400' : item.color}`} />
                  {!isCollapsed && (
                    <span className="truncate">{item.label}</span>
                  )}
                </div>

                {!isCollapsed && item.badge && (
                  <span className={`text-[9px] px-1.5 py-0.5 rounded border uppercase font-bold flex-shrink-0 ml-1.5 ${item.badgeColor || 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-white/[0.08]'}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer Return Home Button */}
      <div className="p-3 border-t border-slate-200 dark:border-white/[0.06] space-y-2">
        {onNavigateHome && (
          <button
            onClick={onNavigateHome}
            title={isCollapsed ? "Back to Homepage" : undefined}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
              isCollapsed ? 'justify-center px-0' : ''
            }`}
          >
            <ArrowLeft className="w-4 h-4 flex-shrink-0" />
            {!isCollapsed && <span>Return Home</span>}
          </button>
        )}
      </div>
    </aside>
  );
}
