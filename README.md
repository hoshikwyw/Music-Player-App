# Kayv Vibe

A personal music player web app built with React and Supabase.

![React](https://img.shields.io/badge/React-18.3-blue)
![Vite](https://img.shields.io/badge/Vite-5.4-purple)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-teal)
![Supabase](https://img.shields.io/badge/Supabase-2.103-green)

## Features

- **Music Discovery** - Browse songs by genre with pagination
- **Search** - Search songs and artists
- **Artist & Song Details** - Artist info, lyrics, and related tracks
- **Music Player** - Play/pause, next/prev, shuffle, repeat, seek, volume
- **Now Playing** - Full-screen player with spinning disc and queue
- **Charts & Liked Songs** - Play-count rankings and favorites
- **Admin Dashboard** - CRUD for songs, artists, and albums with file upload
- **5 Themes** - Orange, Dark, Mint, Purple, and Rose color schemes
- **Fully Responsive** - Mobile, tablet, and desktop

## Tech Stack

| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| Supabase | Postgres database, storage, and auth |
| TanStack Query v5 | Server state, caching, and mutations |
| Redux Toolkit | Playback state (queue, active song) |
| React Router v6 | Client-side routing |
| Tailwind CSS 3 | Utility-first styling |
| Vite 5 | Build tool & dev server |
| Swiper | Artist carousel |
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
├── assets/          # Images, constants (genres, nav links)
├── components/
│   ├── player-control/
│   │   ├── Track.jsx        # Now-playing track info
│   │   ├── PlayBtn.jsx      # Audio element & playback logic
│   │   ├── ControlBtns.jsx  # Play/pause/skip/shuffle/repeat
│   │   ├── Seekbar.jsx      # Progress bar with timestamps
│   │   └── Volumebar.jsx    # Volume slider
│   ├── Sidebar.jsx          # Fixed sidebar with navigation
│   ├── Searchbar.jsx        # Fixed search bar with theme switcher
│   ├── TopPlay.jsx          # Charts sidebar & artist carousel
│   ├── SongCard.jsx         # Song grid card
│   ├── ArtistCard.jsx       # Artist grid card
│   ├── PlayPause.jsx        # Play/pause button
│   ├── SongBar.jsx          # Song list item
│   ├── RelateSong.jsx       # Related songs section
│   ├── DetailsTitle.jsx     # Detail page header
│   ├── RetroDropdown.jsx    # Custom dropdown component
│   ├── ThemeSwitcher.jsx    # Theme selection dropdown
│   ├── ErrorBoundary.jsx    # Catches render crashes per route
│   ├── Loader.jsx           # Loading spinner
│   └── Error.jsx            # Error state
├── contexts/
│   └── ThemeContext.jsx     # Theme management with CSS variables
├── hooks/
│   └── useSupabase.js       # All TanStack Query hooks & mutations
├── lib/
│   └── supabase.js          # Supabase client
├── pages/
│   ├── Discover.jsx         # Genre-filtered songs with pagination
│   ├── Artists.jsx          # Artists grid
│   ├── Charts.jsx           # Top charts
│   ├── Liked.jsx            # Liked songs grid
│   ├── ArtistDetail.jsx     # Artist detail + songs
│   ├── SongDetail.jsx       # Song detail + lyrics + related songs
│   ├── Search.jsx           # Search results
│   ├── NowPlaying.jsx       # Full-screen player
│   ├── MusicPlayer.jsx      # Bottom player bar
│   ├── AdminDashboard.jsx   # Content management
│   └── NotFound.jsx         # 404 state
├── redux/
│   ├── store.js             # Redux store configuration
│   └── services/
│       └── PlayerSlice.js   # Player state (queue, playback)
├── main.jsx                 # App entry point
└── index.css                # Global styles & design system
```

## Data Layer

All data access goes through TanStack Query hooks in `src/hooks/useSupabase.js`.
Supabase rows are mapped into the shape components consume by the `transform*`
functions at the top of that file.

Public read hooks: `useSongs`, `useSongDetail`, `useRelatedSongs`,
`useSearchSongs`, `useChartSongs`, `useTopArtists`, `useTopAlbums`,
`useArtists`, `useArtistDetail`, `useArtistSongs`, `useAlbumDetail`,
`useCategories`, `useLikedSongs`.

Mutations: `useTrackPlay`, `useLikeSong`, `useUnlikeSong`, and the admin
`useAdd*` / `useUpdate*` / `useDelete*` families plus `useUploadFile`.

## Design System

Custom component classes defined in `index.css`:

- **`.retro-card`** / **`.retro-card-interactive`** - Cards, the latter with hover lift
- **`.retro-btn`** / **`.retro-btn-outline`** - Buttons with offset shadow
- **`.retro-input`** - Input with thick border and focus glow
- **`.retro-badge`** - Small pill label
- **`.retro-range`** - Custom styled range slider
- **`.retro-divider`** - Horizontal rule

### Themes

Themes swap CSS custom properties on `:root` and persist to `localStorage`.
Switchable via the palette icon in the search bar.

| Theme | Primary Color | Background |
|---|---|---|
| Retro Orange | `#E8871E` | `#F5EDE3` |
| Retro Dark | `#E8871E` | `#1E1E1E` |
| Retro Mint | `#2EAD8E` | `#F0F5F3` |
| Retro Purple | `#8B5CF6` | `#F5F0FA` |
| Retro Rose | `#E05080` | `#FDF0F4` |

### Responsive Breakpoints

| Screen | Sidebar | TopPlay | Grid |
|---|---|---|---|
| Mobile (<768px) | Hamburger menu | Hidden | 2 columns |
| Tablet (768-1023px) | Fixed sidebar | Hidden | 3 columns |
| Desktop (1024px+) | Fixed sidebar | Right sidebar | 3-4 columns |

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
