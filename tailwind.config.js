/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: 'var(--bg-main)',
        panel: 'var(--bg-panel)',
        border: 'var(--border-color)',
        muted: 'var(--text-muted)',
        main: 'var(--text-main)',
        hover: 'var(--bg-hover)',
        accent: 'var(--accent)',
      },
    },
  },
  plugins: [],
};
