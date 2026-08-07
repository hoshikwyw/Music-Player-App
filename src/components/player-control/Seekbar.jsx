import { formatTime } from "../../lib/formatTime";

const Seekbar = ({ value, max, onSeek }) => {
  const progress = max > 0 ? (value / max) * 100 : 0;

  return (
    <div className="flex items-center gap-1.5 sm:gap-2 w-full max-w-lg">
      <span className="text-[9px] sm:text-[10px] text-text-muted font-retro-mono w-6 sm:w-8 text-right tabular-nums">
        {formatTime(value)}
      </span>
      <div className="flex-1 relative h-4 sm:h-5 flex items-center group cursor-pointer">
        <div className="w-full h-[3px] sm:h-1 rounded-full bg-background-tertiary overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-[width] duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
        <input
          type="range"
          step="any"
          value={value}
          min={0}
          max={max || 0}
          onChange={(event) => onSeek(event.target.value)}
          aria-label="Seek"
          className="absolute inset-0 w-full opacity-0 cursor-pointer"
        />
        <div
          className="absolute w-2.5 h-2.5 sm:w-3 sm:h-3 bg-primary border-2 border-border rounded-full shadow-sm pointer-events-none transition-[left] duration-100 -translate-x-1/2 sm:opacity-0 sm:group-hover:opacity-100"
          style={{ left: `${progress}%` }}
        />
      </div>
      <span className="text-[9px] sm:text-[10px] text-text-muted font-retro-mono w-6 sm:w-8 tabular-nums">
        {formatTime(max)}
      </span>
    </div>
  );
};

export default Seekbar;
