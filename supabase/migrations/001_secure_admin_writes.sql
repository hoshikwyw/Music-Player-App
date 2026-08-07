-- ============================================
-- 001: Move content writes behind an admin allow-list
-- ============================================
-- Before this migration every write policy was `using (true)`, so anyone
-- holding the anon key (which Vite inlines into the public bundle) could
-- insert, update, or delete songs, artists, and albums.
--
-- Run this whole file in the Supabase SQL editor, then grant yourself admin:
--
--   1. Authentication > Users > Add user  (email + password)
--   2. Copy the new user's UUID
--   3. insert into admins (user_id) values ('<paste-uuid-here>');
--
-- ============================================


-- --------------------------------------------
-- Admin allow-list
-- --------------------------------------------
create table if not exists admins (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table admins enable row level security;

-- A signed-in user may see their own row. There is no insert/update/delete
-- policy, so the table is only writable from the SQL editor or service role.
drop policy if exists "Read own admin row" on admins;
create policy "Read own admin row" on admins
  for select using (auth.uid() = user_id);

-- security definer so RLS policies can call this without recursing into the
-- admins table's own policies. Pinned search_path prevents shadowing attacks.
create or replace function is_admin()
returns boolean as $$
  select exists (select 1 from admins where user_id = auth.uid());
$$ language sql stable security definer set search_path = public;

grant execute on function is_admin() to anon, authenticated;


-- --------------------------------------------
-- Harden the existing play-count function
-- --------------------------------------------
-- Unchanged behaviour, but with a pinned search_path. It stays security
-- definer, which is what lets plays be recorded without any write policy.
create or replace function increment_play_count(p_song_id text)
returns void as $$
begin
  update songs set play_count = play_count + 1 where id = p_song_id;
  insert into play_history (song_id) values (p_song_id);
end;
$$ language plpgsql security definer set search_path = public;


-- --------------------------------------------
-- Drop the permissive write policies
-- --------------------------------------------
-- Note: "Public update play_count" did NOT limit writes to the play_count
-- column. RLS cannot scope a policy to specific columns, so that policy
-- allowed rewriting every field of every song. It is also unnecessary, since
-- increment_play_count() is security definer and bypasses RLS.
drop policy if exists "Public update play_count" on songs;
drop policy if exists "Public insert" on songs;
drop policy if exists "Public delete" on songs;
drop policy if exists "Public insert" on artists;
drop policy if exists "Public update" on artists;
drop policy if exists "Public delete" on artists;
drop policy if exists "Public insert" on albums;
drop policy if exists "Public update" on albums;
drop policy if exists "Public delete" on albums;

-- play_history is written only by increment_play_count(), and its contents are
-- a listening log rather than public data.
drop policy if exists "Public insert" on play_history;
drop policy if exists "Public read"   on play_history;

create policy "Admin read" on play_history
  for select to authenticated using (is_admin());


-- --------------------------------------------
-- Admin-only writes on content tables
-- --------------------------------------------
do $$
declare
  t text;
begin
  foreach t in array array['songs', 'artists', 'albums', 'categories', 'artist_categories']
  loop
    execute format('drop policy if exists "Admin insert" on %I', t);
    execute format('drop policy if exists "Admin update" on %I', t);
    execute format('drop policy if exists "Admin delete" on %I', t);

    execute format(
      'create policy "Admin insert" on %I for insert to authenticated with check (is_admin())', t);
    execute format(
      'create policy "Admin update" on %I for update to authenticated using (is_admin()) with check (is_admin())', t);
    execute format(
      'create policy "Admin delete" on %I for delete to authenticated using (is_admin())', t);
  end loop;
end $$;


-- --------------------------------------------
-- Storage: public read, admin-only write
-- --------------------------------------------
-- Without these, anyone with the anon key can overwrite or delete your audio
-- files and cover art, because useUploadFile() uploads with upsert: true.
drop policy if exists "Public read media"  on storage.objects;
drop policy if exists "Admin write media"  on storage.objects;
drop policy if exists "Admin update media" on storage.objects;
drop policy if exists "Admin delete media" on storage.objects;

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


-- --------------------------------------------
-- Still open by design: liked_songs
-- --------------------------------------------
-- liked_songs keeps public read/insert/delete so listeners never have to sign
-- in. That means anyone with the anon key can add to or clear the liked list.
-- Acceptable for a single-user personal app; revisit if this is ever shared.
