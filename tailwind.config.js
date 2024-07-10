/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/**/*.{html,js,handlebars}"],
  theme: {
    extend:{
    colors: {
        'azulclaro': '#ADD8E6',
        'cinza': '#808080',
        primary: '#ADD8E6',
        secondary: {
          100: '#808080',
          200: '#D9D9D9'
        }
    },
  },
  }, 

  plugins: [],
}