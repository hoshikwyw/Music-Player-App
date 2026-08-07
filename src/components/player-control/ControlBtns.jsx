import { MdSkipNext, MdSkipPrevious } from "react-icons/md";
import {
  BsArrowRepeat,
  BsFillPauseFill,
  BsFillPlayFill,
  BsShuffle,
} from "react-icons/bs";

const toggleClass = (on) =>
  `hidden sm:flex w-7 h-7 items-center justify-center rounded-full transition-colors ${
    on ? "text-primary" : "text-text-muted hover:text-text-primary"
  }`;

const skipClass =
  "w-8 h-8 flex items-center justify-center rounded-full text-text-secondary hover:text-text-primary hover:bg-glass transition-colors";

const ControlBtns = ({
  isPlaying,
  repeat,
  shuffle,
  hasQueue,
  onToggleRepeat,
  onToggleShuffle,
  onPlayPause,
  onNext,
  onPrev,
}) => (
  <div className="flex items-center gap-1.5 sm:gap-2">
    <button
      onClick={onToggleRepeat}
      aria-label={repeat ? "Disable repeat" : "Repeat this track"}
      aria-pressed={repeat}
      className={toggleClass(repeat)}
    >
      <BsArrowRepeat size={13} />
    </button>

    {hasQueue && (
      <button onClick={onPrev} aria-label="Previous track" className={skipClass}>
        <MdSkipPrevious size={18} />
      </button>
    )}

    {/* The one solid surface in the dock, so the primary action reads first. */}
    <button
      onClick={onPlayPause}
      aria-label={isPlaying ? "Pause" : "Play"}
      className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-primary text-on-accent shadow-glass-glow hover:bg-primary-light active:scale-95 transition-all"
    >
      {isPlaying ? (
        <BsFillPauseFill className="text-base sm:text-lg" />
      ) : (
        <BsFillPlayFill className="text-base sm:text-lg ml-0.5" />
      )}
    </button>

    {hasQueue && (
      <button onClick={onNext} aria-label="Next track" className={skipClass}>
        <MdSkipNext size={18} />
      </button>
    )}

    <button
      onClick={onToggleShuffle}
      aria-label={shuffle ? "Disable shuffle" : "Shuffle queue"}
      aria-pressed={shuffle}
      className={toggleClass(shuffle)}
    >
      <BsShuffle size={12} />
    </button>
  </div>
);

export default ControlBtns;
