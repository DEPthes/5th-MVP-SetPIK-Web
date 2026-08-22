const SPOTIFY_LOGIN_START_PATH = "/api/v1/auth/spotify/login";
const ACCESS_TOKEN_REFRESH_PATH = "/api/v1/auth/token/refresh";

let accessToken: string | null = null;
let accessTokenRefreshRequest: Promise<string> | null = null;

interface ApiResponse<T> {
  isSuccess?: unknown;
  message?: unknown;
  result?: T;
}

interface AccessTokenPayload {
  accessToken: unknown;
}

export class SpotifyAuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SpotifyAuthError";
  }
}

function getApiOrigin() {
  const configuredOrigin = import.meta.env.VITE_API_BASE_URL?.trim();

  return configuredOrigin || window.location.origin;
}

export function getApiUrl(path: string) {
  return new URL(path, getApiOrigin()).toString();
}

function getErrorMessage(payload: unknown, fallback: string) {
  if (
    payload &&
    typeof payload === "object" &&
    "message" in payload &&
    typeof payload.message === "string" &&
    payload.message.trim()
  ) {
    return payload.message;
  }

  return fallback;
}

function isApiResponse(value: unknown): value is ApiResponse<unknown> {
  return Boolean(value) && typeof value === "object";
}

async function readJson(response: Response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

/**
 * 백엔드가 state 쿠키를 같은 사이트 탐색으로 설정한 뒤 Spotify로 302 이동한다.
 * 프론트는 이 주소로 직접 이동해야 한다.
 */
export function getSpotifyLoginStartUrl() {
  const loginUrl = new URL(getApiUrl(SPOTIFY_LOGIN_START_PATH));

  // 백엔드는 이 값을 허용된 프론트 주소인지 검증한 뒤 OAuth 완료 후 되돌려 준다.
  // 따라서 로컬에서는 localhost:5173, 배포에서는 Vercel 주소가 전달된다.
  loginUrl.searchParams.set("frontendUrl", window.location.origin);

  return loginUrl.toString();
}

/**
 * OAuth 콜백이 HttpOnly Refresh Token 쿠키를 설정한 뒤 호출합니다.
 * 이 요청이 성공한 경우에만 프론트의 로그인 상태를 갱신해야 합니다.
 */
export async function confirmSpotifyLogin() {
  return refreshSpotifyAccessToken();
}

/**
 * Refresh Token 쿠키로 Access Token을 다시 발급받는다.
 * Access Token은 localStorage에 저장하지 않고, 열린 브라우저 탭의 메모리에만 둔다.
 */
export async function refreshSpotifyAccessToken() {
  if (accessTokenRefreshRequest) return accessTokenRefreshRequest;

  accessTokenRefreshRequest = (async () => {
  let response: Response;

    try {
      response = await fetch(getApiUrl(ACCESS_TOKEN_REFRESH_PATH), {
        method: "POST",
        headers: { Accept: "application/json" },
        credentials: "include",
        cache: "no-store",
      });
    } catch {
      throw new SpotifyAuthError("로그인 정보를 확인할 수 없습니다. 다시 시도해주세요.");
    }

    const payload = await readJson(response);

    if (!response.ok) {
      throw new SpotifyAuthError(getErrorMessage(payload, "로그인 정보를 확인하지 못했습니다."));
    }

    if (!isApiResponse(payload) || payload.isSuccess !== true) {
      throw new SpotifyAuthError(getErrorMessage(payload, "로그인 정보를 확인하지 못했습니다."));
    }

    const result = payload.result as AccessTokenPayload | undefined;
    if (!result || typeof result.accessToken !== "string" || !result.accessToken.trim()) {
      throw new SpotifyAuthError("로그인 확인 응답에 access token이 없습니다.");
    }

    accessToken = result.accessToken.trim();
    return accessToken;
  })();

  try {
    return await accessTokenRefreshRequest;
  } finally {
    accessTokenRefreshRequest = null;
  }
}

/**
 * 인증이 필요한 API가 사용할 Access Token을 가져온다.
 * 새로고침으로 메모리 값이 사라진 경우에는 HttpOnly Refresh Token 쿠키로 재발급한다.
 */
export async function getSpotifyAccessToken() {
  return accessToken ?? refreshSpotifyAccessToken();
}

export function clearSpotifyAccessToken() {
  accessToken = null;
}
