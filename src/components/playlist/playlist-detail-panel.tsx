import arrowRightIcon from "@/assets/icons/ic_arrow_right.svg";
import checkIcon from "@/assets/icons/ic_check_pink.svg";
import dateIcon from "@/assets/icons/ic_date_pink.svg";
import musicNoteIcon from "@/assets/icons/ic_music2_pink.svg";
import playlistIcon from "@/assets/icons/ic_playlist.svg";
import timePinkIcon from "@/assets/icons/ic_time_pink.svg";
import { Button } from "@/components/common/button";
import { PlaylistCover } from "./playlist-cover";
import { PlaylistTrackTable } from "./playlist-track-table";
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
            <span><img src={timePinkIcon} alt="" />1시간 32분</span>
            <i aria-hidden="true">·</i>
            <span><img src={dateIcon} alt="" />{playlist.updatedAt}</span>
          </div>
        </div>
      </div>
      <div className="playlist-detail__tracks">
        <div className="playlist-detail__tracks-heading">
          <h3>수록곡</h3>
        </div>
        <PlaylistTrackTable tracks={MOCK_PLAYLIST_TRACKS} />
      </div>
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
