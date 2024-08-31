/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      screens: {
        xs: "480px",
      },
    },
  },
  darkMode: "selector",
  // darkMode: "class", // or 'media' for system preference-based dark mode
  plugins: [require("tailwind-scrollbar")],
};
