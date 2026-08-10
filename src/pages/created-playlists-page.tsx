import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "@/styles/pre-study-playlist.css";

const imgArrowLeft = "https://www.figma.com/api/mcp/asset/ca47f883-ea51-4741-bf7c-11d68da86bf3.svg";
const imgSearchIcon = "https://www.figma.com/api/mcp/asset/7267fb0d-7221-4790-969b-c33cd3afca9b.svg";
const imgSortIcon = "https://www.figma.com/api/mcp/asset/ba0af375-95b3-47f2-a3c7-d90b94d39b09.svg";
const imgChevronDown = "https://www.figma.com/api/mcp/asset/5cc20bb6-775e-40a2-be66-19c854b17449.svg";
const imgTicketIcon = "https://www.figma.com/api/mcp/asset/99e6c001-089c-4211-a5d2-447ad1db90ba.svg";
const imgSpotifyIcon = "https://www.figma.com/api/mcp/asset/bb792c07-0207-4ede-a380-282b9ee7fe2f.svg";
const imgMusicNoteAlbum = "https://www.figma.com/api/mcp/asset/e51cc5fc-05ba-47e2-9068-f079bfbee646.svg";
const imgPlayIcon = "https://www.figma.com/api/mcp/asset/2953d5e7-0981-4689-88f6-753384ebd7b2.svg";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [sortMode, setSortMode] = useState<"recent" | "oldest" | "alphabetical" | "most-tracks">("recent");
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [expandedPlaylistIds, setExpandedPlaylistIds] = useState<string[]>(["seoul-music-festival"]);

  const filteredPlaylists = useMemo(() => {
    const list = PLAYLISTS.filter((playlist) => playlist.title.includes(searchTerm) || playlist.subtitle.includes(searchTerm));
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
  }, [searchTerm, sortMode]);

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

  return (
    <section className="pre-study-playlist-page page-shell" aria-labelledby="created-playlists-title">
      <div className="pre-study-playlist-page__back">
        <Link to="/mypage" className="pre-study-playlist-page__back-button">
          <img src={imgArrowLeft} alt="뒤로가기" />
          <span>마이페이지로</span>
        </Link>
      </div>

      <div className="pre-study-playlist-page__header">
        <h1 className="pre-study-playlist-page__title" id="created-playlists-title">
          공연별 예습 플레이리스트
        </h1>
        <p className="pre-study-playlist-page__subtitle">
          공연 라인업을 바탕으로 생성한 예습 플레이리스트를 확인해 보세요.
        </p>
      </div>

      <div className="pre-study-playlist-page__controls">
        <label className="pre-study-playlist-page__search-box">
          <img src={imgSearchIcon} alt="검색" />
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="플레이리스트명, 공연명 검색"
            className="pre-study-playlist-page__search-input"
          />
        </label>
        <div className="pre-study-playlist-page__sort-wrapper">
          <button
            type="button"
            className="pre-study-playlist-page__sort-button"
            onClick={() => setShowSortMenu((s) => !s)}
            aria-expanded={showSortMenu}
            aria-haspopup="menu"
          >
            <span>{sortMode === "recent" ? "최근 생성" : sortMode === "oldest" ? "오래된 생성" : sortMode === "alphabetical" ? "공연명" : "수록곡 많은"}</span>
            <img src={imgChevronDown} alt="펼치기" />
          </button>

          {showSortMenu && (
            <div className="pre-study-playlist-page__sort-menu" role="menu">
              <button type="button" role="menuitem" onClick={() => { setSortMode("recent"); setShowSortMenu(false); }}>
                최근 생성한 순
              </button>
              <button type="button" role="menuitem" onClick={() => { setSortMode("oldest"); setShowSortMenu(false); }}>
                오래된 생성 순
              </button>
              <button type="button" role="menuitem" onClick={() => { setSortMode("alphabetical"); setShowSortMenu(false); }}>
                공연명 순
              </button>
              <button type="button" role="menuitem" onClick={() => { setSortMode("most-tracks"); setShowSortMenu(false); }}>
                수록곡 많은 순
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="pre-study-playlist-page__summary-row">
        <p>생성한 예습 플레이리스트 {filteredPlaylists.length}개</p>
        <button type="button" className="pre-study-playlist-page__collapse-all" onClick={toggleAllPlaylists}>
          {allExpanded ? "모두 접기" : "모두 펼치기"}
        </button>
      </div>

      <div className="pre-study-playlist-page__playlist-list">
        {filteredPlaylists.map((playlist) => {
          const isExpanded = expandedPlaylistIds.includes(playlist.id);
          return (
            <article className="pre-study-playlist-page__playlist-card" key={playlist.id}>
              <button type="button" className="pre-study-playlist-page__playlist-card-header" onClick={() => togglePlaylist(playlist.id)}>
                <div className="pre-study-playlist-page__playlist-card-icon" style={{ backgroundImage: "linear-gradient(135deg, rgb(26, 10, 46) 0%, rgb(40, 12, 64) 100%)" }}>
                  <img src={imgTicketIcon} alt="플레이리스트 아이콘" />
                </div>
                <div className="pre-study-playlist-page__playlist-card-meta">
                  <div className="pre-study-playlist-page__playlist-card-title-row">
                    <p className="pre-study-playlist-page__playlist-card-title">{playlist.title}</p>
                    <span className="pre-study-playlist-page__playlist-card-tag">{playlist.subtitle}</span>
                  </div>
                  <div className="pre-study-playlist-page__playlist-card-badges">
                    <span className="pre-study-playlist-page__playlist-card-badge pre-study-playlist-page__playlist-card-badge--setpik">
                      SetPik에만 저장됨
                    </span>
                    <span className="pre-study-playlist-page__playlist-card-badge pre-study-playlist-page__playlist-card-badge--spotify">
                      <img src={imgSpotifyIcon} alt="Spotify" />
                      {playlist.badgeText}
                    </span>
                  </div>
                </div>
                <div className={`pre-study-playlist-page__playlist-card-toggle${isExpanded ? " pre-study-playlist-page__playlist-card-toggle--expanded" : ""}`}>
                  <img src={imgChevronDown} alt={isExpanded ? "접기" : "펼치기"} />
                </div>
              </button>

              {isExpanded && (
                <div className="pre-study-playlist-page__playlist-card-body">
                  <div className="pre-study-playlist-page__playlist-card-body-header">
                    <div>
                      <p className="pre-study-playlist-page__body-heading">수록곡</p>
                      <p className="pre-study-playlist-page__body-description">
                        이 예습 플레이리스트에 포함된 곡을 확인해 보세요. · 총 {playlist.trackCount}곡
                      </p>
                    </div>
                    <span className="pre-study-playlist-page__body-badge">최근 생성한 순</span>
                  </div>

                  <div className="pre-study-playlist-page__track-table">
                    <div className="pre-study-playlist-page__track-table-header">
                      <span>#</span>
                      <span className="pre-study-playlist-page__track-table-title">제목</span>
                      <span className="pre-study-playlist-page__track-table-album">앨범</span>
                      <span className="pre-study-playlist-page__track-table-date">추가된 날짜</span>
                      <span className="pre-study-playlist-page__track-table-duration">시간</span>
                      <span className="pre-study-playlist-page__track-table-actions" />
                    </div>
                    {playlist.tracks.map((track) => (
                      <div className="pre-study-playlist-page__track-row" key={track.id}>
                        <span>{playlist.tracks.indexOf(track) + 1}</span>
                        <div className="pre-study-playlist-page__track-title-cell">
                          <div className="pre-study-playlist-page__track-icon" style={{ backgroundImage: "linear-gradient(135deg, rgb(26, 10, 46) 0%, rgb(40, 12, 64) 100%)" }}>
                            <img src={imgMusicNoteAlbum} alt="트랙 아이콘" />
                          </div>
                          <div>
                            <p className="pre-study-playlist-page__track-title">{track.title}</p>
                            <p className="pre-study-playlist-page__track-artist">{track.artist}</p>
                          </div>
                        </div>
                        <span className="pre-study-playlist-page__track-album">{track.album}</span>
                        <span className="pre-study-playlist-page__track-date">{track.addedAt}</span>
                        <span className="pre-study-playlist-page__track-duration">{track.duration}</span>
                        <button type="button" className="pre-study-playlist-page__track-preview-button">
                          <img src={imgPlayIcon} alt="미리듣기" />
                          미리듣기
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="pre-study-playlist-page__card-footer">
                    <div className="pre-study-playlist-page__card-footer-left">
                      <span>{playlist.trackCount}곡 · {playlist.badgeText}</span>
                    </div>
                    <div className="pre-study-playlist-page__card-footer-right">
                      <button type="button" className="pre-study-playlist-page__open-spotify">
                        <img src={imgSpotifyIcon} alt="Spotify" />
                        <span>Spotify에서 열기</span>
                      </button>
                      <Link to={`/concerts/${playlist.id}`} className="pre-study-playlist-page__view-concert">공연 상세 보기</Link>
                      <button type="button" className="pre-study-playlist-page__delete-playlist">생성 기록 삭제</button>
                    </div>
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
