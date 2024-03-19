/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#2BB19C",
        darkPrimary: "#0f9f70",
        lightPrimary: "#E5F5F3",
        lightGray: "#D7DBDA",
        mediumGray: "#798683",
        darkGray: "#242827",
        danger: "#CB1010",
        lightDanger: "#FFF1F0",
        success: "#0FCD5E",
        lightSuccess: "#DFF6E8",
        warning: "#F9C74F",
        lightWarning: "#F9F2E2",
      },
    },
  },
  plugins: [],
};
