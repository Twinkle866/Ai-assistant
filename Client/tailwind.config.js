/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class", // dark mode enabled
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#E6CCFF", // use bg-primary / text-primary
      },
      fontFamily: {
        outfit: ["Outfit", "sans-serif"], // use font-outfit
      },
    },
  },
  plugins: [],
}
