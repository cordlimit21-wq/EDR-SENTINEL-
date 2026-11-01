import React, { useState } from 'react';
import { 
  Shield, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Zap, 
  Activity, 
  Cpu, 
  KeyRound,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';

export default function LoginPage({ 
  onNavigateHome, 
  onNavigateSignup, 
  onNavigateForgotPassword, 
  onLoginSuccess,
  theme = 'dark',
  onToggleTheme 
}) {
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setErrorMessage("Please enter your analyst email address.");
      return;
    }
    if (!password) {
      setErrorMessage("Please enter your account password.");
      return;
    }

    setIsSubmitting(true);
    try {
      await login(cleanEmail, password, rememberMe);
      if (onLoginSuccess) {
        onLoginSuccess();
      }
    } catch (err) {
      setErrorMessage(err.message || "Authentication failed. Please verify your credentials.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickFillDemo = () => {
    setEmail('admin@sentinel.defense');
    setPassword('Sentinel@2026!');
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen w-screen flex flex-col justify-between bg-[#080C18] text-slate-100 font-sans relative overflow-x-hidden selection:bg-orange-500 selection:text-black">
      
      {/* Background Cyber Grid & Glow Orbs */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(14,165,233,0.15),rgba(255,117,72,0.05)_50%,transparent)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#15223815_1px,transparent_1px),linear-gradient(to_bottom,#15223815_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />

      {/* Top Header Navigation */}
      <header className="relative z-20 px-6 py-4 flex items-center justify-between border-b border-white/[0.06] backdrop-blur-md bg-[#080C18]/80">
        <button
          onClick={onNavigateHome}
          className="flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-white transition-colors group cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-orange-400 group-hover:-translate-x-1 transition-transform" />
          <span>Return to Homepage</span>
        </button>

        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-block text-[11px] font-mono text-emerald-400 font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            ● SOC AUTHENTICATION PORTAL
          </span>
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        </div>
      </header>

      {/* Main Split Authentication Container */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-12">
        <div className="w-full max-w-5xl rounded-3xl bg-[#101A2B]/80 border border-white/[0.08] backdrop-blur-2xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
          
          {/* ========================================================================= */}
          {/* LEFT SECTION: Cyber Branding & Live Mission Telemetry                      */}
          {/* ========================================================================= */}
          <div className="lg:col-span-5 p-8 sm:p-10 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/[0.08] bg-gradient-to-br from-[#0B1220] via-[#101A2B] to-[#0A101D] relative overflow-hidden">
            
            {/* Ambient Accent Light */}
            <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-64 h-64 rounded-full bg-orange-500/10 blur-3xl pointer-events-none" />

            <div className="space-y-6 relative z-10">
              {/* Product Badge */}
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-gradient-to-br from-orange-500/20 to-cyan-500/20 border border-orange-500/40 text-orange-400 shadow-lg shadow-orange-500/10">
                  <Shield className="w-6 h-6 text-orange-400 stroke-[2.2]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-base font-extrabold tracking-wider text-white">
                      SENTINEL <span className="text-orange-500">//</span> EDR
                    </span>
                    <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 uppercase tracking-widest">
                      ZERO-DAY DEFENSE
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 block tracking-tight">
                    Behavior-Based Ransomware Detection &amp; Response
                  </span>
                </div>
              </div>

              {/* Main Heading & Description */}
              <div className="space-y-3 pt-4">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                  Your Security Operations <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-cyan-400">Start Here.</span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
                  Authenticate your analyst session to access live NTFS filesystem telemetry, real-time Shannon byte entropy monitoring, canary honeypot tripwires, and autonomous sub-11ms kernel containment.
                </p>
              </div>

              {/* Key Platform Capability Highlights */}
              <div className="space-y-2.5 pt-2 font-mono text-xs">
                <div className="p-3 rounded-xl bg-slate-900/60 border border-white/[0.06] flex items-center gap-3">
                  <div className="p-1.5 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20 shrink-0">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-white text-[11px] block">Sub-11ms Mitigation Hook</span>
                    <span className="text-[10px] text-slate-400">Pre-empts zero-day ransomware bursts before encryption completes</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/60 border border-white/[0.06] flex items-center gap-3">
                  <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shrink-0">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-white text-[11px] block">Shannon Byte Entropy Telemetry</span>
                    <span className="text-[10px] text-slate-400">Mathematical profiling of high-entropy cryptographic payloads (H &gt; 7.00)</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/60 border border-white/[0.06] flex items-center gap-3">
                  <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20 shrink-0">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-white text-[11px] block">Canary Honeypot Tripwire Vault</span>
                    <span className="text-[10px] text-slate-400">48 enterprise decoys deployed to trap recursive traversal scripts</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Status */}
            <div className="pt-6 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Backend Engine: Online
              </span>
              <span>FastAPI Port: 8000</span>
            </div>

          </div>

          {/* ========================================================================= */}
          {/* RIGHT SECTION: Enterprise Login Form Card                                  */}
          {/* ========================================================================= */}
          <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center space-y-6">
            
            {/* Form Header */}
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-orange-400 font-bold uppercase tracking-widest">
                  IDENTITY VERIFICATION
                </span>
                
                {/* One-Click Demo Credentials Chip */}
                <button
                  type="button"
                  onClick={handleQuickFillDemo}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-[10px] font-mono font-semibold transition-all cursor-pointer hover:border-cyan-400 active:scale-95"
                  title="Click to automatically fill default Administrator credentials"
                >
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  <span>Use Demo Admin</span>
                </button>
              </div>

              <h3 className="text-2xl font-bold font-mono text-white mt-1">
                Analyst Sign In
              </h3>
              <p className="text-xs text-slate-400 font-sans mt-1">
                Enter your authorized credentials to access the live EDR dashboard.
              </p>
            </div>

            {/* Error Message Banner */}
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 font-mono text-xs flex items-center gap-3 animate-fade-in">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span className="leading-tight">{errorMessage}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
              
              {/* Email Address */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    required
                    placeholder="analyst@sentinel.defense"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSubmitting}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#080C18] border border-white/[0.1] text-slate-100 placeholder:text-slate-500 text-xs focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all shadow-inner disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={onNavigateForgotPassword}
                    className="text-[11px] text-cyan-400 hover:text-cyan-300 transition-colors font-mono cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Enter your security passphrase"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isSubmitting}
                    className="w-full pl-10 pr-11 py-3 rounded-xl bg-[#080C18] border border-white/[0.1] text-slate-100 placeholder:text-slate-500 text-xs focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all shadow-inner disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    className="p-1.5 text-slate-400 hover:text-white absolute right-3 top-1/2 -translate-y-1/2 rounded-md transition-colors cursor-pointer"
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me Checkbox */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="remember-me"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={isSubmitting}
                  className="w-4 h-4 rounded border-slate-700 bg-[#080C18] text-orange-500 focus:ring-orange-500/20 cursor-pointer accent-orange-500"
                />
                <label htmlFor="remember-me" className="text-slate-300 text-[11px] font-sans select-none cursor-pointer">
                  Remember this workstation session (Extended 30 days)
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-5 rounded-xl bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 hover:from-orange-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs uppercase tracking-wider font-mono shadow-xl shadow-orange-500/25 hover:shadow-orange-500/40 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                      <span>Verifying Security Clearance...</span>
                    </>
                  ) : (
                    <>
                      <span>Authenticate &amp; Launch EDR</span>
                      <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                    </>
                  )}
                </button>
              </div>

            </form>

            {/* Switch to Sign Up */}
            <div className="pt-4 border-t border-white/[0.08] text-center font-sans text-xs text-slate-400">
              Don't have an analyst account?{' '}
              <button
                type="button"
                onClick={onNavigateSignup}
                className="font-bold text-orange-400 hover:text-orange-300 font-mono transition-colors ml-1 cursor-pointer underline"
              >
                Sign Up for Access
              </button>
            </div>

            {/* Demo Credential Note */}
            <div className="p-3 rounded-xl bg-slate-900/40 border border-white/[0.04] text-[11px] font-mono text-slate-400 text-center">
              Default SOC Admin: <span className="text-cyan-300 font-semibold">admin@sentinel.defense</span> &bull; Pass: <span className="text-orange-300 font-semibold">Sentinel@2026!</span>
            </div>

          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-4 text-center text-[10px] font-mono text-slate-500 border-t border-white/[0.06]">
        SENTINEL // EDR &bull; ZERO-DAY DEFENSE &bull; Enterprise Endpoint Protection &bull; All Sessions Authenticated &amp; Audited
      </footer>

    </div>
  );
}
