// Every query key in the app lives here.
//
// Keys are hierarchical so a broad invalidate cascades: invalidating
// ["artists"] also clears ["artists", "top"] and ["artists", <id>, "songs"].
// Two hooks that run different queries must never share a key -- that is what
// made the Artists page show a 20-row slice of the top-artists list.
export const queryKeys = {
  songs: (genreSlug) => ["songs", "list", genreSlug ?? null],
  song: (id) => ["songs", "detail", id],
  relatedSongs: (id) => ["songs", "related", id],
  searchSongs: (term) => ["songs", "search", term],

  charts: () => ["charts"],

  artists: () => ["artists", "all"],
  topArtists: () => ["artists", "top"],
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
  charts: ["charts"],
  artists: ["artists"],
  albums: ["albums"],
  likedSongs: ["likedSongs"],
  admin: ["admin"],
};
