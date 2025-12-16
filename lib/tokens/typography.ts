const typographyTokens = {
  fonts: {
    sans: "var(--font-sans, 'Pretendard Variable', 'Inter', 'Noto Sans KR', system-ui, sans-serif)",
    mono: "var(--font-mono, 'JetBrains Mono', 'Fira Code', ui-monospace, SFMono-Regular, Menlo, monospace)"
  },
  weights: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700
  },
  sizes: {
    xs: {
      fontSize: "0.75rem",
      lineHeight: "1.125rem",
      letterSpacing: "-0.01em"
    },
    sm: {
      fontSize: "0.875rem",
      lineHeight: "1.25rem",
      letterSpacing: "-0.008em"
    },
    md: {
      fontSize: "1rem",
      lineHeight: "1.5rem",
      letterSpacing: "-0.005em"
    },
    lg: {
      fontSize: "1.125rem",
      lineHeight: "1.75rem",
      letterSpacing: "-0.01em"
    },
    xl: {
      fontSize: "1.5rem",
      lineHeight: "2rem",
      letterSpacing: "-0.02em"
    },
    "2xl": {
      fontSize: "1.875rem",
      lineHeight: "2.25rem",
      letterSpacing: "-0.025em"
    },
    "3xl": {
      fontSize: "2.25rem",
      lineHeight: "2.5rem",
      letterSpacing: "-0.03em"
    }
  },
  tones: {
    default: {
      color: "#0F172A",
      hoverColor: "#020617"
    },
    muted: {
      color: "#334155",
      hoverColor: "#1E293B"
    },
    subtle: {
      color: "#64748B",
      hoverColor: "#475569"
    },
    accent: {
      color: "#1D4ED8",
      hoverColor: "#1E3A8A"
    },
    success: {
      color: "#15803D",
      hoverColor: "#166534"
    },
    warning: {
      color: "#B45309",
      hoverColor: "#92400E"
    },
    danger: {
      color: "#B91C1C",
      hoverColor: "#991B1B"
    },
    info: {
      color: "#0F766E",
      hoverColor: "#115E59"
    },
    inverted: {
      color: "#F8FAFC",
      hoverColor: "#E2E8F0"
    }
  },
  variants: {
    display: {
      font: "sans",
      weight: "bold",
      size: "3xl",
      lineHeight: "1.1",
      letterSpacing: "-0.04em",
      tone: "default",
      transform: undefined
    },
    headline: {
      font: "sans",
      weight: "bold",
      size: "2xl",
      lineHeight: "1.2",
      letterSpacing: "-0.03em",
      tone: "default",
      transform: undefined
    },
    title: {
      font: "sans",
      weight: "semibold",
      size: "xl",
      tone: "default",
      transform: undefined
    },
    subtitle: {
      font: "sans",
      weight: "medium",
      size: "lg",
      tone: "muted",
      transform: undefined
    },
    body: {
      font: "sans",
      weight: "regular",
      size: "md",
      tone: "default",
      transform: undefined
    },
    bodySmall: {
      font: "sans",
      weight: "regular",
      size: "sm",
      tone: "subtle",
      transform: undefined
    },
    caption: {
      font: "sans",
      weight: "medium",
      size: "xs",
      letterSpacing: "0.08em",
      transform: "uppercase",
      tone: "subtle"
    },
    mono: {
      font: "mono",
      weight: "medium",
      size: "sm",
      tone: "accent",
      transform: undefined
    },
    overline: {
      font: "sans",
      weight: "semibold",
      size: "xs",
      letterSpacing: "0.1em",
      transform: "uppercase",
      tone: "muted"
    }
  }
} as const;

export type TypographyTokens = typeof typographyTokens;
export type TypographyVariant = keyof TypographyTokens["variants"];
export type TypographyTone = keyof TypographyTokens["tones"];
export type TypographyFont = keyof TypographyTokens["fonts"];
export type TypographySize = keyof TypographyTokens["sizes"];
export type TypographyWeight = keyof TypographyTokens["weights"];

export { typographyTokens };
