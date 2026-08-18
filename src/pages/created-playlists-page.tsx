import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import chevronDownIcon from "@/assets/icons/ic_chevron_down.svg";
import searchIcon from "@/assets/icons/ic_search.svg";
import sortIcon from "@/assets/icons/ic_sort.svg";
import spotifyGreenIcon from "@/assets/icons/ic_spotify_green.svg";
import spotifyIcon from "@/assets/icons/ic_spotify_white.svg";
import { BackLink } from "@/components/common/back-link";
import { CreatedPlaylistDeleteModal } from "@/components/common/created-playlist-delete-modal";
import { PlaylistTrackTable } from "@/components/playlist/playlist-track-table";
import "@/styles/created-playlists.css";

interface PlaylistTrack {
  id: string;
  title: string;
  artist: string;
  album: string;
  addedAt: string;
  duration: string;
}

interface PlaylistData {
  id: string;
  concertId: string;
  title: string;
  subtitle: string;
  trackCount: number;
  createdAt: string;
  badgeText: string;
  badgeType: "spotify" | "setpik";
  tracks: PlaylistTrack[];
}

const PLAYLISTS: PlaylistData[] = [
  {
    id: "seoul-music-festival",
    concertId: "concert-1",
    title: "2026 서울 뮤직 페스티벌 예습 플리",
    subtitle: "2026 서울 뮤직 페스티벌 · 24곡 · 생성일 2026.07.20",
    trackCount: 7,
    createdAt: "2026.07.20",
    badgeText: "Spotify에 저장됨",
    badgeType: "spotify",
    tracks: [
      { id: "track-1", title: "NO PAIN", artist: "실리카겔", album: "POWER ANDRE 99", addedAt: "2026.07.20", duration: "3:42" },
      { id: "track-2", title: "주저하는 연인들을 위해", artist: "잔나비", album: "전설", addedAt: "2026.07.20", duration: "4:15" },
      { id: "track-3", title: "light", artist: "wave to earth", album: "summer flows", addedAt: "2026.07.20", duration: "3:28" },
      { id: "track-4", title: "TOMBOY", artist: "HYUKOH", album: "23", addedAt: "2026.07.20", duration: "3:55" },
      { id: "track-5", title: "밤 내렸으다", artist: "이문세", album: "밤 내렸으다", addedAt: "2026.07.20", duration: "2:48" },
      { id: "track-6", title: "파도", artist: "세븐틴", album: "셀로판", addedAt: "2026.07.20", duration: "4:02" },
      { id: "track-7", title: "에덴에", artist: "DAY6", album: "The Day", addedAt: "2026.07.20", duration: "3:31" },
    ],
  },
  {
    id: "silica-gel",
    concertId: "concert-5",
    title: "실리카겔 단독 공연 예습 플리",
    subtitle: "실리카겔 단독 공연 2026 · 12곡 · 생성일 2026.07.18",
    trackCount: 12,
    createdAt: "2026.07.18",
    badgeText: "Spotify에 저장됨",
    badgeType: "spotify",
    tracks: [],
  },
  {
    id: "hyukoh-world-tour",
    concertId: "concert-8",
    title: "HYUKOH World Tour 예습 플리",
    subtitle: "HYUKOH World Tour — Seoul · 15곡 · 생성일 2026.07.15",
    trackCount: 15,
    createdAt: "2026.07.15",
    badgeText: "SetPik에만 저장됨",
    badgeType: "setpik",
    tracks: [],
  },
  {
    id: "summer-sonic",
    concertId: "concert-11",
    title: "Summer Sonic Seoul 예습 플리",
    subtitle: "Summer Sonic Seoul 2026 · 30곡 · 생성일 2026.07.10",
    trackCount: 30,
    createdAt: "2026.07.10",
    badgeText: "Spotify에 저장됨",
    badgeType: "spotify",
    tracks: [],
  },
];

