import type { Config } from "tailwindcss";

/**
 * Nexa Design System — Tailwind v4 ile birlikte kullanılır.
 * Ana tema tanımları src/app/globals.css içindeki @theme bloğundadır.
 */
const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        nexa: {
          black: "#000000",
          anthracite: "#0F172A",
          "anthracite-light": "#1E293B",
          electric: "#1D4ED8",
          "electric-bright": "#2563EB",
          neon: "#3B82F6",
          "neon-glow": "rgba(59, 130, 246, 0.35)",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-poppins)", "var(--font-inter)", "sans-serif"],
      },
      backgroundImage: {
        "nexa-gradient":
          "linear-gradient(135deg, #000000 0%, #0F172A 50%, #000000 100%)",
        "nexa-glow":
          "radial-gradient(ellipse at top, rgba(37, 99, 235, 0.15) 0%, transparent 60%)",
      },
      boxShadow: {
        neon: "0 0 20px rgba(37, 99, 235, 0.4), 0 0 40px rgba(37, 99, 235, 0.15)",
        "neon-sm": "0 0 10px rgba(37, 99, 235, 0.25)",
        card: "0 4px 24px rgba(0, 0, 0, 0.5)",
      },
      borderRadius: {
        nexa: "0.75rem",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "slide-up": "slideUp 0.6s ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
