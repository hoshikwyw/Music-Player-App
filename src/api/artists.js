import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { mapArtist, mapSong, SONG_SELECT } from "./mappers";
import { queryKeys } from "./queryKeys";

// Every artist, ranked by play count.
export function useArtists() {
  return useQuery({
    queryKey: queryKeys.artists(),
    queryFn: async () => {
      const { data, error } = await supabase.from("top_artists").select("*");
      if (error) throw error;
      return data.map(mapArtist);
    },
  });
}

// The leaderboard slice. Distinct key from useArtists -- same view, different
// row count, so sharing a key would let whichever mounted first win.
export function useTopArtists() {
  return useQuery({
    queryKey: queryKeys.topArtists(),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("top_artists")
        .select("*")
        .limit(20);
      if (error) throw error;
      return data.map(mapArtist);
    },
  });
}

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
