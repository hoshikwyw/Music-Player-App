// Supabase rows -> the flat shapes the UI consumes.
//
// These used to inflate rows back into the nested shape of the Shazam API this
// app was originally built against (attributes.previews[0].url, hub.actions[],
// images.coverart, ...). That API is long gone; the nesting only survived as
// optional-chaining noise in every component.

/**
 * @typedef {object} Song
 * @property {string}   id
 * @property {string}   title
 * @property {string}   artistId
 * @property {string}   artistName
 * @property {string}   albumId
 * @property {string}   albumTitle
 * @property {string}   coverUrl
 * @property {string}   audioUrl
 * @property {string}   genre
 * @property {number}   duration    seconds
 * @property {number}   playCount
 * @property {string[]} lyrics      empty when the song has none
 * @property {number}  [chartRank]  only present on rows from the charts view
 */

/** @returns {Song | null} */
export function mapSong(row) {
  if (!row) return null;

  return {
    id: row.id,
    title: row.title ?? "",
    artistId: row.artist_id ?? "",
    artistName: row.artist_name ?? "",
    albumId: row.album_id ?? "",
    // `albums(title)` when joined, `album_title` when flattened by a view
    albumTitle: row.albums?.title ?? row.album_title ?? "",
    coverUrl: row.cover_url ?? "",
    audioUrl: row.audio_url ?? "",
    genre: row.genre ?? "",
    duration: row.duration ?? 0,
    playCount: row.play_count ?? 0,
    lyrics: Array.isArray(row.lyrics) ? row.lyrics : [],
    chartRank: row.chart_rank,
  };
}

/**
 * @typedef {object} Artist
 * @property {string}   id
 * @property {string}   name
 * @property {string}   bio
 * @property {string}   avatarUrl
 * @property {number}   totalPlays
 * @property {number}   songCount
 * @property {number}  [rank]
 * @property {string[]} genres
 */

/** @returns {Artist | null} */
export function mapArtist(row) {
  if (!row) return null;

  return {
    id: row.id,
    name: row.name ?? "",
    bio: row.bio ?? "",
    avatarUrl: row.avatar_url ?? "",
    totalPlays: row.total_plays ?? 0,
    songCount: row.song_count ?? 0,
    rank: row.artist_rank,
    genres: [],
  };
}

/**
 * @typedef {object} Album
 * @property {string}  id
 * @property {string}  title
 * @property {string}  artistId
 * @property {string}  artistName
 * @property {string}  coverUrl
 * @property {string}  releaseDate
 * @property {number}  totalPlays
 * @property {number}  songCount
 * @property {number} [rank]
 */

/** @returns {Album | null} */
export function mapAlbum(row) {
  if (!row) return null;

  return {
    id: row.id,
    title: row.title ?? "",
    artistId: row.artist_id ?? "",
    artistName: row.artist_name ?? row.artists?.name ?? "",
    coverUrl: row.cover_url ?? "",
    releaseDate: row.release_date ?? "",
    totalPlays: row.total_plays ?? 0,
    songCount: row.song_count ?? 0,
    rank: row.album_rank,
  };
}

// Columns needed to build a Song, including the album title join.
export const SONG_SELECT = "*, albums(title)";
