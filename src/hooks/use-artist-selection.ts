import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  ARTIST_SORT_OPTIONS,
  getArtistPreviewState,
  type Artist,
  type ArtistLoadState,
  type ArtistSortOption,
} from "@/components/artist/artist-data";
import {
  AnalysisQueryError,
  createPlaylistAnalysis,
  getAnalysisArtists,
  getPlaylistAnalysis,
  updateAnalysisArtists,
} from "@/services/analysis-query";
import { getRecentPlaylistSelections } from "@/services/playlist-query";

export function useArtistSelection() {
  const [searchParams] = useSearchParams();
  const [loadState, setLoadState] = useState<ArtistLoadState>("loading");
  const [artists, setArtists] = useState<Artist[]>([]);
  const [analysisId, setAnalysisId] = useState<string | null>(null);
  const [recentPlaylistName, setRecentPlaylistName] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedArtistIds, setSelectedArtistIds] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState<ArtistSortOption>("appearance");
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const previewState = getArtistPreviewState(searchParams.get("state"));
  const currentState = previewState ?? loadState;

  useEffect(() => {
    if (previewState) return undefined;

    let isActive = true;

    async function loadArtistSelection() {
      setLoadState("loading");
      setSaveError(null);

      try {
        const [recentSelection] = await getRecentPlaylistSelections();
        if (!recentSelection) {
          throw new AnalysisQueryError("먼저 분석할 플레이리스트를 선택해 주세요.");
        }
        if (!isActive) return;

        let analysis;

        try {
          analysis = await getPlaylistAnalysis(recentSelection.playlistId);
        } catch (error) {
          if (!(error instanceof AnalysisQueryError) || error.status !== 404) throw error;
          analysis = await createPlaylistAnalysis(recentSelection.playlistId);
        }
        if (!isActive) return;

        const analyzedArtists = await getAnalysisArtists(analysis.analysisId);
        if (!isActive) return;

        setAnalysisId(analysis.analysisId);
        setArtists(analyzedArtists);
        setRecentPlaylistName(recentSelection.playlistName);
        setSelectedArtistIds(
          analyzedArtists.filter((artist) => !artist.isExcluded).map((artist) => artist.id),
        );
        setLoadState("ready");
      } catch (error) {
        if (!isActive) return;

        setArtists([]);
        setAnalysisId(null);
        setRecentPlaylistName(null);
        setSelectedArtistIds([]);
        setLoadState("error");
        setSaveError(error instanceof Error ? error.message : "아티스트 분석을 불러오지 못했습니다.");
      }
    }

    void loadArtistSelection();

    return () => {
      isActive = false;
    };
  }, [previewState, reloadKey]);

  const filteredArtists = useMemo(() => {
    const normalizedSearchTerm = searchTerm.trim().toLowerCase();
    const matchingArtists = normalizedSearchTerm
      ? artists.filter((artist) => artist.name.toLowerCase().includes(normalizedSearchTerm))
      : artists;

    return [...matchingArtists].sort((firstArtist, secondArtist) => {
      if (sortOption === "name") return firstArtist.name.localeCompare(secondArtist.name);
      return secondArtist.appearanceCount - firstArtist.appearanceCount;
    });
  }, [artists, searchTerm, sortOption]);

  function toggleArtist(artistId: string) {
    setSelectedArtistIds((ids) => ids.includes(artistId) ? ids.filter((id) => id !== artistId) : [...ids, artistId]);
  }

  function selectSortOption(option: ArtistSortOption) {
    setSortOption(option);
    setIsSortMenuOpen(false);
  }

  async function saveSelectedArtists() {
    if (!analysisId || !selectedArtistIds.length || isSaving) return false;

    setIsSaving(true);
    setSaveError(null);

    try {
      await updateAnalysisArtists(
        analysisId,
        artists.map((artist) => ({
          artistId: Number(artist.id),
          isExcluded: !selectedArtistIds.includes(artist.id),
        })),
      );
      return true;
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "아티스트 선택을 저장하지 못했습니다.");
      return false;
    } finally {
      setIsSaving(false);
    }
  }

  return {
    currentState,
    filteredArtists,
    isSortMenuOpen,
    isSaving,
    recentPlaylistName,
    reload: () => setReloadKey((key) => key + 1),
    saveError,
    saveSelectedArtists,
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
