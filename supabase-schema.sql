-- ============================================
-- Supabase Schema for Music Player App
-- Run this in your Supabase SQL Editor
-- ============================================

-- 1. Categories / Genres
create table if not exists categories (
  id text primary key,
  name text not null,
  slug text unique not null
);

-- 2. Artists
create table if not exists artists (
  id text primary key,
  name text not null,
  bio text,
  avatar_url text,
  created_at timestamptz default now()
);

-- 3. Albums
create table if not exists albums (
  id text primary key,
  title text not null,
  artist_id text references artists(id) on delete cascade,
  cover_url text,
  release_date date,
  created_at timestamptz default now()
);

-- 4. Songs
create table if not exists songs (
  id text primary key,
  title text not null,
  artist_id text references artists(id) on delete cascade,
  artist_name text not null,
  album_id text references albums(id) on delete set null,
  category_id text references categories(id) on delete set null,
  genre text,
  cover_url text,
  audio_url text,
  duration integer default 0,
  lyrics text[],
  play_count integer default 0,
  created_at timestamptz default now()
);

-- 5. Play history (for calculating top charts)
create table if not exists play_history (
  id uuid primary key default gen_random_uuid(),
  song_id text references songs(id) on delete cascade,
  played_at timestamptz default now()
);

-- 6. Liked songs
create table if not exists liked_songs (
  id uuid primary key default gen_random_uuid(),
  song_id text references songs(id) on delete cascade,
  created_at timestamptz default now(),
  unique(song_id)
);

-- 7. Artist-Category junction (artists can belong to multiple genres)
create table if not exists artist_categories (
  artist_id text references artists(id) on delete cascade,
  category_id text references categories(id) on delete cascade,
  primary key (artist_id, category_id)
);

-- ============================================
-- Indexes
-- ============================================
create index if not exists idx_songs_artist_id on songs(artist_id);
create index if not exists idx_songs_album_id on songs(album_id);
create index if not exists idx_songs_category_id on songs(category_id);
create index if not exists idx_songs_genre on songs(genre);
create index if not exists idx_songs_play_count on songs(play_count desc);
create index if not exists idx_albums_artist_id on albums(artist_id);
create index if not exists idx_play_history_song_id on play_history(song_id);
create index if not exists idx_play_history_played_at on play_history(played_at desc);
create index if not exists idx_liked_songs_song_id on liked_songs(song_id);

-- ============================================
-- Views for Top Charts / Top Artists / Top Albums
-- ============================================

-- Top Charts: songs ranked by play_count
create or replace view top_charts as
select
  s.*,
  a.name as computed_artist_name,
  a.avatar_url as artist_avatar_url,
  al.title as album_title,
  al.cover_url as album_cover_url,
  c.name as category_name,
  rank() over (order by s.play_count desc) as chart_rank
from songs s
left join artists a on s.artist_id = a.id
left join albums al on s.album_id = al.id
left join categories c on s.category_id = c.id
order by s.play_count desc;

-- Top Artists: ranked by total play_count of their songs
create or replace view top_artists as
select
  a.*,
  coalesce(sum(s.play_count), 0) as total_plays,
  count(s.id) as song_count,
  rank() over (order by coalesce(sum(s.play_count), 0) desc) as artist_rank
from artists a
left join songs s on s.artist_id = a.id
group by a.id
order by total_plays desc;

-- Top Albums: ranked by total play_count of their songs
create or replace view top_albums as
select
  al.*,
  a.name as artist_name,
  a.avatar_url as artist_avatar_url,
  coalesce(sum(s.play_count), 0) as total_plays,
  count(s.id) as song_count,
  rank() over (order by coalesce(sum(s.play_count), 0) desc) as album_rank
from albums al
left join artists a on al.artist_id = a.id
left join songs s on s.album_id = al.id
group by al.id, a.name, a.avatar_url
order by total_plays desc;

-- ============================================
-- Function: increment play count (call from app)
-- ============================================
create or replace function increment_play_count(p_song_id text)
returns void as $$
begin
  update songs set play_count = play_count + 1 where id = p_song_id;
  insert into play_history (song_id) values (p_song_id);
end;
$$ language plpgsql security definer set search_path = public;

-- ============================================
-- Row Level Security
-- ============================================
alter table categories enable row level security;
alter table artists enable row level security;
alter table albums enable row level security;
alter table songs enable row level security;
alter table play_history enable row level security;
alter table liked_songs enable row level security;
alter table artist_categories enable row level security;

