import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { type Playlist, type PlaylistLoadState, type PlaylistTrack } from "@/components/playlist/playlist-data";
import {
  getMyPlaylists,
  getPlaylistDetail,
  getPlaylistTracks,
  PlaylistQueryError,
  selectPlaylist,
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
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionError, setSelectionError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [syncAttempt, setSyncAttempt] = useState(0);
  const previewState = getPreviewState(searchParams.get("state"));
  const currentState = previewState ?? loadState;

  useEffect(() => {
    if (previewState) return undefined;

    let isActive = true;

    async function loadPlaylists() {
      try {
        // 이미 동기화된 목록은 먼저 보여 주고, Spotify 동기화는 뒤에서 진행한다.
        // 첫 로그인처럼 저장된 목록이 없는 경우에는 동기화 완료 후의 목록을 보여 준다.
        const existingPlaylistsPromise = getMyPlaylists();
        const syncPromise = syncSpotifyPlaylists();
        const existingPlaylists = await existingPlaylistsPromise.catch(() => null);

        if (isActive && existingPlaylists?.length) {
          setPlaylists(existingPlaylists);
          setSelectedPlaylistId(null);
          setSelectedTracks([]);
          setSelectionError(null);
          setLoadState("ready");
        }

        if (!isActive) return;
        await syncPromise;
        const loadedPlaylists = await getMyPlaylists();
        if (!isActive) return;
        setPlaylists(loadedPlaylists);
        setSelectedPlaylistId(null);
        setSelectedTracks([]);
        setSelectionError(null);
        setLoadState(loadedPlaylists.length ? "ready" : "empty");
      } catch {
        if (isActive) setLoadState("error");
      }
    }

    void loadPlaylists();

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

  async function saveSelectedPlaylist() {
    if (!selectedPlaylistId || isSelecting) return false;

    setIsSelecting(true);
    setSelectionError(null);

    try {
      await selectPlaylist(selectedPlaylistId);
      return true;
    } catch (error) {
      setSelectionError(
        error instanceof PlaylistQueryError
          ? error.message
          : "플레이리스트 선택을 저장하지 못했습니다. 다시 시도해 주세요.",
      );
      return false;
    } finally {
      setIsSelecting(false);
    }
  }

  return {
    currentState,
    filteredPlaylists,
    retry,
    saveSelectedPlaylist,
    searchTerm,
    isSelecting,
    selectionError,
    selectedPlaylist,
    selectedPlaylistId,
    selectedTracks,
    setSearchTerm,
    setSelectedPlaylistId,
  };
}
