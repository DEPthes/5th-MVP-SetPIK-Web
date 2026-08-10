import { useNavigate } from "react-router-dom";
import disconnectedIcon from "@/assets/icons/ic-disconnected.svg";
import { SpotifyButton } from "@/components/common/spotify-button";
import { StatusState } from "@/components/common/status-state";
import { ArtistCardSkeleton } from "./artist-card-skeleton";
import "./artist-selection-state.css";

export function ArtistDisconnectedState() {
  const navigate = useNavigate();

  return (
    <StatusState
      action={<SpotifyButton className="artist-selection__reconnect-button" onClick={() => navigate("/login")}>Spotify 다시 연결하기</SpotifyButton>}
      className="artist-selection__disconnected"
      description="플레이리스트 분석을 계속하려면 Spotify 계정을 다시 연결해 주세요."
      icon={disconnectedIcon}
      title="Spotify 연결이 끊겼어요."
      titleId="artist-selection-title"
    />
  );
}

export function ArtistLoadingState() {
  return (
    <div className="artist-selection__loading" aria-live="polite" aria-label="아티스트를 분석하는 중">
      <h1 className="sr-only" id="artist-selection-title">아티스트를 분석하는 중</h1>
      <div className="artist-selection__heading-skeleton"><span className="skeleton-reflection" /><i className="skeleton-reflection" /></div>
      <p>플레이리스트에서 아티스트를 분석하고 있어요.</p>
      <span>잠시만 기다려 주세요.</span>
      <div className="artist-selection__skeleton-grid">
        {Array.from({ length: 10 }, (_, index) => <ArtistCardSkeleton key={index} />)}
      </div>
    </div>
  );
}
