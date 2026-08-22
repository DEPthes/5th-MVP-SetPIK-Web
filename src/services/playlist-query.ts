import type { Playlist, PlaylistTrack } from "@/components/playlist/playlist-data";
import { getApiUrl, getSpotifyAccessToken, SpotifyAuthError } from "@/services/spotify-auth";

let ongoingMyPlaylistsRequest: Promise<Playlist[]> | null = null;
let ongoingRecentSelectionsRequest: Promise<RecentPlaylistSelection[]> | null = null;

interface ApiResponse<T> {
  isSuccess?: unknown;
  message?: unknown;
  result?: T;
}

interface PlaylistSummaryPayload {
  playlistId: unknown;
  playlistName: unknown;
  trackCount: unknown;
  coverImageUrl: unknown;
  lastSyncedAt: unknown;
}

interface PlaylistPagePayload {
  content: unknown;
}

interface PlaylistDetailPayload {
  playlistId: unknown;
  playlistName: unknown;
  description: unknown;
  trackCount: unknown;
  lastSyncedAt: unknown;
}

interface PlaylistTrackPayload {
  playlistTrackId: unknown;
  trackPosition: unknown;
  trackName: unknown;
  albumName: unknown;
  albumImageUrl: unknown;
  addedAt: unknown;
  durationMs: unknown;
  artists: unknown;
}

interface PlaylistTrackPagePayload {
  content: unknown;
}

interface PlaylistSelectionPayload {
  playlistId: unknown;
  selectedAt: unknown;
}

interface RecentPlaylistSelectionPayload {
  playlistId: unknown;
  playlistName: unknown;
  selectedAt: unknown;
}

interface RecentPlaylistSelectionPagePayload {
  content: unknown;
}

export interface RecentPlaylistSelection {
  playlistId: string;
  playlistName: string;
  selectedAt: string;
}

export class PlaylistQueryError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PlaylistQueryError";
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

function getResult<T>(payload: unknown, fallback: string): T {
  if (!payload || typeof payload !== "object") {
    throw new PlaylistQueryError(fallback);
  }

  const response = payload as ApiResponse<T>;
  if (response.isSuccess !== true || !response.result) {
    throw new PlaylistQueryError(getErrorMessage(payload, fallback));
  }

  return response.result;
}

function formatDate(value: unknown, fallback = "동기화 날짜 정보 없음") {
  if (typeof value !== "string" || !value.trim()) return fallback;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date).replaceAll(". ", ".");
}

