/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#2BB19C",
        "dark-primary": "#078C89",
        "light-primary": "#E5F5F3",
        "dark-gray": "#242827",
        "light-gray": "#D7DBDA",
        "medium-gray": "#798683",
        danger: "#CB1010",
        "light-danger": "#FFB8B3",
        success: "#0FCD5E",
        "light-success": "#DFF6E8",
        "dark-success": "#042713",
        warning: "#F9C74F",
        "light-warning": "#EAE4D7",
      },
    },
  },
  plugins: [],
};
