import { getApiUrl } from "@/services/spotify-auth";

const LOGOUT_PATH = "/api/v1/auth/logout";

interface ApiResponse {
  isSuccess?: unknown;
  message?: unknown;
}

function getErrorMessage(payload: unknown) {
  if (
    payload
    && typeof payload === "object"
    && "message" in payload
    && typeof payload.message === "string"
    && payload.message.trim()
  ) {
    return payload.message;
  }

  return "로그아웃 요청에 실패했습니다.";
}

async function readJson(response: Response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

/** Refresh Token 쿠키를 서버에서 폐기한다. */
export async function requestLogout() {
  let response: Response;

  try {
    response = await fetch(getApiUrl(LOGOUT_PATH), {
      method: "POST",
      headers: { Accept: "application/json" },
      credentials: "include",
      cache: "no-store",
    });
  } catch {
    throw new Error("로그아웃 서버에 연결하지 못했습니다.");
  }

  const payload = await readJson(response);

  if (!response.ok) {
    throw new Error(getErrorMessage(payload));
  }

  if (!payload || typeof payload !== "object" || (payload as ApiResponse).isSuccess !== true) {
    throw new Error(getErrorMessage(payload));
  }
}
