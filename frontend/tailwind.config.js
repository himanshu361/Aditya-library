/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        midnight: '#07131f',
        glass: 'rgba(255,255,255,0.12)',
        accent: '#7dd3fc',
        violet: '#a78bfa',
        mint: '#34d399',
      },
      boxShadow: {
        glow: '0 0 30px rgba(125,211,252,0.35)',
      },
      backgroundImage: {
        mesh: 'radial-gradient(circle at top left, rgba(125,211,252,0.25), transparent 30%), radial-gradient(circle at bottom right, rgba(167,139,250,0.25), transparent 35%)',
      },
    },
  },
  plugins: [],
}
