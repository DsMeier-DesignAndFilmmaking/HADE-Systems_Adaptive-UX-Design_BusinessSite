import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}", "./lib/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0b0d12",
        surface: "#f6f7f9",
        line: "#d8dce3",
        accent: "#316BFF",
        accentSoft: "#E7EEFF",
        // Deep Field brand tokens
        obsidian: "#080b11",
        slateGlass: "#1c2236",
        cyberLime: "#F59E0B",
        electricBlue: "#316BFF"
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "Menlo", "monospace"]
      },
      boxShadow: {
        panel: "0 18px 40px rgba(11, 13, 18, 0.08)",
        soft: "0 10px 24px rgba(11, 13, 18, 0.05)",
        glow: "0 0 24px rgba(245, 158, 11, 0.22)",
        glowBlue: "0 0 24px rgba(49, 107, 255, 0.22)"
      },
      maxWidth: {
        proseWide: "72rem"
      }
    }
  },
  plugins: []
};

export default config;
