import { MdSkipNext, MdSkipPrevious } from "react-icons/md";
import {
  BsArrowRepeat,
  BsFillPauseFill,
  BsFillPlayFill,
  BsShuffle,
} from "react-icons/bs";

const ControlBtns = ({
  isPlaying,
  repeat,
  setRepeat,
  shuffle,
  setShuffle,
  currentSongs,
  handlePlayPause,
  handlePrev,
  handleNext,
}) => {
  return (
    <div className="flex items-center gap-1.5 sm:gap-2">
      <button
        onClick={() => setRepeat((prev) => !prev)}
        className={`hidden sm:flex w-7 h-7 items-center justify-center rounded-full transition-colors ${
          repeat ? "text-primary" : "text-text-muted hover:text-text-primary"
        }`}
      >
        <BsArrowRepeat size={13} />
      </button>

      {currentSongs?.length && (
        <button
          onClick={handlePrev}
          className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full border-2 border-border text-text-primary hover:bg-background-secondary transition-colors"
        >
          <MdSkipPrevious size={16} className="sm:hidden" />
          <MdSkipPrevious size={18} className="hidden sm:block" />
        </button>
      )}

      <button
        onClick={handlePlayPause}
        className="w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center bg-primary border-2 border-border rounded-full shadow-retro-sm hover:bg-primary-light active:shadow-none active:translate-x-px active:translate-y-px transition-all"
      >
        {isPlaying ? (
          <BsFillPauseFill className="text-white text-sm sm:text-lg" />
        ) : (
          <BsFillPlayFill className="text-white text-sm sm:text-lg ml-0.5" />
        )}
      </button>

      {currentSongs?.length && (
        <button
          onClick={handleNext}
          className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full border-2 border-border text-text-primary hover:bg-background-secondary transition-colors"
        >
          <MdSkipNext size={16} className="sm:hidden" />
          <MdSkipNext size={18} className="hidden sm:block" />
        </button>
      )}

      <button
        onClick={() => setShuffle((prev) => !prev)}
        className={`hidden sm:flex w-7 h-7 items-center justify-center rounded-full transition-colors ${
          shuffle ? "text-primary" : "text-text-muted hover:text-text-primary"
        }`}
      >
        <BsShuffle size={12} />
      </button>
    </div>
  );
};

export default ControlBtns;
