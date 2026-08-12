import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import sparkleIcon from "@/assets/icons/ic-sparkle-icon-1.svg";
import arrowRightIcon from "@/assets/icons/ic-arrow-right.svg";
import chevronDownIcon from "@/assets/icons/ic-chevron-down.svg";
import chevronUpIcon from "@/assets/icons/ic-chevron-up.svg";
import searchIcon from "@/assets/icons/ic-search.svg";
import { Button } from "@/components/common/button";
import { BrowseConcertCard, SavedConcertCard, type PreStudyConcert } from "@/components/pre-study/pre-study-concert-card";
import "@/styles/pre-study-playlists.css";

const FILTERS = ["전체", "페스티벌", "콘서트", "내한 공연", "이번 달", "서울"];
const SORT_OPTIONS = ["추천순", "최신 공연순", "공연명순", "가격 낮은 순"];

const SAVED_CONCERTS: PreStudyConcert[] = [
  { id: "saved-1", title: "Summer Sonic Seoul 2026", category: "페스티벌", date: "2026.08.22", location: "송도 달빛축제공원", artists: "실리카겔, HYUKOH, wave to earth 외 17팀", gradient: "cyan" },
  { id: "saved-2", title: "Summer Sonic Seoul 2026", category: "페스티벌", date: "2026.08.22", location: "송도 달빛축제공원", artists: "실리카겔, HYUKOH, wave to earth 외 17팀", gradient: "cyan", playlistExists: true },
  { id: "saved-3", title: "Summer Sonic Seoul 2026", category: "페스티벌", date: "2026.08.22", location: "송도 달빛축제공원", artists: "실리카겔, HYUKOH, wave to earth 외 17팀", gradient: "cyan", playlistExists: true },
];

const RECOMMENDED_CONCERTS: PreStudyConcert[] = [
  { id: "recommend-1", title: "실리카겔 단독 공연 2026", category: "단독 공연", date: "2026.09.05", location: "YES24 라이브홀", artists: "실리카겔", gradient: "blue", reason: "연관도 92%", rank: 1 },
  { id: "recommend-2", title: "잔나비 CONCERT : TIME", category: "콘서트", date: "2026.08.14", location: "올림픽홀", artists: "잔나비", gradient: "blue", reason: "연관도 88%", rank: 2 },
  { id: "recommend-3", title: "새소년 단독 콘서트", category: "단독 공연", date: "2026.10.15", location: "예스24 라이브홀", artists: "새소년", gradient: "red", reason: "연관도 84%", rank: 3 },
  { id: "recommend-4", title: "DAY6 Gravity 앙코르 투어", category: "콘서트", date: "2026.11.01", location: "체조경기장", artists: "DAY6", gradient: "blue", reason: "연관도 81%", rank: 4 },
];

const BROWSE_CONCERTS: PreStudyConcert[] = [
  { id: "browse-1", title: "wave to earth 단독공연", category: "단독 공연", date: "2026.08.30", location: "YES24 라이브홀", artists: "wave to earth", gradient: "cyan", price: 99000 },
  { id: "browse-2", title: "이날치 X 앰비규어스댄스컴퍼니", category: "콘서트", date: "2026.09.12", location: "국립극장", artists: "이날치 외 1팀", gradient: "red", price: 77000 },
  { id: "browse-3", title: "PEPPERTONES 20주년 콘서트", category: "콘서트", date: "2026.09.20", location: "세종문화회관 대극장", artists: "PEPPERTONES", gradient: "blue", price: 88000 },
  { id: "browse-4", title: "Guckkasten Live 2026", category: "단독 공연", date: "2026.09.27", location: "KBS 아레나홀", artists: "국카스텐", gradient: "purple", price: 110000 },
  { id: "browse-5", title: "Seoul Jazz Festival", category: "페스티벌", date: "2026.10.05", location: "올림픽공원 88광장", artists: "다수 아티스트 외 29팀", gradient: "yellow", price: 143000 },
  { id: "browse-6", title: "이소라 콘서트", category: "단독 공연", date: "2026.10.18", location: "블루스퀘어 마스터카드홀", artists: "이소라", gradient: "blue", price: 132000 },
  { id: "browse-7", title: "검정치마 콘서트 2026", category: "단독 공연", date: "2026.10.25", location: "예스24 라이브홀", artists: "검정치마", gradient: "cyan", price: 121000 },
  { id: "browse-8", title: "한국 월드 뮤직 페스티벌", category: "페스티벌", date: "2026.11.08", location: "인천아시아드 주경기장", artists: "다수 아티스트 외 17팀", gradient: "purple", price: 66000 },
];

