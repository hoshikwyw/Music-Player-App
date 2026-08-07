import { Link } from "react-router-dom";
import PlayPause from "./PlayPause";

const SongBar = ({
  song,
  i,
  artistId,
  isPlaying,
  activeSong,
  handlePauseBtn,
  handlePlayBtn,
}) => (
  <div
    className={`w-full flex items-center gap-2 sm:gap-3 p-2 sm:p-2.5 rounded-lg sm:rounded-[10px] cursor-pointer transition-all duration-150 mb-0.5 ${
      activeSong?.title === song?.title
        ? "bg-primary/8"
        : "hover:bg-background-secondary"
    }`}
  >
    <span className="text-[10px] sm:text-[11px] font-bold text-text-muted font-retro-mono w-4 sm:w-5 text-center flex-shrink-0">
      {String(i + 1).padStart(2, "0")}
    </span>
    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg overflow-hidden flex-shrink-0">
      <img
        className="w-full h-full object-cover"
        src={
          artistId
            ? song?.attributes?.artwork?.url
                .replace("{w}", "125")
                .replace("{h}", "125")
            : song?.images?.coverart
        }
        alt={song?.title}
      />
    </div>
    <div className="flex-1 min-w-0">
      {!artistId ? (
        <Link to={`/songs/${song.key}`}>
          <p className="text-[13px] sm:text-sm font-semibold text-text-primary truncate hover:text-primary transition-colors">
            {song?.title}
          </p>
        </Link>
      ) : (
        <p className="text-[13px] sm:text-sm font-semibold text-text-primary truncate">
          {song?.attributes?.name}
        </p>
      )}
      <p className="text-[10px] sm:text-xs text-text-muted mt-0.5 truncate">
        {artistId ? song?.attributes?.albumName : song?.subtitle}
      </p>
    </div>
    {!artistId && (
      <div className="flex-shrink-0 scale-[0.6] sm:scale-[0.7]">
        <PlayPause
          isPlaying={isPlaying}
          activeSong={activeSong}
          song={song}
          handlePause={handlePauseBtn}
          handlePlay={() => handlePlayBtn(song, i)}
        />
      </div>
    )}
  </div>
);

export default SongBar;
