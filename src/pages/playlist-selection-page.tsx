import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import chevronRightIcon from "@/assets/icons/ic-chevron-right.svg";
import arrowRightIcon from "@/assets/icons/ic-arrow-right.svg";
import checkIcon from "@/assets/icons/ic-check.svg";
import closeIcon from "@/assets/icons/ic-close.svg";
import dateIcon from "@/assets/icons/ic-date-pink.svg";
import errorIcon from "@/assets/icons/ic-icon.svg";
import externalLinkIcon from "@/assets/icons/ic-external-link.svg";
import musicNoteIcon from "@/assets/icons/ic-note-pink.svg";
import playlistIcon from "@/assets/icons/ic-playlist.svg";
import searchIcon from "@/assets/icons/ic-search.svg";
import timeIcon from "@/assets/icons/ic-time-pink.svg";
import { BackButton } from "@/components/common/back-button";
import { Button } from "@/components/common/button";

type PlaylistLoadState = "loading" | "ready" | "error" | "empty";

interface Playlist {
  id: string;
  title: string;
  trackCount: number;
  updatedAt: string;
  coverUrl?: string;
}

const PLAYLISTS: Playlist[] = [
  { id: "dawn", title: "새벽 감성", trackCount: 24, updatedAt: "2026.07.18" },
  { id: "workout", title: "운동할 때 듣는 노래", trackCount: 18, updatedAt: "2026.07.10" },
  { id: "summer", title: "여름 드라이브", trackCount: 32, updatedAt: "2026.06.25" },
  { id: "indie", title: "인디 팝 모음", trackCount: 15, updatedAt: "2026.06.15" },
  { id: "jazz", title: "재즈 카페", trackCount: 20, updatedAt: "2026.05.30" },
  { id: "kpop", title: "K-POP 최신곡", trackCount: 45, updatedAt: "2026.07.20" },
  { id: "rain", title: "빗소리와 함께", trackCount: 12, updatedAt: "2026.05.12" },
  { id: "roadtrip", title: "로드트립 BGM", trackCount: 28, updatedAt: "2026.04.20" },
  { id: "study", title: "공부할 때", trackCount: 35, updatedAt: "2026.03.15" },
  { id: "classic", title: "팝 클래식", trackCount: 40, updatedAt: "2026.02.28" },
  { id: "hiphop", title: "힙합 믹스", trackCount: 22, updatedAt: "2026.07.01" },
  { id: "favorites", title: "좋아하는 노래", trackCount: 57, updatedAt: "2026.07.25" },
];

const SELECTED_PLAYLIST_TRACKS = [
  { title: "Fix You", artist: "Coldplay", album: "X&Y", addedAt: "2026.07.18", duration: "4:55", coverUrl: undefined },
  { title: "Yellow", artist: "Coldplay", album: "Parachutes", addedAt: "2026.07.18", duration: "4:27", coverUrl: undefined },
  { title: "The Scientist", artist: "Coldplay", album: "A Rush of Blood to the Head", addedAt: "2026.07.18", duration: "5:09", coverUrl: undefined },
  { title: "Somewhere Only We Know", artist: "Keane", album: "Hopes and Fears", addedAt: "2026.07.17", duration: "3:56", coverUrl: undefined },
  { title: "Midnight City", artist: "M83", album: "Hurry Up, We're Dreaming", addedAt: "2026.07.16", duration: "4:03", coverUrl: undefined },
  { title: "Dreams", artist: "Fleetwood Mac", album: "Rumours", addedAt: "2026.07.15", duration: "4:14", coverUrl: undefined },
  { title: "Afterglow", artist: "Ed Sheeran", album: "Afterglow", addedAt: "2026.07.15", duration: "3:05", coverUrl: undefined },
  { title: "Slow Dancing in the Dark", artist: "Joji", album: "BALLADS 1", addedAt: "2026.07.14", duration: "3:29", coverUrl: undefined },
];

function getPreviewState(value: string | null): PlaylistLoadState | null {
  return value === "loading" || value === "error" || value === "empty" ? value : null;
}

function formatPlaylistMeta(playlist: Playlist) {
  return `${playlist.trackCount}곡 · ${playlist.updatedAt}`;
}

function PlaylistCover({ playlist }: { playlist: Playlist }) {
  return (
    <span
      aria-hidden="true"
      className="playlist-cover"
      style={playlist.coverUrl ? { backgroundImage: `url(${playlist.coverUrl})` } : undefined}
    />
  );
}

