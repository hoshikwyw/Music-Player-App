const VARIANTS = {
  glass: "glass-btn",
  accent: "glass-btn glass-btn-accent",
  ghost:
    "inline-flex items-center justify-center gap-2 rounded-full text-text-muted hover:text-text-primary cursor-pointer",
};

const SIZES = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-5 py-2.5 text-base",
  // Square icon buttons
  icon: "w-9 h-9 p-0",
  "icon-lg": "w-12 h-12 p-0",
};

/**
 * Icon-only buttons must be given an aria-label -- they carry no text for a
 * screen reader to announce.
 */
const GlassButton = ({
  variant = "glass",
  size = "md",
  className = "",
  children,
  ...props
}) => (
  <button
    type="button"
    className={[VARIANTS[variant] ?? VARIANTS.glass, SIZES[size] ?? SIZES.md, className]
      .filter(Boolean)
      .join(" ")}
    {...props}
  >
    {children}
  </button>
);

export default GlassButton;