export function PreStudyPlaylistPage() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("전체");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [savedConcertIds, setSavedConcertIds] = useState<Set<string>>(() => new Set(["browse-2"]));
  const [sort, setSort] = useState(SORT_OPTIONS[0]);

  const visibleBrowseConcerts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const filteredConcerts = BROWSE_CONCERTS.filter((concert) => {
      const matchesQuery = !normalizedQuery || `${concert.title} ${concert.artists} ${concert.location}`.toLowerCase().includes(normalizedQuery);
      const matchesFilter = activeFilter === "전체"
        || (activeFilter === "이번 달" ? concert.date.startsWith("2026.08") : concert.category === activeFilter);
      return matchesQuery && matchesFilter;
    });

    if (sort === "최신 공연순") return [...filteredConcerts].reverse();
    if (sort === "공연명순") return [...filteredConcerts].sort((first, second) => first.title.localeCompare(second.title));
    if (sort === "가격 낮은 순") return [...filteredConcerts].sort((first, second) => (first.price ?? 0) - (second.price ?? 0));
    return filteredConcerts;
  }, [activeFilter, query, sort]);

  function toggleSavedConcert(id: string) {
    setSavedConcertIds((currentIds) => {
      const nextIds = new Set(currentIds);
      if (nextIds.has(id)) nextIds.delete(id);
      else nextIds.add(id);
      return nextIds;
    });
  }

  function openSpotifyPlaylist(playlistUrl?: string) {
    if (playlistUrl) window.open(playlistUrl, "_blank", "noopener,noreferrer");
  }

  return (
    <section className="pre-study-page" aria-labelledby="pre-study-title">
      <div className="pre-study-page__hero page-content">
        <h1 id="pre-study-title">어떤 공연을 예습해 볼까요?</h1>
        <p>관람 예정인 공연을 선택하면 출연 아티스트를 기반으로 Spotify 예습 플레이리스트를 만들어 드려요.</p>
      </div>

      <div className="pre-study-page__search-sticky">
        <div className="page-content">
          <label className="pre-study-page__search">
            <img alt="" src={searchIcon} />
            <span className="sr-only">공연 검색</span>
            <input onChange={(event) => setQuery(event.target.value)} placeholder="공연명, 아티스트명, 공연장 검색" type="search" value={query} />
          </label>
        </div>
      </div>

      <div className="pre-study-page__filters page-content" aria-label="공연 빠른 필터">
          {FILTERS.map((filter) => (
            <button aria-pressed={activeFilter === filter} className={activeFilter === filter ? "is-active" : ""} key={filter} onClick={() => setActiveFilter(filter)} type="button">
              {filter}
            </button>
          ))}
      </div>

      <section className="pre-study-page__section page-content" aria-labelledby="saved-concerts-title">
        <SectionHeading count="3개" description="관심 공연으로 저장한 공연에서 예습 플리를 만들 수 있어요." id="saved-concerts-title" title="저장한 공연으로 만들기" action="전체 보기" />
        <div className="pre-study-page__saved-grid">
          {SAVED_CONCERTS.map((concert) => (
            <SavedConcertCard
              concert={concert}
              key={concert.id}
              onCreate={() => navigate("/pre-study-playlists/create")}
              onOpenPlaylist={openSpotifyPlaylist}
            />
          ))}
        </div>
      </section>

      <section className="pre-study-page__section pre-study-page__section--bordered page-content" aria-labelledby="recommended-concerts-title">
        <SectionHeading description="공연 홈의 연관도 매칭으로 추천한 공연이에요." icon id="recommended-concerts-title" title="내 취향에 맞는 공연" action="더 보기" />
        <div className="pre-study-page__recommended-grid">
          {RECOMMENDED_CONCERTS.map((concert) => (
            <BrowseConcertCard concert={concert} isSaved={savedConcertIds.has(concert.id)} key={concert.id} onCreate={() => navigate("/pre-study-playlists/create")} onToggleSaved={toggleSavedConcert} recommended />
          ))}
        </div>
      </section>

      <section className="pre-study-page__section pre-study-page__browse page-content" aria-labelledby="browse-concerts-title">
        <div className="pre-study-page__browse-header">
          <div>
            <h2 id="browse-concerts-title">공연 둘러보기</h2>
            <p>전체 공연 {BROWSE_CONCERTS.length}개</p>
          </div>
          <div className={`pre-study-page__sort${isSortOpen ? " is-open" : ""}`}>
            <button aria-expanded={isSortOpen} aria-haspopup="listbox" className="pre-study-page__sort-trigger" onClick={() => setIsSortOpen((isOpen) => !isOpen)} type="button">
              {sort}<img alt="" src={isSortOpen ? chevronUpIcon : chevronDownIcon} />
            </button>
            {isSortOpen ? (
              <div className="pre-study-page__sort-menu" role="listbox">
                {SORT_OPTIONS.map((option) => (
                  <button aria-selected={sort === option} key={option} onClick={() => { setSort(option); setIsSortOpen(false); }} role="option" type="button">
                    {option}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </div>
        {visibleBrowseConcerts.length ? (
          <div className="pre-study-page__browse-grid">
            {visibleBrowseConcerts.map((concert) => (
              <BrowseConcertCard concert={concert} isSaved={savedConcertIds.has(concert.id)} key={concert.id} onCreate={() => navigate("/pre-study-playlists/create")} onToggleSaved={toggleSavedConcert} />
            ))}
          </div>
        ) : <p className="pre-study-page__empty">검색 조건에 맞는 공연이 없어요.</p>}
      </section>

      <section className="pre-study-page__search-cta-section page-content" aria-labelledby="more-concerts-title">
        <div className="pre-study-page__search-cta">
          <div className="pre-study-page__search-cta-copy">
            <span><img alt="" src={searchIcon} /></span>
            <div>
              <h2 id="more-concerts-title">원하는 공연이 없나요?</h2>
              <p>검색을 통해 더 많은 공연으로 예습 플레이리스트를 만들 수 있습니다.</p>
            </div>
          </div>
          <Button trailingIcon={<img alt="" src={arrowRightIcon} />}>공연 검색하기</Button>
        </div>
      </section>
    </section>
  );
}

function SectionHeading({ action, count, description, icon = false, id, title }: { action: string; count?: string; description: string; icon?: boolean; id: string; title: string }) {
  return (
    <header className="pre-study-page__section-heading">
      <div>
        <h2 id={id}>{icon ? <img alt="" src={sparkleIcon} /> : null}{title}{count ? <span>{count}</span> : null}</h2>
        <p>{description}</p>
      </div>
      <button type="button">{action}<img alt="" src={arrowRightIcon} /></button>
    </header>
  );
}
