const Loader = ({ label = "Loading" }) => (
  <div className="w-full h-[60vh] flex flex-col gap-4 justify-center items-center">
    <div className="relative w-14 h-14">
      {/* Faint full ring, with a bright arc spinning over it */}
      <div
        className="absolute inset-0 rounded-full border-2"
        style={{ borderColor: "var(--glass-border)" }}
      />
      <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary animate-spin" />
      <div
        className="absolute inset-3 rounded-full animate-pulse"
        style={{
          background: "var(--color-primary)",
          opacity: 0.15,
          filter: "blur(8px)",
        }}
      />
    </div>
    <p className="text-[10px] font-bold text-text-muted font-mono tracking-[0.25em] animate-pulse">
      {label.toUpperCase()}
    </p>
  </div>
);

export default Loader;
