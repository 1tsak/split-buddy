/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  important:"#root",
  theme: {
    extend: {
      colors:{
        "main":"#7EEF",
        "secondary":"#9CF5BA",
        "tertiary":"#d968ef",
        "card-color":"#F0F4FF"
      }
    },
  },
  plugins: [],
};
