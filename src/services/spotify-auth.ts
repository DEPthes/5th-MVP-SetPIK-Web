const SPOTIFY_CALLBACK_PATH = "/api/v1/auth/spotify/callback";
const SPOTIFY_LOGIN_URL_PATH = "/api/v1/auth/spotify/login-url";
const ACCESS_TOKEN_REFRESH_PATH = "/api/v1/auth/token/refresh";
const SPOTIFY_ACCOUNTS_HOST = "accounts.spotify.com";

interface SpotifyLoginUrlPayload {
  loginUrl: unknown;
  state: unknown;
}

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

function getApiUrl(path: string) {
  return new URL(path, getApiOrigin()).toString();
}

function getConfiguredRedirectUri() {
  const configuredUri = import.meta.env.VITE_SPOTIFY_REDIRECT_URI?.trim();

  if (configuredUri) {
    return configuredUri;
  }

  return getApiUrl(SPOTIFY_CALLBACK_PATH);
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

function isApiResponse(value: unknown): value is ApiResponse<SpotifyLoginUrlPayload> {
  return Boolean(value) && typeof value === "object";
}

function getSpotifyLoginUrl(payload: unknown) {
  if (!isApiResponse(payload)) {
    throw new SpotifyAuthError("로그인 URL 응답 형식이 올바르지 않습니다.");
  }

  if (payload.isSuccess !== true) {
    throw new SpotifyAuthError(getErrorMessage(payload, "Spotify 로그인 URL 발급에 실패했습니다."));
  }

  const result = payload.result;
  if (!result || typeof result.loginUrl !== "string" || typeof result.state !== "string") {
    throw new SpotifyAuthError("로그인 URL 응답에 필요한 값이 없습니다.");
  }

  const state = result.state.trim();
  if (!state) {
    throw new SpotifyAuthError("로그인 URL 응답의 state 값이 비어 있습니다.");
  }

  let loginUrl: URL;
  try {
    loginUrl = new URL(result.loginUrl);
  } catch {
    throw new SpotifyAuthError("로그인 URL 형식이 올바르지 않습니다.");
  }

  if (loginUrl.protocol !== "https:" || loginUrl.hostname !== SPOTIFY_ACCOUNTS_HOST) {
    throw new SpotifyAuthError("허용되지 않은 Spotify 로그인 URL입니다.");
  }

  if (loginUrl.searchParams.get("state") !== state) {
    throw new SpotifyAuthError("Spotify 로그인 state 검증에 실패했습니다.");
  }

  return loginUrl.toString();
}

async function readJson(response: Response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

/**
 * 백엔드가 OAuth state 쿠키를 발급한 뒤 Spotify 인가 URL을 반환합니다.
 * callback은 프론트가 아닌 백엔드 API 주소여야 합니다.
 */
export async function requestSpotifyLoginUrl() {
  let response: Response;

  try {
    response = await fetch(
      `${getApiUrl(SPOTIFY_LOGIN_URL_PATH)}?${new URLSearchParams({
        redirectUri: getConfiguredRedirectUri(),
      })}`,
      {
        method: "GET",
        headers: { Accept: "application/json" },
        credentials: "include",
        cache: "no-store",
      },
    );
  } catch {
    throw new SpotifyAuthError("서버에 연결하지 못했습니다. 잠시 후 다시 시도해주세요.");
  }

  const payload = await readJson(response);

  if (!response.ok) {
    throw new SpotifyAuthError(
      getErrorMessage(payload, "Spotify 로그인 URL을 가져오지 못했습니다. 잠시 후 다시 시도해주세요."),
    );
  }

  return getSpotifyLoginUrl(payload);
}

/**
 * OAuth 콜백이 HttpOnly Refresh Token 쿠키를 설정한 뒤 호출합니다.
 * 이 요청이 성공한 경우에만 프론트의 로그인 상태를 갱신해야 합니다.
 */
export async function confirmSpotifyLogin() {
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
}
