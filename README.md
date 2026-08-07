# Kayv Vibe

A personal music player web app built with React and Supabase.

![React](https://img.shields.io/badge/React-18.3-blue)
![Vite](https://img.shields.io/badge/Vite-5.4-purple)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-teal)
![Supabase](https://img.shields.io/badge/Supabase-2.103-green)

## Features

- **Moods, not genres** - Chill, Focus, Night Drive, Rainy, Lift, Sleep. The
  home screen suggests one based on the time of day
- **Now Playing** - Immersive player with a spinning record and queue
- **Sleep timer** - Stops playback after 15/30/45/60 minutes
- **Pick up where you left off** - Recently played, kept locally
- **Liked** - Keep tracks, play or shuffle the lot
- **Search** - Songs and artists
- **Admin Dashboard** - CRUD for songs, artists, and albums with file upload
- **4 Vibes** - Midnight, Ember, Aurora, and Velvet dark palettes
- **Liquid glass UI** - Blurred panes over an ambient backdrop tinted by the
  cover art of whatever is playing
- **Fully Responsive** - Mobile, tablet, and desktop

## Tech Stack

| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| Supabase | Postgres database, storage, and auth |
| TanStack Query v5 | Server state, caching, and mutations |
| Redux Toolkit | Playback state (queue, transport, recents) |
| React Router v6 | Client-side routing |
| Tailwind CSS 3 | Utility-first styling |
| Vite 5 | Build tool & dev server |
| React Icons | Icon library |

## Getting Started

### Prerequisites

- Node.js 18+
- A Supabase project

### Installation

```bash
npm install
cp .env.example .env
```

Fill in `.env` with your Supabase project credentials:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

Vite inlines every `VITE_`-prefixed variable into the client bundle, so never
put a real secret here. The anon key is safe to expose — RLS is what protects
the data.

### Database setup

Run `supabase-schema.sql` in the Supabase SQL editor. It creates the tables
(`categories`, `artists`, `albums`, `songs`, `play_history`, `liked_songs`,
`artist_categories`, `admins`), the ranking views (`top_charts`, `top_artists`,
`top_albums`), the `increment_play_count` and `is_admin` functions, and the RLS
policies.

You also need two public storage buckets: one for audio files and one for
cover art.

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

### Build

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── api/                     # Server data (TanStack Query)
│   ├── mappers.js           # Supabase rows -> flat domain objects
│   ├── queryKeys.js         # Every cache key, in one place
│   ├── songs.js             # Songs, search, related, play tracking
│   ├── artists.js           # Artists, detail, artist songs
│   ├── albums.js            # Top albums, album detail
│   ├── moods.js             # Mood -> songs
│   ├── categories.js        # Track categories
│   ├── likes.js             # Liked songs
│   ├── admin.js             # CRUD + storage upload
│   └── index.js             # Barrel export
├── assets/          # Images, constants (genres, nav links)
├── components/
│   ├── player-control/
│   │   ├── AudioEngine.jsx  # The single <audio> element
│   │   ├── VinylDisc.jsx    # Spinning record on Now Playing
│   │   ├── QueueSheet.jsx   # Up-next list
│   │   ├── Track.jsx        # Dock track info
│   │   ├── ControlBtns.jsx  # Play/pause/skip/shuffle/repeat
│   │   ├── Seekbar.jsx      # Progress bar with timestamps
│   │   └── Volumebar.jsx    # Volume slider
│   ├── ui/
│   │   ├── GlassPanel.jsx   # Glass surface primitive
│   │   ├── GlassButton.jsx  # Glass button primitive
│   │   ├── GlassSlider.jsx  # Seek / volume slider primitive
│   │   └── Dropdown.jsx     # Glass dropdown
│   ├── AmbientBackdrop.jsx  # Drifting colour fields behind the glass
│   ├── LikeButton.jsx       # Like / unlike toggle
│   ├── MoodCard.jsx         # Mood tile
│   ├── SleepTimer.jsx       # Stop-playing-in menu
│   ├── Sidebar.jsx          # Fixed sidebar with navigation
│   ├── Searchbar.jsx        # Fixed search bar with theme switcher
│   ├── SongCard.jsx         # Song grid card
│   ├── PlayPause.jsx        # Play/pause button
│   ├── SongBar.jsx          # Song list item
│   ├── RelateSong.jsx       # Related songs section
│   ├── DetailsTitle.jsx     # Detail page header
│   ├── ThemeSwitcher.jsx    # Vibe picker
│   ├── RequireAdmin.jsx     # Admin route guard
│   ├── AdminLogin.jsx       # Supabase email/password sign-in
│   ├── ErrorBoundary.jsx    # Catches render crashes per route
│   ├── Loader.jsx           # Loading spinner
│   └── Error.jsx            # Error state
├── contexts/
│   ├── ThemeContext.jsx     # Applies the active vibe to :root
│   ├── SidebarContext.jsx   # Mobile sidebar open state
│   └── AuthContext.jsx      # Supabase session + admin status
├── theme/
│   └── vibes.js             # Vibe palettes (colour + glass + ambient tokens)
├── hooks/
│   ├── useAuth.js           # Consumes AuthContext
│   ├── useTheme.js          # Consumes ThemeContext
│   ├── usePlayerControls.js # Every playback action
│   └── useDominantColors.js # Cover-art colour extraction
├── lib/
│   ├── supabase.js          # Supabase client
│   ├── moods.js             # Mood definitions + time-of-day logic
│   └── formatTime.js        # Seconds -> m:ss
├── pages/
│   ├── Home.jsx             # Greeting, moods, recently played
│   ├── Mood.jsx             # Songs for one mood
│   ├── Liked.jsx            # Liked songs grid
│   ├── ArtistDetail.jsx     # Artist detail + songs
│   ├── SongDetail.jsx       # Song detail + lyrics + related songs
│   ├── Search.jsx           # Search results
│   ├── NowPlaying.jsx       # Immersive player
│   ├── MusicPlayer.jsx      # Floating dock contents
│   ├── AdminDashboard.jsx   # Content management
│   └── NotFound.jsx         # 404 state
├── redux/
│   ├── store.js             # Redux store configuration
│   └── services/
│       ├── PlayerSlice.js      # All player state
│       └── playerSelectors.js  # Narrow selectors (see Playback)
├── main.jsx                 # App entry point
└── index.css                # Global styles & design system
```

## Data Layer

All server data goes through TanStack Query hooks in `src/api/`, split by
domain. Import from the barrel:

```js
import { useSongs, useArtistDetail, useLikeSong } from "../api";
```

`src/api/` is server data; `src/hooks/` is UI state (`useAuth`, `useTheme`).

### Domain model

`src/api/mappers.js` converts Supabase rows into flat objects. Components never
see database column names or nested API shapes:

```js
Song   { id, title, artistId, artistName, albumId, albumTitle,
         coverUrl, audioUrl, genre, duration, playCount, lyrics[], chartRank? }
Artist { id, name, bio, avatarUrl, totalPlays, songCount, rank?, genres[] }
Album  { id, title, artistId, artistName, coverUrl, releaseDate,
         totalPlays, songCount, rank? }
```

### Query keys

Every key is defined in `src/api/queryKeys.js` and is hierarchical, so
invalidating `["artists"]` cascades to the top-artists list and every artist's
song list. Two hooks that run different queries must never share a key.

### Moods

Moods live in `src/lib/moods.js`, not in the database. Each one maps to a set
of category slugs, so this works against existing data with no migration and no
re-tagging. `useMoodSongs` resolves those slugs to category ids and filters.

If you later add a real `mood` column to `songs`, `useMoodSongs` is the only
function that has to change — nothing else reads `categories` directly.

The `everything` mood has no category filter. It exists so a track with no
category set is still reachable.

### Not yet wired to UI

`useTopAlbums` and `useAlbumDetail` work but have no component using them. The
`top_charts` and `top_artists` views still exist in the database if you ever
want rankings back.

## Playback

There is exactly **one** `<audio>` element in the app, owned by
`AudioEngine` and mounted in `App.jsx` outside the routes so playback survives
navigation. No other component may create an `<audio>` tag.

- **State** lives entirely in `PlayerSlice` — queue, index, transport, volume,
  mute, repeat, shuffle, progress, duration. Volume persists to `localStorage`.
- **Actions** go through `usePlayerControls()`, never raw dispatches:
  `playSong, play, pause, toggle, next, prev, seek, setVolume, toggleMute,
  toggleRepeat, toggleShuffle`.
- **Seeking** uses a `{ time, token }` pair. The token increments on every
  request so seeking twice to the same position still applies.
- **Repeat** sets the audio element's native `loop`, so `onEnded` never fires —
  that is repeat-one, by design.
- **Shuffle** picks any index except the current one, so the same track never
  repeats back-to-back.

### Selecting player state

`AudioEngine` dispatches `setProgress` on every `timeupdate` (~4x/second), so
`state.player` changes identity that often. Components that only need to know
what is playing must use the narrow selectors:

```js
const { activeSong, isPlaying } = useNowPlaying();  // not useSelector(s => s.player)
```

Selecting the whole slice re-renders that component four times a second. Only
`MusicPlayer` and `NowPlaying` do it, because they render the seek bar.

## Design System

### Glass

Four ingredients, and all four matter:

1. **A translucent tint** — lets the backdrop through
2. **`blur()` + `saturate()`** — saturate compensates for the wash-out blurring
   alone causes
3. **A hairline border** — defines the pane's edge
4. **An inset top highlight** — the specular line where light catches the rim.
   Skip it and the pane reads as a flat frosted rectangle, not glass.

| Class | Use |
|---|---|
| `.glass-1` | Subtle chrome — top bar, nav, buttons (blur 12px) |
| `.glass-2` | Cards, the default (blur 20px) |
| `.glass-3` | Modals and the player, closest to the viewer (blur 40px) |
| `.glass-flat` | Rows inside a scrolling list — translucent, **no blur** |
| `.glass-interactive` | Hover lift plus a light sweep across the pane |

Components in `src/components/ui/`: `<GlassPanel elevation radius interactive>`,
`<GlassButton variant size>`, `<GlassSlider value max onChange label>`,
`<Dropdown options value onChange>`.

### Layout

| Surface | Elevation | Treatment |
|---|---|---|
| Sidebar rail | 2 | Full height, hairline right edge |
| Top bar | 1 | Fixed, hairline bottom edge |
| Player dock | 3 | **Floating**, inset from the viewport edges so the ambient backdrop stays visible around it |
| Cards | 2 | `glass-interactive` for hover lift |

The dock is the only elevation-3 surface in the main layout — it is the closest
thing to the viewer. Its play button is the one solid fill on screen, so the
primary action reads first against all the translucency.

### Now Playing

The immersive screen. It hides both the app search bar and the charts rail —
it carries its own header, and chrome alongside an immersive player defeats
the point. The record's spin animation is always applied and paused via
`animationPlayState`, so pausing freezes it in place rather than snapping back
to 0°; the spindle sits outside the rotating element because a real one does
not turn with the record.

**Rules**

- **Never nest more than two blurred layers.** Each re-blurs what the one below
  already blurred and the result turns to mud. Use `.glass-flat` inside a pane.
- **Never put `backdrop-filter` on a scrolling list row.** It forces a
  compositing layer per row and destroys scroll performance.
- **Never write `.glass-x { @apply glass; ... }`.** Tailwind's `@apply` copies
  every rule matching the applied class — including the ones inside the media
  queries at the bottom of `index.css` — and re-emits them *ahead* of the
  override, silently breaking the reduced-transparency fallback. Elevation is
  driven by the `--pane-blur` / `--pane-saturate` custom properties instead.

### Vibes

Themes are dark by design. Glass only reads as glass when there is depth
behind it: a light surface under a blur just turns grey, and the specular edge
disappears. Each vibe is a near-black base plus a saturated accent pair that
the ambient backdrop paints with. Defined in `src/theme/vibes.js`, applied as
CSS custom properties on `:root`, persisted to `localStorage`.

| Vibe | Accent | Base |
|---|---|---|
| Midnight (default) | `#7C9CFF` → `#B388FF` | `#07090F` |
| Ember | `#FF9F45` → `#FF6B5E` | `#0D0806` |
| Aurora | `#4EE7B0` → `#38BDF8` | `#04100D` |
| Velvet | `#C084FC` → `#F472B6` | `#0A0610` |

Accents are light, so text on an accent fill uses `text-on-accent` (a dark tone
defined per vibe), never `text-white`.

### Ambient backdrop

`AmbientBackdrop` is what gives the glass something to refract. Two large
blurred colour fields drift slowly behind everything, tinted by the current
cover art via `useDominantColors` — a 16×16 canvas sample that buckets pixels
and discards near-black, near-white, and desaturated ones. Falls back to the
vibe's accent pair when no song is playing, when the image is not
CORS-readable, or when the canvas is tainted.

A radial darkening wash sits on top: without it, bright cover art lifts the
backdrop enough to break text contrast on the panes above.

### Accessibility

- `prefers-reduced-transparency: reduce` → every pane becomes opaque
  (`--glass-solid`) and the ambient blobs are hidden
- `prefers-reduced-motion: reduce` → drift animations and hover transforms off
- `@supports not (backdrop-filter)` → opaque fallback
- `:focus-visible` gets a 2px accent outline

### Responsive Breakpoints

| Screen | Sidebar | Song grid | Mood grid |
|---|---|---|---|
| Mobile (<768px) | Drawer | 2 columns | 2 columns |
| Tablet (768-1023px) | Fixed rail | 3 columns | 2 columns |
| Desktop (1024px+) | Fixed rail | 3-4 columns | 3 columns |

## Admin Access

The dashboard at `/superadmin` requires a Supabase Auth account that is listed
in the `admins` table.

To grant yourself access:

1. Supabase Dashboard > **Authentication > Users > Add user** — set an email
   and password
2. Copy the new user's UUID
3. Run in the SQL editor:
   ```sql
   insert into admins (user_id) values ('<paste-uuid-here>');
   ```

The `RequireAdmin` route guard is only a convenience. The real boundary is the
RLS policies: every insert, update, and delete on `songs`, `artists`, `albums`,
`categories`, and `artist_categories` calls `is_admin()`, as do all writes to
the `audio` and `covers` storage buckets. Bypassing the guard in the browser
grants nothing.

### Existing projects

If your database was created before these policies existed, run
`supabase/migrations/001_secure_admin_writes.sql` in the SQL editor. It drops
the old `using (true)` write policies and replaces them with the admin checks.

### Known gap

`liked_songs` stays publicly readable and writable so listeners never have to
sign in, which means anyone with the anon key can add to or clear the liked
list. Acceptable for a single-user personal app; revisit before sharing.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## License

This project is for educational purposes.
