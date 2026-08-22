import {
  getApiUrl,
  getSpotifyAccessToken,
  SpotifyAuthError,
} from "@/services/spotify-auth";

const PLAYLIST_SYNC_PATH = "/api/v1/playlists/sync";
let ongoingPlaylistSync: Promise<PlaylistSyncSummary> | null = null;

interface PlaylistSyncResult {
  syncedPlaylistCount: unknown;
  syncedTrackCount: unknown;
  lastSyncedAt: unknown;
}

interface ApiResponse<T> {
  isSuccess?: unknown;
  message?: unknown;
  result?: T;
}

export interface PlaylistSyncSummary {
  lastSyncedAt: string;
  syncedPlaylistCount: number;
  syncedTrackCount: number;
}

export class PlaylistSyncError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PlaylistSyncError";
  }
}

function getErrorMessage(payload: unknown, fallback: string) {
  if (
    payload
    && typeof payload === "object"
    && "message" in payload
    && typeof payload.message === "string"
    && payload.message.trim()
  ) {
    return payload.message;
  }

  return fallback;
}

async function readJson(response: Response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

function getSummary(payload: unknown): PlaylistSyncSummary {
  if (!payload || typeof payload !== "object" || !("isSuccess" in payload)) {
    throw new PlaylistSyncError("플레이리스트 동기화 응답 형식이 올바르지 않습니다.");
  }

  const response = payload as ApiResponse<PlaylistSyncResult>;
  if (response.isSuccess !== true) {
    throw new PlaylistSyncError(getErrorMessage(payload, "플레이리스트 동기화에 실패했습니다."));
  }

  const result = response.result;
  if (
    !result
    || typeof result.syncedPlaylistCount !== "number"
    || typeof result.syncedTrackCount !== "number"
    || typeof result.lastSyncedAt !== "string"
  ) {
    throw new PlaylistSyncError("플레이리스트 동기화 응답에 필요한 값이 없습니다.");
  }

  return {
    syncedPlaylistCount: result.syncedPlaylistCount,
    syncedTrackCount: result.syncedTrackCount,
    lastSyncedAt: result.lastSyncedAt,
  };
}

/**
 * Spotify의 내 플레이리스트와 수록곡을 SetPik 서버에 동기화한다.
 * 동기화된 목록은 다음 단계의 GET /api/v1/playlists에서 조회한다.
 */
async function requestSpotifyPlaylistSync() {
  let token: string;

  try {
    token = await getSpotifyAccessToken();
  } catch (error) {
    if (error instanceof SpotifyAuthError) {
      throw new PlaylistSyncError(error.message);
    }

    throw new PlaylistSyncError("로그인 정보를 확인하지 못했습니다. 다시 로그인해 주세요.");
  }

  let response: Response;

  try {
    response = await fetch(getApiUrl(PLAYLIST_SYNC_PATH), {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
      cache: "no-store",
    });
  } catch {
    throw new PlaylistSyncError("플레이리스트 동기화 서버에 연결하지 못했습니다.");
  }

  const payload = await readJson(response);

  if (response.status === 401) {
    throw new PlaylistSyncError("로그인이 만료되었습니다. 다시 로그인해 주세요.");
  }

  if (!response.ok) {
    throw new PlaylistSyncError(getErrorMessage(payload, "플레이리스트 동기화에 실패했습니다."));
  }

  return getSummary(payload);
}

export function syncSpotifyPlaylists() {
  if (ongoingPlaylistSync) return ongoingPlaylistSync;

  const request = requestSpotifyPlaylistSync();
  ongoingPlaylistSync = request;
  request.then(
    () => {
      if (ongoingPlaylistSync === request) ongoingPlaylistSync = null;
    },
    () => {
      if (ongoingPlaylistSync === request) ongoingPlaylistSync = null;
    },
  );

  return request;
}
