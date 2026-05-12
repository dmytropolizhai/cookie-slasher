/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        neon: { pink: '#FF0080', cyan: '#00FFFF', yellow: '#FFE600', purple: '#9B00FF', green: '#00FF88' },
        arcade: { bg: '#0A0010', panel: '#120020', border: '#2A004A' },
      },
    },
  },
  plugins: [],
};


