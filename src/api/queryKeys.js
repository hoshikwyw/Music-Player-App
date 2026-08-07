// Every query key in the app lives here.
//
// Keys are hierarchical so a broad invalidate cascades: invalidating
// ["songs"] clears every mood list, every search, and every detail view.
// Two hooks that run different queries must never share a key -- doing so once
// made an artist list silently render a 20-row slice of a different query.
export const queryKeys = {
  moodSongs: (moodSlug) => ["songs", "mood", moodSlug],
  song: (id) => ["songs", "detail", id],
  relatedSongs: (id) => ["songs", "related", id],
  searchSongs: (term) => ["songs", "search", term],

  artist: (id) => ["artists", "detail", id],
  artistSongs: (id) => ["artists", "detail", id, "songs"],

  topAlbums: () => ["albums", "top"],
  album: (id) => ["albums", "detail", id],

  categories: () => ["categories"],
  likedSongs: () => ["likedSongs"],

  adminSongs: () => ["admin", "songs"],
  adminArtists: () => ["admin", "artists"],
  adminAlbums: () => ["admin", "albums"],
};

// Root keys, for mutations that need to invalidate a whole domain.
export const rootKeys = {
  songs: ["songs"],
  artists: ["artists"],
  albums: ["albums"],
  likedSongs: ["likedSongs"],
  admin: ["admin"],
};
