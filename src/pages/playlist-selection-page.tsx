import { useNavigate } from "react-router-dom";
import { BackButton } from "@/components/common/back-button";
import { PlaylistDetailPanel } from "@/components/playlist/playlist-detail-panel";
import { PlaylistListPanel } from "@/components/playlist/playlist-list-panel";
import { usePlaylistSelection } from "@/hooks/use-playlist-selection";
import "@/styles/playlist-selection.css";

export function PlaylistSelectionPage() {
  const navigate = useNavigate();
  const {
    currentState,
    filteredPlaylists,
    retry,
    searchTerm,
    selectedPlaylist,
    selectedPlaylistId,
    setSearchTerm,
    setSelectedPlaylistId,
  } = usePlaylistSelection();

  return (
    <section className="playlist-selection-page" aria-labelledby="playlist-selection-title">
      <div className="playlist-selection-page__inner">
        <BackButton className="playlist-selection__back-button" onClick={() => navigate("/login")} />

        <header className="playlist-selection__heading">
          <h1 id="playlist-selection-title">OO님의 플레이리스트 중 하나를 선택해 주세요.</h1>
          <p>선택한 플레이리스트의 음악 취향을 분석해 맞춤 공연을 추천해 드려요</p>
        </header>

        <div className="playlist-selection__content">
          <PlaylistListPanel
            currentState={currentState}
            onRetry={retry}
            onSearchChange={setSearchTerm}
            onSelect={setSelectedPlaylistId}
            playlists={filteredPlaylists}
            searchTerm={searchTerm}
            selectedPlaylistId={selectedPlaylistId}
          />
          <PlaylistDetailPanel
            currentState={currentState}
            onNext={() => navigate("/onboarding/artists")}
            selectedPlaylist={selectedPlaylist}
          />
        </div>
      </div>
    </section>
  );
}
