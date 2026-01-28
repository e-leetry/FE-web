import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./providers.tsx"
  ],
  theme: {
    extend: {
      keyframes: {
        "toast-slide-in": {
          "0%": { opacity: "0", transform: "translateX(-50%) translateY(-100%)" },
          "100%": { opacity: "1", transform: "translateX(-50%) translateY(0)" }
        },
        "toast-slide-out": {
          "0%": { opacity: "1", transform: "translateX(-50%) translateY(0)" },
          "100%": { opacity: "0", transform: "translateX(-50%) translateY(-100%)" }
        }
      },
      animation: {
        "toast-slide-in": "toast-slide-in 0.3s ease-out forwards",
        "toast-slide-out": "toast-slide-out 0.3s ease-in forwards"
      }
    }
  },
  plugins: []
};

export default config;
