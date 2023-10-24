/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.{html,js}"],
  theme: {
    extend: {
      fontFamily: {
        abril: ["Abril Fatface", "serif"],
        gabarito: ["Gabarito", "sans-serif"],
      }
    },
  },
  plugins: [],
}

