/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#E8F4FD",
          100: "#D0E9FB",
          200: "#A1D3F7",
          500: "#4A90E2",
          600: "#3A7BC8",
          700: "#2B5A94",
          900: "#1A3A5C",
        },
        secondary: {
          100: "#FFE5D0",
          300: "#FFD1A1",
          500: "#FF9F66",
          700: "#E67A3D",
        },
        neutral: {
          50: "#F8FAFC",
          100: "#F1F5F9",
          200: "#E2E8F0",
          300: "#CBD5E1",
          500: "#64748B",
          700: "#334155",
          900: "#0F172A",
        },
        success: "#10B981",
        danger: "#EF4444",
        warning: "#F59E0B",
      },
      fontFamily: {
        primary: ["Onest", "Helvetica Neue", "Arial", "sans-serif"],
        secondary: ["JetBrains Mono", "Courier New", "monospace"],
      },
      spacing: {
        18: "4.5rem",
        88: "22rem",
        128: "32rem",
      },
    },
  },
  plugins: [],
};
