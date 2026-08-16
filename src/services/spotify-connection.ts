import { getStorageItem } from "@/utils/storage";

const SPOTIFY_CONNECTION_HEALTH_KEY = "spotify-connection-healthy";

/**
 * Temporary frontend adapter until the Spotify token/status API is available.
 * The default keeps the current mock account connected; the API result can
 * replace this adapter without changing the MyPage UI flow.
 */
export function getSpotifyConnectionHealth() {
  return getStorageItem(SPOTIFY_CONNECTION_HEALTH_KEY, true);
}
