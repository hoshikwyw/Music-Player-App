import { useMemo } from "react";
import { useDispatch } from "react-redux";
import {
  nextTrack,
  playPause,
  prevTrack,
  seekTo,
  setActiveSong,
  setVolume,
  toggleMute,
  togglePlay,
  toggleRepeat,
  toggleShuffle,
} from "../redux/services/PlayerSlice";

// Single entry point for every playback action. Before this, MusicPlayer and
// NowPlaying each carried their own copy of next/prev and could drift apart.
export function usePlayerControls() {
  const dispatch = useDispatch();

  return useMemo(
    () => ({
      playSong: (song, queue, index) =>
        dispatch(setActiveSong({ song, data: queue, i: index })),
      play: () => dispatch(playPause(true)),
      pause: () => dispatch(playPause(false)),
      toggle: () => dispatch(togglePlay()),
      next: () => dispatch(nextTrack()),
      prev: () => dispatch(prevTrack()),
      seek: (time) => dispatch(seekTo(Number(time))),
      setVolume: (value) => dispatch(setVolume(Number(value))),
      toggleMute: () => dispatch(toggleMute()),
      toggleRepeat: () => dispatch(toggleRepeat()),
      toggleShuffle: () => dispatch(toggleShuffle()),
    }),
    [dispatch]
  );
}
