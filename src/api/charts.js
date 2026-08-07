import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { mapSong } from "./mappers";
import { queryKeys } from "./queryKeys";

// Songs ranked by play count. The view already flattens artist and album, so
// no join is needed here.
export function useChartSongs() {
  return useQuery({
    queryKey: queryKeys.charts(),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("top_charts")
        .select("*")
        .limit(20);
      if (error) throw error;
      return data.map(mapSong);
    },
  });
}
