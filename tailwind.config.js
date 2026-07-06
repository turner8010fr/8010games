/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#060816',
        card: '#11182d',
        accent: '#7c3aed',
        neon: '#22d3ee'
      }
    }
  },
  plugins: []
};
