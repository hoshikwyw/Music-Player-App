import { useSelector } from "react-redux";
import Track from "../components/player-control/Track";
import ControlBtns from "../components/player-control/ControlBtns";
import Seekbar from "../components/player-control/Seekbar";
import Volumebar from "../components/player-control/Volumebar";
import { usePlayerControls } from "../hooks/usePlayerControls";

// The docked mini player. Pure presentation -- AudioEngine owns playback.
const MusicPlayer = () => {
  const { activeSong, currentSongs, isPlaying, isActive, repeat, shuffle, volume, isMuted, progress, duration } =
    useSelector((state) => state.player);
  const controls = usePlayerControls();

  return (
    <div className="relative px-3 sm:px-4 md:px-6 w-full flex items-center justify-between gap-2 sm:gap-4">
      <Track isPlaying={isPlaying} isActive={isActive} activeSong={activeSong} />

      <div className="flex items-center gap-2 sm:flex-1 sm:flex-col sm:items-center sm:justify-center sm:gap-0.5">
        <ControlBtns
          isPlaying={isPlaying}
          repeat={repeat}
          shuffle={shuffle}
          hasQueue={currentSongs.length > 0}
          onToggleRepeat={controls.toggleRepeat}
          onToggleShuffle={controls.toggleShuffle}
          onPlayPause={controls.toggle}
          onNext={controls.next}
          onPrev={controls.prev}
        />
        <div className="hidden sm:flex w-full justify-center">
          <Seekbar value={progress} max={duration} onSeek={controls.seek} />
        </div>
      </div>

      <Volumebar
        value={volume}
        isMuted={isMuted}
        onChange={controls.setVolume}
        onToggleMute={controls.toggleMute}
      />
    </div>
  );
};

export default MusicPlayer;
