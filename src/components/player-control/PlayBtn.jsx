import { useEffect, useRef } from "react";
import { useTrackPlay } from "../../api";

const PlayBtn = ({
  activeSong,
  isPlaying,
  volume,
  seekTime,
  onEnded,
  onTimeUpdate,
  onLoadedData,
  repeat,
}) => {
  const ref = useRef(null);
  const trackedRef = useRef(null);
  const { mutate: trackPlay } = useTrackPlay();

  const audioSrc = activeSong?.audioUrl || "";

  // Count a play once per song, on first playback
  useEffect(() => {
    if (isPlaying && activeSong?.id && trackedRef.current !== activeSong.id) {
      trackedRef.current = activeSong.id;
      trackPlay(activeSong.id);
    }
  }, [isPlaying, activeSong?.id, trackPlay]);

  // Handle play / pause
  useEffect(() => {
    if (ref.current) {
      if (isPlaying) {
        ref.current.play().catch((err) => {
          console.warn("Audio play failed:", err);
        });
      } else {
        ref.current.pause();
      }
    }
  }, [isPlaying, audioSrc]);

  // Sync volume
  useEffect(() => {
    if (ref.current) {
      ref.current.volume = volume;
    }
  }, [volume]);

  // Sync seek time
  useEffect(() => {
    if (ref.current && seekTime >= 0) {
      ref.current.currentTime = seekTime;
    }
  }, [seekTime]);

  return (
    <audio
      src={audioSrc}
      ref={ref}
      preload="auto"
      loop={repeat}
      onEnded={onEnded}
      onTimeUpdate={onTimeUpdate}
      onLoadedData={onLoadedData}
    />
  );
};

export default PlayBtn;
