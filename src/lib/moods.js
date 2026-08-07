// Moods, not genres.
//
// A genre taxonomy ("Hip-Hop / Reggae / K-Pop") is a catalogue metaphor: it
// asks what a track *is*. A mood asks what you want it *for*, which is the
// only question a personal listening app needs to answer.
//
// Moods are defined here rather than in the database so this works against the
// existing data with no migration and no re-tagging. Each one maps to a set of
// category slugs. If you later add a real `mood` column to `songs`, only
// useMoodSongs has to change -- nothing else reads `categories` directly.

export const moods = [
  {
    slug: "chill",
    name: "Chill",
    line: "Settle in",
    categories: ["SOUL_RNB", "RNB", "INDIE", "ALTERNATIVE"],
    from: "#7C9CFF",
    to: "#B388FF",
  },
  {
    slug: "focus",
    name: "Focus",
    line: "Nothing in the way",
    categories: ["CLASSICAL", "JAZZ", "ELECTRONIC"],
    from: "#4EE7B0",
    to: "#38BDF8",
  },
  {
    slug: "night-drive",
    name: "Night Drive",
    line: "Windows down",
    categories: ["ELECTRONIC", "HOUSE", "DANCE", "POP"],
    from: "#C084FC",
    to: "#F472B6",
  },
  {
    slug: "rainy",
    name: "Rainy",
    line: "Grey afternoon",
    categories: ["JAZZ", "SOUL_RNB", "CLASSICAL", "INDIE"],
    from: "#60A5FA",
    to: "#94A3B8",
  },
  {
    slug: "lift",
    name: "Lift",
    line: "Pick the room up",
    categories: ["HIP_HOP_RAP", "ROCK", "K_POP", "DANCE", "METAL"],
    from: "#FF9F45",
    to: "#FF6B5E",
  },
  {
    slug: "sleep",
    name: "Sleep",
    line: "Wind all the way down",
    categories: ["CLASSICAL", "JAZZ"],
    from: "#818CF8",
    to: "#4C1D95",
  },
  {
    // Escape hatch. Without this, a track whose category is unset would be
    // unreachable from anywhere but search.
    slug: "everything",
    name: "Everything",
    line: "The whole shelf",
    categories: null,
    from: "#94A3B8",
    to: "#64748B",
  },
];

export function getMood(slug) {
  return moods.find((mood) => mood.slug === slug) ?? null;
}

/**
 * What the app opens on, by the clock. A chill app that suggests Lift at 2am
 * is not paying attention.
 */
export function moodForHour(hour) {
  if (hour >= 5 && hour < 11) return "chill";
  if (hour >= 11 && hour < 17) return "focus";
  if (hour >= 17 && hour < 22) return "night-drive";
  return "sleep";
}

export function greetingForHour(hour) {
  if (hour >= 5 && hour < 12) return "Good morning";
  if (hour >= 12 && hour < 17) return "Good afternoon";
  if (hour >= 17 && hour < 22) return "Good evening";
  return "Still up";
}
