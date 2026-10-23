import React from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle({ theme = 'dark', onToggle }) {
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={onToggle}
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      aria-label="Toggle Theme"
      className={`relative inline-flex items-center gap-1.5 px-2 py-1 rounded-full transition-all duration-300 border select-none ${
        isDark 
          ? 'bg-[#0b101d]/90 hover:bg-[#12192b] border-white/[0.12] shadow-inner shadow-black/40' 
          : 'bg-slate-100 hover:bg-slate-200 border-slate-300 shadow-sm'
      }`}
    >
      {/* Sun Icon */}
      <Sun className={`w-3.5 h-3.5 transition-colors duration-200 ${
        isDark ? 'text-slate-400 hover:text-amber-300' : 'text-amber-600 font-bold'
      }`} />

      {/* Sliding Pill Track with Indicator */}
      <div className="w-8 h-4 rounded-full bg-slate-800/80 dark:bg-black/60 p-0.5 flex items-center border border-slate-300 dark:border-white/[0.08]">
        <div 
          className={`w-3 h-3 rounded-full bg-gradient-to-r from-orange-400 to-amber-500 shadow-sm shadow-orange-500/50 transition-transform duration-300 transform ${
            isDark ? 'translate-x-4' : 'translate-x-0'
          }`}
        />
      </div>

      {/* Moon Icon */}
      <Moon className={`w-3.5 h-3.5 transition-colors duration-200 ${
        isDark ? 'text-cyan-300' : 'text-slate-400 hover:text-slate-600'
      }`} />

      <span className="sr-only">{isDark ? "Light Mode" : "Dark Mode"}</span>
    </button>
  );
}
