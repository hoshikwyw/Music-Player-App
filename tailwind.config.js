/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "var(--color-primary)",
          light: "var(--color-primary-light)",
          dark: "var(--color-primary-dark)",
        },
        secondary: {
          DEFAULT: "var(--color-secondary)",
          light: "var(--color-secondary-light)",
          dark: "var(--color-secondary-dark)",
        },
        accent: {
          DEFAULT: "var(--color-accent)",
          hover: "var(--color-accent-hover)",
        },
        background: {
          DEFAULT: "var(--color-background)",
          secondary: "var(--color-background-secondary)",
          tertiary: "var(--color-background-tertiary)",
        },
        text: {
          primary: "var(--color-text-primary)",
          secondary: "var(--color-text-secondary)",
          muted: "var(--color-text-muted)",
        },
        card: {
          DEFAULT: "var(--color-card)",
          hover: "var(--color-card-hover)",
        },
        border: {
          DEFAULT: "var(--color-border)",
          accent: "var(--color-border-accent)",
        },
        glass: {
          DEFAULT: "var(--glass-tint)",
          strong: "var(--glass-tint-strong)",
          border: "var(--glass-border)",
          highlight: "var(--glass-highlight)",
        },
        danger: "var(--color-danger)",
        success: "var(--color-success)",
        surface: "var(--color-surface)",
        "on-accent": "var(--color-on-accent)",
      },
      borderRadius: {
        // Large, continuous radii read as glass; tight corners read as cards.
        glass: "20px",
        "glass-sm": "14px",
        "glass-lg": "28px",
        "glass-xl": "36px",
        // Aliases kept while pages migrate off the retro classes.
        retro: "20px",
        "retro-sm": "14px",
        "retro-lg": "28px",
        "retro-xl": "36px",
      },
      boxShadow: {
        glass: "0 8px 32px -12px var(--glass-shadow)",
        "glass-lg": "0 16px 48px -12px var(--glass-shadow)",
        "glass-glow":
          "0 6px 24px -6px color-mix(in srgb, var(--color-primary) 60%, transparent)",
        // The retro shadows were hard offsets in the border colour. On a dark
        // background that reads as a smudge, so they are soft lifts now.
        retro: "0 8px 32px -12px var(--glass-shadow)",
        "retro-sm": "0 4px 16px -8px var(--glass-shadow)",
        "retro-lg": "0 16px 48px -12px var(--glass-shadow)",
        "retro-accent":
          "0 6px 24px -6px color-mix(in srgb, var(--color-primary) 60%, transparent)",
        "retro-inset": "inset 0 1px 0 0 var(--glass-highlight)",
      },
      backdropBlur: {
        glass: "20px",
        "glass-sm": "12px",
        "glass-lg": "40px",
      },
      fontFamily: {
        sans: ['"Space Grotesk"', "system-ui", "sans-serif"],
        mono: ['"Space Mono"', "monospace"],
        // Aliases kept while pages migrate.
        retro: ['"Space Grotesk"', "system-ui", "sans-serif"],
        "retro-mono": ['"Space Mono"', "monospace"],
      },
      animation: {
        slideup: "slideup 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
        slideright: "slideright 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
        "fade-in": "fade-in 0.4s ease-out",
        "pulse-slow": "pulse 3s ease-in-out infinite",
        "spin-slow": "spin 4s linear infinite",
        "drift-a": "ambient-drift-a 28s ease-in-out infinite",
        "drift-b": "ambient-drift-b 34s ease-in-out infinite",
      },
      keyframes: {
        slideup: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideright: {
          "0%": { opacity: "0", transform: "translateX(-16px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
