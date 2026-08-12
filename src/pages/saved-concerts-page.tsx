import { useState } from "react";
import { Link } from "react-router-dom";
import { ALL_CONCERTS } from "@/components/concert/concert-data";
import { useSavedConcerts } from "@/contexts/saved-concerts-context";
import arrowLeftIcon from "@/assets/icons/ic-arrow-left.svg";
import searchIcon from "@/assets/icons/ic-search-icon.svg";
import sortIcon from "@/assets/icons/ic-filter.svg";
import chevronDownIcon from "@/assets/icons/ic-chevron-down.svg";
import ticketIcon from "@/assets/icons/ic-ticket-icon.svg";
import sparkleIcon from "@/assets/icons/ic-sparkle-icon.svg";
import heartIcon from "@/assets/icons/ic-heart-icon.svg";
import "@/styles/saved-concerts.css";

interface PlaylistInfo {
  id: string;
  title: string;
  description: string;
  concertIds: string[];
}

const PLAYLISTS: PlaylistInfo[] = [
  {
    id: "dawn-vibe",
    title: "새벽 감성",
    description: "42곡 · 생성일 2026.07.18",
    concertIds: ["concert-1", "concert-2", "concert-3", "concert-4"],
  },
  {
    id: "indie-pop",
    title: "인디 팝 모음",
    description: "28곡 · 생성일 2026.06.30",
    concertIds: ["concert-5", "concert-6", "concert-7"],
  },
  {
    id: "alternative",
    title: "얼터너티브 플레이리스트",
    description: "55곡 · 생성일 2026.05.12",
    concertIds: ["concert-8", "concert-9", "concert-10"],
  },
  {
    id: "korean-indie",
    title: "한국 인디 모음",
    description: "31곡 · 생성일 2026.04.20",
    concertIds: ["concert-11", "concert-12"],
  },
];

