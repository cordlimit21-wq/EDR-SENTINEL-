/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: '#05070d',
          surface: '#090d16',
          card: '#0d1322',
          cardHover: '#121a2e',
          border: 'rgba(255, 255, 255, 0.08)',
          borderGlow: 'rgba(249, 115, 22, 0.3)',
          cyan: '#00f0ff',
          blue: '#3b82f6',
          emerald: '#10b981',
          rose: '#ef4444',
          amber: '#f59e0b',
          orange: '#f97316',
          orangeGlow: 'rgba(249, 115, 22, 0.4)',
          purple: '#a855f7',
          purpleGlow: 'rgba(168, 85, 247, 0.4)',
          magenta: '#c026d3',
        },
        sentinel: {
          orange: '#f97316',
          orangeLight: '#fb923c',
          orangeDark: '#ea580c',
          purple: '#a855f7',
          purpleLight: '#c084fc',
          purpleDark: '#7e22ce',
          magenta: '#c026d3',
          darkBg: '#05070d',
          darkSurface: '#0a0e1a',
          darkCard: '#0f1629',
          lightBg: '#f8fafc',
          lightSurface: '#ffffff',
          lightCard: '#ffffff',
          lightBorder: '#e2e8f0',
        }
      },
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', '"Liberation Mono"', '"Courier New"', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
      animation: {
        'pulse-subtle': 'pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'flash-crimson': 'flashCrimson 0.8s ease-in-out infinite alternate',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
      },
      keyframes: {
        flashCrimson: {
          '0%': { backgroundColor: 'rgba(239, 68, 68, 0.18)', borderColor: 'rgba(239, 68, 68, 0.8)' },
          '100%': { backgroundColor: 'rgba(239, 68, 68, 0.04)', borderColor: 'rgba(239, 68, 68, 0.25)' }
        },
        glowPulse: {
          '0%, 100%': { opacity: 0.8 },
          '50%': { opacity: 0.4 }
        }
      }
    },
  },
  plugins: [],
}
