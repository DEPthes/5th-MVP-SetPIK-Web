export type PlaylistLoadState = "loading" | "ready" | "error" | "empty";

export interface Playlist {
  id: string;
  title: string;
  trackCount: number;
  updatedAt: string;
  coverUrl?: string;
}

export interface PlaylistTrack {
  title: string;
  artist: string;
  album: string;
  addedAt: string;
  duration: string;
  coverUrl?: string;
}

// 실제 Spotify 응답이 연결되면 이 단일 객체를 API 매퍼의 반환 타입으로 대체한다.
export const MOCK_PLAYLIST: Omit<Playlist, "id"> = {
  title: "새벽 감성",
  trackCount: 24,
  updatedAt: "2026.07.18",
};

export const MOCK_PLAYLISTS: Playlist[] = Array.from({ length: 12 }, (_, index) => ({
  ...MOCK_PLAYLIST,
  id: `playlist-${index + 1}`,
}));

export const MOCK_PLAYLIST_TRACKS: PlaylistTrack[] = [
  { title: "Fix You", artist: "Coldplay", album: "X&Y", addedAt: "2026.07.18", duration: "4:55" },
  { title: "Yellow", artist: "Coldplay", album: "Parachutes", addedAt: "2026.07.18", duration: "4:27" },
  { title: "The Scientist", artist: "Coldplay", album: "A Rush of Blood to the Head", addedAt: "2026.07.18", duration: "5:09" },
  { title: "Somewhere Only We Know", artist: "Keane", album: "Hopes and Fears", addedAt: "2026.07.17", duration: "3:56" },
  { title: "Midnight City", artist: "M83", album: "Hurry Up, We're Dreaming", addedAt: "2026.07.16", duration: "4:03" },
  { title: "Dreams", artist: "Fleetwood Mac", album: "Rumours", addedAt: "2026.07.15", duration: "4:14" },
  { title: "Afterglow", artist: "Ed Sheeran", album: "Afterglow", addedAt: "2026.07.15", duration: "3:05" },
  { title: "Slow Dancing in the Dark", artist: "Joji", album: "BALLADS 1", addedAt: "2026.07.14", duration: "3:29" },
];

export function formatPlaylistMeta(playlist: Playlist) {
  return `${playlist.trackCount}곡 · ${playlist.updatedAt}`;
}