export function SavedConcertsPage() {
  const { savedConcertIds, toggleSavedConcert } = useSavedConcerts();
  const [expandedPlaylistIds, setExpandedPlaylistIds] = useState<string[]>([]);
  const [sortMode, setSortMode] = useState<"recent" | "alphabetical">("recent");
  const [searchTerm, setSearchTerm] = useState("");

  const savedConcertOrder = Array.from(savedConcertIds);
  const savedConcerts = ALL_CONCERTS.filter((concert) => savedConcertIds.has(concert.id));
  const playlists = PLAYLISTS.map((playlist, index) => {
    const savedCount = playlist.concertIds.filter((id) => savedConcertIds.has(id)).length;
    const lastSavedIndex = playlist.concertIds
      .map((concertId) => savedConcertOrder.indexOf(concertId))
      .filter((index) => index >= 0)
      .reduce((max, index) => Math.max(max, index), -1);

    return {
      ...playlist,
      savedCount,
      isExpanded: expandedPlaylistIds.includes(playlist.id),
      lastSavedIndex,
      originalIndex: index,
    };
  })
    .filter((playlist) => playlist.title.includes(searchTerm))
    .sort((a, b) => {
      if (sortMode === "recent") {
        if (a.lastSavedIndex === b.lastSavedIndex) return a.originalIndex - b.originalIndex;
        return b.lastSavedIndex - a.lastSavedIndex;
      }
      return a.title.localeCompare(b.title, "ko");
    });
  const allExpanded = playlists.every((playlist) => playlist.isExpanded);

  const togglePlaylist = (playlistId: string) => {
    setExpandedPlaylistIds((current) =>
      current.includes(playlistId) ? current.filter((id) => id !== playlistId) : [...current, playlistId],
    );
  };

  const toggleAllPlaylists = () => {
    if (allExpanded) {
      setExpandedPlaylistIds([]);
    } else {
      setExpandedPlaylistIds(PLAYLISTS.map((playlist) => playlist.id));
    }
  };

  const toggleSortMode = () => {
    setSortMode((current) => (current === "recent" ? "alphabetical" : "recent"));
  };

  return (
    <section className="saved-concerts-page page-shell" aria-labelledby="saved-concerts-title">
      <div className="saved-concerts-page__back">
        <Link to="/mypage" className="saved-concerts-page__back-button">
          <img src={arrowLeftIcon} alt="뒤로가기" />
          <span>마이페이지로</span>
        </Link>
      </div>

      <div className="saved-concerts-page__header">
        <h1 className="text-heading-1" id="saved-concerts-title">
          저장한 관심 공연
        </h1>
        <p className="text-body-1 saved-concerts-page__subtitle">
          플레이리스트별로 저장한 관심 공연을 확인해 보세요.
        </p>
      </div>

      <div className="saved-concerts-page__controls">
        <label className="saved-concerts-page__search-box">
          <img src={searchIcon} alt="검색" />
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="플레이리스트 제목 검색"
            className="saved-concerts-page__search-input"
          />
        </label>
        <button type="button" className="saved-concerts-page__sort-button" onClick={toggleSortMode}>
          <img src={sortIcon} alt="정렬" />
          <span>{sortMode === "recent" ? "최근 저장한 순" : "가나다 순"}</span>
          <img src={chevronDownIcon} alt="정렬 옵션" />
        </button>
      </div>

      <div className="saved-concerts-page__summary-row">
        <p>저장한 플레이리스트 {playlists.filter((playlist) => playlist.savedCount > 0).length}개</p>
        <button type="button" className="saved-concerts-page__expand-all" onClick={toggleAllPlaylists}>
          {allExpanded ? "모두 접기" : "모두 펼치기"}
        </button>
      </div>

      <div className="saved-concerts-page__playlist-list">
        {playlists.map((playlist) => (
          <article className="saved-concerts-page__playlist-card" key={playlist.id}>
            <div className="saved-concerts-page__playlist-card-header" role="button" onClick={() => togglePlaylist(playlist.id)}>
              <div className="saved-concerts-page__playlist-card-icon">
                <div className="saved-concerts-page__playlist-card-icon-bg">
                  <img src={ticketIcon} alt="플레이리스트 아이콘" />
                </div>
              </div>
              <div className="saved-concerts-page__playlist-card-meta">
                <div className="saved-concerts-page__playlist-card-title-row">
                  <strong>{playlist.title}</strong>
                  <span className="saved-concerts-page__playlist-card-tag">저장한 공연 {playlist.savedCount}개</span>
                </div>
                <p className="saved-concerts-page__playlist-card-description">{playlist.description}</p>
              </div>
              <div className="saved-concerts-page__playlist-card-toggle">
                <img
                  src={chevronDownIcon}
                  alt={playlist.isExpanded ? "접기" : "펼치기"}
                  className={playlist.isExpanded ? "saved-concerts-page__rotate-icon" : ""}
                />
              </div>
            </div>

            {playlist.isExpanded && (
              <div className="saved-concerts-page__playlist-card-body">
                <div className="saved-concerts-page__playlist-card-body-top">
                  <div>
                    <p className="saved-concerts-page__playlist-card-body-title">이 플레이리스트에서 저장한 공연</p>
                    <p className="saved-concerts-page__playlist-card-body-subtitle">
                      추천 결과에서 저장한 관심 공연을 확인할 수 있어요. · 총 {playlist.savedCount}개
                    </p>
                  </div>
                  <span className="saved-concerts-page__playlist-card-body-badge">최근 저장한 공연 순</span>
                </div>

                <div className="saved-concerts-page__concert-list">
                  {playlist.savedCount === 0 ? (
                    <div className="saved-concerts-page__empty-state">이 플레이리스트에서 저장한 공연이 없습니다.</div>
                  ) : (
                    ALL_CONCERTS.filter((concert) => playlist.concertIds.includes(concert.id) && savedConcertIds.has(concert.id)).map((concert) => (
                      <article className="saved-concerts-page__concert-card" key={concert.id}>
                        <div className="saved-concerts-page__concert-card-thumb">
                          <img src={ticketIcon} alt="공연 카드 아이콘" />
                        </div>
                        <div className="saved-concerts-page__concert-card-content">
                          <p className="saved-concerts-page__concert-card-title">{concert.title}</p>
                          <p className="saved-concerts-page__concert-card-meta">{concert.date} · {concert.location}</p>
                          <div className="saved-concerts-page__concert-card-tags">
                            <img src={sparkleIcon} alt="Sparkle" />
                            <span>내 플레이리스트 아티스트 {concert.playlistArtistCount}팀 출연</span>
                          </div>
                          <p className="saved-concerts-page__concert-card-date">저장일 2026.07.20</p>
                        </div>
                        <div className="saved-concerts-page__concert-card-actions">
                          <button type="button">공연 상세 보기</button>
                          <button type="button" className="saved-concerts-page__concert-card-action-saved" onClick={() => toggleSavedConcert(concert.id)}>
                            <img src={heartIcon} alt="저장됨" />
                            저장됨
                          </button>
                        </div>
                      </article>
                    ))
                  )}
                </div>
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
