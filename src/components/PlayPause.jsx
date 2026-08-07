import { BsFillPauseFill, BsFillPlayFill } from "react-icons/bs";

// Identity, not title. Two songs can share a name; ids cannot collide.
const PlayPause = ({ isPlaying, activeSong, song, handlePause, handlePlay }) => {
  const isCurrent = isPlaying && activeSong?.id === song?.id;

  return (
    <button
      onClick={isCurrent ? handlePause : handlePlay}
      aria-label={isCurrent ? `Pause ${song?.title}` : `Play ${song?.title}`}
      className="w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center bg-primary border-2 border-border rounded-full shadow-retro-sm hover:bg-primary-light transition-colors"
    >
      {isCurrent ? (
        <BsFillPauseFill className="text-on-accent text-sm sm:text-lg" />
      ) : (
        <BsFillPlayFill className="text-on-accent text-sm sm:text-lg ml-0.5" />
      )}
    </button>
  );
};

export default PlayPause;
