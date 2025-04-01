const colors = require("tailwindcss/colors");

export default {
  content: ["./index.html", "./src//*.{js,ts,jsx,tsx}"], // 👈 Add this to scan files
  theme: {
    extend: {
      colors: {
        primarycolor: "#795ded",
        primaryblack: "#251F47",
        primarygraylight: "#999999",
      },
      fontFamily: {
        sans: ["Urbanist", "sans-serif"],
      },
    },
  },
  plugins: [],
};