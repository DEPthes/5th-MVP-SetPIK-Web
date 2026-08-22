import type { Artist } from "@/components/artist/artist-data";
import { getApiUrl, getSpotifyAccessToken, SpotifyAuthError } from "@/services/spotify-auth";

interface ApiResponse<T> {
  isSuccess?: unknown;
  message?: unknown;
  result?: T;
}

interface PlaylistAnalysisPayload {
  analysisId: unknown;
  analysisStatus: unknown;
}

interface AnalysisArtistPayload {
  artistId: unknown;
  artistName: unknown;
  occurrenceCount: unknown;
  isMajor: unknown;
  isExcluded: unknown;
}

interface AnalysisArtistPagePayload {
  content: unknown;
}

interface ArtistSelectionUpdatePayload {
  artists: Array<{
    artistId: number;
    isExcluded: boolean;
  }>;
}

export interface PlaylistAnalysis {
  analysisId: string;
  analysisStatus: string;
}

export interface AnalyzedArtist extends Artist {
  isExcluded: boolean;
}

export class AnalysisQueryError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "AnalysisQueryError";
    this.status = status;
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
    throw new AnalysisQueryError(fallback);
  }

  const response = payload as ApiResponse<T>;
  if (response.isSuccess !== true || !response.result) {
    throw new AnalysisQueryError(getErrorMessage(payload, fallback));
  }

  return response.result;
}

async function authorizedRequest(
  path: string,
  options: Pick<RequestInit, "body" | "method"> = {},
) {
  let token: string;

  try {
    token = await getSpotifyAccessToken();
  } catch (error) {
    if (error instanceof SpotifyAuthError) throw new AnalysisQueryError(error.message);
    throw new AnalysisQueryError("로그인 정보를 확인하지 못했습니다. 다시 로그인해 주세요.");
  }

  let response: Response;

  try {
    response = await fetch(getApiUrl(path), {
      method: options.method,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        ...(options.body ? { "Content-Type": "application/json" } : {}),
      },
      body: options.body,
      credentials: "include",
      cache: "no-store",
    });
  } catch {
    throw new AnalysisQueryError("아티스트 분석 서버에 연결하지 못했습니다.");
  }

  const payload = await readJson(response);

  if (response.status === 401) {
    throw new AnalysisQueryError("로그인이 만료되었습니다. 다시 로그인해 주세요.", response.status);
  }

  if (!response.ok) {
    throw new AnalysisQueryError(
      getErrorMessage(payload, "아티스트 분석 정보를 불러오지 못했습니다."),
      response.status,
    );
  }

  return payload;
}

function mapAnalysis(payload: PlaylistAnalysisPayload): PlaylistAnalysis {
  if (typeof payload.analysisId !== "number" || typeof payload.analysisStatus !== "string") {
    throw new AnalysisQueryError("플레이리스트 분석 응답 형식이 올바르지 않습니다.");
  }

  return {
    analysisId: String(payload.analysisId),
    analysisStatus: payload.analysisStatus,
  };
}

function mapArtist(payload: AnalysisArtistPayload): AnalyzedArtist {
  if (
    typeof payload.artistId !== "number"
    || typeof payload.artistName !== "string"
    || typeof payload.occurrenceCount !== "number"
    || typeof payload.isMajor !== "boolean"
    || typeof payload.isExcluded !== "boolean"
  ) {
    throw new AnalysisQueryError("아티스트 목록 응답 형식이 올바르지 않습니다.");
  }

  return {
    id: String(payload.artistId),
    name: payload.artistName,
    description: `플레이리스트에 ${payload.occurrenceCount}곡 포함`,
    appearanceCount: payload.occurrenceCount,
    isMainArtist: payload.isMajor,
    isExcluded: payload.isExcluded,
  };
}

export async function getPlaylistAnalysis(playlistId: string) {
  const payload = await authorizedRequest(
    `/api/v1/playlists/${encodeURIComponent(playlistId)}/analysis`,
  );
  const result = getResult<PlaylistAnalysisPayload>(payload, "플레이리스트 분석 정보를 불러오지 못했습니다.");

  return mapAnalysis(result);
}

export async function createPlaylistAnalysis(playlistId: string) {
  const payload = await authorizedRequest(
    `/api/v1/playlists/${encodeURIComponent(playlistId)}/analysis`,
    { method: "POST" },
  );
  const result = getResult<PlaylistAnalysisPayload>(payload, "플레이리스트 분석을 시작하지 못했습니다.");

  return mapAnalysis(result);
}

export async function getAnalysisArtists(analysisId: string) {
  const payload = await authorizedRequest(
    `/api/v1/analyses/${encodeURIComponent(analysisId)}/artists?includeExcluded=true&page=0&size=100&sort=displayRank,asc`,
  );
  const result = getResult<AnalysisArtistPagePayload>(payload, "아티스트 목록을 불러오지 못했습니다.");

  if (!Array.isArray(result.content)) {
    throw new AnalysisQueryError("아티스트 목록 응답 형식이 올바르지 않습니다.");
  }

  return result.content.map((artist) => mapArtist(artist as AnalysisArtistPayload));
}

export async function updateAnalysisArtists(
  analysisId: string,
  artists: ArtistSelectionUpdatePayload["artists"],
) {
  const payload = await authorizedRequest(
    `/api/v1/analyses/${encodeURIComponent(analysisId)}/artists`,
    {
      method: "PATCH",
      body: JSON.stringify({ artists } satisfies ArtistSelectionUpdatePayload),
    },
  );

  getResult(payload, "아티스트 선택을 저장하지 못했습니다.");
}
