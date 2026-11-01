import React, { useState, useMemo } from 'react';
import { 
  Shield, 
  Lock, 
  Mail, 
  User, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Check, 
  X,
  Building,
  KeyRound,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';

export default function SignupPage({ 
  onNavigateHome, 
  onNavigateLogin, 
  onSignupSuccess,
  theme = 'dark',
  onToggleTheme 
}) {
  const { register } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('Cyber Defense Operations');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Real-time password strength computation
  const passwordCriteria = useMemo(() => {
    return {
      minLength: password.length >= 8,
      hasLetter: /[a-zA-Z]/.test(password),
      hasNumberOrSymbol: /[0-9!@#$%^&*(),.?":{}|<>]/.test(password),
      hasUppercase: /[A-Z]/.test(password)
    };
  }, [password]);

  const strengthScore = useMemo(() => {
    if (!password) return 0;
    let score = 0;
    if (passwordCriteria.minLength) score += 1;
    if (passwordCriteria.hasLetter) score += 1;
    if (passwordCriteria.hasNumberOrSymbol) score += 1;
    if (passwordCriteria.hasUppercase) score += 1;
    return score;
  }, [password, passwordCriteria]);

  const strengthLabel = useMemo(() => {
    if (strengthScore <= 1) return { text: "Weak", color: "text-rose-400", bg: "bg-rose-500", width: "25%" };
    if (strengthScore === 2) return { text: "Fair", color: "text-amber-400", bg: "bg-amber-500", width: "50%" };
    if (strengthScore === 3) return { text: "Good", color: "text-cyan-400", bg: "bg-cyan-500", width: "75%" };
    return { text: "Strong", color: "text-emerald-400", bg: "bg-emerald-500", width: "100%" };
  }, [strengthScore]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const cleanName = fullName.trim();
    const cleanEmail = email.trim();

    if (!cleanName || cleanName.length < 2) {
      setErrorMessage("Please enter your full legal or analyst name.");
      return;
    }
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setErrorMessage("Please enter a valid work or organization email address.");
      return;
    }
    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long.");
      return;
    }
    if (!passwordCriteria.hasLetter || !passwordCriteria.hasNumberOrSymbol) {
      setErrorMessage("Password must contain at least one letter and one number or special character.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match. Please re-enter confirmation password.");
      return;
    }
    if (!agreeTerms) {
      setErrorMessage("You must accept the Security Operations Terms & SOC Privacy Policy.");
      return;
    }

    setIsSubmitting(true);
    try {
      await register(cleanName, cleanEmail, password, department);
      setSuccessMessage("Account created successfully! Launching EDR Console...");
      setTimeout(() => {
        if (onSignupSuccess) {
          onSignupSuccess();
        }
      }, 800);
    } catch (err) {
      setErrorMessage(err.message || "Registration failed. Please check your information.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-screen flex flex-col justify-between bg-[#080C18] text-slate-100 font-sans relative overflow-x-hidden selection:bg-orange-500 selection:text-black">
      
      {/* Background Cyber Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(167,139,250,0.12),rgba(57,231,255,0.06)_50%,transparent)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#15223815_1px,transparent_1px),linear-gradient(to_bottom,#15223815_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />

      {/* Top Header */}
      <header className="relative z-20 px-6 py-4 flex items-center justify-between border-b border-white/[0.06] backdrop-blur-md bg-[#080C18]/80">
        <button
          onClick={onNavigateHome}
          className="flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-white transition-colors group cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-orange-400 group-hover:-translate-x-1 transition-transform" />
          <span>Return to Homepage</span>
        </button>

        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-block text-[11px] font-mono text-cyan-400 font-semibold px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20">
            ● ANALYST ONBOARDING
          </span>
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-12">
        <div className="w-full max-w-5xl rounded-3xl bg-[#101A2B]/80 border border-white/[0.08] backdrop-blur-2xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[620px]">
          
          {/* ========================================================================= */}
          {/* LEFT SECTION: Cyber Security Onboarding Summary                             */}
          {/* ========================================================================= */}
          <div className="lg:col-span-5 p-8 sm:p-10 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/[0.08] bg-gradient-to-br from-[#0B1220] via-[#101A2B] to-[#0A101D] relative overflow-hidden">
            
            <div className="space-y-6 relative z-10">
              {/* Product Badge */}
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/40 text-cyan-400 shadow-lg shadow-cyan-500/10">
                  <ShieldCheck className="w-6 h-6 text-cyan-400 stroke-[2.2]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-base font-extrabold tracking-wider text-white">
                      SENTINEL <span className="text-orange-500">//</span> EDR
                    </span>
                    <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 uppercase tracking-widest">
                      TIER-3 ACCESS
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 block tracking-tight">
                    Unified Ransomware Prevention &amp; Incident Console
                  </span>
                </div>
              </div>

              {/* Heading */}
              <div className="space-y-3 pt-4">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                  Enlist Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300">Defense Node.</span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
                  Join the Sentinel security operations fleet. Register your analyst credentials to inspect live threat lineages, manage canary vaults, and trigger autonomous containment workflows.
                </p>
              </div>

              {/* Verification Guarantees */}
              <div className="space-y-3 pt-2 font-mono text-xs">
                <div className="flex items-start gap-2.5 text-slate-300">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Encrypted credential storage with salted bcrypt hashes</span>
                </div>
                <div className="flex items-start gap-2.5 text-slate-300">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Real-time access to live NTFS EDR_Test/ directory monitor</span>
                </div>
                <div className="flex items-start gap-2.5 text-slate-300">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Automated incident report generation with IST timestamps</span>
                </div>
                <div className="flex items-start gap-2.5 text-slate-300">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Zero telemetry exfiltration beyond local protected sandbox</span>
                </div>
              </div>
            </div>

            {/* Bottom Status */}
            <div className="pt-6 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>Security Clearance: LEVEL 3</span>
              <span className="text-cyan-400 font-semibold">Active Encryption: AES-256</span>
            </div>

          </div>

          {/* ========================================================================= */}
          {/* RIGHT SECTION: Registration Form Card                                     */}
          {/* ========================================================================= */}
          <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center space-y-6">
            
            {/* Form Header */}
            <div>
              <span className="text-[11px] font-mono text-cyan-400 font-bold uppercase tracking-widest">
                ANALYST REGISTRATION
              </span>
              <h3 className="text-2xl font-bold font-mono text-white mt-1">
                Create Security Account
              </h3>
              <p className="text-xs text-slate-400 font-sans mt-1">
                Provision a new operator profile with full EDR console privileges.
              </p>
            </div>

            {/* Error & Success Messages */}
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 font-mono text-xs flex items-center gap-3 animate-fade-in">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span className="leading-tight">{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-mono text-xs flex items-center gap-3 animate-fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="leading-tight">{successMessage}</span>
              </div>
            )}

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
              
              {/* Row 1: Full Name & Department */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      required
                      placeholder="Jane Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      disabled={isSubmitting}
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-[#080C18] border border-white/[0.1] text-slate-100 placeholder:text-slate-500 text-xs focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all shadow-inner disabled:opacity-50"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                    Department
                  </label>
                  <div className="relative">
                    <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      disabled={isSubmitting}
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-[#080C18] border border-white/[0.1] text-slate-100 text-xs focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all shadow-inner disabled:opacity-50"
                    >
                      <option value="Cyber Defense Operations">Cyber Defense Operations</option>
                      <option value="Threat Intelligence Team">Threat Intelligence Team</option>
                      <option value="Incident Response Unit">Incident Response Unit</option>
                      <option value="Security Architecture">Security Architecture</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Email Address */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                  Analyst Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    required
                    placeholder="analyst.jane@sentinel.defense"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSubmitting}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#080C18] border border-white/[0.1] text-slate-100 placeholder:text-slate-500 text-xs focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all shadow-inner disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Passwords Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Password */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="Min. 8 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isSubmitting}
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#080C18] border border-white/[0.1] text-slate-100 placeholder:text-slate-500 text-xs focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all shadow-inner disabled:opacity-50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex={-1}
                      className="p-1 text-slate-400 hover:text-white absolute right-3 top-1/2 -translate-y-1/2 transition-colors cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      placeholder="Re-enter password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={isSubmitting}
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#080C18] border border-white/[0.1] text-slate-100 placeholder:text-slate-500 text-xs focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all shadow-inner disabled:opacity-50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      tabIndex={-1}
                      className="p-1 text-slate-400 hover:text-white absolute right-3 top-1/2 -translate-y-1/2 transition-colors cursor-pointer"
                    >
                      {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Password Strength Indicator Bar */}
              {password && (
                <div className="space-y-2 p-3 rounded-xl bg-slate-900/40 border border-white/[0.04] animate-fade-in">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Password Strength:</span>
                    <span className={`font-bold ${strengthLabel.color}`}>{strengthLabel.text}</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${strengthLabel.bg} transition-all duration-300`} 
                      style={{ width: strengthLabel.width }}
                    />
                  </div>

                  {/* Criteria Checklist */}
                  <div className="grid grid-cols-2 gap-1.5 pt-1 text-[10px]">
                    <div className={`flex items-center gap-1.5 ${passwordCriteria.minLength ? 'text-emerald-400' : 'text-slate-500'}`}>
                      {passwordCriteria.minLength ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                      <span>8+ Characters</span>
                    </div>
                    <div className={`flex items-center gap-1.5 ${passwordCriteria.hasLetter ? 'text-emerald-400' : 'text-slate-500'}`}>
                      {passwordCriteria.hasLetter ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                      <span>Letters (a-z)</span>
                    </div>
                    <div className={`flex items-center gap-1.5 ${passwordCriteria.hasNumberOrSymbol ? 'text-emerald-400' : 'text-slate-500'}`}>
                      {passwordCriteria.hasNumberOrSymbol ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                      <span>Number or Symbol</span>
                    </div>
                    <div className={`flex items-center gap-1.5 ${password && confirmPassword && password === confirmPassword ? 'text-emerald-400' : 'text-slate-500'}`}>
                      {password && confirmPassword && password === confirmPassword ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                      <span>Passwords Match</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Terms Checkbox */}
              <div className="flex items-start gap-2.5 pt-1">
                <input
                  type="checkbox"
                  id="agree-terms"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  disabled={isSubmitting}
                  className="w-4 h-4 rounded border-slate-700 bg-[#080C18] text-cyan-500 focus:ring-cyan-500/20 cursor-pointer accent-cyan-500 mt-0.5"
                />
                <label htmlFor="agree-terms" className="text-slate-300 text-[11px] font-sans leading-tight select-none cursor-pointer">
                  I agree to the <span className="text-cyan-400 underline">Security Operations Terms of Service</span> and <span className="text-cyan-400 underline">SOC Privacy &amp; Data Ethics Policy</span>.
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-extrabold text-xs uppercase tracking-wider font-mono shadow-xl shadow-cyan-500/20 hover:shadow-cyan-500/35 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Provisioning Security Profile...</span>
                    </>
                  ) : (
                    <>
                      <span>Create Account &amp; Access Dashboard</span>
                      <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                    </>
                  )}
                </button>
              </div>

            </form>

            {/* Switch to Login */}
            <div className="pt-3 border-t border-white/[0.08] text-center font-sans text-xs text-slate-400">
              Already have an analyst account?{' '}
              <button
                type="button"
                onClick={onNavigateLogin}
                className="font-bold text-cyan-400 hover:text-cyan-300 font-mono transition-colors ml-1 cursor-pointer underline"
              >
                Sign In
              </button>
            </div>

          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-4 text-center text-[10px] font-mono text-slate-500 border-t border-white/[0.06]">
        SENTINEL // EDR &bull; ZERO-DAY DEFENSE &bull; Enterprise Endpoint Protection &bull; All Registrations Audited
      </footer>

    </div>
  );
}
