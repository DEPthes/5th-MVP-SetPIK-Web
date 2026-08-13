import { useState } from "react";
import { Link } from "react-router-dom";
import { ALL_CONCERTS } from "@/components/concert/concert-data";
import { useSavedConcerts } from "@/hooks/use-saved-concerts";
import arrowLeftIcon from "@/assets/icons/ic_chevron_left_thick.svg";
import searchIcon from "@/assets/icons/ic_search.svg";
import sortIcon from "@/assets/icons/ic_sort.svg";
import chevronDownIcon from "@/assets/icons/ic_chevron_down.svg";
import chevronUpPinkIcon from "@/assets/icons/ic_chevron_up_pink.svg";
import musicIcon from "@/assets/icons/ic_music1.svg";
import ticketIcon from "@/assets/icons/ic_TicketIcon_gray.svg";
import sparkleIcon from "@/assets/icons/ic_shine_cyan.svg";
import heartIcon from "@/assets/icons/ic_heart_pink.svg";
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
    concertIds: ["concert-5", "concert-6"],
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
    concertIds: ["concert-11"],
  },
];

const SORT_OPTIONS = [
  { value: "recent", label: "최근 저장한 순" },
  { value: "name", label: "이름순" },
  { value: "count", label: "저장한 공연 많은순" },
] as const;

type SortMode = (typeof SORT_OPTIONS)[number]["value"];

