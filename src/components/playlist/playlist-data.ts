export type PlaylistLoadState = "loading" | "ready" | "error" | "empty";

export interface Playlist {
  id: string;
  title: string;
  trackCount: number;
  updatedAt: string;
  coverUrl?: string;
  description?: string;
}

export interface PlaylistTrack {
  id?: string;
  title: string;
  artist: string;
  album: string;
  addedAt: string;
  duration: string;
  durationMs?: number;
  coverUrl?: string;
}

export function formatPlaylistMeta(playlist: Playlist) {
  return `${playlist.trackCount}곡 · ${playlist.updatedAt}`;
}
