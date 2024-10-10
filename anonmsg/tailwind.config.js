/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        'fade-in': {
          'from': { opacity: '0' },
          'to': { opacity: '1' },
        },
      },
      animation: {
        'fade-in': 'fade-in 1.5s ease-in-out',
      },
      colors: {
        'neutral-dark': '#2a2a2a',
        'neutral-light': '#e5e5e5',
      },
    },
  },
  plugins: [],
}
