import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        bg: {
          primary: "#0d0d0f",
          secondary: "#141417",
          tertiary: "#1c1c21",
          card: "#18181d",
        },
        accent: {
          blue: "#4f8ef7",
          violet: "#7c6af5",
          glow: "rgba(79,142,247,0.15)",
        },
        border: {
          subtle: "rgba(255,255,255,0.07)",
          active: "rgba(79,142,247,0.5)",
        },
      },
      boxShadow: {
        glow: "0 0 20px rgba(79,142,247,0.25)",
        "glow-sm": "0 0 10px rgba(79,142,247,0.15)",
        card: "0 4px 24px rgba(0,0,0,0.4)",
        modal: "0 24px 80px rgba(0,0,0,0.7)",
      },
      backdropBlur: {
        xs: "4px",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        pulse_glow: {
          "0%, 100%": { boxShadow: "0 0 6px rgba(79,142,247,0.4)" },
          "50%": { boxShadow: "0 0 18px rgba(79,142,247,0.8)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.3s ease forwards",
        pulse_glow: "pulse_glow 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
