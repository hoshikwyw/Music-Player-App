import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { mapSong, SONG_SELECT } from "./mappers";
import { queryKeys, rootKeys } from "./queryKeys";

// Songs, optionally narrowed to one category slug.
export function useSongs(genreSlug) {
  return useQuery({
    queryKey: queryKeys.songs(genreSlug),
    queryFn: async () => {
      let query = supabase
        .from("songs")
        .select(SONG_SELECT)
        .order("play_count", { ascending: false });

      if (genreSlug) {
        const { data: category } = await supabase
          .from("categories")
          .select("id")
          .eq("slug", genreSlug)
          .single();

        if (category) query = query.eq("category_id", category.id);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data.map(mapSong);
    },
  });
}

export function useSongDetail(songId) {
  return useQuery({
    queryKey: queryKeys.song(songId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("songs")
        .select(SONG_SELECT)
        .eq("id", songId)
        .single();
      if (error) throw error;
      return mapSong(data);
    },
    enabled: !!songId,
  });
}

// Other songs in the same genre.
export function useRelatedSongs(songId) {
  return useQuery({
    queryKey: queryKeys.relatedSongs(songId),
    queryFn: async () => {
      const { data: current, error: currentError } = await supabase
        .from("songs")
        .select("genre")
        .eq("id", songId)
        .single();
      if (currentError) throw currentError;

      const { data, error } = await supabase
        .from("songs")
        .select(SONG_SELECT)
        .ilike("genre", current.genre)
        .neq("id", songId)
        .order("play_count", { ascending: false })
        .limit(10);
      if (error) throw error;
      return data.map(mapSong);
    },
    enabled: !!songId,
  });
}

export function useSearchSongs(searchTerm) {
  return useQuery({
    queryKey: queryKeys.searchSongs(searchTerm),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("songs")
        .select(SONG_SELECT)
        .or(`title.ilike.%${searchTerm}%,artist_name.ilike.%${searchTerm}%`)
        .order("play_count", { ascending: false });
      if (error) throw error;
      return data.map(mapSong);
    },
    enabled: !!searchTerm,
  });
}

// Bumps play_count and appends to play_history via a security-definer function.
export function useTrackPlay() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (songId) => {
      const { error } = await supabase.rpc("increment_play_count", {
        p_song_id: songId,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      // Play counts drive every ranking in the app.
      queryClient.invalidateQueries({ queryKey: rootKeys.charts });
      queryClient.invalidateQueries({ queryKey: rootKeys.artists });
      queryClient.invalidateQueries({ queryKey: rootKeys.albums });
    },
  });
}
