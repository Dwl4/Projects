/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
        'noto': ['Noto Sans KR', 'sans-serif'],
      },
      colors: {
        'lawmate-blue': '#9ec3e5',
        'lawmate-dark-blue': '#95b1d4',
        'lawmate-navy': '#08213b',
        'lawmate-teal': '#03345a',
        'lawmate-gray': '#7b7b7b',
        'lawmate-dark-gray': '#454545',
        'lawmate-medium-gray': '#4b4b4b',
      },
      spacing: {
        '1600': '1600px',
      },
      minHeight: {
        '1000': '1000px',
      }
    },
  },
  plugins: [],
}