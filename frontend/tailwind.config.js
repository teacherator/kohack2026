/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
      dyslexia: ['"Atkinson Hyperlegible"', 'sans-serif'], // recommended accessibility font
      },
    },
  },
  plugins: [],
}
