/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
    "./src/pages/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
   theme: {
    extend: {
      colors: {
        primary: '#473391',
        yellow: {
          400: '#FACC15', // already Tailwind default
        }
      }
    }
  },
  plugins: [],
}