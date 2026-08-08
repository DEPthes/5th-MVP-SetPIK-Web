import { ConcertErrorState, ConcertLoadingState } from "@/components/concert/concert-page-state";
import {
  ConcertRecommendationCriteria,
  ConcertRecommendations,
} from "@/components/concert/concert-recommendations";
import { ConcertToolbar } from "@/components/concert/concert-toolbar";
import { useConcertCatalog } from "@/hooks/use-concert-catalog";
import "@/styles/concerts.css";

export function ConcertsPage() {
  const catalog = useConcertCatalog();

  if (catalog.isLoading) return <ConcertLoadingState />;
  if (catalog.isError) return <ConcertErrorState />;

  return (
    <section className="concert-home" aria-labelledby="concert-home-title">
      <div className="concert-home__inner">
        <header className="concert-home__intro">
          <h1 id="concert-home-title">민준님을 위한 공연을 추천해 드려요.</h1>
          <p>선택한 플레이리스트와 아티스트를 기준으로 가장 잘 맞는 공연을 찾았어요.</p>
        </header>

        <ConcertRecommendationCriteria />
        <ConcertToolbar
          appliedFilters={catalog.appliedFilters}
          filterMenuRef={catalog.filterMenuRef}
          isFilterOpen={catalog.isFilterOpen}
          isSortOpen={catalog.isSortOpen}
          onApplyFilters={catalog.applyFilters}
          onCloseFilter={catalog.closeFilterMenu}
          onDraftFilterCountChange={catalog.setDraftFilterCount}
          onSearchChange={catalog.updateSearchTerm}
          onSelectSort={catalog.selectSort}
          onSortOpenChange={catalog.setIsSortOpen}
          onToggleFilter={catalog.toggleFilterMenu}
          searchTerm={catalog.searchTerm}
          selectedSortLabel={catalog.selectedSortLabel}
          sort={catalog.sort}
          visibleFilterCount={catalog.visibleFilterCount}
        />
        <ConcertRecommendations
          filteredConcertCount={catalog.filteredConcerts.length}
          hasMoreConcerts={catalog.hasMoreConcerts}
          loadMoreRef={catalog.loadMoreRef}
          onToggleSaved={catalog.toggleSavedConcert}
          savedConcertIds={catalog.savedConcertIds}
          visibleConcerts={catalog.visibleConcerts}
        />
      </div>
    </section>
  );
}
