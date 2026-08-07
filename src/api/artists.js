import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { mapArtist, mapSong, SONG_SELECT } from "./mappers";
import { queryKeys } from "./queryKeys";

// Artists are reachable from a track, not browsed as a list, so there is no
// useArtists / useTopArtists any more. The top_artists view still exists in
// the database if you want to bring a leaderboard back.
export function useArtistDetail(artistId) {
  return useQuery({
    queryKey: queryKeys.artist(artistId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("artists")
        .select("*")
        .eq("id", artistId)
        .single();
      if (error) throw error;

      const { data: categories } = await supabase
        .from("artist_categories")
        .select("categories(name)")
        .eq("artist_id", artistId);

      return {
        ...mapArtist(data),
        genres: categories?.map((c) => c.categories.name).filter(Boolean) ?? [],
      };
    },
    enabled: !!artistId,
  });
}

export function useArtistSongs(artistId) {
  return useQuery({
    queryKey: queryKeys.artistSongs(artistId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("songs")
        .select(SONG_SELECT)
        .eq("artist_id", artistId)
        .order("play_count", { ascending: false });
      if (error) throw error;
      return data.map(mapSong);
    },
    enabled: !!artistId,
  });
}
