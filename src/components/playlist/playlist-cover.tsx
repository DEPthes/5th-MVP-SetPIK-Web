import type { Playlist } from "./playlist-data";

interface PlaylistCoverProps {
  playlist: Playlist;
}

export function PlaylistCover({ playlist }: PlaylistCoverProps) {
  return (
    <span
      aria-hidden="true"
      className="playlist-cover"
      style={playlist.coverUrl ? { backgroundImage: `url(${playlist.coverUrl})` } : undefined}
    />
  );
}
