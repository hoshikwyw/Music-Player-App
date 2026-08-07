import { useEffect, useState } from "react";
import Track from "../components/player-control/Track";
import ControlBtns from "../components/player-control/ControlBtns";
import Seekbar from "../components/player-control/Seekbar";
import PlayBtn from "../components/player-control/PlayBtn";
import Volumebar from "../components/player-control/Volumebar";
import { useDispatch, useSelector } from "react-redux";
import { nextSong, playPause, prevSong } from "../redux/services/PlayerSlice";

const MusicPlayer = () => {
  const { activeSong, currentSongs, currentIndex, isPlaying, isActive } =
    useSelector((state) => state.player);
  const [playTime, setPlayTime] = useState(0);
  const [seekTime, setSeekTime] = useState(0);
  const [appTime, setAppTime] = useState(0);
  const [volume, setVolume] = useState(0.3);
  const [repeat, setRepeat] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const dispatch = useDispatch();

  // Auto-play on track change only. Adding currentSongs.length would restart
  // playback whenever the queue is refetched.
  // TODO: remove once playback moves into a single shared audio engine.
  useEffect(() => {
    if (currentSongs.length) dispatch(playPause(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex]);

  const handlePlayPause = () => {
    if (!isActive) return;
    dispatch(playPause(!isPlaying));
  };

  const handleNext = () => {
    dispatch(playPause(false));
    if (!shuffle) {
      dispatch(nextSong((currentIndex + 1) % currentSongs.length));
    } else {
      dispatch(nextSong(Math.floor(Math.random() * currentSongs.length)));
    }
  };

  const handlePrev = () => {
    if (currentIndex === 0) {
      dispatch(prevSong(currentSongs.length - 1));
    } else if (shuffle) {
      dispatch(prevSong(Math.floor(Math.random() * currentSongs.length)));
    } else {
      dispatch(prevSong(currentIndex - 1));
    }
  };

  return (
    <div className="relative px-3 sm:px-4 md:px-6 w-full flex items-center justify-between gap-2 sm:gap-4">
      {/* Track info */}
      <Track
        isPlaying={isPlaying}
        isActive={isActive}
        activeSong={activeSong}
      />

      {/* Center: controls + seekbar */}
      <div className="flex items-center gap-2 sm:flex-1 sm:flex-col sm:items-center sm:justify-center sm:gap-0.5">
        <ControlBtns
          isPlaying={isPlaying}
          isActive={isActive}
          repeat={repeat}
          setRepeat={setRepeat}
          shuffle={shuffle}
          setShuffle={setShuffle}
          currentSongs={currentSongs}
          handlePlayPause={handlePlayPause}
          handleNext={handleNext}
          handlePrev={handlePrev}
        />
        <div className="hidden sm:flex w-full justify-center">
          <Seekbar
            value={appTime}
            min="0"
            max={playTime}
            onInput={(event) => setSeekTime(event.target.value)}
          />
        </div>
        <PlayBtn
          activeSong={activeSong}
          volume={volume}
          isPlaying={isPlaying}
          seekTime={seekTime}
          repeat={repeat}
          currentIndex={currentIndex}
          onEnded={handleNext}
          onTimeUpdate={(event) => setAppTime(event.target.currentTime)}
          onLoadedData={(event) => setPlayTime(event.target.duration || 0)}
        />
      </div>

      {/* Volume (desktop only) */}
      <Volumebar
        value={volume}
        min="0"
        max="1"
        onChange={(event) => setVolume(event.target.value)}
        setVolume={setVolume}
      />
    </div>
  );
};

export default MusicPlayer;
