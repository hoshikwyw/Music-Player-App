import { BsMusicNoteBeamed } from "react-icons/bs";

/**
 * The spinning record.
 *
 * Two details that make it convincing:
 *  - The animation class is always applied and paused via animationPlayState,
 *    so pausing freezes the disc where it is instead of snapping back to 0deg.
 *  - The spindle sits outside the rotating element, because a real spindle
 *    does not turn with the record.
 */
const VinylDisc = ({ coverUrl, title, isPlaying }) => (
  <div className="relative w-[min(76vw,340px)] aspect-square">
    {/* Accent bloom. Brightens while playing, giving the page a slow pulse. */}
    <div
      className="absolute -inset-8 rounded-full bg-primary pointer-events-none transition-opacity duration-700"
      style={{ filter: "blur(60px)", opacity: isPlaying ? 0.3 : 0.12 }}
    />

    <div
      className="relative w-full h-full rounded-full overflow-hidden animate-[spin_16s_linear_infinite]"
      style={{
        animationPlayState: isPlaying ? "running" : "paused",
        border: "1px solid var(--glass-border)",
        boxShadow:
          "0 28px 70px -20px var(--glass-shadow), inset 0 1px 0 0 var(--glass-highlight)",
      }}
    >
      {coverUrl ? (
        <img src={coverUrl} alt={title} className="w-full h-full object-cover" />
      ) : (
        <div
          className="w-full h-full flex items-center justify-center"
          style={{ background: "var(--glass-tint-strong)" }}
        >
          <BsMusicNoteBeamed className="text-text-muted text-5xl" />
        </div>
      )}

      {/* Grooves */}
      <div className="absolute inset-0 rounded-full pointer-events-none">
        <div className="absolute inset-[8%] rounded-full border border-black/20" />
        <div className="absolute inset-[18%] rounded-full border border-black/15" />
        <div className="absolute inset-[28%] rounded-full border border-black/10" />
        <div className="absolute inset-[38%] rounded-full border border-white/10" />
      </div>

      {/* Sheen sweep, so the surface catches light as it turns */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background:
            "linear-gradient(115deg, transparent 38%, rgba(255,255,255,0.16) 50%, transparent 62%)",
        }}
      />

      {/* Darken toward the middle so the label area reads */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at center, rgba(0,0,0,0.55) 0%, transparent 34%)",
        }}
      />
    </div>

    {/* Spindle -- outside the rotating element */}
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div
        className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center"
        style={{
          background: "var(--ambient-base)",
          border: "1px solid var(--glass-border)",
          boxShadow: "inset 0 1px 0 0 var(--glass-highlight)",
        }}
      >
        <div
          className="w-2.5 h-2.5 rounded-full bg-primary"
          style={{
            boxShadow: "0 0 12px color-mix(in srgb, var(--color-primary) 80%, transparent)",
          }}
        />
      </div>
    </div>
  </div>
);

export default VinylDisc;
