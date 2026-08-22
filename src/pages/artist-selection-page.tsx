import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArtistSelectionAction } from "@/components/artist/artist-selection-action";
import { ArtistSelectionGrid } from "@/components/artist/artist-selection-grid";
import { ArtistSelectionNotice } from "@/components/artist/artist-selection-notice";
import { ArtistDisconnectedState, ArtistLoadingState } from "@/components/artist/artist-selection-states";
import { ArtistSelectionToolbar } from "@/components/artist/artist-selection-toolbar";
import { BackButton } from "@/components/common/back-button";
import { useArtistSelection } from "@/hooks/use-artist-selection";
import { getRecentPlaylistSelections } from "@/services/playlist-query";
import "@/styles/artist-selection.css";

export function ArtistSelectionPage() {
  const navigate = useNavigate();
  const selection = useArtistSelection();
  const [recentPlaylistName, setRecentPlaylistName] = useState<string | null>(null);
  const isDisconnected = selection.currentState === "disconnected";

  useEffect(() => {
    let isActive = true;

    async function loadRecentSelection() {
      try {
        const [recentSelection] = await getRecentPlaylistSelections();
        if (isActive) setRecentPlaylistName(recentSelection?.playlistName ?? null);
      } catch {
        if (isActive) setRecentPlaylistName(null);
      }
    }

    void loadRecentSelection();

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <section
      className={`artist-selection-page${isDisconnected ? " artist-selection-page--disconnected" : ""}`}
      aria-labelledby="artist-selection-title"
    >
      <div className="artist-selection-page__inner">
        {!isDisconnected ? (
          <BackButton
            onClick={() => navigate("/onboarding/playlist-selection")}
          />
        ) : null}

        {isDisconnected ? (
          <ArtistDisconnectedState />
        ) : selection.currentState === "loading" ? (
          <ArtistLoadingState />
        ) : (
          <>
            <header className="artist-selection__heading">
              <h1 id="artist-selection-title">민준님이 즐겨 듣는 아티스트를 확인해 주세요.</h1>
              <p>
                선택한 플레이리스트에서 자주 등장한 아티스트를 분석했어요. 공연을 추천받고 싶은
                아티스트를 한 명 이상 선택해 주세요.
              </p>
            </header>

            <section className="artist-selection__playlist-summary" aria-label="분석할 플레이리스트">
              <span className="artist-selection__playlist-cover" aria-hidden="true" />
              <div>
                <p>분석할 플레이리스트</p>
                <strong>{recentPlaylistName ?? "최근 선택한 플레이리스트"}</strong>
              </div>
              <button type="button" onClick={() => navigate("/onboarding/playlist-selection")}>
                변경
              </button>
            </section>

            <ArtistSelectionToolbar
              isSortMenuOpen={selection.isSortMenuOpen}
              onSearchChange={selection.setSearchTerm}
              onSelectSort={selection.selectSortOption}
              onSortMenuOpenChange={selection.setIsSortMenuOpen}
              searchTerm={selection.searchTerm}
              sortOption={selection.sortOption}
              sortOptionLabel={selection.sortOptionLabel}
            />

            <div className="artist-selection__list-heading">
              <p>아티스트 목록 · {selection.filteredArtists.length}명</p>
              <ArtistSelectionNotice selectedArtistCount={selection.selectedArtistCount} />
            </div>

            <ArtistSelectionGrid
              artists={selection.filteredArtists}
              onToggleArtist={selection.toggleArtist}
              selectedArtistIds={selection.selectedArtistIds}
            />
            <ArtistSelectionAction selectedArtistCount={selection.selectedArtistCount} />
          </>
        )}
      </div>
    </section>
  );
}
