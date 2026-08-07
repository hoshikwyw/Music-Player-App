import { useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { queryKeys, rootKeys } from "./queryKeys";

// The dashboard edits database columns directly, so these hooks deliberately
// return raw rows rather than mapped domain objects.

// Which caches each table's writes affect. Songs touch the most: play counts
// feed the charts, and song_count feeds the artist and album rankings.
const AFFECTED_KEYS = {
  songs: [rootKeys.admin, rootKeys.songs, rootKeys.charts, rootKeys.artists, rootKeys.albums],
  artists: [rootKeys.admin, rootKeys.artists, rootKeys.songs],
  albums: [rootKeys.admin, rootKeys.albums, rootKeys.songs],
};

function useInvalidator(table) {
  const queryClient = useQueryClient();

  return useCallback(() => {
    AFFECTED_KEYS[table].forEach((queryKey) =>
      queryClient.invalidateQueries({ queryKey })
    );
  }, [queryClient, table]);
}

function useInsertRow(table) {
  const invalidate = useInvalidator(table);

  return useMutation({
    mutationFn: async (values) => {
      const { error } = await supabase.from(table).insert(values);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });
}

function useUpdateRow(table) {
  const invalidate = useInvalidator(table);

  return useMutation({
    mutationFn: async ({ id, ...updates }) => {
      const { error } = await supabase.from(table).update(updates).eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });
}

function useDeleteRow(table) {
  const invalidate = useInvalidator(table);

  return useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from(table).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });
}

// --- Songs ---
export function useAdminSongs() {
  return useQuery({
    queryKey: queryKeys.adminSongs(),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("songs")
        .select("*, artists(name), albums(title), categories(name)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export const useAddSong = () => useInsertRow("songs");
export const useUpdateSong = () => useUpdateRow("songs");
export const useDeleteSong = () => useDeleteRow("songs");

// --- Artists ---
export function useAdminArtists() {
  return useQuery({
    queryKey: queryKeys.adminArtists(),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("artists")
        .select("*")
        .order("name");
      if (error) throw error;
      return data;
    },
  });
}

export const useAddArtist = () => useInsertRow("artists");
export const useUpdateArtist = () => useUpdateRow("artists");
export const useDeleteArtist = () => useDeleteRow("artists");

// --- Albums ---
export function useAdminAlbums() {
  return useQuery({
    queryKey: queryKeys.adminAlbums(),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("albums")
        .select("*, artists(name)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export const useAddAlbum = () => useInsertRow("albums");
export const useUpdateAlbum = () => useUpdateRow("albums");
export const useDeleteAlbum = () => useDeleteRow("albums");

// --- Storage ---
export function useUploadFile() {
  return useMutation({
    mutationFn: async ({ bucket, path, file }) => {
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(path, file, { upsert: true });
      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);
      return urlData.publicUrl;
    },
  });
}