function formatDuration(durationMs: unknown) {
  if (typeof durationMs !== "number" || !Number.isFinite(durationMs) || durationMs < 0) {
    return "-";
  }

  const totalSeconds = Math.floor(durationMs / 1_000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function mapPlaylist(payload: PlaylistSummaryPayload): Playlist {
  if (
    typeof payload.playlistId !== "number"
    || typeof payload.playlistName !== "string"
    || typeof payload.trackCount !== "number"
  ) {
    throw new PlaylistQueryError("플레이리스트 목록 응답 형식이 올바르지 않습니다.");
  }

  return {
    id: String(payload.playlistId),
    title: payload.playlistName,
    trackCount: payload.trackCount,
    updatedAt: formatDate(payload.lastSyncedAt),
    coverUrl: typeof payload.coverImageUrl === "string" ? payload.coverImageUrl : undefined,
  };
}

function mapTrack(payload: PlaylistTrackPayload): PlaylistTrack {
  const artists = Array.isArray(payload.artists)
    ? payload.artists
      .filter((artist): artist is { artistName: string } => (
        Boolean(artist)
        && typeof artist === "object"
        && "artistName" in artist
        && typeof artist.artistName === "string"
      ))
      .map((artist) => artist.artistName)
    : [];

  if (typeof payload.trackName !== "string") {
    throw new PlaylistQueryError("수록곡 응답 형식이 올바르지 않습니다.");
  }

  return {
    id: typeof payload.playlistTrackId === "number" ? String(payload.playlistTrackId) : undefined,
    title: payload.trackName,
    artist: artists.join(", ") || "아티스트 정보 없음",
    album: typeof payload.albumName === "string" && payload.albumName.trim()
      ? payload.albumName
      : "앨범 정보 없음",
    addedAt: formatDate(payload.addedAt, "추가 날짜 정보 없음"),
    duration: formatDuration(payload.durationMs),
    durationMs: typeof payload.durationMs === "number" && Number.isFinite(payload.durationMs)
      ? payload.durationMs
      : undefined,
    coverUrl: typeof payload.albumImageUrl === "string" ? payload.albumImageUrl : undefined,
  };
}

async function authorizedRequest(path: string, options: Pick<RequestInit, "method"> = {}) {
  let token: string;

  try {
    token = await getSpotifyAccessToken();
  } catch (error) {
    if (error instanceof SpotifyAuthError) throw new PlaylistQueryError(error.message);
    throw new PlaylistQueryError("로그인 정보를 확인하지 못했습니다. 다시 로그인해 주세요.");
  }

  let response: Response;

  try {
    response = await fetch(getApiUrl(path), {
      method: options.method,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
      cache: "no-store",
    });
  } catch {
    throw new PlaylistQueryError("플레이리스트 서버에 연결하지 못했습니다.");
  }

  const payload = await readJson(response);
  if (response.status === 401) throw new PlaylistQueryError("로그인이 만료되었습니다. 다시 로그인해 주세요.");
  if (!response.ok) throw new PlaylistQueryError(getErrorMessage(payload, "플레이리스트를 불러오지 못했습니다."));

  return payload;
}

async function requestMyPlaylists() {
  const payload = await authorizedRequest("/api/v1/playlists?page=0&size=100&sort=playlistName,asc");
  const result = getResult<PlaylistPagePayload>(payload, "플레이리스트 목록을 불러오지 못했습니다.");

  if (!Array.isArray(result.content)) {
    throw new PlaylistQueryError("플레이리스트 목록 응답 형식이 올바르지 않습니다.");
  }

  return result.content.map((playlist) => mapPlaylist(playlist as PlaylistSummaryPayload));
}

export function getMyPlaylists() {
  if (ongoingMyPlaylistsRequest) return ongoingMyPlaylistsRequest;

  const request = requestMyPlaylists();
  ongoingMyPlaylistsRequest = request;
  request.finally(() => {
    if (ongoingMyPlaylistsRequest === request) ongoingMyPlaylistsRequest = null;
  }).catch(() => undefined);

  return request;
}

export async function getPlaylistDetail(playlistId: string) {
  const payload = await authorizedRequest(`/api/v1/playlists/${encodeURIComponent(playlistId)}`);
  const result = getResult<PlaylistDetailPayload>(payload, "플레이리스트 정보를 불러오지 못했습니다.");

  if (
    typeof result.playlistId !== "number"
    || typeof result.playlistName !== "string"
    || typeof result.trackCount !== "number"
  ) {
    throw new PlaylistQueryError("플레이리스트 정보 응답 형식이 올바르지 않습니다.");
  }

  return {
    id: String(result.playlistId),
    title: result.playlistName,
    trackCount: result.trackCount,
    updatedAt: formatDate(result.lastSyncedAt),
    description: typeof result.description === "string" && result.description.trim()
      ? result.description
      : "플레이리스트 설명이 없습니다.",
  } satisfies Playlist;
}

export async function getPlaylistTracks(playlistId: string) {
  const payload = await authorizedRequest(`/api/v1/playlists/${encodeURIComponent(playlistId)}/tracks?page=0&size=100&sort=trackPosition,asc`);
  const result = getResult<PlaylistTrackPagePayload>(payload, "수록곡을 불러오지 못했습니다.");

  if (!Array.isArray(result.content)) {
    throw new PlaylistQueryError("수록곡 응답 형식이 올바르지 않습니다.");
  }

  return result.content.map((track) => mapTrack(track as PlaylistTrackPayload));
}

export async function selectPlaylist(playlistId: string) {
  const payload = await authorizedRequest(
    `/api/v1/playlists/${encodeURIComponent(playlistId)}/select`,
    { method: "POST" },
  );
  const result = getResult<PlaylistSelectionPayload>(payload, "플레이리스트 선택을 저장하지 못했습니다.");

  if (typeof result.playlistId !== "number" || typeof result.selectedAt !== "string") {
    throw new PlaylistQueryError("플레이리스트 선택 응답 형식이 올바르지 않습니다.");
  }
}

async function requestRecentPlaylistSelections() {
  const payload = await authorizedRequest(
    "/api/v1/playlists/recent-selections?page=0&size=20&sort=selectedAt,desc",
  );
  const result = getResult<RecentPlaylistSelectionPagePayload>(payload, "최근 선택한 플레이리스트를 불러오지 못했습니다.");

  if (!Array.isArray(result.content)) {
    throw new PlaylistQueryError("최근 선택한 플레이리스트 응답 형식이 올바르지 않습니다.");
  }

  return result.content.map((selection): RecentPlaylistSelection => {
    const item = selection as RecentPlaylistSelectionPayload;
    if (
      typeof item.playlistId !== "number"
      || typeof item.playlistName !== "string"
      || typeof item.selectedAt !== "string"
    ) {
      throw new PlaylistQueryError("최근 선택한 플레이리스트 응답 형식이 올바르지 않습니다.");
    }

    return {
      playlistId: String(item.playlistId),
      playlistName: item.playlistName,
      selectedAt: item.selectedAt,
    };
  });
}

export function getRecentPlaylistSelections() {
  if (ongoingRecentSelectionsRequest) return ongoingRecentSelectionsRequest;

  const request = requestRecentPlaylistSelections();
  ongoingRecentSelectionsRequest = request;
  request.finally(() => {
    if (ongoingRecentSelectionsRequest === request) ongoingRecentSelectionsRequest = null;
  }).catch(() => undefined);

  return request;
}
