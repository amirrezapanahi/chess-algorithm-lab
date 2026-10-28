/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}', './exercises/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ink: '#131612',
        cream: '#f4f1e8',
        lime: '#c7f65b',
        moss: '#253129',
        amber: '#f6b94b',
      },
      fontFamily: {
        sans: ['Inter', 'Vazirmatn', 'ui-sans-serif', 'system-ui'],
        mono: ['JetBrains Mono', 'SFMono-Regular', 'Consolas', 'monospace'],
      },
      boxShadow: {
        panel: '0 18px 60px rgba(10, 20, 12, .12)',
      },
    },
  },
  plugins: [],
}
