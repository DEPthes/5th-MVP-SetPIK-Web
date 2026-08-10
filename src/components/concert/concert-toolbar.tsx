import type { RefObject } from "react";
import chevronDownIcon from "@/assets/icons/ic-chevron-down.svg";
import chevronUpIcon from "@/assets/icons/ic-chevron-up.svg";
import filterIcon from "@/assets/icons/ic-filter.svg";
import searchIcon from "@/assets/icons/ic-search.svg";
import { SORT_OPTIONS, type ConcertFilterState, type ConcertSort } from "./concert-data";
import { ConcertFilterModal } from "./concert-filter-modal";
import "./concert-toolbar.css";

interface ConcertToolbarProps {
  appliedFilters: ConcertFilterState;
  filterMenuRef: RefObject<HTMLDivElement | null>;
  isFilterOpen: boolean;
  isSortOpen: boolean;
  searchTerm: string;
  selectedSortLabel: string;
  sort: ConcertSort;
  visibleFilterCount: number;
  onApplyFilters: (filters: ConcertFilterState) => void;
  onCloseFilter: () => void;
  onDraftFilterCountChange: (count: number) => void;
  onSearchChange: (value: string) => void;
  onSelectSort: (sort: ConcertSort) => void;
  onSortOpenChange: (isOpen: boolean) => void;
  onToggleFilter: () => void;
}

export function ConcertToolbar({
  appliedFilters,
  filterMenuRef,
  isFilterOpen,
  isSortOpen,
  searchTerm,
  selectedSortLabel,
  sort,
  visibleFilterCount,
  onApplyFilters,
  onCloseFilter,
  onDraftFilterCountChange,
  onSearchChange,
  onSelectSort,
  onSortOpenChange,
  onToggleFilter,
}: ConcertToolbarProps) {
  return (
    <div className="concert-home__search-sticky">
      <div className="concert-home__toolbar">
        <label className="concert-home__search-field">
          <img alt="" src={searchIcon} />
          <span className="sr-only">공연 검색</span>
          <input
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="공연명, 아티스트, 공연장 검색"
            type="search"
            value={searchTerm}
          />
        </label>

        <div className="concert-home__filter" ref={filterMenuRef}>
          <button
            aria-expanded={isFilterOpen}
            aria-haspopup="dialog"
            className={`concert-home__filter-button${visibleFilterCount ? " concert-home__filter-button--active" : ""}`}
            onClick={onToggleFilter}
            type="button"
          >
            <img alt="" src={filterIcon} />
            필터
            {visibleFilterCount ? <span>{visibleFilterCount}</span> : null}
          </button>
          {isFilterOpen ? (
            <ConcertFilterModal
              initialFilters={appliedFilters}
              onApply={onApplyFilters}
              onClose={onCloseFilter}
              onFilterChange={onDraftFilterCountChange}
            />
          ) : null}
        </div>

        <div className="concert-home__sort">
          <button
            aria-expanded={isSortOpen}
            aria-haspopup="listbox"
            className="concert-home__sort-trigger"
            onClick={() => onSortOpenChange(!isSortOpen)}
            type="button"
          >
            {selectedSortLabel}
            <img alt="" src={isSortOpen ? chevronUpIcon : chevronDownIcon} />
          </button>
          {isSortOpen ? (
            <div className="concert-home__sort-menu" role="listbox">
              {SORT_OPTIONS.map((option) => (
                <button
                  aria-selected={sort === option.value}
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
    </div>
  );
}
