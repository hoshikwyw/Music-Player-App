import { Link } from "react-router-dom";
import PlayPause from "./PlayPause";

const TopPlayCard = ({
  song,
  i,
  isPlaying,
  activeSong,
  handlePauseBtn,
  handlePlayBtn,
}) => {
  return (
    <div
      className={`w-full flex items-center gap-2 sm:gap-2.5 py-1.5 sm:py-2 px-1.5 sm:px-2 rounded-lg sm:rounded-[10px] cursor-pointer transition-all duration-150 ${
        activeSong?.title === song?.title
          ? "bg-primary/8"
          : "hover:bg-background-secondary"
      }`}
    >
      <span className="text-[10px] sm:text-[11px] font-bold text-text-muted font-retro-mono w-4 sm:w-5 text-center flex-shrink-0">
        {String(i + 1).padStart(2, "0")}
      </span>
      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg overflow-hidden flex-shrink-0">
        <img
          className="w-full h-full object-cover"
          src={song?.images?.coverart}
          alt={song?.title}
        />
      </div>
      <div className="flex-1 min-w-0">
        <Link to={`/songs/${song.key}`}>
          <p className="text-[12px] sm:text-[13px] font-semibold text-text-primary truncate hover:text-primary transition-colors">
            {song?.title}
          </p>
        </Link>
        <Link to={`/artists/${song?.artists[0].adamid}`}>
          <p className="text-[10px] sm:text-[11px] text-text-muted truncate hover:text-primary transition-colors">
            {song?.subtitle}
          </p>
        </Link>
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
};

export default TopPlayCard;
