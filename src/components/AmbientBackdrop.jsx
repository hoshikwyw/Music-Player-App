import { useDominantColors } from "../hooks/useDominantColors";
import { useActiveSong } from "../redux/services/playerSelectors";

// Glass has nothing to refract without this. A flat background under a blur
// just renders as grey, so the backdrop is a pair of slowly drifting colour
// fields -- tinted by the current cover art when one is playing, and by the
// vibe's own accent pair otherwise.
//
// Sits at z-index -1 behind everything, fixed to the viewport so it does not
// scroll and does not repaint on scroll.
const AmbientBackdrop = () => {
  const activeSong = useActiveSong();
  const artColors = useDominantColors(activeSong?.coverUrl);

  const [colorA, colorB] = artColors ?? [
    "var(--ambient-a)",
    "var(--ambient-b)",
  ];

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
      style={{ background: "var(--ambient-base)" }}
    >
      <div
        className="ambient-blob animate-drift-a"
        style={{
          top: "-18%",
          left: "-12%",
          width: "62vw",
          height: "62vw",
          background: colorA,
          opacity: 0.4,
          // Cross-fades when the track changes.
          transition: "background 1.2s ease",
        }}
      />
      <div
        className="ambient-blob animate-drift-b"
        style={{
          bottom: "-22%",
          right: "-14%",
          width: "58vw",
          height: "58vw",
          background: colorB,
          opacity: 0.32,
          transition: "background 1.2s ease",
        }}
      />
      {/* Darkening wash. Without it, bright cover art pushes the backdrop light
          enough that text on glass loses contrast. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 80% at 50% 0%, transparent 0%, var(--ambient-base) 85%)",
          opacity: 0.72,
        }}
      />
    </div>
  );
};

export default AmbientBackdrop;
