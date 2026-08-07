import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { mapSong } from "./mappers";
import { queryKeys, rootKeys } from "./queryKeys";

export function useLikedSongs() {
  return useQuery({
    queryKey: queryKeys.likedSongs(),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("liked_songs")
        .select("*, songs(*, albums(title))")
        .order("created_at", { ascending: false });
      if (error) throw error;
      // A like whose song was deleted comes back with songs: null.
      return data.map((row) => mapSong(row.songs)).filter(Boolean);
    },
  });
}

export function useLikeSong() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (songId) => {
      const { error } = await supabase
        .from("liked_songs")
        .insert({ song_id: songId });
      if (error) throw error;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: rootKeys.likedSongs }),
  });
}

export function useUnlikeSong() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (songId) => {
      const { error } = await supabase
        .from("liked_songs")
        .delete()
        .eq("song_id", songId);
      if (error) throw error;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: rootKeys.likedSongs }),
  });
}
