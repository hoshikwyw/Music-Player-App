import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import {
  BsFillPauseFill,
  BsFillPlayFill,
  BsShuffle,
  BsArrowRepeat,
  BsChevronDown,
  BsFillVolumeUpFill,
  BsVolumeDownFill,
  BsFillVolumeMuteFill,
} from "react-icons/bs";
import { MdSkipNext, MdSkipPrevious, MdQueueMusic } from "react-icons/md";
import { usePlayerControls } from "../hooks/usePlayerControls";
import { formatTime } from "../lib/formatTime";
import GlassSlider from "../components/ui/GlassSlider";
import VinylDisc from "../components/player-control/VinylDisc";
import QueueSheet from "../components/player-control/QueueSheet";
import LikeButton from "../components/LikeButton";

const NowPlaying = () => {
  const navigate = useNavigate();
  const controls = usePlayerControls();
  const {
    activeSong,
    currentSongs,
    currentIndex,
    isPlaying,
    volume,
    isMuted,
    repeat,
    shuffle,
    progress,
    duration,
  } = useSelector((state) => state.player);

  const [showQueue, setShowQueue] = useState(false);

  useEffect(() => {
    if (!activeSong?.id) navigate("/");
  }, [activeSong, navigate]);

  if (!activeSong?.id) return null;

  const effectiveVolume = isMuted ? 0 : volume;
  const hasQueue = currentSongs.length > 1;

  return (
    <div className="flex flex-col items-center w-full max-w-xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="w-full flex items-center justify-between mb-6 sm:mb-8">
        <button
          onClick={() => navigate(-1)}
          aria-label="Close now playing"
          className="glass-btn w-9 h-9 !p-0"
        >
          <BsChevronDown className="text-text-primary text-sm" />
        </button>

        <p className="text-[10px] font-bold text-text-muted font-mono tracking-[0.3em]">
          NOW PLAYING
        </p>

        <button
          onClick={() => setShowQueue((open) => !open)}
          aria-label="Toggle queue"
          aria-pressed={showQueue}
          className={`glass-btn w-9 h-9 !p-0 ${showQueue ? "!text-primary" : ""}`}
        >
          <MdQueueMusic className="text-base" />
        </button>
      </div>

      <VinylDisc
        coverUrl={activeSong.coverUrl}
        title={activeSong.title}
        isPlaying={isPlaying}
      />

      {/* Track info */}
      <div className="w-full text-center mt-8 sm:mt-10 mb-6 px-4">
        <Link to={`/songs/${activeSong.id}`}>
          <h2 className="text-2xl sm:text-3xl font-bold text-text-primary truncate hover:text-primary transition-colors tracking-tight">
            {activeSong.title}
          </h2>
        </Link>
        {activeSong.artistId ? (
          <Link
            to={`/artists/${activeSong.artistId}`}
            className="text-sm text-text-secondary mt-1.5 inline-block truncate hover:text-primary transition-colors"
          >
            {activeSong.artistName || "Unknown artist"}
          </Link>
        ) : (
          <p className="text-sm text-text-secondary mt-1.5 truncate">
            {activeSong.artistName || "Unknown artist"}
          </p>
        )}
        {activeSong.genre && (
          <div className="mt-3">
            <span className="glass-badge text-[10px] !text-primary tracking-wide">
              {activeSong.genre}
            </span>
          </div>
        )}
      </div>

      {/* Seek */}
      <div className="w-full px-2 mb-5">
        <GlassSlider
          value={progress}
          max={duration}
          onChange={controls.seek}
          label="Seek"
          size="md"
          alwaysShowThumb
        />
        <div className="flex justify-between mt-1.5">
          <span className="text-[10px] text-text-muted font-mono tabular-nums">
            {formatTime(progress)}
          </span>
          <span className="text-[10px] text-text-muted font-mono tabular-nums">
            {formatTime(duration)}
          </span>
        </div>
      </div>

      {/* Transport */}
      <div className="flex items-center gap-4 sm:gap-6 mb-6">
        <button
          onClick={controls.toggleShuffle}
          aria-label={shuffle ? "Disable shuffle" : "Shuffle queue"}
          aria-pressed={shuffle}
          className={`w-9 h-9 flex items-center justify-center rounded-full transition-colors ${
            shuffle ? "text-primary" : "text-text-muted hover:text-text-primary"
          }`}
        >
          <BsShuffle size={16} />
        </button>

        {hasQueue && (
          <button
            onClick={controls.prev}
            aria-label="Previous track"
            className="w-11 h-11 flex items-center justify-center rounded-full text-text-primary hover:bg-glass transition-colors"
          >
            <MdSkipPrevious size={26} />
          </button>
        )}

        {/* The one solid surface on the page */}
        <button
          onClick={controls.toggle}
          aria-label={isPlaying ? "Pause" : "Play"}
          className="w-16 h-16 sm:w-[70px] sm:h-[70px] flex items-center justify-center bg-primary text-on-accent rounded-full shadow-glass-glow hover:bg-primary-light active:scale-95 transition-all"
        >
          {isPlaying ? (
            <BsFillPauseFill className="text-2xl sm:text-3xl" />
          ) : (
            <BsFillPlayFill className="text-2xl sm:text-3xl ml-1" />
          )}
        </button>

        {hasQueue && (
          <button
            onClick={controls.next}
            aria-label="Next track"
            className="w-11 h-11 flex items-center justify-center rounded-full text-text-primary hover:bg-glass transition-colors"
          >
            <MdSkipNext size={26} />
          </button>
        )}

        <button
          onClick={controls.toggleRepeat}
          aria-label={repeat ? "Disable repeat" : "Repeat this track"}
          aria-pressed={repeat}
          className={`w-9 h-9 flex items-center justify-center rounded-full transition-colors ${
            repeat ? "text-primary" : "text-text-muted hover:text-text-primary"
          }`}
        >
          <BsArrowRepeat size={16} />
        </button>
      </div>

      {/* Secondary row: like + volume */}
      <div className="w-full flex items-center gap-3 px-2 mb-6">
        <LikeButton songId={activeSong.id} />

        <div className="flex-1 flex items-center gap-2">
          <button
            onClick={controls.toggleMute}
            aria-label={isMuted ? "Unmute" : "Mute"}
            className="w-7 h-7 flex items-center justify-center rounded-full text-text-muted hover:text-primary transition-colors flex-shrink-0"
          >
            {effectiveVolume > 0.5 && <BsFillVolumeUpFill size={14} />}
            {effectiveVolume > 0 && effectiveVolume <= 0.5 && (
              <BsVolumeDownFill size={14} />
            )}
            {effectiveVolume === 0 && <BsFillVolumeMuteFill size={14} />}
          </button>
          <GlassSlider
            value={effectiveVolume}
            max={1}
            onChange={controls.setVolume}
            label="Volume"
            className="flex-1"
          />
          <span className="text-[9px] text-text-muted font-mono w-8 text-right flex-shrink-0 tabular-nums">
            {Math.round(effectiveVolume * 100)}%
          </span>
        </div>
      </div>

      {/* Queue */}
      {showQueue && currentSongs.length > 0 && (
        <QueueSheet
          songs={currentSongs}
          currentIndex={currentIndex}
          onSelect={(song, i) => controls.playSong(song, currentSongs, i)}
        />
      )}
    </div>
  );
};

export default NowPlaying;
