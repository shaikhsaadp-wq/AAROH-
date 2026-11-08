/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        aaroh: {
          primary: '#6366f1',
          secondary: '#0ea5e9',
          dark: '#0f0f1a',
          surface: '#1a1a2e',
          card: '#16213e',
          border: '#2a2a4a',
          text: '#e2e8f0',
          muted: '#94a3b8',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
}