export function CreatedPlaylistsPage() {
  const [playlists, setPlaylists] = useState(PLAYLISTS);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortMode, setSortMode] = useState<"recent" | "oldest" | "alphabetical" | "most-tracks">("recent");
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [expandedPlaylistIds, setExpandedPlaylistIds] = useState<string[]>(["seoul-music-festival"]);
  const [deleteTarget, setDeleteTarget] = useState<PlaylistData | null>(null);

  const filteredPlaylists = useMemo(() => {
    const list = playlists.filter((playlist) => playlist.title.includes(searchTerm) || playlist.subtitle.includes(searchTerm));
    switch (sortMode) {
      case "recent":
        return [...list].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      case "oldest":
        return [...list].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
      case "alphabetical":
        return [...list].sort((a, b) => a.title.localeCompare(b.title, "ko"));
      case "most-tracks":
        return [...list].sort((a, b) => b.trackCount - a.trackCount);
      default:
        return list;
    }
  }, [playlists, searchTerm, sortMode]);

  const allExpanded = filteredPlaylists.every((playlist) => expandedPlaylistIds.includes(playlist.id));

  const togglePlaylist = (playlistId: string) => {
    setExpandedPlaylistIds((current) =>
      current.includes(playlistId) ? current.filter((id) => id !== playlistId) : [...current, playlistId],
    );
  };

  const toggleAllPlaylists = () => {
    if (allExpanded) {
      setExpandedPlaylistIds([]);
    } else {
      setExpandedPlaylistIds(filteredPlaylists.map((playlist) => playlist.id));
    }
  };

  const deletePlaylist = () => {
    if (!deleteTarget) return;

    setPlaylists((current) => current.filter((playlist) => playlist.id !== deleteTarget.id));
    setExpandedPlaylistIds((current) => current.filter((playlistId) => playlistId !== deleteTarget.id));
    setDeleteTarget(null);
  };

  return (
    <section className="created-playlists-page page-shell" aria-labelledby="created-playlists-title">
      <div className="created-playlists-page__back">
        <BackLink to="/mypage">마이페이지로</BackLink>
      </div>

      <div className="created-playlists-page__header">
        <h1 className="created-playlists-page__title" id="created-playlists-title">
          생성한 예습 플레이리스트
        </h1>
        <p className="created-playlists-page__subtitle">
          공연 라인업을 바탕으로 생성한 예습 플레이리스트를 확인해 보세요.
        </p>
      </div>

      <div className="created-playlists-page__controls">
        <label className="created-playlists-page__search-box">
          <img src={searchIcon} alt="검색" />
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="플레이리스트명, 공연명 검색"
            className="created-playlists-page__search-input"
          />
        </label>
        <div className="created-playlists-page__sort-wrapper">
          <button
            type="button"
            className="created-playlists-page__sort-button"
            onClick={() => setShowSortMenu((s) => !s)}
            aria-expanded={showSortMenu}
            aria-haspopup="menu"
          >
            <img src={sortIcon} alt="" className="created-playlists-page__sort-icon" />
            <span>{sortMode === "recent" ? "최근 생성한 순" : sortMode === "oldest" ? "오래된 생성 순" : sortMode === "alphabetical" ? "공연명 순" : "수록곡 많은 순"}</span>
            <img src={chevronDownIcon} alt="펼치기" />
          </button>

          {showSortMenu && (
            <div className="created-playlists-page__sort-menu" role="menu">
              <button aria-selected={sortMode === "recent"} type="button" role="menuitem" onClick={() => { setSortMode("recent"); setShowSortMenu(false); }}>
                최근 생성한 순
              </button>
              <button aria-selected={sortMode === "oldest"} type="button" role="menuitem" onClick={() => { setSortMode("oldest"); setShowSortMenu(false); }}>
                오래된 생성 순
              </button>
              <button aria-selected={sortMode === "alphabetical"} type="button" role="menuitem" onClick={() => { setSortMode("alphabetical"); setShowSortMenu(false); }}>
                공연명 순
              </button>
              <button aria-selected={sortMode === "most-tracks"} type="button" role="menuitem" onClick={() => { setSortMode("most-tracks"); setShowSortMenu(false); }}>
                수록곡 많은 순
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="created-playlists-page__summary-row">
        <p>생성한 예습 플레이리스트 {filteredPlaylists.length}개</p>
        <button type="button" className="created-playlists-page__collapse-all" onClick={toggleAllPlaylists}>
          {allExpanded ? "모두 접기" : "모두 펼치기"}
        </button>
      </div>

      <div className="created-playlists-page__playlist-list">
        {filteredPlaylists.map((playlist) => {
          const isExpanded = expandedPlaylistIds.includes(playlist.id);
          return (
            <article
              className={`created-playlists-page__playlist-card${isExpanded ? " created-playlists-page__playlist-card--expanded" : ""}`}
              key={playlist.id}
            >
              <button type="button" className="created-playlists-page__playlist-card-header" onClick={() => togglePlaylist(playlist.id)}>
                <div className="created-playlists-page__playlist-card-icon" aria-hidden="true" />
                <div className="created-playlists-page__playlist-card-meta">
                  <div className="created-playlists-page__playlist-card-title-row">
                    <p className="created-playlists-page__playlist-card-title">{playlist.title}</p>
                    <span className="created-playlists-page__playlist-card-tag">{playlist.subtitle}</span>
                  </div>
                </div>
                <div className="created-playlists-page__playlist-card-badges">
                  {playlist.badgeType === "setpik" ? (
                    <span className="created-playlists-page__playlist-card-badge created-playlists-page__playlist-card-badge--setpik">
                      {playlist.badgeText}
                    </span>
                  ) : (
                    <span className="created-playlists-page__playlist-card-badge created-playlists-page__playlist-card-badge--spotify">
                      <img src={spotifyGreenIcon} alt="Spotify" />
                      {playlist.badgeText}
                    </span>
                  )}
                </div>
                <div className={`created-playlists-page__playlist-card-toggle${isExpanded ? " created-playlists-page__playlist-card-toggle--expanded" : ""}`}>
                  <img src={chevronDownIcon} alt={isExpanded ? "접기" : "펼치기"} />
                </div>
              </button>

              {isExpanded && (
                <div className="created-playlists-page__playlist-card-body">
                  <div className="created-playlists-page__card-divider" />
                  <div className="created-playlists-page__playlist-card-body-header">
                    <div>
                      <p className="created-playlists-page__body-heading">수록곡</p>
                      <p className="created-playlists-page__body-description">
                        이 예습 플레이리스트에 포함된 곡을 확인해 보세요. · 총 {playlist.trackCount}곡
                      </p>
                    </div>
                  </div>

                  <PlaylistTrackTable
                    showPreviewButton
                    tracks={playlist.tracks}
                  />
                  <div className="created-playlists-page__card-footer">
                    <div className="created-playlists-page__card-footer-left">
                      <span>{playlist.trackCount}곡 · {playlist.badgeText}</span>
                    </div>
                    <div className="created-playlists-page__card-footer-right">
                      <button type="button" className="created-playlists-page__open-spotify">
                        <img src={spotifyIcon} alt="Spotify" />
                        <span>Spotify에서 열기</span>
                      </button>
                      <Link to={`/concerts/${playlist.concertId}`} className="created-playlists-page__view-concert">공연 상세 보기</Link>
                      <button
                        type="button"
                        className="created-playlists-page__delete-playlist"
                        onClick={() => setDeleteTarget(playlist)}
                      >
                        생성 기록 삭제
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>

      {deleteTarget ? (
        <CreatedPlaylistDeleteModal
          onCancel={() => setDeleteTarget(null)}
          onConfirm={deletePlaylist}
        />
      ) : null}
    </section>
  );
}
