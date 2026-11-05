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
          black: "#020617", // slate-950 deep navy base
          darker: "#00030a",
          anthracite: "#0a0f1d",
          "anthracite-light": "#0f172a",
          electric: "#06b6d4", // Elektrik Mavisi (Cyan)
          "electric-bright": "#22d3ee",
          "electric-glow": "rgba(6, 182, 212, 0.4)",
          blue: "#3b82f6",
          neon: "#10b981", // Nexa ERP inşaat aksanı
          "neon-bright": "#34d399",
          "neon-glow": "rgba(16, 185, 129, 0.4)",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-poppins)", "var(--font-inter)", "sans-serif"],
      },
      backgroundImage: {
        "nexa-gradient":
          "linear-gradient(135deg, #09090b 0%, #0f172a 50%, #09090b 100%)",
        "nexa-glow":
          "radial-gradient(ellipse at top, rgba(37, 99, 235, 0.15) 0%, transparent 60%)",
        "cyber-grid":
          "linear-gradient(to right, rgba(255, 255, 255, 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.04) 1px, transparent 1px)",
      },
      boxShadow: {
        neon: "0 0 25px rgba(37, 99, 235, 0.45), 0 0 50px rgba(37, 99, 235, 0.15)",
        "neon-green": "0 0 25px rgba(16, 185, 129, 0.5), 0 0 50px rgba(16, 185, 129, 0.2)",
        "neon-sm": "0 0 12px rgba(37, 99, 235, 0.35)",
        "neon-green-sm": "0 0 12px rgba(16, 185, 129, 0.4)",
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.45)",
        card: "0 4px 24px rgba(0, 0, 0, 0.6)",
      },
      borderRadius: {
        nexa: "0.75rem",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "slide-up": "slideUp 0.6s ease-out forwards",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
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
