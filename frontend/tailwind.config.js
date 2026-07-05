/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'void': '#050d0a',
        'glass': 'rgba(8, 20, 18, 0.6)',
        'glass-border': 'rgba(16, 185, 129, 0.2)',
        'accent-blue': '#10B981',
        'accent-purple': '#059669',
        'accent-cyan': '#00f5d4',
        'accent-green': '#34d399',
        'accent-orange': '#fbbf24',
        'accent-red': '#ef4444',
      },
      fontFamily: {
        'heading': ['Space Grotesk', 'sans-serif'],
        'body': ['Inter', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
      },
      backdropBlur: {
        'glass': '16px',
      }
    },
  },
  plugins: [],
}