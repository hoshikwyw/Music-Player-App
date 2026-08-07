import { useEffect, useRef } from "react";
import { useTrackPlay } from "../../hooks/useSupabase";

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

  const audioSrc =
    activeSong?.hub?.actions?.find((a) => a.type === "uri")?.uri ||
    activeSong?.attributes?.previews?.[0]?.url ||
    "";

  // Track play count when song starts playing
  useEffect(() => {
    if (isPlaying && activeSong?.key && trackedRef.current !== activeSong.key) {
      trackedRef.current = activeSong.key;
      trackPlay(activeSong.key);
    }
  }, [isPlaying, activeSong?.key, trackPlay]);

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
