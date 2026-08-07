import {
  BsFillVolumeUpFill,
  BsVolumeDownFill,
  BsFillVolumeMuteFill,
} from "react-icons/bs";

const Volumebar = ({ value, isMuted, onChange, onToggleMute }) => {
  const effective = isMuted ? 0 : value;
  const progress = effective * 100;

  return (
    <div className="hidden lg:flex items-center gap-1.5 w-[140px] justify-end">
      <button
        onClick={onToggleMute}
        aria-label={isMuted ? "Unmute" : "Mute"}
        className="w-7 h-7 flex items-center justify-center rounded-full text-text-muted hover:text-primary transition-colors"
      >
        {effective > 0.5 && <BsFillVolumeUpFill size={15} />}
        {effective > 0 && effective <= 0.5 && <BsVolumeDownFill size={15} />}
        {effective === 0 && <BsFillVolumeMuteFill size={15} />}
      </button>
      <div className="flex-1 relative h-5 flex items-center group cursor-pointer">
        <div className="w-full h-1 rounded-full bg-background-tertiary overflow-hidden">
          <div
            className="h-full bg-primary rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
        <input
          type="range"
          step="any"
          value={effective}
          min={0}
          max={1}
          onChange={(event) => onChange(event.target.value)}
          aria-label="Volume"
          className="absolute inset-0 w-full opacity-0 cursor-pointer"
        />
        <div
          className="absolute w-2.5 h-2.5 bg-primary border-2 border-border rounded-full pointer-events-none -translate-x-1/2 opacity-0 group-hover:opacity-100"
          style={{ left: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default Volumebar;
