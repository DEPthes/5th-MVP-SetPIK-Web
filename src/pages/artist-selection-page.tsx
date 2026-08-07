import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import arrowRightIcon from "@/assets/icons/ic-arrow-right.svg";
import checkIcon from "@/assets/icons/ic-check.svg";
import chevronDownIcon from "@/assets/icons/ic-chevron-down.svg";
import chevronUpIcon from "@/assets/icons/ic-chevron-up.svg";
import searchIcon from "@/assets/icons/ic-search.svg";
import { BackButton } from "@/components/common/back-button";
import { Button } from "@/components/common/button";

type ArtistLoadState = "loading" | "ready";
type ArtistSortOption = "appearance" | "name";

interface Artist {
  id: string;
  name: string;
  description: string;
  appearanceCount: number;
  isMainArtist?: boolean;
  imageUrl?: string;
}

const ARTISTS: Artist[] = [
  { id: "coldplay", name: "Coldplay", description: "플레이리스트에 8곡 포함", appearanceCount: 8, isMainArtist: true },
  { id: "the-1975", name: "The 1975", description: "플레이리스트에 7곡 포함", appearanceCount: 7, isMainArtist: true },
  { id: "frank-ocean", name: "Frank Ocean", description: "플레이리스트에 6곡 포함", appearanceCount: 6, isMainArtist: true },
  { id: "keshi", name: "keshi", description: "플레이리스트에 5곡 포함", appearanceCount: 5 },
  { id: "wave-to-earth", name: "wave to earth", description: "플레이리스트에 5곡 포함", appearanceCount: 5 },
  { id: "lauv", name: "Lauv", description: "플레이리스트에 4곡 포함", appearanceCount: 4 },
  { id: "joji", name: "Joji", description: "플레이리스트에 4곡 포함", appearanceCount: 4 },
  { id: "dayglow", name: "Dayglow", description: "플레이리스트에 3곡 포함", appearanceCount: 3 },
  { id: "cigarettes-after-sex", name: "Cigarettes After Sex", description: "플레이리스트에 3곡 포함", appearanceCount: 3 },
  { id: "beabadoobee", name: "beabadoobee", description: "플레이리스트에 2곡 포함", appearanceCount: 2 },
  { id: "nujabes", name: "Nujabes", description: "플레이리스트에 2곡 포함", appearanceCount: 2 },
  { id: "clairo", name: "Clairo", description: "플레이리스트에 2곡 포함", appearanceCount: 2 },
  { id: "sza", name: "SZA", description: "플레이리스트에 1곡 포함", appearanceCount: 1 },
  { id: "daniel-caesar", name: "Daniel Caesar", description: "플레이리스트에 1곡 포함", appearanceCount: 1 },
  { id: "tame-impala", name: "Tame Impala", description: "플레이리스트에 1곡 포함", appearanceCount: 1 },
];

const SORT_OPTIONS: Array<{ value: ArtistSortOption; label: string }> = [
  { value: "appearance", label: "등장 횟수 높은 순" },
  { value: "name", label: "이름순" },
];

function getPreviewState(value: string | null): ArtistLoadState | null {
  return value === "loading" ? value : null;
}

function ArtistCover({ artist }: { artist: Artist }) {
  return (
    <span
      aria-hidden="true"
      className="artist-card__cover"
      style={artist.imageUrl ? { backgroundImage: `url(${artist.imageUrl})` } : undefined}
    />
  );
}

function ArtistSkeleton() {
  return (
    <article className="artist-card artist-card--skeleton" aria-hidden="true">
      <span className="artist-card__skeleton-cover" />
      <span className="artist-card__skeleton-title" />
      <span className="artist-card__skeleton-description" />
    </article>
  );
}

