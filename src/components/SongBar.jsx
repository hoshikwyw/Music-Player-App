import { Link } from "react-router-dom";
import PlayPause from "./PlayPause";

// showAlbum swaps the subtitle from artist to album, for lists that are already
// scoped to one artist.
const SongBar = ({
  song,
  i,
  isPlaying,
  activeSong,
  handlePauseBtn,
  handlePlayBtn,
  showAlbum = false,
}) => (
  <div
    className={`w-full flex items-center gap-2 sm:gap-3 p-2 sm:p-2.5 rounded-lg sm:rounded-[10px] cursor-pointer transition-all duration-150 mb-0.5 ${
      activeSong?.id === song.id ? "bg-primary/8" : "hover:bg-background-secondary"
    }`}
  >
    <span className="text-[10px] sm:text-[11px] font-bold text-text-muted font-retro-mono w-4 sm:w-5 text-center flex-shrink-0">
      {String(i + 1).padStart(2, "0")}
    </span>
    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg overflow-hidden flex-shrink-0">
      <img
        className="w-full h-full object-cover"
        src={song.coverUrl}
        alt={song.title}
        loading="lazy"
      />
    </div>
    <div className="flex-1 min-w-0">
      <Link to={`/songs/${song.id}`}>
        <p className="text-[13px] sm:text-sm font-semibold text-text-primary truncate hover:text-primary transition-colors">
          {song.title}
        </p>
      </Link>
      <p className="text-[10px] sm:text-xs text-text-muted mt-0.5 truncate">
        {showAlbum ? song.albumTitle : song.artistName}
      </p>
    </div>
    <div className="flex-shrink-0 scale-[0.6] sm:scale-[0.7]">
      <PlayPause
        isPlaying={isPlaying}
        activeSong={activeSong}
        song={song}
        handlePause={handlePauseBtn}
        handlePlay={() => handlePlayBtn(song, i)}
      />
    </div>
  </div>
);

export default SongBar;
