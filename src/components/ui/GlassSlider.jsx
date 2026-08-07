const TRACK_HEIGHT = {
  sm: "h-1",
  md: "h-1.5",
};

const THUMB_SIZE = {
  sm: "w-3 h-3",
  md: "w-3.5 h-3.5",
};

/**
 * The seek and volume controls in the dock and on Now Playing were four copies
 * of this markup. A native range input sits invisibly on top for keyboard and
 * pointer handling, while the visible track, fill, and thumb are plain divs --
 * which is the only reliable way to style a range consistently across engines.
 */
const GlassSlider = ({
  value,
  max,
  onChange,
  label,
  size = "sm",
  alwaysShowThumb = false,
  className = "",
}) => {
  const safeMax = max > 0 ? max : 0;
  const percent = safeMax > 0 ? Math.min(100, (value / safeMax) * 100) : 0;

  return (
    <div
      className={`relative flex items-center group cursor-pointer ${
        size === "md" ? "h-6" : "h-5"
      } ${className}`}
    >
      <div
        className={`w-full ${TRACK_HEIGHT[size]} rounded-full overflow-hidden`}
        style={{ background: "var(--glass-tint-strong)" }}
      >
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-100"
          style={{ width: `${percent}%` }}
        />
      </div>

      <input
        type="range"
        step="any"
        min={0}
        max={safeMax}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-label={label}
        className="absolute inset-0 w-full opacity-0 cursor-pointer"
      />

      <div
        className={`absolute ${THUMB_SIZE[size]} rounded-full bg-primary pointer-events-none -translate-x-1/2 transition-[left,opacity] duration-100 ${
          alwaysShowThumb ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        }`}
        style={{
          left: `${percent}%`,
          boxShadow: "0 0 0 4px color-mix(in srgb, var(--color-primary) 22%, transparent)",
        }}
      />
    </div>
  );
};

export default GlassSlider;
