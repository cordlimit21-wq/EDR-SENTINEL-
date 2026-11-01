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
  ArrowLeft,
  Crosshair,
  History,
  GitCommit,
  FlaskConical
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
  // Navigation sections grouped by functional operational areas
  const navSections = [
    {
      title: "CORE SOC",
      items: [
        {
          id: 'overview',
          label: 'Overview',
          icon: LayoutDashboard,
          badge: null,
          color: 'text-cyan-400'
        },
        {
          id: 'live-threats',
          label: 'Threat Detection',
          icon: ShieldAlert,
          badge: threatsCount > 0 ? `${threatsCount} ALERT` : '3 ACTIVE',
          badgeColor: 'bg-rose-950 text-rose-300 border-rose-500/50 animate-pulse',
          color: 'text-rose-400'
        },
        {
          id: 'attack-timeline',
          label: 'Live Activity',
          icon: Clock,
          badge: eventsCount > 0 ? `${eventsCount}` : null,
          badgeColor: 'bg-cyan-950 text-cyan-300 border-cyan-500/40',
          color: 'text-cyan-400'
        },
        {
          id: 'threat-hunting',
          label: 'Threat Hunting',
          icon: Crosshair,
          badge: 'QUERY',
          badgeColor: 'bg-orange-950/80 text-orange-300 border-orange-500/40',
          color: 'text-orange-400'
        },
        {
          id: 'threat-history',
          label: 'Threat History',
          icon: History,
          badge: null,
          color: 'text-purple-400'
        }
      ]
    },
    {
      title: "INVESTIGATION & ASSETS",
      items: [
        {
          id: 'endpoints',
          label: 'Endpoints Fleet',
          icon: Laptop,
          badge: '24 NODES',
          badgeColor: 'bg-slate-800 text-slate-300 border-slate-700',
          color: 'text-sky-400'
        },
        {
          id: 'incidents',
          label: 'Incidents Vault',
          icon: FileSearch,
          badge: 'INC-0042',
          badgeColor: 'bg-amber-950/80 text-amber-300 border-amber-500/40',
          color: 'text-amber-400'
        },
        {
          id: 'processes',
          label: 'Process Monitoring',
          icon: Cpu,
          badge: null,
          color: 'text-cyan-400'
        },
        {
          id: 'process-lineage',
          label: 'Process Lineage',
          icon: GitCommit,
          badge: 'GRAPH',
          badgeColor: 'bg-purple-950 text-purple-300 border-purple-500/40',
          color: 'text-purple-400'
        },
        {
          id: 'canary-vault',
          label: 'Canary / Decoy Vault',
          icon: HardDrive,
          badge: '48 TRAPS',
          badgeColor: 'bg-emerald-950 text-emerald-300 border-emerald-500/40',
          color: 'text-emerald-400'
        }
      ]
    },
    {
      title: "DEFENSE & REPORTING",
      items: [
        {
          id: 'simulation-lab',
          label: 'Simulation Lab',
          icon: FlaskConical,
          badge: 'SANDBOX',
          badgeColor: 'bg-orange-950 text-orange-300 border-orange-500/40',
          color: 'text-orange-400'
        },
        {
          id: 'detection-rules',
          label: 'Detection Rules',
          icon: Sliders,
          badge: '6 RULES',
          badgeColor: 'bg-slate-800 text-slate-300 border-slate-700',
          color: 'text-emerald-400'
        },
        {
          id: 'containment',
          label: 'Containment',
          icon: Lock,
          badge: 'ARMED',
          badgeColor: 'bg-rose-950 text-rose-300 border-rose-500/40',
          color: 'text-rose-400'
        },
        {
          id: 'reports',
          label: 'Incident Reports',
          icon: FileText,
          badge: 'PDF',
          badgeColor: 'bg-indigo-950 text-indigo-300 border-indigo-500/40',
          color: 'text-indigo-400'
        },
        {
          id: 'settings',
          label: 'Settings',
          icon: Settings,
          badge: null,
          color: 'text-slate-400'
        }
      ]
    }
  ];

  return (
    <aside className={`transition-all duration-250 ease-in-out bg-[#080C18] border-r border-[#152238] text-slate-100 flex flex-col justify-between flex-shrink-0 min-h-screen select-none font-mono text-xs z-30 ${
      isCollapsed ? 'w-16' : 'w-60 xl:w-64'
    }`}>
      {/* Brand & Nav items */}
      <div className="flex-1 overflow-y-auto">
        {/* Brand header */}
        <div className={`p-4 border-b border-[#152238] flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          {!isCollapsed ? (
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-[#101A2B] border border-cyan-500/30 text-cyan-400 shadow-sm">
                <Shield className="w-4 h-4 text-cyan-400" />
              </div>
              <div>
                <span className="text-xs font-extrabold tracking-wider text-white block">
                  SENTINEL <span className="text-cyan-400">// EDR</span>
                </span>
                <span className="text-[9px] text-slate-400 block uppercase font-bold">ZERO-DAY DEFENSE</span>
              </div>
            </div>
          ) : (
            <div className="p-1.5 rounded-lg bg-[#101A2B] border border-cyan-500/30 text-cyan-400 shadow-sm">
              <Shield className="w-4 h-4 text-cyan-400" />
            </div>
          )}

          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              className="p-1 rounded-lg hover:bg-[#152238] text-slate-400 hover:text-white transition-colors"
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          )}
        </div>

        {/* Navigation sections */}
        <div className="p-2 space-y-4">
          {navSections.map((section, sIdx) => (
            <div key={sIdx} className="space-y-1">
              {!isCollapsed && (
                <div className="px-3 py-1 text-[9px] uppercase tracking-widest text-slate-500 font-bold">
                  {section.title}
                </div>
              )}

              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectTab(item.id)}
                    title={isCollapsed ? item.label : undefined}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all duration-150 ${
                      isActive
                        ? 'bg-[#152238] text-[#39E7FF] font-bold border border-cyan-400/30 shadow-sm'
                        : 'text-slate-400 hover:bg-[#101A2B] hover:text-white'
                    } ${isCollapsed ? 'justify-center px-0' : ''}`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-[#39E7FF]' : item.color}`} />
                      {!isCollapsed && (
                        <span className="truncate text-[11.5px]">{item.label}</span>
                      )}
                    </div>

                    {!isCollapsed && item.badge && (
                      <span className={`text-[8.5px] px-1.5 py-0.5 rounded border uppercase font-bold flex-shrink-0 ml-1.5 ${item.badgeColor || 'bg-slate-800 text-slate-300 border-slate-700'}`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Footer Return Home Button */}
      <div className="p-3 border-t border-[#152238] space-y-2">
        {onNavigateHome && (
          <button
            onClick={onNavigateHome}
            title={isCollapsed ? "Back to Homepage" : undefined}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#152238] transition-colors ${
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
