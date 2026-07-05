/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'void': '#F8FAFC',
        'glass': 'rgba(255, 255, 255, 0.85)',
        'glass-border': 'rgba(16, 185, 129, 0.15)',
        'accent-blue': '#10B981',
        'accent-purple': '#059669',
        'accent-cyan': '#34D399',
        'accent-green': '#047857',
        'accent-orange': '#D97706',
        'accent-red': '#DC2626',
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