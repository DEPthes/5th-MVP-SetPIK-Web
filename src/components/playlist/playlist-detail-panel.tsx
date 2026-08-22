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
  type Playlist,
  type PlaylistLoadState,
  type PlaylistTrack,
} from "./playlist-data";
import "./playlist-detail-panel.css";

interface PlaylistDetailPanelProps {
  currentState: PlaylistLoadState;
  selectedPlaylist: Playlist | null;
  selectedTracks: PlaylistTrack[];
  isSelecting: boolean;
  selectionError: string | null;
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

function PlaylistDetail({ playlist, tracks }: { playlist: Playlist; tracks: PlaylistTrack[] }) {
  const totalDurationMs = tracks.reduce((total, track) => total + (track.durationMs ?? 0), 0);
  const totalMinutes = Math.floor(totalDurationMs / 60_000);
  const totalHours = Math.floor(totalMinutes / 60);
  const totalDuration = totalDurationMs > 0
    ? totalHours > 0
      ? `${totalHours}시간 ${totalMinutes % 60}분`
      : `${totalMinutes}분`
    : "재생 시간 정보 없음";

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
          <span>{playlist.description ?? "플레이리스트 설명을 불러오는 중입니다."}</span>
          <div className="playlist-detail__metadata">
            <span><img src={musicNoteIcon} alt="" />{playlist.trackCount}곡</span>
            <i aria-hidden="true">·</i>
            <span><img src={timePinkIcon} alt="" />{totalDuration}</span>
            <i aria-hidden="true">·</i>
            <span><img src={dateIcon} alt="" />{playlist.updatedAt}</span>
          </div>
        </div>
      </div>
      <div className="playlist-detail__tracks">
        <div className="playlist-detail__tracks-heading">
          <h3>수록곡</h3>
        </div>
        <PlaylistTrackTable tracks={tracks} />
      </div>
    </div>
  );
}

export function PlaylistDetailPanel({
  currentState,
  selectedPlaylist,
  selectedTracks,
  isSelecting,
  selectionError,
  onNext,
}: PlaylistDetailPanelProps) {
  const hasSelection = selectedPlaylist !== null && currentState === "ready";

  return (
    <div className="playlist-selection__detail-column">
      <section
        className={`playlist-selection__detail-panel${hasSelection ? " playlist-selection__detail-panel--selected" : ""}`}
        aria-live="polite"
      >
        {hasSelection ? <PlaylistDetail playlist={selectedPlaylist} tracks={selectedTracks} /> : <SelectionPlaceholder />}
      </section>
      <Button
        className="playlist-selection__next-button button--selection-cta"
        disabled={!hasSelection || isSelecting}
        onClick={onNext}
        trailingIcon={<img src={arrowRightIcon} alt="" />}
      >
        {isSelecting ? "선택 저장 중..." : "다음 단계"}
      </Button>
      {selectionError ? <p className="playlist-selection__next-error" role="alert">{selectionError}</p> : null}
    </div>
  );
}
