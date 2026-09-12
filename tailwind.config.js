// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#E60000", // rojo corporativo
        secondary: "#FFFFFF", // blanco
        accent: "#FF4D4D" // rojo claro para hover, etc.
      }
    }
  },
  plugins: []
};
