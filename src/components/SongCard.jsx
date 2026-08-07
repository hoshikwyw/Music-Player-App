import PlayPause from "./PlayPause";
import { Link } from "react-router-dom";
import { usePlayerControls } from "../hooks/usePlayerControls";

const SongCard = ({ song, i, isPlaying, activeSong, data }) => {
  const controls = usePlayerControls();
  const isCurrent = activeSong?.id === song.id;

  const handlePause = () => controls.pause();
  const handlePlay = () => controls.playSong(song, data, i);

  return (
    <div className="animate-slideup">
      <div className="retro-card-interactive p-2 sm:p-2.5 cursor-pointer group">
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
        <div className="mt-1.5 sm:mt-2 px-0.5">
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
      </div>
    </div>
  );
};

export default SongCard;
