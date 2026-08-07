import { useSelector } from "react-redux";

// AudioEngine dispatches setProgress on every timeupdate (~4x/second), so the
// whole player slice changes identity that often. Anything that selects the
// slice wholesale re-renders at that rate -- which, on a song grid, is a lot of
// wasted work. Select the individual fields instead.

export const useActiveSong = () => useSelector((state) => state.player.activeSong);
export const useIsPlaying = () => useSelector((state) => state.player.isPlaying);

// Convenience for the many list views that highlight the playing row.
export function useNowPlaying() {
  return {
    activeSong: useActiveSong(),
    isPlaying: useIsPlaying(),
  };
}
