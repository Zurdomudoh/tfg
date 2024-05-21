/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        arsenal: ['Arsenal', 'sans-serif'],
        mountains: ['Mountains of Christmas', 'cursive'],
      },
    },
  },
  plugins: [
    require('flowbite/plugin')
  ],
}