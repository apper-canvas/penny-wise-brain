/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
colors: {
        primary: {
          50: "#fff1f2",
          100: "#ffe4e6",
          500: "#ec4899",
          600: "#db2777",
          700: "#9f1239",
        },
        secondary: {
          50: "#faf5ff",
          100: "#f3e8ff",
          500: "#a855f7",
          600: "#9333ea",
          700: "#6b21a8",
        },
        accent: {
          50: "#fff5f5",
          100: "#ffe4e1",
          500: "#fb923c",
          600: "#f97316",
          700: "#b91c1c",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};