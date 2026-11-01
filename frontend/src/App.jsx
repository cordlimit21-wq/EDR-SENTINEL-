import React, { useState, useEffect, useRef } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingPage from './components/LandingPage';
import ProtectionView from './components/ProtectionView';
import ArchitectureView from './components/ArchitectureView';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import ForgotPasswordPage from './components/ForgotPasswordPage';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import OverviewView from './components/OverviewView';
import ActivityTimeline from './components/ActivityTimeline';
import ThreatDetectionView from './components/ThreatDetectionView';
import ThreatHuntingView from './components/ThreatHuntingView';
import ProcessMonitoringTable from './components/ProcessMonitoringTable';
import CanaryTrapVault from './components/CanaryTrapVault';
import ThreatHistoryView from './components/ThreatHistoryView';
import ProcessLineageCard from './components/ProcessLineageCard';
import SimulationControl from './components/SimulationControl';
import SettingsView from './components/SettingsView';
import ThreatAlertModal from './components/ThreatAlertModal';
import NetworkBackground from './components/NetworkBackground';
import EndpointsView from './components/EndpointsView';
import IncidentsView from './components/IncidentsView';
import DetectionRulesView from './components/DetectionRulesView';
import ContainmentView from './components/ContainmentView';
import ReportsView from './components/ReportsView';
import NetworkActivityView from './components/NetworkActivityView';
import { Shield } from 'lucide-react';

const API_BASE = "http://localhost:8000";
const WS_URL = "ws://localhost:8000/ws/telemetry";

