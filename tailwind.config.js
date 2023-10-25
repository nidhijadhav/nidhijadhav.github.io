/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.{html,js}"],
  theme: {
    extend: {
      spacing: {
        '25%' : '25%',
        '15%': '15%',
        '10%': '10%',
        '5%': '5%',
        '3%': '3%',
        '2%': '2%',
        '1%': '1%'
      },
      fontFamily: {
        abril: ["Abril Fatface", "serif"],
        gabarito: ["Gabarito", "sans-serif"],
      }
    },
  },
  plugins: [],
}

