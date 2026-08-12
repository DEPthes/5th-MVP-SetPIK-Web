import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  MOCK_PLAYLISTS,
  type PlaylistLoadState,
} from "@/components/playlist/playlist-data";

function getPreviewState(value: string | null): PlaylistLoadState | null {
  return value === "loading" || value === "error" || value === "empty" ? value : null;
}

export function usePlaylistSelection() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [loadState, setLoadState] = useState<PlaylistLoadState>("loading");
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const previewState = getPreviewState(searchParams.get("state"));
  const currentState = previewState ?? loadState;

  useEffect(() => {
    if (previewState || loadState !== "loading") {
      return undefined;
    }

    const timer = window.setTimeout(() => setLoadState("ready"), 850);
    return () => window.clearTimeout(timer);
  }, [loadState, previewState]);

  const filteredPlaylists = useMemo(() => {
    const normalizedSearchTerm = searchTerm.trim().toLowerCase();
    return normalizedSearchTerm
      ? MOCK_PLAYLISTS.filter((playlist) => playlist.title.toLowerCase().includes(normalizedSearchTerm))
      : MOCK_PLAYLISTS;
  }, [searchTerm]);

  const selectedPlaylist = useMemo(
    () => MOCK_PLAYLISTS.find((playlist) => playlist.id === selectedPlaylistId) ?? null,
    [selectedPlaylistId],
  );

  function retry() {
    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.delete("state");
    setSearchParams(nextSearchParams, { replace: true });
    setLoadState("loading");
  }

  return {
    currentState,
    filteredPlaylists,
    retry,
    searchTerm,
    selectedPlaylist,
    selectedPlaylistId,
    setSearchTerm,
    setSelectedPlaylistId,
  };
}
