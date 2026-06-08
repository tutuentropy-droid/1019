/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
    },
    extend: {
      colors: {
        cosmos: {
          950: "#050810",
          900: "#0A0E1A",
          800: "#121826",
          700: "#1A2238",
          600: "#2A2F45",
        },
        nebula: {
          DEFAULT: "#5B3FD9",
          light: "#7C66E8",
          dark: "#3E28B0",
        },
        chronos: {
          DEFAULT: "#00D4AA",
          light: "#33E0BE",
          dark: "#00A885",
        },
        ember: {
          DEFAULT: "#E8A838",
          light: "#F0C06A",
          dark: "#C28920",
        },
        mist: {
          50: "rgba(255,255,255,0.02)",
          100: "rgba(255,255,255,0.05)",
          200: "rgba(255,255,255,0.08)",
          300: "rgba(255,255,255,0.15)",
          400: "rgba(255,255,255,0.35)",
          500: "rgba(255,255,255,0.55)",
          600: "rgba(255,255,255,0.75)",
          700: "rgba(255,255,255,0.85)",
          800: "rgba(255,255,255,0.92)",
        },
      },
      fontFamily: {
        serif: ['"Noto Serif SC"', "Georgia", "serif"],
        sans: ['"Noto Sans SC"', "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "fade-in-up": "fadeInUp 0.8s ease-out forwards",
        "fade-in-down": "fadeInDown 0.8s ease-out forwards",
        "pulse-glow": "pulseGlow 3s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
        "shimmer": "shimmer 2.5s linear infinite",
        "spin-slow": "spin 20s linear infinite",
        "orbit": "orbit 12s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeInDown: {
          "0%": { opacity: "0", transform: "translateY(-30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(91,63,217,0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(91,63,217,0.6)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-15px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
        orbit: {
          "0%": { transform: "rotate(0deg) translateX(100px) rotate(0deg)" },
          "100%": { transform: "rotate(360deg) translateX(100px) rotate(-360deg)" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};