export function SavedConcertsPage() {
  const { savedConcertIds, toggleSavedConcert } = useSavedConcerts();
  const [expandedPlaylistIds, setExpandedPlaylistIds] = useState<string[]>([PLAYLISTS[0].id]);
  const [sortMode, setSortMode] = useState<SortMode>("recent");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const savedConcertOrder = Array.from(savedConcertIds);
  const playlists = PLAYLISTS.map((playlist, index) => {
    const savedCount = playlist.concertIds.length;
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
    .filter((playlist) => playlist.title.toLocaleLowerCase().includes(searchTerm.trim().toLocaleLowerCase()))
    .sort((a, b) => {
      if (sortMode === "recent") {
        if (a.lastSavedIndex === b.lastSavedIndex) return a.originalIndex - b.originalIndex;
        return b.lastSavedIndex - a.lastSavedIndex;
      }
      if (sortMode === "name") return a.title.localeCompare(b.title, "ko");
      if (a.savedCount === b.savedCount) return a.originalIndex - b.originalIndex;
      return b.savedCount - a.savedCount;
    });
  const allExpanded = playlists.every((playlist) => playlist.isExpanded);
  const activeSortLabel = SORT_OPTIONS.find((option) => option.value === sortMode)?.label;

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

  return (
    <section className="saved-concerts-page page-shell" aria-labelledby="saved-concerts-title">
      <div className="saved-concerts-page__back">
        <Link to="/mypage" className="saved-concerts-page__back-button">
          <img src={arrowLeftIcon} alt="" />
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
        <div className="saved-concerts-page__sort-menu">
          <button
            aria-expanded={isSortOpen}
            aria-haspopup="listbox"
            className="saved-concerts-page__sort-button"
            onClick={() => setIsSortOpen((current) => !current)}
            type="button"
          >
            <img src={sortIcon} alt="" />
            <span>{activeSortLabel}</span>
            <img src={chevronDownIcon} alt="" className={isSortOpen ? "saved-concerts-page__sort-chevron--open" : ""} />
          </button>
          {isSortOpen ? (
            <div aria-label="플레이리스트 정렬" className="saved-concerts-page__sort-options" role="listbox">
              {SORT_OPTIONS.map((option) => (
                <button
                  aria-selected={sortMode === option.value}
                  className={sortMode === option.value ? "is-selected" : ""}
                  key={option.value}
                  onClick={() => {
                    setSortMode(option.value);
                    setIsSortOpen(false);
                  }}
                  role="option"
                  type="button"
                >
                  {option.label}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <div className="saved-concerts-page__summary-row">
        <p>저장한 플레이리스트 {playlists.length}개</p>
        <button type="button" className="saved-concerts-page__expand-all" onClick={toggleAllPlaylists}>
          {allExpanded ? "모두 접기" : "모두 펼치기"}
        </button>
      </div>

      <div className="saved-concerts-page__playlist-list">
        {playlists.map((playlist) => (
          <article className={[
            "saved-concerts-page__playlist-card",
            playlist.isExpanded ? "saved-concerts-page__playlist-card--expanded" : "",
          ].filter(Boolean).join(" ")} key={playlist.id}>
            <button
              type="button"
              aria-expanded={playlist.isExpanded}
              className="saved-concerts-page__playlist-card-header"
              onClick={() => togglePlaylist(playlist.id)}
            >
              <div className={`saved-concerts-page__playlist-card-icon-bg saved-concerts-page__playlist-card-icon-bg--${playlist.originalIndex}`}>
                <img src={musicIcon} alt="" />
              </div>
              <div className="saved-concerts-page__playlist-card-meta">
                <div className="saved-concerts-page__playlist-card-title-row">
                  <strong>{playlist.title}</strong>
                  <span className="saved-concerts-page__playlist-card-tag">저장한 공연 {playlist.savedCount}개</span>
                </div>
                <p className="saved-concerts-page__playlist-card-description">{playlist.description}</p>
              </div>
              <img
                src={playlist.isExpanded ? chevronUpPinkIcon : chevronDownIcon}
                alt=""
                className="saved-concerts-page__playlist-card-toggle"
              />
            </button>

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
                    ALL_CONCERTS.filter((concert) => playlist.concertIds.includes(concert.id)).map((concert, index) => {
                      const isEnded = index === 3;

                      return (
                      <article
                        aria-disabled={isEnded}
                        className={[
                          "saved-concerts-page__concert-card",
                          isEnded ? "saved-concerts-page__concert-card--disabled" : "",
                        ].filter(Boolean).join(" ")}
                        key={concert.id}
                      >
                        <Link
                          aria-disabled={isEnded}
                          className="saved-concerts-page__concert-card-link"
                          onClick={isEnded ? (event) => event.preventDefault() : undefined}
                          tabIndex={isEnded ? -1 : undefined}
                          to={`/concerts/${concert.id}`}
                        >
                          <div className={`saved-concerts-page__concert-card-thumb saved-concerts-page__concert-card-thumb--${index}`}>
                            {index >= 2 ? <span className="saved-concerts-page__concert-card-status">{index === 2 ? "매진" : "종료"}</span> : null}
                            <span className="saved-concerts-page__concert-card-category">
                              {index === 0 ? "페스티벌" : index === 1 ? "단독 공연" : "콘서트"}
                            </span>
                            <img src={ticketIcon} alt="" />
                          </div>
                          <div className="saved-concerts-page__concert-card-content">
                            <p className="saved-concerts-page__concert-card-title">{concert.title}</p>
                            <p className="saved-concerts-page__concert-card-meta">{concert.date} · {concert.location}</p>
                            <p className="saved-concerts-page__concert-card-match">
                              <img src={sparkleIcon} alt="" />
                              {index === 2 ? "인디 록 취향과 높은 관련" : `내 플레이리스트 아티스트 ${concert.playlistArtistCount}팀 출연`}
                            </p>
                            <p className="saved-concerts-page__concert-card-date">저장일 2026.07.{20 - index}</p>
                          </div>
                        </Link>
                        <div className="saved-concerts-page__concert-card-actions">
                          <Link
                            aria-disabled={isEnded}
                            onClick={isEnded ? (event) => event.preventDefault() : undefined}
                            tabIndex={isEnded ? -1 : undefined}
                            to={`/concerts/${concert.id}`}
                          >
                            공연 상세 보기
                          </Link>
                          <button type="button" className="saved-concerts-page__concert-card-action-saved" disabled={isEnded} onClick={() => toggleSavedConcert(concert.id)}>
                            <img src={heartIcon} alt="" />
                            저장됨
                          </button>
                        </div>
                      </article>
                      );
                    })
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
