import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { mapAlbum, mapSong, SONG_SELECT } from "./mappers";
import { queryKeys } from "./queryKeys";

export function useTopAlbums() {
  return useQuery({
    queryKey: queryKeys.topAlbums(),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("top_albums")
        .select("*")
        .limit(20);
      if (error) throw error;
      return data.map(mapAlbum);
    },
  });
}

export function useAlbumDetail(albumId) {
  return useQuery({
    queryKey: queryKeys.album(albumId),
    queryFn: async () => {
      const { data: album, error: albumError } = await supabase
        .from("albums")
        .select("*, artists(name, avatar_url)")
        .eq("id", albumId)
        .single();
      if (albumError) throw albumError;

      const { data: songs, error: songsError } = await supabase
        .from("songs")
        .select(SONG_SELECT)
        .eq("album_id", albumId)
        .order("created_at");
      if (songsError) throw songsError;

      return {
        album: {
          ...mapAlbum(album),
          artistAvatarUrl: album.artists?.avatar_url ?? "",
        },
        songs: songs.map(mapSong),
      };
    },
    enabled: !!albumId,
  });
}
