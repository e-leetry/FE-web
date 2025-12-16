import type { Config } from "tailwindcss";

import { colorTokens } from "./lib/tokens/colors";

const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}", "./providers.tsx"],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: colorTokens.brand.primary,
          "primary-hover": colorTokens.brand.primaryHover,
          "primary-foreground": colorTokens.brand.primaryForeground,
          "primary-focus": colorTokens.brand.primaryFocus
        },
        surface: {
          base: colorTokens.surface.base,
          card: colorTokens.surface.card,
          accent: colorTokens.surface.accent,
          foreground: colorTokens.surface.foreground,
          muted: colorTokens.surface.muted,
          border: colorTokens.surface.border
        },
        link: {
          base: colorTokens.link.base,
          hover: colorTokens.link.hover
        },
        danger: {
          base: colorTokens.danger.base,
          hover: colorTokens.danger.hover,
          foreground: colorTokens.danger.foreground,
          focus: colorTokens.danger.focus
        }
      }
    }
  },
  plugins: []
};

export default config;
