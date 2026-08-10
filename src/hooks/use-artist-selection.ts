import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  ARTIST_SORT_OPTIONS,
  getArtistPreviewState,
  MOCK_ARTISTS,
  type ArtistLoadState,
  type ArtistSortOption,
} from "@/components/artist/artist-data";

export function useArtistSelection() {
  const [searchParams] = useSearchParams();
  const [loadState, setLoadState] = useState<ArtistLoadState>("loading");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedArtistIds, setSelectedArtistIds] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState<ArtistSortOption>("appearance");
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
  const previewState = getArtistPreviewState(searchParams.get("state"));
  const currentState = previewState ?? loadState;

  useEffect(() => {
    if (previewState || loadState !== "loading") return undefined;
    const timer = window.setTimeout(() => setLoadState("ready"), 1100);
    return () => window.clearTimeout(timer);
  }, [loadState, previewState]);

  const filteredArtists = useMemo(() => {
    const normalizedSearchTerm = searchTerm.trim().toLowerCase();
    const artists = normalizedSearchTerm
      ? MOCK_ARTISTS.filter((artist) => artist.name.toLowerCase().includes(normalizedSearchTerm))
      : MOCK_ARTISTS;

    return [...artists].sort((firstArtist, secondArtist) => {
      if (sortOption === "name") return firstArtist.name.localeCompare(secondArtist.name);
      return secondArtist.appearanceCount - firstArtist.appearanceCount;
    });
  }, [searchTerm, sortOption]);

  function toggleArtist(artistId: string) {
    setSelectedArtistIds((ids) => ids.includes(artistId) ? ids.filter((id) => id !== artistId) : [...ids, artistId]);
  }

  function selectSortOption(option: ArtistSortOption) {
    setSortOption(option);
    setIsSortMenuOpen(false);
  }

  return {
    currentState,
    filteredArtists,
    isSortMenuOpen,
    searchTerm,
    selectedArtistIds,
    selectedArtistCount: selectedArtistIds.length,
    selectSortOption,
    setIsSortMenuOpen,
    setSearchTerm,
    sortOption,
    sortOptionLabel: ARTIST_SORT_OPTIONS.find((option) => option.value === sortOption)?.label ?? "",
    toggleArtist,
  };
}
