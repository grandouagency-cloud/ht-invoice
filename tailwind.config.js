/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: '#8248DE',
        'brand-light': '#A98CD8',
        'dark-bg': '#09090B',
        'dark-card': '#121216',
        'dark-2': '#1A1821',
        'dark-border': '#2C2932',
        'dark-muted': '#8A8691',
      },
      fontFamily: {
        display: ['"Orbitron"', 'sans-serif'],
        body: ['"Space Grotesk"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
