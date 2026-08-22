import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { type Playlist, type PlaylistLoadState, type PlaylistTrack } from "@/components/playlist/playlist-data";
import {
  getMyPlaylists,
  getPlaylistDetail,
  getPlaylistTracks,
} from "@/services/playlist-query";
import { syncSpotifyPlaylists } from "@/services/playlist-sync";

function getPreviewState(value: string | null): PlaylistLoadState | null {
  return value === "loading" || value === "error" || value === "empty" ? value : null;
}

export function usePlaylistSelection() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [loadState, setLoadState] = useState<PlaylistLoadState>("loading");
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [selectedTracks, setSelectedTracks] = useState<PlaylistTrack[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [syncAttempt, setSyncAttempt] = useState(0);
  const lastSyncedAttemptRef = useRef<number | null>(null);
  const previewState = getPreviewState(searchParams.get("state"));
  const currentState = previewState ?? loadState;

  useEffect(() => {
    if (previewState) return undefined;

    // StrictMode가 개발 환경에서 effect를 다시 실행해도 같은 동기화를 중복 호출하지 않는다.
    if (lastSyncedAttemptRef.current === syncAttempt) return undefined;
    lastSyncedAttemptRef.current = syncAttempt;

    let isActive = true;

    async function sync() {
      try {
        await syncSpotifyPlaylists();
        const loadedPlaylists = await getMyPlaylists();
        if (!isActive) return;
        setPlaylists(loadedPlaylists);
        setSelectedPlaylistId(null);
        setSelectedTracks([]);
        setLoadState(loadedPlaylists.length ? "ready" : "empty");
      } catch {
        if (isActive) setLoadState("error");
      }
    }

    void sync();

    return () => {
      isActive = false;
    };
  }, [previewState, syncAttempt]);

  useEffect(() => {
    if (!selectedPlaylistId) return undefined;
    const playlistId = selectedPlaylistId;

    let isActive = true;

    async function loadSelectedPlaylist() {
      try {
        const [detail, tracks] = await Promise.all([
          getPlaylistDetail(playlistId),
          getPlaylistTracks(playlistId),
        ]);

        if (!isActive) return;
        setPlaylists((current) => current.map((playlist) => (
          playlist.id === playlistId ? { ...playlist, ...detail, coverUrl: playlist.coverUrl } : playlist
        )));
        setSelectedTracks(tracks);
      } catch {
        if (isActive) setSelectedTracks([]);
      }
    }

    void loadSelectedPlaylist();

    return () => {
      isActive = false;
    };
  }, [selectedPlaylistId]);

  const filteredPlaylists = useMemo(() => {
    const normalizedSearchTerm = searchTerm.trim().toLowerCase();
    return normalizedSearchTerm
      ? playlists.filter((playlist) => playlist.title.toLowerCase().includes(normalizedSearchTerm))
      : playlists;
  }, [playlists, searchTerm]);

  const selectedPlaylist = useMemo(
    () => playlists.find((playlist) => playlist.id === selectedPlaylistId) ?? null,
    [playlists, selectedPlaylistId],
  );

  function retry() {
    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.delete("state");
    setSearchParams(nextSearchParams, { replace: true });
    setLoadState("loading");
    setSyncAttempt((attempt) => attempt + 1);
  }

  return {
    currentState,
    filteredPlaylists,
    retry,
    searchTerm,
    selectedPlaylist,
    selectedPlaylistId,
    selectedTracks,
    setSearchTerm,
    setSelectedPlaylistId,
  };
}
