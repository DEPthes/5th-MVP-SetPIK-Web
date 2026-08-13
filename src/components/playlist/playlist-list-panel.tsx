import chevronRightIcon from "@/assets/icons/ic_chevron_right.svg";
import checkIcon from "@/assets/icons/ic_check_pink.svg";
import closeIcon from "@/assets/icons/ic_close.svg";
import failIcon from "@/assets/icons/ic_fail.svg";
import externalLinkIcon from "@/assets/icons/ic_externallink.svg";
import playlistIcon from "@/assets/icons/ic_playlist.svg";
import refreshIcon from "@/assets/icons/ic_reload.svg";
import searchIcon from "@/assets/icons/ic_search.svg";
import { Button } from "@/components/common/button";
import { PlaylistCover } from "./playlist-cover";
import {
  formatPlaylistMeta,
  MOCK_PLAYLISTS,
  type Playlist,
  type PlaylistLoadState,
} from "./playlist-data";
import "./playlist-list-panel.css";

interface PlaylistListPanelProps {
  currentState: PlaylistLoadState;
  playlists: Playlist[];
  searchTerm: string;
  selectedPlaylistId: string | null;
  onRetry: () => void;
  onSearchChange: (value: string) => void;
  onSelect: (playlistId: string) => void;
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
            <span className="playlist-skeleton__cover skeleton-reflection" />
            <span className="playlist-skeleton__text">
              <i className="skeleton-reflection" />
              <i className="skeleton-reflection" />
            </span>
          </div>
        ))}
      </div>
    </>
  );
}

function PlaylistLoadStatus({
  state,
  onRetry,
}: Pick<PlaylistListPanelProps, "onRetry"> & { state: "error" | "empty" }) {
  const isError = state === "error";

  return (
    <div className="playlist-selection__status">
      <span
        className={`playlist-selection__status-icon playlist-selection__status-icon--${state}`}
      >
        <img src={isError ? failIcon : playlistIcon} alt="" />
      </span>
      <h2>{isError ? "플레이리스트를 불러오지 못했습니다." : "불러올 플레이리스트가 없습니다."}</h2>
      <p>
        {isError ? "잠시 후 다시 시도해 주세요." : (
          <>Spotify에서 플레이리스트를 만든 후<br />다시 시도해 주세요.</>
        )}
      </p>
      {isError ? (
        <Button
          className="playlist-selection__retry-button"
          leadingIcon={<img src={refreshIcon} alt="" />}
          onClick={onRetry}
          size="small"
          variant="brand"
        >
          다시 시도
        </Button>
      ) : (
        <a className="playlist-selection__spotify-link" href="https://open.spotify.com/" rel="noreferrer" target="_blank">
          <img src={externalLinkIcon} alt="" />
          Spotify에서 플레이리스트 만들기
        </a>
      )}
    </div>
  );
}

export function PlaylistListPanel({
  currentState,
  playlists,
  searchTerm,
  selectedPlaylistId,
  onRetry,
  onSearchChange,
  onSelect,
}: PlaylistListPanelProps) {
  const statusState = currentState === "error" || currentState === "empty" ? currentState : null;

  return (
    <aside
      className={`playlist-selection__list-panel${statusState ? " playlist-selection__list-panel--status" : ""}`}
      aria-label="내 플레이리스트"
    >
      {currentState === "loading" ? <PlaylistSkeletonList /> : null}
      {statusState ? <PlaylistLoadStatus onRetry={onRetry} state={statusState} /> : null}
      {currentState === "ready" ? (
        <>
          <div className="playlist-search">
            <img src={searchIcon} alt="" />
            <input
              aria-label="플레이리스트 제목 검색"
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="플레이리스트 제목 검색"
              type="search"
              value={searchTerm}
            />
            {searchTerm ? (
              <button aria-label="검색어 지우기" className="playlist-search__clear-button" onClick={() => onSearchChange("")} type="button">
                <img src={closeIcon} alt="" />
              </button>
            ) : null}
          </div>
          <p className="playlist-selection__count">내 플레이리스트 · {MOCK_PLAYLISTS.length}개</p>
          <ul className="playlist-list">
            {playlists.map((playlist) => {
              const isSelected = playlist.id === selectedPlaylistId;
              return (
                <li key={playlist.id}>
                  <button
                    aria-pressed={isSelected}
                    className={`playlist-list__item${isSelected ? " playlist-list__item--selected" : ""}`}
                    onClick={() => onSelect(playlist.id)}
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
  );
}
