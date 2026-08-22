import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  MOCK_PLAYLISTS,
  type PlaylistLoadState,
} from "@/components/playlist/playlist-data";
import { syncSpotifyPlaylists } from "@/services/playlist-sync";

const isDevelopmentAuthBypass =
  import.meta.env.DEV && import.meta.env.VITE_DEV_AUTH_BYPASS === "true";

function getPreviewState(value: string | null): PlaylistLoadState | null {
  return value === "loading" || value === "error" || value === "empty" ? value : null;
}

export function usePlaylistSelection() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [loadState, setLoadState] = useState<PlaylistLoadState>("loading");
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [syncAttempt, setSyncAttempt] = useState(0);
  const lastSyncedAttemptRef = useRef<number | null>(null);
  const previewState = getPreviewState(searchParams.get("state"));
  const currentState = previewState ?? loadState;

  useEffect(() => {
    if (previewState) return undefined;

    // 로컬 화면 작업용 우회에서는 실제 인증 쿠키가 없으므로 기존 목 데이터를 유지한다.
    if (isDevelopmentAuthBypass) {
      const timer = window.setTimeout(() => setLoadState("ready"), 850);
      return () => window.clearTimeout(timer);
    }

    // StrictMode가 개발 환경에서 effect를 다시 실행해도 같은 동기화를 중복 호출하지 않는다.
    if (lastSyncedAttemptRef.current === syncAttempt) return undefined;
    lastSyncedAttemptRef.current = syncAttempt;

    let isActive = true;

    async function sync() {
      try {
        await syncSpotifyPlaylists();
        if (isActive) setLoadState("ready");
      } catch {
        if (isActive) setLoadState("error");
      }
    }

    void sync();

    return () => {
      isActive = false;
    };
  }, [previewState, syncAttempt]);

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
    setSyncAttempt((attempt) => attempt + 1);
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
