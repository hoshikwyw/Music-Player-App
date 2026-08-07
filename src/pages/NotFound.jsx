import { Link } from "react-router-dom";
import { BsMusicNoteBeamed } from "react-icons/bs";

const NotFound = () => (
  <div className="flex flex-col justify-center items-center w-full h-[60vh] gap-4">
    <div
      className="w-16 h-16 flex items-center justify-center rounded-glass"
      style={{
        background: "var(--glass-tint-strong)",
        border: "1px solid var(--glass-border)",
        boxShadow: "inset 0 1px 0 0 var(--glass-highlight)",
      }}
    >
      <BsMusicNoteBeamed className="text-primary text-2xl" />
    </div>
    <div className="text-center">
      <h2 className="font-bold text-3xl text-text-primary tracking-tight">404</h2>
      <p className="text-xs text-text-muted mt-1">
        That track isn&apos;t in the crate.
      </p>
    </div>
    <Link to="/" className="glass-btn glass-btn-accent">
      Back to Discover
    </Link>
  </div>
);

export default NotFound;
