/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          red: '#E31E24',
          redHover: '#C61A1F',
          dark: '#1F2937',
          light: '#F3F4F6',
          cream: '#FFF8F1', // Matching the warm tone in the screenshot
        }
      },
      fontFamily: {
        sans: ['"Hind Siliguri"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}