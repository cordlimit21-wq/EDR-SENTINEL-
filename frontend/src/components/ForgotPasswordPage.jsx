import React, { useState } from 'react';
import { 
  Shield, 
  KeyRound, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Clock, 
  Copy, 
  Check,
  Sparkles
} from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const API_BASE = "http://localhost:8000";

export default function ForgotPasswordPage({ 
  onNavigateHome, 
  onNavigateLogin, 
  theme = 'dark',
  onToggleTheme 
}) {
  const [step, setStep] = useState(1); // 1 = Request Token, 2 = Reset Password
  const [email, setEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [generatedTokenNotice, setGeneratedTokenNotice] = useState(null);
  const [tokenCopied, setTokenCopied] = useState(false);

  // Step 1: Request Token
  const handleRequestToken = async (e) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setGeneratedTokenNotice(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setErrorMessage("Please enter a valid analyst email address.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || "Unable to process password recovery request.");
      }

      setGeneratedTokenNotice({
        token: data.reset_token,
        expiresIn: data.expires_in_minutes || 15
      });
      setResetToken(data.reset_token);
      setSuccessMessage("Security reset token generated and validated by Sentinel Auth Kernel.");
    } catch (err) {
      setErrorMessage(err.message || "Failed to initiate password recovery.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 2: Reset Password using Token
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!resetToken.trim()) {
      setErrorMessage("Please enter your single-use recovery token.");
      return;
    }
    if (newPassword.length < 8) {
      setErrorMessage("New password must be at least 8 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage("New passwords do not match. Please verify.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: resetToken.trim(),
          new_password: newPassword
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || "Failed to update password.");
      }

      setSuccessMessage("Password successfully updated! Redirecting to login...");
      setTimeout(() => {
        onNavigateLogin();
      }, 1500);
    } catch (err) {
      setErrorMessage(err.message || "Failed to reset password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyToken = () => {
    if (generatedTokenNotice?.token) {
      navigator.clipboard.writeText(generatedTokenNotice.token);
      setTokenCopied(true);
      setTimeout(() => setTokenCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen w-screen flex flex-col justify-between bg-[#080C18] text-slate-100 font-sans relative overflow-x-hidden selection:bg-orange-500 selection:text-black">
      
      {/* Background Cyber Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(255,117,72,0.12),rgba(57,231,255,0.05)_50%,transparent)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#15223815_1px,transparent_1px),linear-gradient(to_bottom,#15223815_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />

      {/* Top Header */}
      <header className="relative z-20 px-6 py-4 flex items-center justify-between border-b border-white/[0.06] backdrop-blur-md bg-[#080C18]/80">
        <button
          onClick={onNavigateLogin}
          className="flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-white transition-colors group cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-orange-400 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Sign In</span>
        </button>

        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-block text-[11px] font-mono text-orange-400 font-semibold px-2.5 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/20">
            ● CREDENTIAL RECOVERY
          </span>
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-12">
        <div className="w-full max-w-xl rounded-3xl bg-[#101A2B]/85 border border-white/[0.08] backdrop-blur-2xl shadow-2xl p-6 sm:p-10 space-y-6">
          
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-orange-500/15 border border-orange-500/30 text-orange-400">
              <KeyRound className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-orange-400 font-bold uppercase tracking-widest block">
                AUTHENTICATION RECOVERY
              </span>
              <h2 className="text-2xl font-bold font-mono text-white mt-0.5">
                Reset Account Password
              </h2>
            </div>
          </div>

          <p className="text-xs text-slate-300 font-sans leading-relaxed">
            Password resets use a cryptographically secure, time-limited, single-use token (valid for 15 minutes) to guarantee unauthorized parties cannot tamper with your account.
          </p>

          {/* Stepper Tabs */}
          <div className="flex items-center gap-2 border-b border-white/[0.08] pb-3 font-mono text-xs">
            <button
              type="button"
              onClick={() => setStep(1)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                step === 1 
                  ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40 font-bold' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              1. Request Reset Token
            </button>
            <button
              type="button"
              onClick={() => setStep(2)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                step === 2 
                  ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40 font-bold' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              2. Enter Token &amp; New Password
            </button>
          </div>

          {/* Error Message Banner */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 font-mono text-xs flex items-center gap-3 animate-fade-in">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span className="leading-tight">{errorMessage}</span>
            </div>
          )}

          {/* Success Message Banner */}
          {successMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-mono text-xs flex items-center gap-3 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="leading-tight">{successMessage}</span>
            </div>
          )}

          {/* STEP 1: REQUEST TOKEN */}
          {step === 1 && (
            <form onSubmit={handleRequestToken} className="space-y-4 font-mono text-xs">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                  Registered Analyst Email
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
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#080C18] border border-white/[0.1] text-slate-100 placeholder:text-slate-500 text-xs focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 transition-all shadow-inner disabled:opacity-50"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-5 rounded-xl bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 hover:from-orange-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs uppercase tracking-wider font-mono shadow-xl shadow-orange-500/20 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                    <span>Issuing Cryptographic Reset Token...</span>
                  </>
                ) : (
                  <>
                    <span>Generate Secure Reset Token</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </>
                )}
              </button>

              {/* Generated Token Display Box (Zero-friction local verification) */}
              {generatedTokenNotice && (
                <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/40 space-y-3 animate-fade-in">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-cyan-300 font-bold flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      Single-Use Reset Token (Expires in 15 mins):
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyToken}
                      className="flex items-center gap-1 text-[10px] text-cyan-400 hover:text-white cursor-pointer"
                    >
                      {tokenCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{tokenCopied ? "Copied" : "Copy"}</span>
                    </button>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#080C18] border border-cyan-500/30 text-cyan-200 font-mono text-[11px] break-all select-all">
                    {generatedTokenNotice.token}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setStep(2);
                      setResetToken(generatedTokenNotice.token);
                    }}
                    className="w-full py-2 px-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Proceed to Step 2 with this Token</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </form>
          )}

          {/* STEP 2: RESET PASSWORD */}
          {step === 2 && (
            <form onSubmit={handleResetPassword} className="space-y-4 font-mono text-xs">
              {/* Reset Token Input */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                  Single-Use Recovery Token
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    required
                    placeholder="rst_..."
                    value={resetToken}
                    onChange={(e) => setResetToken(e.target.value)}
                    disabled={isSubmitting}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#080C18] border border-white/[0.1] text-cyan-300 placeholder:text-slate-500 text-xs focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all shadow-inner disabled:opacity-50"
                  />
                </div>
              </div>

              {/* New Password */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                  New Security Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Min. 8 chars (letters, numbers, symbols)"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={isSubmitting}
                    className="w-full pl-10 pr-10 py-3 rounded-xl bg-[#080C18] border border-white/[0.1] text-slate-100 placeholder:text-slate-500 text-xs focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 transition-all shadow-inner disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    className="p-1.5 text-slate-400 hover:text-white absolute right-3 top-1/2 -translate-y-1/2 transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm New Password */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    placeholder="Re-enter new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isSubmitting}
                    className="w-full pl-10 pr-10 py-3 rounded-xl bg-[#080C18] border border-white/[0.1] text-slate-100 placeholder:text-slate-500 text-xs focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 transition-all shadow-inner disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    tabIndex={-1}
                    className="p-1.5 text-slate-400 hover:text-white absolute right-3 top-1/2 -translate-y-1/2 transition-colors cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 text-slate-950 font-extrabold text-xs uppercase tracking-wider font-mono shadow-xl shadow-emerald-500/20 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                    <span>Updating Password in Auth Kernel...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm Password Reset</span>
                    <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Back to Sign In Link */}
          <div className="pt-3 border-t border-white/[0.08] text-center font-sans text-xs text-slate-400">
            Remembered your credentials?{' '}
            <button
              type="button"
              onClick={onNavigateLogin}
              className="font-bold text-orange-400 hover:text-orange-300 font-mono transition-colors ml-1 cursor-pointer underline"
            >
              Sign In
            </button>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-4 text-center text-[10px] font-mono text-slate-500 border-t border-white/[0.06]">
        SENTINEL // EDR &bull; ZERO-DAY DEFENSE &bull; Enterprise Endpoint Protection &bull; Password Reset Audit Logged
      </footer>

    </div>
  );
}