export function ArtistSelectionPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loadState, setLoadState] = useState<ArtistLoadState>("loading");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedArtistIds, setSelectedArtistIds] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState<ArtistSortOption>("appearance");
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
  const previewState = getPreviewState(searchParams.get("state"));
  const currentState = previewState ?? loadState;

  useEffect(() => {
    if (previewState || loadState !== "loading") {
      return undefined;
    }

    const timer = window.setTimeout(() => setLoadState("ready"), 1100);
    return () => window.clearTimeout(timer);
  }, [loadState, previewState]);

  const filteredArtists = useMemo(() => {
    const normalizedSearchTerm = searchTerm.trim().toLowerCase();
    const artists = normalizedSearchTerm
      ? ARTISTS.filter((artist) => artist.name.toLowerCase().includes(normalizedSearchTerm))
      : ARTISTS;

    return [...artists].sort((firstArtist, secondArtist) => {
      if (sortOption === "name") {
        return firstArtist.name.localeCompare(secondArtist.name);
      }

      return secondArtist.appearanceCount - firstArtist.appearanceCount;
    });
  }, [searchTerm, sortOption]);

  const sortOptionLabel = SORT_OPTIONS.find((option) => option.value === sortOption)?.label ?? "";
  const selectedArtistCount = selectedArtistIds.length;

  function toggleArtist(artistId: string) {
    setSelectedArtistIds((currentIds) =>
      currentIds.includes(artistId) ? currentIds.filter((id) => id !== artistId) : [...currentIds, artistId],
    );
  }

  function selectSortOption(option: ArtistSortOption) {
    setSortOption(option);
    setIsSortMenuOpen(false);
  }

  return (
    <section className="artist-selection-page" aria-labelledby="artist-selection-title">
      <div className="artist-selection-page__inner">
        <BackButton className="artist-selection__back-button" onClick={() => navigate("/onboarding/playlist-selection")} />

        {currentState === "loading" ? (
          <div className="artist-selection__loading" aria-live="polite" aria-label="아티스트를 분석하는 중">
            <h1 className="sr-only" id="artist-selection-title">아티스트를 분석하는 중</h1>
            <div className="artist-selection__heading-skeleton">
              <span />
              <i />
            </div>
            <p>플레이리스트에서 아티스트를 분석하고 있어요.</p>
            <span>잠시만 기다려 주세요.</span>
            <div className="artist-selection__skeleton-grid">
              {Array.from({ length: 10 }, (_, index) => <ArtistSkeleton key={index} />)}
            </div>
          </div>
        ) : (
          <>
            <header className="artist-selection__heading">
              <h1 id="artist-selection-title">민준님이 즐겨 듣는 아티스트를 확인해 주세요.</h1>
              <p>선택한 플레이리스트에서 자주 등장한 아티스트를 분석했어요. 공연을 추천받고 싶은 아티스트를 한 명 이상 선택해 주세요.</p>
            </header>

            <section className="artist-selection__playlist-summary" aria-label="분석할 플레이리스트">
              <span className="artist-selection__playlist-cover" aria-hidden="true" />
              <div>
                <p>분석할 플레이리스트</p>
                <strong>새벽 감성 · 42곡</strong>
              </div>
              <button type="button" onClick={() => navigate("/onboarding/playlist-selection")}>변경</button>
            </section>

            <div className="artist-selection__toolbar">
              <label className="artist-selection__search">
                <img src={searchIcon} alt="" />
                <span className="sr-only">아티스트 이름 검색</span>
                <input
                  onChange={(event) => setSearchTerm(event.target.value)}
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
                  onClick={() => setIsSortMenuOpen((isOpen) => !isOpen)}
                  type="button"
                >
                  <span>{sortOptionLabel}</span>
                  <img src={isSortMenuOpen ? chevronUpIcon : chevronDownIcon} alt="" />
                </button>
                {isSortMenuOpen ? (
                  <div className="artist-selection__sort-menu" role="listbox" aria-label="정렬 기준">
                    {SORT_OPTIONS.map((option) => (
                      <button
                        aria-selected={option.value === sortOption}
                        key={option.value}
                        onClick={() => selectSortOption(option.value)}
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

            <div className="artist-selection__list-heading">
              <p>아티스트 목록 · {filteredArtists.length}명</p>
              <div className={`artist-selection__selection-notice${selectedArtistCount ? " artist-selection__selection-notice--selected" : ""}`}>
                <span className="artist-selection__selection-message">
                  {selectedArtistCount ? <i aria-hidden="true">•</i> : null}
                  {selectedArtistCount ? "선택한 아티스트를 기준으로 공연을 추천해 드릴게요." : "최소 1명의 아티스트를 선택해 주세요."}
                </span>
                <span className="artist-selection__selected-count">
                  선택된 아티스트 <em>{selectedArtistCount}명</em>
                </span>
              </div>
            </div>

            <div className="artist-selection__grid">
              {filteredArtists.map((artist) => {
                const isSelected = selectedArtistIds.includes(artist.id);

                return (
                  <button
                    aria-pressed={isSelected}
                    className={`artist-card${isSelected ? " artist-card--selected" : ""}`}
                    key={artist.id}
                    onClick={() => toggleArtist(artist.id)}
                    type="button"
                  >
                    <ArtistCover artist={artist} />
                    <span className="artist-card__selection-mark" aria-hidden="true">
                      {isSelected ? <img src={checkIcon} alt="" /> : null}
                    </span>
                    {artist.isMainArtist ? <span className="artist-card__tag">주요 아티스트</span> : null}
                    <strong>{artist.name}</strong>
                    <small>{artist.description}</small>
                  </button>
                );
              })}
            </div>

            <div className={`artist-selection__footer-action${selectedArtistCount ? " artist-selection__footer-action--selected" : ""}`}>
              <div>
                <strong>선택한 아티스트 <em>{selectedArtistCount}명</em></strong>
                <p>{selectedArtistCount ? "선택한 아티스트를 기준으로 공연을 추천해 드릴게요." : "공연 추천을 받으려면 최소 1명을 선택해 주세요."}</p>
              </div>
              <Button
                className="artist-selection__next-button button--selection-cta"
                disabled={!selectedArtistCount}
                onClick={() => navigate("/concerts")}
                trailingIcon={<img src={arrowRightIcon} alt="" />}
              >
                선택한 아티스트로 공연 찾기
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
