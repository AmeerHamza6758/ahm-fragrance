/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/Components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "rgb(var(--color-primary) / <alpha-value>)",
        "primary-foreground": "rgb(var(--color-primary-foreground) / <alpha-value>)",
        secondary: "rgb(var(--color-secondary) / <alpha-value>)",
        "secondary-foreground":
          "rgb(var(--color-secondary-foreground) / <alpha-value>)",
        muted: "rgb(var(--color-muted) / <alpha-value>)",
        "muted-foreground": "rgb(var(--color-muted-foreground) / <alpha-value>)",
        accent: "rgb(var(--color-accent) / <alpha-value>)",
        "accent-foreground": "rgb(var(--color-accent-foreground) / <alpha-value>)",
        background: "rgb(var(--color-background) / <alpha-value>)",
        surface: "rgb(var(--color-surface) / <alpha-value>)",
        foreground: "rgb(var(--color-foreground) / <alpha-value>)",
        border: "rgb(var(--color-border) / <alpha-value>)",
        brand: {
          700: "rgb(var(--color-brand-700) / <alpha-value>)",
          650: "rgb(var(--color-brand-650) / <alpha-value>)",
          500: "rgb(var(--color-brand-500) / <alpha-value>)",
          300: "rgb(var(--color-brand-300) / <alpha-value>)",
          200: "rgb(var(--color-brand-200) / <alpha-value>)",
          150: "rgb(var(--color-brand-150) / <alpha-value>)",
          100: "rgb(var(--color-brand-100) / <alpha-value>)",
        },
        text: {
          strong: "rgb(var(--color-text-strong) / <alpha-value>)",
          body: "rgb(var(--color-text-body) / <alpha-value>)",
          soft: "rgb(var(--color-text-soft) / <alpha-value>)",
          subtle: "rgb(var(--color-text-subtle) / <alpha-value>)",
          muted: "rgb(var(--color-text-muted) / <alpha-value>)",
        },
        canvas: "rgb(var(--color-bg-canvas) / <alpha-value>)",
        "bg-alt": "rgb(var(--color-bg-alt) / <alpha-value>)",
        ivory: "rgb(var(--color-bg-ivory) / <alpha-value>)",
        "ivory-2": "rgb(var(--color-bg-ivory-2) / <alpha-value>)",
        "pink-soft": "rgb(var(--color-pink-soft) / <alpha-value>)",
        "text-warm": "rgb(var(--color-text-warm) / <alpha-value>)",
        "text-dim": "rgb(var(--color-text-dim) / <alpha-value>)",
        error: "rgb(var(--color-error) / <alpha-value>)",
        "error-soft": "rgb(var(--color-error-soft) / <alpha-value>)",
        "error-border": "rgb(var(--color-error-border) / <alpha-value>)",
        danger: "rgb(var(--color-danger) / <alpha-value>)",
      },
      fontFamily: {
        manrope: ["var(--font-manrope)", "Manrope", "Arial", "sans-serif"],
        noto: ["var(--font-noto-serif)", '"Noto Serif"', "Georgia", "serif"],
        sans: ["var(--font-manrope)", "Manrope", "Arial", "sans-serif"],
        serif: ["var(--font-noto-serif)", '"Noto Serif"', "Georgia", "serif"],
      },
      spacing: {
        header: "84px",
      },
      backgroundImage: {
        "gradient-warm": "linear-gradient(135deg, #d4a574 0%, #8b6f47 100%)",
      },
      borderRadius: {
        "2xl": "20px",
      },
    },
  },
  plugins: [],
};

export default config;
