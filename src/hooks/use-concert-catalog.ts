import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSavedConcerts } from "@/contexts/saved-concerts-context";
import {
  ALL_CONCERTS,
  CONCERT_BATCH_SIZE,
  EMPTY_CONCERT_FILTERS,
  getActiveFilterCount,
  INITIAL_CONCERT_COUNT,
  SORT_OPTIONS,
  type ConcertFilterState,
  type ConcertSort,
} from "@/components/concert/concert-data";

export function useConcertCatalog() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [sort, setSort] = useState<ConcertSort>("recommendation");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<ConcertFilterState>(EMPTY_CONCERT_FILTERS);
  const [draftFilterCount, setDraftFilterCount] = useState(0);
  const [visibleConcertCount, setVisibleConcertCount] = useState(INITIAL_CONCERT_COUNT);
  const { savedConcertIds, toggleSavedConcert } = useSavedConcerts();
  const filterMenuRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const pageState = searchParams.get("state");

  const filteredConcerts = useMemo(() => {
    const normalizedSearchTerm = searchTerm.trim().toLowerCase();
    const concerts = normalizedSearchTerm
      ? ALL_CONCERTS.filter((concert) => `${concert.title} ${concert.category} ${concert.artists}`.toLowerCase().includes(normalizedSearchTerm))
      : ALL_CONCERTS;

    if (sort === "date") return [...concerts].sort((first, second) => first.date.localeCompare(second.date));
    if (sort === "recent") return [...concerts].reverse();
    if (sort === "artist") return [...concerts].sort((first, second) => first.artists.localeCompare(second.artists));
    if (sort === "saved") return [...concerts].sort((first, second) => Number(savedConcertIds.has(second.id)) - Number(savedConcertIds.has(first.id)));
    return concerts;
  }, [savedConcertIds, searchTerm, sort]);

  const visibleConcerts = filteredConcerts.slice(0, visibleConcertCount);
  const hasMoreConcerts = visibleConcertCount < filteredConcerts.length;
  const selectedSortLabel = SORT_OPTIONS.find((option) => option.value === sort)?.label ?? "관련도 높은 순";
  const activeFilterCount = getActiveFilterCount(appliedFilters);
  const visibleFilterCount = isFilterOpen ? draftFilterCount : activeFilterCount;

  const closeFilterMenu = useCallback(() => {
    setDraftFilterCount(activeFilterCount);
    setIsFilterOpen(false);
  }, [activeFilterCount]);

  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target || !hasMoreConcerts) return undefined;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisibleConcertCount((count) => Math.min(count + CONCERT_BATCH_SIZE, filteredConcerts.length));
      }
    }, { rootMargin: "280px" });

    observer.observe(target);
    return () => observer.disconnect();
  }, [filteredConcerts.length, hasMoreConcerts]);

  useEffect(() => {
    if (pageState !== "loading") return undefined;
    const timer = window.setTimeout(() => navigate("/concerts", { replace: true }), 1800);
    return () => window.clearTimeout(timer);
  }, [navigate, pageState]);

  useEffect(() => {
    if (!isFilterOpen) return undefined;

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") closeFilterMenu();
    }
    function closeOnOutsideClick(event: MouseEvent) {
      if (!filterMenuRef.current?.contains(event.target as Node)) closeFilterMenu();
    }

    window.addEventListener("keydown", closeOnEscape);
    window.addEventListener("mousedown", closeOnOutsideClick);
    return () => {
      window.removeEventListener("keydown", closeOnEscape);
      window.removeEventListener("mousedown", closeOnOutsideClick);
    };
  }, [closeFilterMenu, isFilterOpen]);

  useEffect(() => {
    if (!isSortOpen) return undefined;
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setIsSortOpen(false);
    }
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isSortOpen]);

  function updateSearchTerm(value: string) {
    setSearchTerm(value);
    setVisibleConcertCount(INITIAL_CONCERT_COUNT);
  }

  function selectSort(nextSort: ConcertSort) {
    setSort(nextSort);
    setVisibleConcertCount(INITIAL_CONCERT_COUNT);
    setIsSortOpen(false);
  }

  function toggleFilterMenu() {
    if (isFilterOpen) {
      closeFilterMenu();
      return;
    }
    setDraftFilterCount(activeFilterCount);
    setIsFilterOpen(true);
  }

  function applyFilters(filters: ConcertFilterState) {
    setAppliedFilters(filters);
    setDraftFilterCount(getActiveFilterCount(filters));
    setIsFilterOpen(false);
  }

  return {
    appliedFilters,
    applyFilters,
    closeFilterMenu,
    draftFilterCount,
    filteredConcerts,
    filterMenuRef,
    hasMoreConcerts,
    isError: pageState === "error",
    isFilterOpen,
    isLoading: pageState === "loading",
    isSortOpen,
    loadMoreRef,
    savedConcertIds,
    searchTerm,
    selectSort,
    selectedSortLabel,
    setDraftFilterCount,
    setIsSortOpen,
    sort,
    toggleFilterMenu,
    toggleSavedConcert,
    updateSearchTerm,
    visibleConcerts,
    visibleFilterCount,
  };
}
