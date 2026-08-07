import { useNavigate } from "react-router-dom";
import { BsMusicNoteBeamed } from "react-icons/bs";

const Track = ({ isPlaying, isActive, activeSong }) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/now-playing")}
      aria-label="Open now playing"
      className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1 sm:flex-none sm:w-[190px] lg:w-[250px] text-left group"
    >
      {/* Mini disc */}
      <div className="relative w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0">
        <div
          className={`w-full h-full rounded-full overflow-hidden ${
            isPlaying && isActive ? "animate-spin-slow" : ""
          }`}
          style={{
            border: "1px solid var(--glass-border)",
            boxShadow:
              "inset 0 1px 0 0 var(--glass-highlight), 0 4px 14px -4px var(--glass-shadow)",
          }}
        >
          {activeSong?.coverUrl ? (
            <img
              src={activeSong.coverUrl}
              alt=""
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-glass flex items-center justify-center">
              <BsMusicNoteBeamed className="text-text-muted text-sm" />
            </div>
          )}
        </div>

        {/* Groove ring + spindle */}
        <div className="absolute inset-[32%] rounded-full border border-black/25 pointer-events-none" />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div
            className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full flex items-center justify-center"
            style={{ background: "var(--ambient-base)" }}
          >
            <div className="w-1 h-1 rounded-full bg-primary" />
          </div>
        </div>
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-[12px] sm:text-[13px] font-bold text-text-primary truncate group-hover:text-primary transition-colors">
          {activeSong?.title || "Nothing playing"}
        </p>
        <p className="text-[10px] sm:text-[11px] text-text-muted truncate mt-0.5">
          {activeSong?.artistName || "Pick something"}
        </p>
      </div>
    </button>
  );
};

export default Track;
