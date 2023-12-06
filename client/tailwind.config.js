/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
      "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
      extend: {
          colors: {
              quoteColor: "#111213"
          },
          fontFamily: {
              // "crisis": ['Climate Crisis', 'Bebas Neue', 'Montserrat', "cursive"],
              "crisis": ["Montez variant0"],
              "monteserat": ['Montserrat', "sans-serif"],
          }
      },
  },
  plugins: [],
}