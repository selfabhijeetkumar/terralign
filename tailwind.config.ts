import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        space: {
          bg: "#050811",
          surface: "#0A192F",
          elevated: "#112240",
          border: "rgba(139, 156, 181, 0.15)",
          focus: "#00D4AA",
        },
        accent: {
          terrestrial: "#00D4AA",
          lunar: "#1E90FF",
          martian: "#FF6B35",
        },
        status: {
          success: "#00D4AA",
          warning: "#FFB800",
          danger: "#FF4757",
          exact: "#38BDF8",
        },
        text: {
          primary: "#F8FAFC",
          secondary: "#CBD5E1",
          muted: "#8B9CB5",
          disabled: "#475569",
        },
      },
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        sans: ["Inter", "sans-serif"],
        mono: ["Space Mono", "monospace"],
      },
      borderRadius: {
        card: "8px",
      },
      boxShadow: {
        glow: "0 0 16px rgba(0, 212, 170, 0.2)",
        "glow-lunar": "0 0 16px rgba(30, 144, 255, 0.2)",
        "glow-martian": "0 0 16px rgba(255, 107, 53, 0.2)",
        "glow-sm": "0 0 8px rgba(0, 212, 170, 0.25)",
        "depth": "0 4px 24px rgba(5, 8, 17, 0.6), 0 1px 4px rgba(5, 8, 17, 0.4)",
        "card": "0 2px 12px rgba(5, 8, 17, 0.5)",
      },
      animation: {
        "spin-slow": "spin 12s linear infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};

export default config;

