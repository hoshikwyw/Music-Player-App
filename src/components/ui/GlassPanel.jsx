const ELEVATIONS = {
  1: "glass-1",
  2: "glass-2",
  3: "glass-3",
  flat: "glass-flat",
};

const RADII = {
  sm: "rounded-glass-sm",
  md: "rounded-glass",
  lg: "rounded-glass-lg",
  xl: "rounded-glass-xl",
  full: "rounded-full",
};

/**
 * A pane of glass.
 *
 * elevation 1  subtle chrome (top bars, nav)
 * elevation 2  cards, the default
 * elevation 3  modals and the player -- closest to the viewer
 * elevation "flat"  list rows: translucent but not blurred, because a
 *                   backdrop-filter per row destroys scroll performance
 *
 * Do not nest a blurred panel inside another blurred panel. Use `flat` for
 * anything sitting inside a card.
 */
const GlassPanel = ({
  as: Tag = "div",
  elevation = 2,
  radius = "md",
  interactive = false,
  className = "",
  children,
  ...props
}) => (
  <Tag
    className={[
      ELEVATIONS[elevation] ?? ELEVATIONS[2],
      RADII[radius] ?? RADII.md,
      interactive ? "glass-interactive cursor-pointer" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ")}
    {...props}
  >
    {children}
  </Tag>
);

export default GlassPanel;
