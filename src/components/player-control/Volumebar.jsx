import {
  BsFillVolumeUpFill,
  BsVolumeDownFill,
  BsFillVolumeMuteFill,
} from "react-icons/bs";

const Volumebar = ({ value, min, max, onChange, setVolume }) => {
  const progress = value * 100;

  return (
    <div className="hidden lg:flex items-center gap-1.5 w-[140px] justify-end">
      <button
        onClick={() => setVolume(value === 0 ? 0.5 : 0)}
        className="w-7 h-7 flex items-center justify-center rounded-full text-text-muted hover:text-primary transition-colors"
      >
        {value <= 1 && value > 0.5 && <BsFillVolumeUpFill size={15} />}
        {value <= 0.5 && value > 0 && <BsVolumeDownFill size={15} />}
        {value === 0 && <BsFillVolumeMuteFill size={15} />}
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
          value={value}
          min={min}
          max={max}
          onChange={onChange}
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
