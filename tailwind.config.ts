import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        destructive: "hsl(var(--destructive))",
        success: "hsl(var(--success))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
      },
      keyframes: {
        "open-from-l": {
          from: { transform: "translateX(-100%)" },
          to: { transform: "translateX(0rem)" },
        },
        "open-from-r": {
          from: { transform: "translateX(100%)" },
          to: { transform: "translateX(0rem)" },
        },
        "open-pop": {
          from: { scale: "0" },
          to: { scale: "1" },
        },
        "open-opacity": {
          from: { opacity: "0" },
          to: { opacity: "0.5" },
        },
      },
      animation: {
        "open-from-r": "open-from-r 0.2s linear",
        "open-from-l": "open-from-l 0.2s linear",
        "open-pop": "open-pop 0.2s ease-out",
        "open-opacity": "open-opacity 0.2s ease-out",
      },
    },
  },
  plugins: [],
};
export default config;
