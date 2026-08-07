import { createSlice } from "@reduxjs/toolkit";

export const VOLUME_STORAGE_KEY = "player:volume";

function loadStoredVolume() {
  const stored = Number(localStorage.getItem(VOLUME_STORAGE_KEY));
  return Number.isFinite(stored) && stored >= 0 && stored <= 1 ? stored : 0.3;
}

// Picks any index except the current one, so shuffle never repeats a track
// back-to-back. `random` is a 0-1 value supplied by the action creator, which
// keeps the reducer pure.
function shuffledIndex(total, current, random) {
  const offset = 1 + Math.floor(random * (total - 1));
  return (current + offset) % total;
}

// Only the queue and transport live here. Progress and duration are written by
// AudioEngine, which is the sole owner of the <audio> element.
const initialState = {
  currentSongs: [],
  currentIndex: 0,
  activeSong: null,
  isActive: false,
  isPlaying: false,

  volume: loadStoredVolume(),
  isMuted: false,
  repeat: false,
  shuffle: false,

  duration: 0,
  progress: 0,
  // token is bumped on every seek so the engine re-applies even when the
  // requested time equals the previous one.
  seek: { time: 0, token: 0 },

  genreId: "",
};

// Skipping always resumes playback, matching how the player behaved before the
// auto-play effect in MusicPlayer/NowPlaying was removed.
function moveTo(state, index) {
  state.currentIndex = index;
  state.activeSong = state.currentSongs[index] ?? null;
  state.isActive = true;
  state.isPlaying = true;
  state.progress = 0;
  state.duration = 0;
}

export const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    setActiveSong: (state, action) => {
      const { song, data, i } = action.payload;
      state.currentSongs = data ?? [];
      state.currentIndex = i ?? 0;
      state.activeSong = song;
      state.isActive = true;
      state.isPlaying = true;
      state.progress = 0;
      state.duration = 0;
    },

    nextTrack: {
      reducer: (state, action) => {
        const total = state.currentSongs.length;
        if (!total) return;

        moveTo(
          state,
          state.shuffle && total > 1
            ? shuffledIndex(total, state.currentIndex, action.payload.random)
            : (state.currentIndex + 1) % total
        );
      },
      prepare: () => ({ payload: { random: Math.random() } }),
    },

    prevTrack: {
      reducer: (state, action) => {
        const total = state.currentSongs.length;
        if (!total) return;

        moveTo(
          state,
          state.shuffle && total > 1
            ? shuffledIndex(total, state.currentIndex, action.payload.random)
            : (state.currentIndex - 1 + total) % total
        );
      },
      prepare: () => ({ payload: { random: Math.random() } }),
    },

    playPause: (state, action) => {
      state.isPlaying = action.payload;
    },

    togglePlay: (state) => {
      if (state.isActive) state.isPlaying = !state.isPlaying;
    },

    setVolume: (state, action) => {
      state.volume = Math.min(1, Math.max(0, action.payload));
      if (state.volume > 0) state.isMuted = false;
    },

    toggleMute: (state) => {
      state.isMuted = !state.isMuted;
    },

    toggleRepeat: (state) => {
      state.repeat = !state.repeat;
    },

    toggleShuffle: (state) => {
      state.shuffle = !state.shuffle;
    },

    setDuration: (state, action) => {
      state.duration = action.payload;
    },

    setProgress: (state, action) => {
      state.progress = action.payload;
    },

    seekTo: (state, action) => {
      state.seek = { time: action.payload, token: state.seek.token + 1 };
      state.progress = action.payload;
    },

    selectGenreListId: (state, action) => {
      state.genreId = action.payload;
    },
  },
});

export const {
  setActiveSong,
  nextTrack,
  prevTrack,
  playPause,
  togglePlay,
  setVolume,
  toggleMute,
  toggleRepeat,
  toggleShuffle,
  setDuration,
  setProgress,
  seekTo,
  selectGenreListId,
} = playerSlice.actions;

export default playerSlice.reducer;
