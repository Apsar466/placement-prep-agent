/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'void': '#050816',
        'glass': 'rgba(255, 255, 255, 0.08)',
        'glass-border': 'rgba(255, 255, 255, 0.12)',
        'accent-blue': '#3B82F6',
        'accent-purple': '#7C3AED',
        'accent-cyan': '#06B6D4',
        'accent-green': '#10B981',
        'accent-orange': '#F59E0B',
        'accent-red': '#EF4444',
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