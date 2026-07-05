/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'void': '#030208',
        'glass': 'rgba(16, 12, 32, 0.55)',
        'glass-border': 'rgba(157, 78, 221, 0.22)',
        'accent-blue': '#00d2ff',
        'accent-purple': '#9d4edd',
        'accent-cyan': '#00f2fe',
        'accent-green': '#00f5d4',
        'accent-orange': '#ff9f1c',
        'accent-red': '#ff007f',
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