function MainApp() {
  const { isAuthenticated, isLoading, user } = useAuth();

  // 1. Theme Management (Dark by default, persisted in localStorage)
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sentinel-theme');
      if (saved) return saved;
    }
    return 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('sentinel-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // 2. Navigation State: 'landing' | 'protection' | 'architecture' | 'dashboard' | 'login' | 'signup' | 'forgot-password'
  const [currentView, setCurrentView] = useState(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path === '/dashboard') return 'dashboard';
      if (path === '/protection') return 'protection';
      if (path === '/architecture') return 'architecture';
      if (path === '/login') return 'login';
      if (path === '/signup') return 'signup';
      if (path === '/forgot-password') return 'forgot-password';
    }
    return 'landing';
  });

  const [intendedDestination, setIntendedDestination] = useState('dashboard');

  // URL Sync
  const navigateTo = (view) => {
    setCurrentView(view);
    if (typeof window !== 'undefined' && window.history) {
      let path = '/';
      if (view === 'dashboard') path = '/dashboard';
      else if (view === 'protection') path = '/protection';
      else if (view === 'architecture') path = '/architecture';
      else if (view === 'login') path = '/login';
      else if (view === 'signup') path = '/signup';
      else if (view === 'forgot-password') path = '/forgot-password';
      window.history.pushState(null, '', path);
    }
  };

  // Browser popstate navigation
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === '/dashboard') setCurrentView('dashboard');
      else if (path === '/protection') setCurrentView('protection');
      else if (path === '/architecture') setCurrentView('architecture');
      else if (path === '/login') setCurrentView('login');
      else if (path === '/signup') setCurrentView('signup');
      else if (path === '/forgot-password') setCurrentView('forgot-password');
      else setCurrentView('landing');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Protected route enforcement & auth redirection
  useEffect(() => {
    if (isLoading) return;

    // 1. Direct or attempted unauthenticated access to /dashboard -> redirect to /login
    if (currentView === 'dashboard' && !isAuthenticated) {
      setIntendedDestination('dashboard');
      navigateTo('login');
    }

    // 2. Authenticated user visiting /login or /signup -> redirect to /dashboard
    if ((currentView === 'login' || currentView === 'signup') && isAuthenticated) {
      navigateTo('dashboard');
    }
  }, [currentView, isAuthenticated, isLoading]);

  // Handle "Launch EDR" action from public pages
  const handleLaunchEDR = () => {
    if (isAuthenticated) {
      navigateTo('dashboard');
    } else {
      setIntendedDestination('dashboard');
      navigateTo('login');
    }
  };

  // 3. Console Tabs:
  // 'overview' | 'live-threats' | 'endpoints' | 'incidents' | 'attack-timeline' | 'processes' | 'file-activity' | 'network-activity' | 'detection-rules' | 'containment' | 'reports' | 'settings'
  const [currentTab, setCurrentTab] = useState('overview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // 4. Telemetry State & Engine Stats
  const [stats, setStats] = useState({
    protected_endpoints: 24,
    online_endpoints: 21,
    active_threats: 3,
    critical_threats: 2,
    isolated_endpoints: 1,
    current_risk_score: 94,
    monitored_endpoints: 24,
    active_traps: 48,
    zero_day_threats_blocked: 14,
    avg_containment_time: "11ms",
    engine_status: "ENGINE ACTIVE - REAL-TIME MONITORING",
    kernel_driver_status: "ATTACHED (Minifilter: SentinelTrap.sys)",
  });

  const [events, setEvents] = useState([]);
  const [traps, setTraps] = useState([]);
  const [wsConnected, setWsConnected] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [latestThreatEvent, setLatestThreatEvent] = useState(null);
  const [allThreatEvents, setAllThreatEvents] = useState([]);
  const [alertModalEvent, setAlertModalEvent] = useState(null);
  const [latestThreatTimestamp, setLatestThreatTimestamp] = useState(null);

  const socketRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);

  // 5. Initial REST Hydration
  const fetchData = async () => {
    try {
      const [statsRes, trapsRes, eventsRes] = await Promise.all([
        fetch(`${API_BASE}/api/stats`),
        fetch(`${API_BASE}/api/traps`),
        fetch(`${API_BASE}/api/events`)
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(prev => ({ ...prev, ...statsData }));
      }
      if (trapsRes.ok) {
        const trapsData = await trapsRes.json();
        setTraps(trapsData);
      }
      if (eventsRes.ok) {
        const eventsData = await eventsRes.json();
        if (eventsData && eventsData.length > 0) {
          setEvents(eventsData);
          const threats = eventsData.filter(e => e.severity === 'CRITICAL_KILL');
          setAllThreatEvents(threats);
          if (threats.length > 0) {
            setLatestThreatEvent(threats[0]);
          }
        }
      }
    } catch (err) {
      console.warn("REST API initial fetch error:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 6. WebSocket Live Telemetry Connection
  useEffect(() => {
    const connectWebSocket = () => {
      try {
        const ws = new WebSocket(WS_URL);
        socketRef.current = ws;

        ws.onopen = () => {
          console.log("[Sentinel EDR] WebSocket connected to telemetry stream");
          setWsConnected(true);
        };

        ws.onmessage = (message) => {
          try {
            const data = JSON.parse(message.data);

            if (data.type === 'HANDSHAKE_INIT') {
              if (data.stats) setStats(prev => ({ ...prev, ...data.stats }));
              if (data.recent_events && data.recent_events.length > 0) {
                setEvents(data.recent_events);
                const threats = data.recent_events.filter(e => e.severity === 'CRITICAL_KILL');
                setAllThreatEvents(threats);
                if (threats.length > 0) {
                  setLatestThreatEvent(threats[0]);
                }
              }
            } else if (data.type === 'TELEMETRY_FEED') {
              setEvents(prev => [data.payload, ...prev.slice(0, 249)]);
            } else if (data.type === 'ZERO_DAY_ALERT') {
              const attackEvent = data.payload;
              setEvents(prev => [attackEvent, ...prev.slice(0, 249)]);
              setLatestThreatEvent(attackEvent);
              setAllThreatEvents(prev => [attackEvent, ...prev]);
              setSelectedEvent(attackEvent);
              setAlertModalEvent(attackEvent);
              setLatestThreatTimestamp(Date.now());

              if (data.stats) {
                setStats(prev => ({ ...prev, ...data.stats }));
              } else {
                setStats(prev => ({
                  ...prev,
                  zero_day_threats_blocked: (prev.zero_day_threats_blocked || 0) + 1
                }));
              }

              // Update traps state to show tripped trap
              setTraps(prev => prev.map(t => {
                if (attackEvent.target_file && t.path.toLowerCase().includes(attackEvent.target_file.toLowerCase())) {
                  return { ...t, integrity_status: 'TAMPER_ATTEMPT_BLOCKED' };
                }
                return t;
              }));
            } else if (data.type === 'RESET_SYSTEM') {
              if (data.stats) setStats(prev => ({ ...prev, ...data.stats }));
              setTraps(prev => prev.map(t => ({ ...t, integrity_status: 'INTACT' })));
              setLatestThreatEvent(null);
              setAllThreatEvents([]);
              setSelectedEvent(null);
            }
          } catch (e) {
            console.error("Error parsing WebSocket telemetry:", e);
          }
        };

        ws.onclose = () => {
          console.warn("[Sentinel EDR] WebSocket disconnected. Retrying in 2.5s...");
          setWsConnected(false);
          reconnectTimeoutRef.current = setTimeout(connectWebSocket, 2500);
        };

        ws.onerror = (err) => {
          console.error("[Sentinel EDR] WebSocket error:", err);
          ws.close();
        };
      } catch (e) {
        console.error("WebSocket init error:", e);
        reconnectTimeoutRef.current = setTimeout(connectWebSocket, 2500);
      }
    };

    connectWebSocket();

    return () => {
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      if (socketRef.current) socketRef.current.close();
    };
  }, []);

  // 7. Simulation Trigger (Calling multi-stage endpoint)
  const handleSimulateAttack = async () => {
    setIsSimulating(true);
    try {
      const res = await fetch(`${API_BASE}/api/simulation/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      
      if (data.event) {
        setLatestThreatEvent(data.event);
        setAllThreatEvents(prev => [data.event, ...prev]);
        setSelectedEvent(data.event);
        setAlertModalEvent(data.event);
        setLatestThreatTimestamp(Date.now());
        setStats(prev => ({
          ...prev,
          current_risk_score: 94,
          zero_day_threats_blocked: (prev.zero_day_threats_blocked || 0) + 1
        }));
        
        // Refresh traps
        const trapsRes = await fetch(`${API_BASE}/api/traps`);
        if (trapsRes.ok) setTraps(await trapsRes.json());
      }
    } catch (err) {
      console.error("Attack simulation failed:", err);
    } finally {
      setIsSimulating(false);
    }
  };

  // 8. Reset System
  const handleReset = async () => {
    try {
      await fetch(`${API_BASE}/api/reset`, { method: 'POST' });
      setStats(prev => ({ ...prev, zero_day_threats_blocked: 0 }));
      setLatestThreatEvent(null);
      setAllThreatEvents([]);
      setSelectedEvent(null);
      const trapsRes = await fetch(`${API_BASE}/api/traps`);
      if (trapsRes.ok) setTraps(await trapsRes.json());
    } catch (err) {
      console.error("Reset failed:", err);
    }
  };

  const handleAuditTraps = async () => {
    const trapsRes = await fetch(`${API_BASE}/api/traps`);
    if (trapsRes.ok) setTraps(await trapsRes.json());
  };

  const handleViewForensicsForEvent = (event) => {
    setSelectedEvent(event);
    setCurrentTab('lineage');
  };

  // ROUTE 1: Product Homepage
  if (currentView === 'landing') {
    return (
      <LandingPage
        onLaunchEDR={handleLaunchEDR}
        onNavigateView={(v) => navigateTo(v)}
        stats={stats}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
    );
  }

  // ROUTE 2: Dedicated Protection Page
  if (currentView === 'protection') {
    return (
      <ProtectionView
        onNavigateHome={() => navigateTo('landing')}
        onLaunchEDR={handleLaunchEDR}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
    );
  }

  // ROUTE 3: Dedicated Architecture Page
  if (currentView === 'architecture') {
    return (
      <ArchitectureView
        onNavigateHome={() => navigateTo('landing')}
        onLaunchEDR={handleLaunchEDR}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
    );
  }

  // ROUTE 4: Enterprise Authentication - Sign In
  if (currentView === 'login') {
    return (
      <LoginPage
        onNavigateHome={() => navigateTo('landing')}
        onNavigateSignup={() => navigateTo('signup')}
        onNavigateForgotPassword={() => navigateTo('forgot-password')}
        onLoginSuccess={() => navigateTo(intendedDestination || 'dashboard')}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
    );
  }

  // ROUTE 5: Enterprise Authentication - Sign Up / Registration
  if (currentView === 'signup') {
    return (
      <SignupPage
        onNavigateHome={() => navigateTo('landing')}
        onNavigateLogin={() => navigateTo('login')}
        onSignupSuccess={() => navigateTo('dashboard')}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
    );
  }

  // ROUTE 6: Enterprise Authentication - Self-Service Password Recovery
  if (currentView === 'forgot-password') {
    return (
      <ForgotPasswordPage
        onNavigateHome={() => navigateTo('landing')}
        onNavigateLogin={() => navigateTo('login')}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
    );
  }

  // ROUTE 7: EDR Security Operations Console (Protected)
  // If loading session verification, show a cyber security loading screen
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#05070d] flex flex-col items-center justify-center font-mono text-cyan-400 p-6 selection:bg-orange-500">
        <div className="relative flex items-center justify-center mb-6">
          <div className="w-16 h-16 rounded-full border-2 border-cyan-500/20 border-t-cyan-400 animate-spin" />
          <Shield className="w-7 h-7 text-cyan-400 absolute animate-pulse" />
        </div>
        <div className="text-center space-y-2">
          <div className="text-xs tracking-[0.25em] text-cyan-500 uppercase font-bold">
            SENTINEL // EDR CORE
          </div>
          <div className="text-sm text-slate-300">
            Verifying SOC analyst security credentials & session...
          </div>
        </div>
      </div>
    );
  }

  // Unauthenticated access guard fallback
  if (!isAuthenticated) {
    return (
      <LoginPage
        onNavigateHome={() => navigateTo('landing')}
        onNavigateSignup={() => navigateTo('signup')}
        onNavigateForgotPassword={() => navigateTo('forgot-password')}
        onLoginSuccess={() => navigateTo(intendedDestination || 'dashboard')}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
    );
  }

  return (
    <div className="relative flex h-screen w-screen overflow-hidden bg-[#f1f5f9] dark:bg-[#05070d] text-slate-900 dark:text-slate-100 font-sans selection:bg-orange-500 selection:text-black">
      {/* Ambient Animated Digital Background */}
      <div className="fixed inset-0 pointer-events-none opacity-10 dark:opacity-25 z-0">
        <NetworkBackground />
      </div>

      {/* 1. Persistent Collapsible Left Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(prev => !prev)}
        onNavigateHome={() => navigateTo('landing')}
        stats={stats}
        eventsCount={events.length}
        threatsCount={allThreatEvents.length || 3}
        theme={theme}
      />

      {/* 2. Main Console Column */}
      <div className="relative z-10 flex-1 flex flex-col h-screen overflow-hidden min-w-0">
        {/* Top Navbar with Global Search, Notifications, Profile & Environment Status */}
        <Navbar
          onSimulateAttack={handleSimulateAttack}
          onReset={handleReset}
          isSimulating={isSimulating}
          wsConnected={wsConnected}
          stats={stats}
          currentTab={currentTab}
          onSelectTab={(tab) => setCurrentTab(tab)}
          onToggleSidebar={() => setIsSidebarCollapsed(prev => !prev)}
          isSidebarCollapsed={isSidebarCollapsed}
          onNavigateHome={() => navigateTo('landing')}
          theme={theme}
          onToggleTheme={toggleTheme}
        />

        {/* Dynamic Multi-Page Tab View Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 min-w-0">
          <div className="max-w-[1520px] w-full mx-auto">
            {/* View 1: Overview */}
            {currentTab === 'overview' && (
              <OverviewView
                stats={stats}
                events={events}
                traps={traps}
                onSimulateAttack={handleSimulateAttack}
                isSimulating={isSimulating}
                onNavigateTab={(tab) => setCurrentTab(tab)}
                onSelectEvent={(evt) => setSelectedEvent(evt)}
                latestThreatTimestamp={latestThreatTimestamp}
                theme={theme}
              />
            )}

            {/* View 2: Live Threats / Threat Detection */}
            {(currentTab === 'live-threats' || currentTab === 'threat-detection') && (
              <ThreatDetectionView
                latestThreatEvent={latestThreatEvent}
                allThreatEvents={allThreatEvents}
                onSelectThreat={(t) => {
                  setSelectedEvent(t);
                  setLatestThreatEvent(t);
                }}
                onNavigateTab={(tab) => setCurrentTab(tab)}
                theme={theme}
              />
            )}

            {/* View: Threat Hunting */}
            {currentTab === 'threat-hunting' && (
              <ThreatHuntingView
                events={events}
                onSelectEvent={(evt) => setSelectedEvent(evt)}
                onViewForensics={handleViewForensicsForEvent}
                theme={theme}
              />
            )}

            {/* View: Threat History */}
            {currentTab === 'threat-history' && (
              <ThreatHistoryView
                threats={allThreatEvents.length > 0 ? allThreatEvents : events.filter(e => e.severity === 'CRITICAL_KILL')}
                onSelectThreat={(t) => {
                  setSelectedEvent(t);
                  setLatestThreatEvent(t);
                }}
                onViewForensics={handleViewForensicsForEvent}
                onSimulateAttack={handleSimulateAttack}
                theme={theme}
              />
            )}

            {/* View 3: Endpoints */}
            {currentTab === 'endpoints' && (
              <EndpointsView theme={theme} />
            )}

            {/* View 4: Incidents */}
            {currentTab === 'incidents' && (
              <IncidentsView theme={theme} />
            )}

            {/* View 5: Attack Timeline / Live Activity */}
            {(currentTab === 'attack-timeline' || currentTab === 'live-activity') && (
              <ActivityTimeline
                events={events}
                onSelectEvent={(evt) => setSelectedEvent(evt)}
                onViewForensics={handleViewForensicsForEvent}
                isFullPage={true}
                theme={theme}
              />
            )}

            {/* View 6: Processes */}
            {currentTab === 'processes' && (
              <ProcessMonitoringTable
                events={events}
                onSelectEvent={(evt) => setSelectedEvent(evt)}
                onViewForensics={handleViewForensicsForEvent}
                isFullPage={true}
                theme={theme}
              />
            )}

            {/* View: Process Lineage */}
            {currentTab === 'process-lineage' && (
              <div className="space-y-4">
                <ProcessLineageCard
                  selectedEvent={selectedEvent}
                  latestThreatEvent={latestThreatEvent}
                  allThreatEvents={allThreatEvents}
                  onSelectThreat={(t) => {
                    setSelectedEvent(t);
                    setLatestThreatEvent(t);
                  }}
                  isFullPage={true}
                  theme={theme}
                />
              </div>
            )}

            {/* View: Canary / Decoy Vault */}
            {currentTab === 'canary-vault' && (
              <CanaryTrapVault
                traps={traps}
                onAuditTraps={fetchData}
                isFullPage={true}
                theme={theme}
              />
            )}

            {/* View: Simulation Lab */}
            {currentTab === 'simulation-lab' && (
              <div className="space-y-6">
                <SimulationControl
                  onSimulateAttack={handleSimulateAttack}
                  isSimulating={isSimulating}
                  latestThreatEvent={latestThreatEvent}
                  stats={stats}
                  theme={theme}
                />
              </div>
            )}

            {/* View 7: File Activity */}
            {currentTab === 'file-activity' && (
              <ActivityTimeline
                events={events}
                onSelectEvent={(evt) => setSelectedEvent(evt)}
                onViewForensics={handleViewForensicsForEvent}
                isFullPage={true}
                theme={theme}
              />
            )}

            {/* View 8: Network Activity */}
            {currentTab === 'network-activity' && (
              <NetworkActivityView theme={theme} />
            )}

            {/* View 9: Detection Rules */}
            {currentTab === 'detection-rules' && (
              <DetectionRulesView theme={theme} />
            )}

            {/* View 10: Containment */}
            {currentTab === 'containment' && (
              <ContainmentView theme={theme} />
            )}

            {/* View 11: Reports */}
            {currentTab === 'reports' && (
              <ReportsView theme={theme} />
            )}

            {/* View 12: Settings */}
            {currentTab === 'settings' && (
              <SettingsView
                stats={stats}
                theme={theme}
                onToggleTheme={toggleTheme}
                onReset={handleReset}
              />
            )}
          </div>
        </main>
      </div>

      {/* Pop-up Alert Modal when Zero-Day Threat is Intercepted */}
      <ThreatAlertModal
        alertEvent={alertModalEvent}
        onClose={() => setAlertModalEvent(null)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
