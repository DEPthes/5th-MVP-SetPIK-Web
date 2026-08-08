import arrowRightIcon from "@/assets/icons/ic-arrow-right.svg";
import checkIcon from "@/assets/icons/ic-check.svg";
import dateIcon from "@/assets/icons/ic-date-pink.svg";
import musicNoteIcon from "@/assets/icons/ic-note-pink.svg";
import playlistIcon from "@/assets/icons/ic-playlist.svg";
import timeIcon from "@/assets/icons/ic-time-pink.svg";
import { Button } from "@/components/common/button";
import { PlaylistCover } from "./playlist-cover";
import {
  MOCK_PLAYLIST_TRACKS,
  type Playlist,
  type PlaylistLoadState,
} from "./playlist-data";
import "./playlist-detail-panel.css";

interface PlaylistDetailPanelProps {
  currentState: PlaylistLoadState;
  selectedPlaylist: Playlist | null;
  onNext: () => void;
}

function SelectionPlaceholder() {
  return (
    <div className="playlist-selection__placeholder">
      <span className="playlist-selection__placeholder-icon" aria-hidden="true">
        <img src={playlistIcon} alt="" />
      </span>
      <h2>플레이리스트를 선택해 주세요</h2>
      <p>
        왼쪽 목록에서 분석할 플레이리스트를 선택하면
        <br />
        상세 정보와 수록곡을 확인할 수 있습니다.
      </p>
    </div>
  );
}

function PlaylistTrackTable({ playlist }: { playlist: Playlist }) {
  return (
    <div className="playlist-detail__tracks">
      <div className="playlist-detail__tracks-heading">
        <h3>수록곡</h3>
      </div>
      <div className="playlist-track-table" role="table" aria-label={`${playlist.title} 수록곡`}>
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
          {MOCK_PLAYLIST_TRACKS.map((track, index) => (
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
  );
}

function PlaylistDetail({ playlist }: { playlist: Playlist }) {
  return (
    <div className="playlist-detail">
      <div className="playlist-detail__summary">
        <PlaylistCover playlist={playlist} />
        <div>
          <p>선택한 플레이리스트</p>
          <div className="playlist-detail__title-row">
            <h2>{playlist.title}</h2>
            <span className="playlist-detail__selected-badge">
              <img src={checkIcon} alt="" />
              선택됨
            </span>
          </div>
          <span>혼자 있는 새벽에 듣기 좋은 감성적인 곡들 모음</span>
          <div className="playlist-detail__metadata">
            <span><img src={musicNoteIcon} alt="" />{playlist.trackCount}곡</span>
            <i aria-hidden="true">·</i>
            <span><img src={timeIcon} alt="" />1시간 32분</span>
            <i aria-hidden="true">·</i>
            <span><img src={dateIcon} alt="" />{playlist.updatedAt}</span>
          </div>
        </div>
      </div>
      <PlaylistTrackTable playlist={playlist} />
    </div>
  );
}

export function PlaylistDetailPanel({ currentState, selectedPlaylist, onNext }: PlaylistDetailPanelProps) {
  const hasSelection = selectedPlaylist !== null && currentState === "ready";

  return (
    <div className="playlist-selection__detail-column">
      <section
        className={`playlist-selection__detail-panel${hasSelection ? " playlist-selection__detail-panel--selected" : ""}`}
        aria-live="polite"
      >
        {hasSelection ? <PlaylistDetail playlist={selectedPlaylist} /> : <SelectionPlaceholder />}
      </section>
      <Button
        className="playlist-selection__next-button button--selection-cta"
        disabled={!hasSelection}
        onClick={onNext}
        trailingIcon={<img src={arrowRightIcon} alt="" />}
      >
        다음 단계
      </Button>
    </div>
  );
}
