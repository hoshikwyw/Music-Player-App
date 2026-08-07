import { Link } from "react-router-dom";

const MoodCard = ({ mood, suggested = false }) => (
  <Link
    to={`/mood/${mood.slug}`}
    className="glass-2 glass-interactive rounded-glass relative block p-4 sm:p-5 h-[104px] sm:h-[120px] overflow-hidden"
  >
    {/* Colour wash. Sits under the content, low enough that the label keeps
        its contrast against the glass rather than the gradient. */}
    <div
      className="absolute inset-0 opacity-[0.28] pointer-events-none"
      style={{
        background: `linear-gradient(135deg, ${mood.from} 0%, ${mood.to} 100%)`,
      }}
    />
    <div
      className="absolute -right-6 -bottom-8 w-28 h-28 rounded-full pointer-events-none"
      style={{ background: mood.to, filter: "blur(32px)", opacity: 0.45 }}
    />

    <div className="relative flex flex-col h-full">
      {suggested && (
        <span className="glass-badge self-start text-[9px] !py-0 mb-1.5 tracking-widest font-mono">
          FOR NOW
        </span>
      )}
      <h3 className="text-base sm:text-lg font-bold text-text-primary tracking-tight mt-auto">
        {mood.name}
      </h3>
      <p className="text-[11px] text-text-secondary mt-0.5">{mood.line}</p>
    </div>
  </Link>
);

export default MoodCard;