function SelectionPlaceholder() {
  return (
    <div className="playlist-selection__placeholder">
      <span className="playlist-selection__placeholder-icon" aria-hidden="true">
        <img src={playlistIcon} alt="" />
      </span>
      <h2>플레이리스트를 선택해 주세요</h2>
      <p>왼쪽 목록에서 분석할 플레이리스트를 선택하면<br />상세 정보와 수록곡을 확인할 수 있습니다.</p>
    </div>
  );
}

function PlaylistSkeletonList() {
  return (
    <>
      <div className="playlist-search playlist-search--disabled" aria-hidden="true">
        <img src={searchIcon} alt="" />
        <span>플레이리스트 제목 검색</span>
      </div>
      <p className="playlist-selection__count">내 플레이리스트</p>
      <div className="playlist-skeleton-list" aria-label="플레이리스트를 불러오는 중">
        {Array.from({ length: 6 }, (_, index) => (
          <div className="playlist-skeleton" key={index}>
            <span className="playlist-skeleton__cover" />
            <span className="playlist-skeleton__text">
              <i />
              <i />
            </span>
          </div>
        ))}
      </div>
    </>
  );
}

export function PlaylistSelectionPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loadState, setLoadState] = useState<PlaylistLoadState>("loading");
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const previewState = getPreviewState(searchParams.get("state"));
  const currentState = previewState ?? loadState;

  useEffect(() => {
    if (previewState || loadState !== "loading") {
      return undefined;
    }

    const timer = window.setTimeout(() => setLoadState("ready"), 850);
    return () => window.clearTimeout(timer);
  }, [loadState, previewState]);

  const filteredPlaylists = useMemo(() => {
    const normalizedSearchTerm = searchTerm.trim().toLowerCase();
    if (!normalizedSearchTerm) {
      return PLAYLISTS;
    }

    return PLAYLISTS.filter((playlist) => playlist.title.toLowerCase().includes(normalizedSearchTerm));
  }, [searchTerm]);

  const selectedPlaylist = PLAYLISTS.find((playlist) => playlist.id === selectedPlaylistId) ?? null;

  function handleRetry() {
    setLoadState("loading");
  }

  return (
    <section className="playlist-selection-page" aria-labelledby="playlist-selection-title">
      <div className="playlist-selection-page__inner">
        <BackButton className="playlist-selection__back-button" onClick={() => navigate("/login")} />

        <header className="playlist-selection__heading">
          <h1 id="playlist-selection-title">OO님의 플레이리스트 중 하나를 선택해 주세요.</h1>
          <p>선택한 플레이리스트의 음악 취향을 분석해 맞춤 공연을 추천해 드려요</p>
        </header>

        <div className="playlist-selection__content">
          <aside
            className={`playlist-selection__list-panel${currentState === "error" || currentState === "empty" ? " playlist-selection__list-panel--status" : ""}`}
            aria-label="내 플레이리스트"
          >
            {currentState === "loading" ? <PlaylistSkeletonList /> : null}

            {currentState === "error" ? (
              <div className="playlist-selection__status">
                <span className="playlist-selection__status-icon playlist-selection__status-icon--error">
                  <img src={errorIcon} alt="" />
                </span>
                <h2>플레이리스트를 불러오지 못했습니다.</h2>
                <p>잠시 후 다시 시도해 주세요.</p>
                <Button className="playlist-selection__retry-button" onClick={handleRetry} variant="brand">
                  다시 시도
                </Button>
              </div>
            ) : null}

            {currentState === "empty" ? (
              <div className="playlist-selection__status">
                <span className="playlist-selection__status-icon">
                  <img src={playlistIcon} alt="" />
                </span>
                <h2>불러올 플레이리스트가 없습니다.</h2>
                <p>
                  Spotify에서 플레이리스트를 만든 후
                  <br />
                  다시 시도해 주세요.
                </p>
                <a
                  className="playlist-selection__spotify-link"
                  href="https://open.spotify.com/"
                  rel="noreferrer"
                  target="_blank"
                >
                  <img src={externalLinkIcon} alt="" />
                  Spotify에서 플레이리스트 만들기
                </a>
              </div>
            ) : null}

            {currentState === "ready" ? (
              <>
                <div className="playlist-search">
                  <img src={searchIcon} alt="" />
                  <input
                    aria-label="플레이리스트 제목 검색"
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="플레이리스트 제목 검색"
                    type="search"
                    value={searchTerm}
                  />
                  {searchTerm ? (
                    <button
                      aria-label="검색어 지우기"
                      className="playlist-search__clear-button"
                      onClick={() => setSearchTerm("")}
                      type="button"
                    >
                      <img src={closeIcon} alt="" />
                    </button>
                  ) : null}
                </div>
                <p className="playlist-selection__count">내 플레이리스트 · {PLAYLISTS.length}개</p>
                <ul className="playlist-list">
                  {filteredPlaylists.map((playlist) => {
                    const isSelected = playlist.id === selectedPlaylistId;
                    return (
                      <li key={playlist.id}>
                        <button
                          aria-pressed={isSelected}
                          className={`playlist-list__item${isSelected ? " playlist-list__item--selected" : ""}`}
                          onClick={() => setSelectedPlaylistId(playlist.id)}
                          type="button"
                        >
                          <PlaylistCover playlist={playlist} />
                          <span className="playlist-list__details">
                            <strong>{playlist.title}</strong>
                            <small>{formatPlaylistMeta(playlist)}</small>
                          </span>
                          <span className="playlist-list__selection-mark" aria-hidden="true">
                            <img src={isSelected ? checkIcon : chevronRightIcon} alt="" />
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </>
            ) : null}
          </aside>

          <div className="playlist-selection__detail-column">
            <section
              className={`playlist-selection__detail-panel${selectedPlaylist && currentState === "ready" ? " playlist-selection__detail-panel--selected" : ""}`}
              aria-live="polite"
            >
              {selectedPlaylist && currentState === "ready" ? (
                <div className="playlist-detail">
                  <div className="playlist-detail__summary">
                    <PlaylistCover playlist={selectedPlaylist} />
                    <div>
                      <p>선택한 플레이리스트</p>
                      <div className="playlist-detail__title-row">
                        <h2>{selectedPlaylist.title}</h2>
                        <span className="playlist-detail__selected-badge">
                          <img src={checkIcon} alt="" />
                          선택됨
                        </span>
                      </div>
                      <span>혼자 있는 새벽에 듣기 좋은 감성적인 곡들 모음</span>
                      <div className="playlist-detail__metadata">
                        <span>
                          <img src={musicNoteIcon} alt="" />
                          {selectedPlaylist.trackCount}곡
                        </span>
                        <i aria-hidden="true">·</i>
                        <span>
                          <img src={timeIcon} alt="" />
                          1시간 32분
                        </span>
                        <i aria-hidden="true">·</i>
                        <span>
                          <img src={dateIcon} alt="" />
                          {selectedPlaylist.updatedAt}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="playlist-detail__tracks">
                    <div className="playlist-detail__tracks-heading">
                      <h3>수록곡</h3>
                    </div>
                    <div className="playlist-track-table" role="table" aria-label={`${selectedPlaylist.title} 수록곡`}>
                      <div className="playlist-track-table__header" role="row">
                        <span role="columnheader">#</span>
                        <span aria-hidden="true" />
                        <span role="columnheader">제목</span>
                        <span role="columnheader">앨범</span>
                        <span role="columnheader">추가된 날짜</span>
                        <span role="columnheader">
                          <img className="playlist-track-table__duration-icon" src={timeIcon} alt="재생 시간" />
                        </span>
                      </div>
                      <ol className="playlist-track-table__body">
                        {SELECTED_PLAYLIST_TRACKS.map((track, index) => (
                          <li key={track.title} role="row">
                            <span role="cell">{index + 1}</span>
                            <span
                              aria-hidden="true"
                              className="playlist-track-table__cover"
                              style={track.coverUrl ? { backgroundImage: `url(${track.coverUrl})` } : undefined}
                            />
                            <span className="playlist-track-table__title" role="cell">
                              <strong>{track.title}</strong>
                              <small>{track.artist}</small>
                            </span>
                            <span className="playlist-track-table__album" role="cell">{track.album}</span>
                            <span role="cell">{track.addedAt}</span>
                            <span role="cell">{track.duration}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                </div>
              ) : (
                <SelectionPlaceholder />
              )}
            </section>
            <Button
              className="playlist-selection__next-button button--selection-cta"
              disabled={!selectedPlaylist || currentState !== "ready"}
              onClick={() => navigate("/onboarding/artists")}
              trailingIcon={<img src={arrowRightIcon} alt="" />}
            >
              다음 단계
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
