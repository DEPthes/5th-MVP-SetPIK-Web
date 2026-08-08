import chevronDownIcon from "@/assets/icons/ic-chevron-down.svg";
import chevronUpIcon from "@/assets/icons/ic-chevron-up.svg";
import searchIcon from "@/assets/icons/ic-search.svg";
import { ARTIST_SORT_OPTIONS, type ArtistSortOption } from "./artist-data";
import "./artist-selection-toolbar.css";

interface ArtistSelectionToolbarProps {
  isSortMenuOpen: boolean;
  searchTerm: string;
  sortOption: ArtistSortOption;
  sortOptionLabel: string;
  onSearchChange: (value: string) => void;
  onSelectSort: (option: ArtistSortOption) => void;
  onSortMenuOpenChange: (isOpen: boolean) => void;
}

export function ArtistSelectionToolbar({
  isSortMenuOpen,
  searchTerm,
  sortOption,
  sortOptionLabel,
  onSearchChange,
  onSelectSort,
  onSortMenuOpenChange,
}: ArtistSelectionToolbarProps) {
  return (
    <div className="artist-selection__toolbar">
      <label className="artist-selection__search">
        <img src={searchIcon} alt="" />
        <span className="sr-only">아티스트 이름 검색</span>
        <input
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="아티스트 이름 검색"
          type="search"
          value={searchTerm}
        />
      </label>
      <div className="artist-selection__sort">
        <button
          aria-expanded={isSortMenuOpen}
          aria-haspopup="listbox"
          className="artist-selection__sort-trigger"
          onClick={() => onSortMenuOpenChange(!isSortMenuOpen)}
          type="button"
        >
          <span>{sortOptionLabel}</span>
          <img src={isSortMenuOpen ? chevronUpIcon : chevronDownIcon} alt="" />
        </button>
        {isSortMenuOpen ? (
          <div className="artist-selection__sort-menu" role="listbox" aria-label="정렬 기준">
            {ARTIST_SORT_OPTIONS.map((option) => (
              <button
                aria-selected={option.value === sortOption}
                key={option.value}
                onClick={() => onSelectSort(option.value)}
                role="option"
                type="button"
              >
                {option.label}
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
