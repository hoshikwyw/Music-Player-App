import { useNavigate } from 'react-router-dom'
import { BsMusicNoteBeamed } from 'react-icons/bs'

const Track = ({ isPlaying, isActive, activeSong }) => {
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate('/now-playing')}
      className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1 sm:flex-none sm:w-[200px] lg:w-[260px] cursor-pointer group"
    >
      {/* Mini CD disc */}
      <div className="relative w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0">
        <div
          className={`w-full h-full rounded-full border-2 border-border overflow-hidden bg-background-secondary ${
            isPlaying && isActive ? "animate-spin-slow" : ""
          }`}
        >
          {activeSong?.coverUrl ? (
            <img
              src={activeSong.coverUrl}
              alt="cover"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <BsMusicNoteBeamed className="text-text-muted text-sm" />
            </div>
          )}
          {/* Groove ring */}
          <div className="absolute inset-[30%] rounded-full border border-black/10 pointer-events-none" />
          {/* Center hole */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-card border-[2px] border-border">
              <div className="w-full h-full rounded-full flex items-center justify-center">
                <div className="w-1 h-1 rounded-full bg-border" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[12px] sm:text-[13px] font-bold text-text-primary truncate group-hover:text-primary transition-colors">
          {activeSong?.title || "No playing song"}
        </p>
        <p className="text-[10px] sm:text-[11px] text-text-muted truncate mt-0.5">
          {activeSong?.artistName || "Unknown artist"}
        </p>
      </div>
    </div>
  );
};

export default Track
