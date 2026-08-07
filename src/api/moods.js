import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { getMood } from "../lib/moods";
import { mapSong, SONG_SELECT } from "./mappers";
import { queryKeys } from "./queryKeys";

// Songs for a mood, newest-feeling first (most played). A mood with no
// category filter returns everything.
//
// This resolves category slugs to ids on every call rather than reading from
// the cached categories query, so the hook stays self-contained. If moods ever
// become a real column, this is the only function that changes.
export function useMoodSongs(moodSlug) {
  return useQuery({
    queryKey: queryKeys.moodSongs(moodSlug),
    queryFn: async () => {
      const mood = getMood(moodSlug);
      if (!mood) return [];

      let query = supabase
        .from("songs")
        .select(SONG_SELECT)
        .order("play_count", { ascending: false });

      if (mood.categories) {
        const { data: categories, error: categoryError } = await supabase
          .from("categories")
          .select("id")
          .in("slug", mood.categories);
        if (categoryError) throw categoryError;

        const ids = categories.map((category) => category.id);
        // No matching categories means no songs -- not "every song".
        if (ids.length === 0) return [];
        query = query.in("category_id", ids);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data.map(mapSong);
    },
    enabled: !!moodSlug,
  });
}
