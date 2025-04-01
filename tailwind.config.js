const colors = require("tailwindcss/colors");

export default {
  theme: {
    extend: {
      colors: {
        primarycolor: "#795ded", // Custom primary color
        primaryblack: "#251F47", // Custom text color
        primarygraylight: "#999999", // Custom gray text color
      },
      fontFamily: {
        sans: ["Urbanist", "sans-serif"], // Set Urbanist as the default sans font
      },
    },
  },
};
