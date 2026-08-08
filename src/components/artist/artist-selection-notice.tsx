export function ArtistSelectionNotice({ selectedArtistCount }: { selectedArtistCount: number }) {
  return (
    <div
      className={`artist-selection__selection-notice${selectedArtistCount ? " artist-selection__selection-notice--selected" : ""}`}
    >
      <span className="artist-selection__selection-message">
        {selectedArtistCount ? <i aria-hidden="true">•</i> : null}
        {selectedArtistCount
          ? "선택한 아티스트를 기준으로 공연을 추천해 드릴게요."
          : "최소 1명의 아티스트를 선택해 주세요."}
      </span>
      <span className="artist-selection__selected-count">
        선택된 아티스트 <em>{selectedArtistCount}명</em>
      </span>
    </div>
  );
}
