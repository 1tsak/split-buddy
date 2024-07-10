/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors:{
        "main":"#687EEF",
        "secondary":"#9CF5BA",
        "tertiary":"#d968ef"
      }
    },
  },
  plugins: [],
};
