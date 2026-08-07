import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTrackPlay } from "../../api";
import {
  nextTrack,
  playPause,
  setDuration,
  setProgress,
  VOLUME_STORAGE_KEY,
} from "../../redux/services/PlayerSlice";

// The one and only <audio> element. Mounted once, above the router, so
// playback survives navigation. Nothing else in the app may create an
// <audio> tag -- two elements means two songs at once.
const AudioEngine = () => {
  const dispatch = useDispatch();
  const audioRef = useRef(null);
  const trackedRef = useRef(null);

  const activeSong = useSelector((state) => state.player.activeSong);
  const isPlaying = useSelector((state) => state.player.isPlaying);
  const volume = useSelector((state) => state.player.volume);
  const isMuted = useSelector((state) => state.player.isMuted);
  const repeat = useSelector((state) => state.player.repeat);
  const seek = useSelector((state) => state.player.seek);

  const { mutate: trackPlay } = useTrackPlay();
  const audioUrl = activeSong?.audioUrl || "";

  // Play / pause. Browsers reject play() until the user has interacted with
  // the page, so a rejection has to flip isPlaying back or the UI lies.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !audioUrl) return;

    if (isPlaying) {
      audio.play().catch((error) => {
        console.warn("Audio play failed:", error);
        dispatch(playPause(false));
      });
    } else {
      audio.pause();
    }
  }, [isPlaying, audioUrl, dispatch]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  useEffect(() => {
    localStorage.setItem(VOLUME_STORAGE_KEY, String(volume));
  }, [volume]);

  // Keyed on token, not time, so seeking twice to the same spot still applies.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || seek.token === 0) return;

    audio.currentTime = seek.time;
  }, [seek]);

  // One play counted per song, on first playback.
  useEffect(() => {
    if (isPlaying && activeSong?.id && trackedRef.current !== activeSong.id) {
      trackedRef.current = activeSong.id;
      trackPlay(activeSong.id);
    }
  }, [isPlaying, activeSong?.id, trackPlay]);

  return (
    <audio
      ref={audioRef}
      src={audioUrl}
      preload="auto"
      // Native looping means onEnded never fires, which is exactly the
      // repeat-one behaviour we want.
      loop={repeat}
      onEnded={() => dispatch(nextTrack())}
      onTimeUpdate={(event) => dispatch(setProgress(event.target.currentTime))}
      onLoadedMetadata={(event) => dispatch(setDuration(event.target.duration || 0))}
      onError={() => {
        if (!audioUrl) return;
        console.warn("Audio failed to load:", audioUrl);
        dispatch(playPause(false));
      }}
    />
  );
};

export default AudioEngine;
