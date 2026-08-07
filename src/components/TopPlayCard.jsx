import { Link } from "react-router-dom";
import PlayPause from "./PlayPause";

const TopPlayCard = ({
  song,
  i,
  isPlaying,
  activeSong,
  handlePauseBtn,
  handlePlayBtn,
}) => (
  <div
    className={`w-full flex items-center gap-2 sm:gap-2.5 py-1.5 sm:py-2 px-1.5 sm:px-2 rounded-lg sm:rounded-[10px] cursor-pointer transition-all duration-150 ${
      activeSong?.id === song.id ? "bg-primary/8" : "hover:bg-background-secondary"
    }`}
  >
    <span className="text-[10px] sm:text-[11px] font-bold text-text-muted font-retro-mono w-4 sm:w-5 text-center flex-shrink-0">
      {String(i + 1).padStart(2, "0")}
    </span>
    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg overflow-hidden flex-shrink-0">
      <img
        className="w-full h-full object-cover"
        src={song.coverUrl}
        alt={song.title}
        loading="lazy"
      />
    </div>
    <div className="flex-1 min-w-0">
      <Link to={`/songs/${song.id}`}>
        <p className="text-[12px] sm:text-[13px] font-semibold text-text-primary truncate hover:text-primary transition-colors">
          {song.title}
        </p>
      </Link>
      {song.artistId ? (
        <Link to={`/artists/${song.artistId}`}>
          <p className="text-[10px] sm:text-[11px] text-text-muted truncate hover:text-primary transition-colors">
            {song.artistName}
          </p>
        </Link>
      ) : (
        <p className="text-[10px] sm:text-[11px] text-text-muted truncate">
          {song.artistName}
        </p>
      )}
    </div>
    <div className="flex-shrink-0 scale-[0.55] sm:scale-[0.65]">
      <PlayPause
        isPlaying={isPlaying}
        activeSong={activeSong}
        song={song}
        handlePause={handlePauseBtn}
        handlePlay={handlePlayBtn}
      />
    </div>
  </div>
);

export default TopPlayCard;
