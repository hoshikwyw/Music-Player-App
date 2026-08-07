import PlayPause from "./PlayPause";
import LikeButton from "./LikeButton";
import { Link } from "react-router-dom";
import { usePlayerControls } from "../hooks/usePlayerControls";

// showLike puts an unlike control on the card. Only the Liked page needs it --
// mounting it on every card everywhere would clutter the grid.
const SongCard = ({ song, i, isPlaying, activeSong, data, showLike = false }) => {
  const controls = usePlayerControls();
  const isCurrent = activeSong?.id === song.id;

  const handlePause = () => controls.pause();
  const handlePlay = () => controls.playSong(song, data, i);

  return (
    <div className="animate-slideup">
      <div className="glass-2 glass-interactive rounded-glass p-2 sm:p-2.5 group">
        <div className="relative w-full aspect-square overflow-hidden rounded-lg sm:rounded-[10px]">
          <img
            src={song.coverUrl}
            alt={song.title}
            loading="lazy"
            className="w-full h-full object-cover"
          />
          <div
            className={`absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity duration-200 ${
              isCurrent ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            }`}
          >
            <PlayPause
              song={song}
              isPlaying={isPlaying}
              activeSong={activeSong}
              handlePause={handlePause}
              handlePlay={handlePlay}
            />
          </div>
        </div>
        <div className="mt-1.5 sm:mt-2 px-0.5 flex items-end gap-1">
          <div className="min-w-0 flex-1">
            <p className="text-[12px] sm:text-[13px] font-bold text-text-primary truncate">
              <Link to={`/songs/${song.id}`} className="hover:text-primary transition-colors">
                {song.title}
              </Link>
            </p>
            <p className="mt-0.5 text-[10px] sm:text-[11px] text-text-muted truncate">
              {song.artistId ? (
                <Link
                  to={`/artists/${song.artistId}`}
                  className="hover:text-primary transition-colors"
                >
                  {song.artistName}
                </Link>
              ) : (
                song.artistName
              )}
            </p>
          </div>
          {showLike && (
            <LikeButton songId={song.id} size={13} className="!w-7 !h-7 flex-shrink-0" />
          )}
        </div>
      </div>
    </div>
  );
};

export default SongCard;
