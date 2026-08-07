import {
  BsFillVolumeUpFill,
  BsVolumeDownFill,
  BsFillVolumeMuteFill,
} from "react-icons/bs";
import GlassSlider from "../ui/GlassSlider";

const Volumebar = ({ value, isMuted, onChange, onToggleMute }) => {
  const effective = isMuted ? 0 : value;

  return (
    <div className="hidden lg:flex items-center gap-2 w-[130px] justify-end">
      <button
        onClick={onToggleMute}
        aria-label={isMuted ? "Unmute" : "Mute"}
        className="w-7 h-7 flex items-center justify-center rounded-full text-text-muted hover:text-primary transition-colors flex-shrink-0"
      >
        {effective > 0.5 && <BsFillVolumeUpFill size={15} />}
        {effective > 0 && effective <= 0.5 && <BsVolumeDownFill size={15} />}
        {effective === 0 && <BsFillVolumeMuteFill size={15} />}
      </button>
      <GlassSlider
        value={effective}
        max={1}
        onChange={onChange}
        label="Volume"
        className="flex-1"
      />
    </div>
  );
};

export default Volumebar;
