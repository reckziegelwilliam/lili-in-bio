import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Neon pastel palette
        neon: {
          teal: "#7FFFD4",
          peach: "#FFDAB9",
          aqua: "#00CED1",
          lilac: "#DDA0DD",
          rose: "#FFB6C1",
          amber: "#FFBF00",
          indigo: "#9370DB",
          magenta: "#FF69B4",
        },
      },
      animation: {
        "blob-drift-1": "blobDrift1 30s ease-in-out infinite",
        "blob-drift-2": "blobDrift2 25s ease-in-out infinite",
        "blob-drift-3": "blobDrift3 35s ease-in-out infinite",
        "blob-drift-4": "blobDrift4 28s ease-in-out infinite",
        "blob-drift-5": "blobDrift5 32s ease-in-out infinite",
        "blob-drift-6": "blobDrift6 27s ease-in-out infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        blobDrift1: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(30px, -30px) scale(1.1)" },
          "66%": { transform: "translate(-20px, 20px) scale(0.9)" },
        },
        blobDrift2: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(-40px, 30px) scale(0.95)" },
          "66%": { transform: "translate(25px, -25px) scale(1.05)" },
        },
        blobDrift3: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(20px, 40px) scale(1.08)" },
          "66%": { transform: "translate(-30px, -20px) scale(0.92)" },
        },
        blobDrift4: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(-25px, -35px) scale(1.02)" },
          "66%": { transform: "translate(35px, 15px) scale(0.98)" },
        },
        blobDrift5: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(15px, -20px) scale(1.06)" },
          "66%": { transform: "translate(-40px, 30px) scale(0.94)" },
        },
        blobDrift6: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(-15px, 25px) scale(0.96)" },
          "66%": { transform: "translate(30px, -30px) scale(1.04)" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};

export default config;

