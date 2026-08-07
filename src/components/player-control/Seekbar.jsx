import { formatTime } from "../../lib/formatTime";
import GlassSlider from "../ui/GlassSlider";

const Seekbar = ({ value, max, onSeek }) => (
  <div className="flex items-center gap-2 w-full max-w-lg">
    <span className="text-[9px] sm:text-[10px] text-text-muted font-mono w-7 text-right tabular-nums">
      {formatTime(value)}
    </span>
    <GlassSlider
      value={value}
      max={max}
      onChange={onSeek}
      label="Seek"
      className="flex-1"
    />
    <span className="text-[9px] sm:text-[10px] text-text-muted font-mono w-7 tabular-nums">
      {formatTime(max)}
    </span>
  </div>
);

export default Seekbar;