-- Admin allow-list. Only writable from the SQL editor or the service role;
-- a signed-in user can read nothing but their own row.
create table if not exists admins (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table admins enable row level security;

create policy "Read own admin row" on admins
  for select using (auth.uid() = user_id);

-- security definer so write policies can call this without recursing into the
-- admins table's own RLS. Pinned search_path prevents shadowing attacks.
create or replace function is_admin()
returns boolean as $$
  select exists (select 1 from admins where user_id = auth.uid());
$$ language sql stable security definer set search_path = public;

grant execute on function is_admin() to anon, authenticated;

-- Public read on catalog tables
create policy "Public read" on categories for select using (true);
create policy "Public read" on artists for select using (true);
create policy "Public read" on albums for select using (true);
create policy "Public read" on songs for select using (true);
create policy "Public read" on liked_songs for select using (true);
create policy "Public read" on artist_categories for select using (true);

-- play_history is a listening log, not public data. It is written only by
-- increment_play_count(), which is security definer and bypasses RLS.
create policy "Admin read" on play_history
  for select to authenticated using (is_admin());

-- Likes stay open so listeners never have to sign in. Anyone with the anon key
-- can therefore add to or clear the liked list -- fine for a single-user app.
create policy "Public insert" on liked_songs for insert with check (true);
create policy "Public delete" on liked_songs for delete using (true);

-- Content writes require an authenticated user on the admin allow-list.
do $$
declare
  t text;
begin
  foreach t in array array['songs', 'artists', 'albums', 'categories', 'artist_categories']
  loop
    execute format(
      'create policy "Admin insert" on %I for insert to authenticated with check (is_admin())', t);
    execute format(
      'create policy "Admin update" on %I for update to authenticated using (is_admin()) with check (is_admin())', t);
    execute format(
      'create policy "Admin delete" on %I for delete to authenticated using (is_admin())', t);
  end loop;
end $$;

-- Storage: public read, admin-only write. Without these, anyone with the anon
-- key can overwrite your audio and cover art (uploads use upsert: true).
create policy "Public read media" on storage.objects
  for select using (bucket_id in ('audio', 'covers'));

create policy "Admin write media" on storage.objects
  for insert to authenticated
  with check (bucket_id in ('audio', 'covers') and is_admin());

create policy "Admin update media" on storage.objects
  for update to authenticated
  using (bucket_id in ('audio', 'covers') and is_admin())
  with check (bucket_id in ('audio', 'covers') and is_admin());

create policy "Admin delete media" on storage.objects
  for delete to authenticated
  using (bucket_id in ('audio', 'covers') and is_admin());

-- ============================================
-- Storage Buckets (create in Supabase Dashboard > Storage)
--   1. "audio"  — public bucket for MP3/WAV files
--   2. "covers" — public bucket for album art / artist avatars
--
-- URLs will be:
--   https://<project>.supabase.co/storage/v1/object/public/audio/<file>
--   https://<project>.supabase.co/storage/v1/object/public/covers/<file>
-- ============================================

-- ============================================
-- Seed Data
-- ============================================

-- Categories
insert into categories (id, name, slug) values
  ('cat-pop',        'Pop',         'POP'),
  ('cat-hiphop',     'Hip-Hop',     'HIP_HOP_RAP'),
  ('cat-dance',      'Dance',       'DANCE'),
  ('cat-electronic', 'Electronic',  'ELECTRONIC'),
  ('cat-soul',       'Soul',        'SOUL_RNB'),
  ('cat-alternative','Alternative', 'ALTERNATIVE'),
  ('cat-rock',       'Rock',        'ROCK'),
  ('cat-latin',      'Latin',       'LATIN'),
  ('cat-film',       'Film',        'FILM_TV'),
  ('cat-country',    'Country',     'COUNTRY'),
  ('cat-reggae',     'Reggae',      'REGGAE_DANCE_HALL'),
  ('cat-house',      'House',       'HOUSE'),
  ('cat-kpop',       'K-Pop',       'K_POP'),
  ('cat-rnb',        'R&B',         'RNB'),
  ('cat-jazz',       'Jazz',        'JAZZ'),
  ('cat-classical',  'Classical',   'CLASSICAL'),
  ('cat-metal',      'Metal',       'METAL'),
  ('cat-indie',      'Indie',       'INDIE')
on conflict (id) do nothing;

-- Artists
insert into artists (id, name, bio, avatar_url) values
  ('artist-1',  'M83',            'French electronic music project',                   'https://placehold.co/500x500/1a1a2e/e887e8?text=M83'),
  ('artist-2',  'The Weeknd',     'Canadian singer and songwriter',                    'https://placehold.co/500x500/2d1b69/ffffff?text=Weeknd'),
  ('artist-3',  'Daft Punk',      'French electronic music duo',                       'https://placehold.co/500x500/1c1c1c/ffd700?text=DP'),
  ('artist-4',  'Arctic Monkeys', 'English rock band from Sheffield',                  'https://placehold.co/500x500/0f0f0f/ffffff?text=AM'),
  ('artist-5',  'Tame Impala',    'Australian psychedelic music project',               'https://placehold.co/500x500/4a0e4e/ff69b4?text=TI'),
  ('artist-6',  'Billie Eilish',  'American singer and songwriter',                    'https://placehold.co/500x500/0d3b0d/00ff00?text=BE'),
  ('artist-7',  'Kendrick Lamar', 'American rapper and songwriter',                    'https://placehold.co/500x500/8b0000/ffffff?text=KL'),
  ('artist-8',  'SZA',            'American singer and songwriter',                    'https://placehold.co/500x500/654321/ffcc00?text=SZA'),
  ('artist-9',  'Tyler the Creator','American rapper, singer and producer',            'https://placehold.co/500x500/228b22/ffa500?text=TC'),
  ('artist-10', 'Frank Ocean',    'American singer, songwriter and rapper',             'https://placehold.co/500x500/191970/87ceeb?text=FO'),
  ('artist-11', 'Radiohead',      'English rock band',                                 'https://placehold.co/500x500/1a1a1a/ff4444?text=RH'),
  ('artist-12', 'Bad Bunny',      'Puerto Rican rapper and singer',                    'https://placehold.co/500x500/ff1493/ffffff?text=BB'),
  ('artist-13', 'Harry Styles',   'English singer and songwriter',                     'https://placehold.co/500x500/ffb6c1/4b0082?text=HS'),
  ('artist-14', 'Dua Lipa',       'English and Albanian singer and songwriter',        'https://placehold.co/500x500/ff69b4/000000?text=DL'),
  ('artist-15', 'BTS',            'South Korean boy band',                             'https://placehold.co/500x500/7b68ee/ffffff?text=BTS')
on conflict (id) do nothing;

-- Artist-Category links
insert into artist_categories (artist_id, category_id) values
  ('artist-1',  'cat-electronic'),
  ('artist-2',  'cat-pop'),
  ('artist-2',  'cat-rnb'),
  ('artist-3',  'cat-electronic'),
  ('artist-3',  'cat-dance'),
  ('artist-4',  'cat-rock'),
  ('artist-4',  'cat-indie'),
  ('artist-5',  'cat-alternative'),
  ('artist-5',  'cat-rock'),
  ('artist-6',  'cat-pop'),
  ('artist-6',  'cat-alternative'),
  ('artist-7',  'cat-hiphop'),
  ('artist-8',  'cat-rnb'),
  ('artist-8',  'cat-pop'),
  ('artist-9',  'cat-hiphop'),
  ('artist-9',  'cat-alternative'),
  ('artist-10', 'cat-rnb'),
  ('artist-10', 'cat-pop'),
  ('artist-11', 'cat-rock'),
  ('artist-11', 'cat-alternative'),
  ('artist-12', 'cat-latin'),
  ('artist-12', 'cat-hiphop'),
  ('artist-13', 'cat-pop'),
  ('artist-14', 'cat-pop'),
  ('artist-14', 'cat-dance'),
  ('artist-15', 'cat-kpop'),
  ('artist-15', 'cat-pop')
on conflict do nothing;

-- Albums
insert into albums (id, title, artist_id, cover_url, release_date) values
  ('album-1',  'Hurry Up, We''re Dreaming',  'artist-1',  'https://placehold.co/500x500/1a1a2e/e887e8?text=HUWD',     '2011-10-17'),
  ('album-2',  'After Hours',                'artist-2',  'https://placehold.co/500x500/2d1b69/ff0000?text=AH',       '2020-03-20'),
  ('album-3',  'Random Access Memories',     'artist-3',  'https://placehold.co/500x500/1c1c1c/ffd700?text=RAM',      '2013-05-17'),
  ('album-4',  'AM',                         'artist-4',  'https://placehold.co/500x500/0f0f0f/ffffff?text=AM',        '2013-09-09'),
  ('album-5',  'Currents',                   'artist-5',  'https://placehold.co/500x500/4a0e4e/ff69b4?text=Currents', '2015-07-17'),
  ('album-6',  'Happier Than Ever',          'artist-6',  'https://placehold.co/500x500/0d3b0d/cccccc?text=HTE',      '2021-07-30'),
  ('album-7',  'DAMN.',                      'artist-7',  'https://placehold.co/500x500/8b0000/ffffff?text=DAMN',      '2017-04-14'),
  ('album-8',  'SOS',                        'artist-8',  'https://placehold.co/500x500/654321/ffcc00?text=SOS',       '2022-12-09'),
  ('album-9',  'IGOR',                       'artist-9',  'https://placehold.co/500x500/ffc0cb/228b22?text=IGOR',     '2019-05-17'),
  ('album-10', 'Blonde',                     'artist-10', 'https://placehold.co/500x500/191970/87ceeb?text=Blonde',   '2016-08-20'),
  ('album-11', 'OK Computer',                'artist-11', 'https://placehold.co/500x500/1a1a1a/cccccc?text=OKC',      '1997-05-21'),
  ('album-12', 'Un Verano Sin Ti',           'artist-12', 'https://placehold.co/500x500/ff1493/ffffff?text=UVST',     '2022-05-06'),
  ('album-13', 'Harry''s House',             'artist-13', 'https://placehold.co/500x500/ffb6c1/4b0082?text=HH',      '2022-05-20'),
  ('album-14', 'Future Nostalgia',           'artist-14', 'https://placehold.co/500x500/ff69b4/000000?text=FN',       '2020-03-27'),
  ('album-15', 'MAP OF THE SOUL: 7',         'artist-15', 'https://placehold.co/500x500/7b68ee/ffffff?text=MOTS7',    '2020-02-21'),
  ('album-16', 'Dawn FM',                    'artist-2',  'https://placehold.co/500x500/0a0a2a/00bfff?text=DawnFM',   '2022-01-07'),
  ('album-17', 'The Slow Rush',              'artist-5',  'https://placehold.co/500x500/cc5500/ffee00?text=TSR',      '2020-02-14'),
  ('album-18', 'GNX',                        'artist-7',  'https://placehold.co/500x500/333333/ff6600?text=GNX',      '2024-11-22')
on conflict (id) do nothing;

-- Songs (with varied play_counts for chart ranking)
insert into songs (id, title, artist_id, artist_name, album_id, category_id, genre, cover_url, audio_url, duration, lyrics, play_count) values
  -- M83
  ('song-1',  'Midnight City',        'artist-1',  'M83',              'album-1',  'cat-electronic', 'Electronic', 'https://placehold.co/500x500/1a1a2e/e887e8?text=MC',  '', 244, ARRAY['Waiting in a car','Waiting for a ride in the dark','The city storm is coming in'], 48500),
  ('song-2',  'Outro',                'artist-1',  'M83',              'album-1',  'cat-electronic', 'Electronic', 'https://placehold.co/500x500/1a1a2e/c0c0ff?text=Outro','', 324, ARRAY['A new day has come'], 22000),

  -- The Weeknd
  ('song-3',  'Blinding Lights',      'artist-2',  'The Weeknd',       'album-2',  'cat-pop',        'Pop',        'https://placehold.co/500x500/2d1b69/ff0000?text=BL',  '', 200, ARRAY['I been tryna call','I been on my own for long enough'], 95000),
  ('song-4',  'Save Your Tears',      'artist-2',  'The Weeknd',       'album-2',  'cat-pop',        'Pop',        'https://placehold.co/500x500/2d1b69/ff6666?text=SYT', '', 215, ARRAY['I saw you dancing in a crowded room'], 72000),
  ('song-5',  'Take My Breath',       'artist-2',  'The Weeknd',       'album-16', 'cat-pop',        'Pop',        'https://placehold.co/500x500/0a0a2a/00bfff?text=TMB', '', 339, ARRAY['Take my breath away'], 41000),

  -- Daft Punk
  ('song-6',  'Get Lucky',            'artist-3',  'Daft Punk',        'album-3',  'cat-electronic', 'Electronic', 'https://placehold.co/500x500/1c1c1c/ffd700?text=GL',  '', 369, ARRAY['Like the legend of the phoenix','All ends with beginnings'], 88000),
  ('song-7',  'Instant Crush',        'artist-3',  'Daft Punk',        'album-3',  'cat-electronic', 'Electronic', 'https://placehold.co/500x500/1c1c1c/ff8c00?text=IC',  '', 337, ARRAY['I did not think','I did not think you''d come'], 35000),
  ('song-8',  'Lose Yourself to Dance','artist-3', 'Daft Punk',        'album-3',  'cat-dance',      'Dance',      'https://placehold.co/500x500/1c1c1c/ff1493?text=LYTD','', 353, NULL, 52000),

  -- Arctic Monkeys
  ('song-9',  'Do I Wanna Know?',     'artist-4',  'Arctic Monkeys',   'album-4',  'cat-rock',       'Rock',       'https://placehold.co/500x500/0f0f0f/ffffff?text=DIWK', '', 272, ARRAY['Have you got colour in your cheeks?'], 81000),
  ('song-10', 'R U Mine?',            'artist-4',  'Arctic Monkeys',   'album-4',  'cat-rock',       'Rock',       'https://placehold.co/500x500/0f0f0f/cccccc?text=RUM',  '', 202, ARRAY['I''m a puppet on a string'], 54000),
  ('song-11', 'Why''d You Only Call Me When You''re High?', 'artist-4', 'Arctic Monkeys', 'album-4', 'cat-rock', 'Rock', 'https://placehold.co/500x500/0f0f0f/888888?text=WYOC', '', 163, NULL, 43000),

  -- Tame Impala
  ('song-12', 'The Less I Know the Better', 'artist-5', 'Tame Impala',  'album-5',  'cat-alternative','Alternative','https://placehold.co/500x500/4a0e4e/ff69b4?text=TLIB', '', 218, ARRAY['Someone said they left together','I ran out the door to get her'], 76000),
  ('song-13', 'Let It Happen',        'artist-5',  'Tame Impala',      'album-5',  'cat-alternative','Alternative','https://placehold.co/500x500/4a0e4e/ff00ff?text=LIH',  '', 467, NULL, 38000),
  ('song-14', 'Lost in Yesterday',    'artist-5',  'Tame Impala',      'album-17', 'cat-alternative','Alternative','https://placehold.co/500x500/cc5500/ffee00?text=LIY',  '', 254, NULL, 29000),

  -- Billie Eilish
  ('song-15', 'Happier Than Ever',    'artist-6',  'Billie Eilish',    'album-6',  'cat-pop',        'Pop',        'https://placehold.co/500x500/0d3b0d/ffffff?text=HTE',  '', 298, ARRAY['When I''m away from you','I''m happier than ever'], 63000),
  ('song-16', 'Therefore I Am',       'artist-6',  'Billie Eilish',    'album-6',  'cat-pop',        'Pop',        'https://placehold.co/500x500/0d3b0d/00ff00?text=TIA',  '', 174, NULL, 47000),

  -- Kendrick Lamar
  ('song-17', 'HUMBLE.',              'artist-7',  'Kendrick Lamar',   'album-7',  'cat-hiphop',     'Hip-Hop',    'https://placehold.co/500x500/8b0000/ffffff?text=HUM',  '', 177, ARRAY['Nobody pray for me','Sit down, be humble'], 91000),
  ('song-18', 'DNA.',                 'artist-7',  'Kendrick Lamar',   'album-7',  'cat-hiphop',     'Hip-Hop',    'https://placehold.co/500x500/8b0000/ff4444?text=DNA',  '', 185, ARRAY['I got loyalty, got royalty inside my DNA'], 68000),
  ('song-19', 'luther',               'artist-7',  'Kendrick Lamar',   'album-18', 'cat-hiphop',     'Hip-Hop',    'https://placehold.co/500x500/333333/ff6600?text=LTR',  '', 210, NULL, 55000),

  -- SZA
  ('song-20', 'Kill Bill',            'artist-8',  'SZA',              'album-8',  'cat-rnb',        'R&B',        'https://placehold.co/500x500/654321/ffcc00?text=KB',   '', 154, ARRAY['I might kill my ex'], 84000),
  ('song-21', 'Snooze',               'artist-8',  'SZA',              'album-8',  'cat-rnb',        'R&B',        'https://placehold.co/500x500/654321/ff9900?text=SNZ',  '', 201, NULL, 59000),

  -- Tyler the Creator
  ('song-22', 'EARFQUAKE',            'artist-9',  'Tyler, the Creator','album-9', 'cat-hiphop',     'Hip-Hop',    'https://placehold.co/500x500/ffc0cb/228b22?text=EQ',   '', 190, ARRAY['Don''t leave, it''s my fault'], 70000),
  ('song-23', 'NEW MAGIC WAND',       'artist-9',  'Tyler, the Creator','album-9', 'cat-hiphop',     'Hip-Hop',    'https://placehold.co/500x500/ffc0cb/006400?text=NMW',  '', 200, NULL, 37000),

  -- Frank Ocean
  ('song-24', 'Nights',               'artist-10', 'Frank Ocean',      'album-10', 'cat-rnb',        'R&B',        'https://placehold.co/500x500/191970/87ceeb?text=NGT',  '', 303, ARRAY['Every night fucks every day up','Every day patches the night up'], 71000),
  ('song-25', 'Pink + White',         'artist-10', 'Frank Ocean',      'album-10', 'cat-rnb',        'R&B',        'https://placehold.co/500x500/191970/ffb6c1?text=PW',   '', 185, NULL, 44000),

  -- Radiohead
  ('song-26', 'Karma Police',         'artist-11', 'Radiohead',        'album-11', 'cat-rock',       'Rock',       'https://placehold.co/500x500/1a1a1a/cccccc?text=KP',   '', 263, ARRAY['Karma police, arrest this man'], 57000),
  ('song-27', 'Paranoid Android',     'artist-11', 'Radiohead',        'album-11', 'cat-rock',       'Rock',       'https://placehold.co/500x500/1a1a1a/ff4444?text=PA',   '', 386, NULL, 42000),

  -- Bad Bunny
  ('song-28', 'Titi Me Pregunto',     'artist-12', 'Bad Bunny',        'album-12', 'cat-latin',      'Latin',      'https://placehold.co/500x500/ff1493/ffffff?text=TMP',  '', 243, NULL, 79000),
  ('song-29', 'Me Porto Bonito',      'artist-12', 'Bad Bunny',        'album-12', 'cat-latin',      'Latin',      'https://placehold.co/500x500/ff1493/ffcc00?text=MPB',  '', 178, NULL, 66000),

  -- Harry Styles
  ('song-30', 'As It Was',            'artist-13', 'Harry Styles',     'album-13', 'cat-pop',        'Pop',        'https://placehold.co/500x500/ffb6c1/4b0082?text=AIW',  '', 167, ARRAY['Holding me back','Gravity''s holding me back'], 87000),
  ('song-31', 'Late Night Talking',   'artist-13', 'Harry Styles',     'album-13', 'cat-pop',        'Pop',        'https://placehold.co/500x500/ffb6c1/6a0dad?text=LNT',  '', 178, NULL, 46000),

  -- Dua Lipa
  ('song-32', 'Levitating',           'artist-14', 'Dua Lipa',         'album-14', 'cat-dance',      'Dance',      'https://placehold.co/500x500/ff69b4/000000?text=LEV',  '', 203, ARRAY['If you wanna run away with me, I know a galaxy'], 82000),
  ('song-33', 'Don''t Start Now',     'artist-14', 'Dua Lipa',         'album-14', 'cat-dance',      'Dance',      'https://placehold.co/500x500/ff69b4/333333?text=DSN',  '', 183, NULL, 61000),

  -- BTS
  ('song-34', 'Dynamite',             'artist-15', 'BTS',              'album-15', 'cat-kpop',       'K-Pop',      'https://placehold.co/500x500/7b68ee/ffffff?text=DYN',  '', 199, ARRAY['Cause I-I-I''m in the stars tonight'], 93000),
  ('song-35', 'Butter',               'artist-15', 'BTS',              'album-15', 'cat-kpop',       'K-Pop',      'https://placehold.co/500x500/7b68ee/ffd700?text=BTR',  '', 169, NULL, 74000)
on conflict (id) do nothing;
