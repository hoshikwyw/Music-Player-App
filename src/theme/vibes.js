// Vibes are dark by design.
//
// Glass only reads as glass when there is depth behind it: a light surface
// under a blur just turns grey, and the specular edge that sells "liquid"
// disappears. Every vibe is a near-black base with a saturated accent pair
// that the ambient backdrop paints with.
//
// Each vibe defines three groups:
//   --color-*    semantic tokens consumed by Tailwind (see tailwind.config.js)
//   --glass-*    the glass recipe: tint, border, specular highlight, shadow
//   --ambient-*  blob colours for the animated backdrop

function buildVibe({ name, base, surface, raised, accent, accentAlt, accentText, tintHue }) {
  return {
    name,
    colors: {
      // --- Semantic tokens ---
      "--color-primary": accent,
      "--color-primary-light": accentAlt,
      "--color-primary-dark": accent,
      "--color-secondary": surface,
      "--color-secondary-light": raised,
      "--color-secondary-dark": base,
      "--color-accent": accent,
      "--color-accent-hover": accentAlt,

      "--color-background": base,
      "--color-background-secondary": surface,
      "--color-background-tertiary": raised,

      "--color-text-primary": "#F3F5FA",
      "--color-text-secondary": "rgba(243, 245, 250, 0.72)",
      "--color-text-muted": "rgba(243, 245, 250, 0.45)",

      // Cards are glass, so "card" is a translucent tint rather than a solid.
      "--color-card": `rgba(${tintHue}, 0.06)`,
      "--color-card-hover": `rgba(${tintHue}, 0.10)`,
      "--color-surface": `rgba(${tintHue}, 0.05)`,
      "--color-border": `rgba(${tintHue}, 0.14)`,
      "--color-border-accent": accent,

      "--color-danger": "#FF6B6B",
      "--color-success": "#4EE7B0",
      "--color-on-accent": accentText,

      // --- Glass recipe ---
      "--glass-tint": `rgba(${tintHue}, 0.06)`,
      "--glass-tint-strong": `rgba(${tintHue}, 0.11)`,
      "--glass-border": `rgba(${tintHue}, 0.14)`,
      // The inner top edge. Without it glass reads as a flat frosted div.
      "--glass-highlight": `rgba(${tintHue}, 0.28)`,
      "--glass-lowlight": "rgba(0, 0, 0, 0.25)",
      "--glass-shadow": "rgba(0, 0, 0, 0.55)",
      // Opaque stand-in for prefers-reduced-transparency and browsers with no
      // backdrop-filter support.
      "--glass-solid": surface,

      // --- Ambient backdrop ---
      "--ambient-base": base,
      "--ambient-a": accent,
      "--ambient-b": accentAlt,
    },
  };
}

export const vibes = {
  midnight: buildVibe({
    name: "Midnight",
    base: "#07090F",
    surface: "#111624",
    raised: "#1A2133",
    accent: "#7C9CFF",
    accentAlt: "#B388FF",
    accentText: "#080B14",
    tintHue: "216, 226, 255",
  }),

  ember: buildVibe({
    name: "Ember",
    base: "#0D0806",
    surface: "#1C1310",
    raised: "#291D17",
    accent: "#FF9F45",
    accentAlt: "#FF6B5E",
    accentText: "#160B04",
    tintHue: "255, 232, 214",
  }),

  aurora: buildVibe({
    name: "Aurora",
    base: "#04100D",
    surface: "#0D1D1A",
    raised: "#152B26",
    accent: "#4EE7B0",
    accentAlt: "#38BDF8",
    accentText: "#04140F",
    tintHue: "214, 255, 244",
  }),

  velvet: buildVibe({
    name: "Velvet",
    base: "#0A0610",
    surface: "#160F20",
    raised: "#21172F",
    accent: "#C084FC",
    accentAlt: "#F472B6",
    accentText: "#12071B",
    tintHue: "240, 224, 255",
  }),
};

export const DEFAULT_VIBE = "midnight";
