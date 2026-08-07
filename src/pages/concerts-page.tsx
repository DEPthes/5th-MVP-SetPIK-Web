import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import aiCyanIcon from "@/assets/icons/ic-ai-cyan.svg";
import arrowRightIcon from "@/assets/icons/ic-arrow-right.svg";
import artistIcon from "@/assets/icons/ic-artist.svg";
import chevronDownIcon from "@/assets/icons/ic-chevron-down.svg";
import dateIcon from "@/assets/icons/ic-date-gray.svg";
import filterIcon from "@/assets/icons/ic-filter.svg";
import heartIcon from "@/assets/icons/ic-heart-icon.svg";
import locationIcon from "@/assets/icons/ic-location.svg";
import playlistIcon from "@/assets/icons/ic-playlist.svg";
import searchIcon from "@/assets/icons/ic-search.svg";

type ConcertSort = "recommendation" | "date";

interface Concert {
  id: string;
  title: string;
  category: string;
  date: string;
  location: string;
  artists: string;
  playlistArtistCount: number;
  playlistRelevance: number;
}

const INITIAL_CONCERT_COUNT = 8;
const CONCERT_BATCH_SIZE = 8;

const CONCERT_TEMPLATES: Omit<Concert, "id">[] = [
  { title: "뷰티풀 민트 라이프 2026", category: "페스티벌", date: "2026.05.16", location: "올림픽공원", artists: "DAY6, LUCY, 잔나비 외 4팀", playlistArtistCount: 2, playlistRelevance: 86 },
  { title: "2026 서울 뮤직 페스티벌", category: "페스티벌", date: "2026.08.20", location: "서울 올림픽공원", artists: "실리카겔, 잔나비, wave to earth 외 5팀", playlistArtistCount: 3, playlistRelevance: 92 },
  { title: "SUMMER SONIC SEOUL 2026", category: "페스티벌", date: "2026.08.15 - 08.16", location: "잠실종합운동장", artists: "The 1975, keshi, Lauv 외 15팀", playlistArtistCount: 3, playlistRelevance: 89 },
  { title: "서울 재즈 페스티벌 2026", category: "페스티벌", date: "2026.05.29 - 05.31", location: "올림픽공원", artists: "Daniel Caesar, Clairo, Nujabes 외 19팀", playlistArtistCount: 2, playlistRelevance: 84 },
  { title: "그랜드 민트 페스티벌 2026", category: "페스티벌", date: "2026.10.17 - 10.18", location: "올림픽공원", artists: "wave to earth, Dayglow, Joji 외 11팀", playlistArtistCount: 2, playlistRelevance: 82 },
  { title: "Mellow City Night", category: "페스티벌", date: "2026.07.18", location: "노들섬 라이브하우스", artists: "Joji, keshi, beabadoobee 외 6팀", playlistArtistCount: 1, playlistRelevance: 80 },
  { title: "인천 펜타포트 록 페스티벌", category: "페스티벌", date: "2026.08.01 - 08.03", location: "송도 달빛축제공원", artists: "The 1975, Coldplay, LUCY 외 17팀", playlistArtistCount: 3, playlistRelevance: 78 },
  { title: "서울숲 뮤직 위크", category: "페스티벌", date: "2026.09.05 - 09.06", location: "서울숲", artists: "Clairo, Cigarettes After Sex 외 8팀", playlistArtistCount: 1, playlistRelevance: 76 },
  { title: "한강 뮤직 피크닉 2026", category: "페스티벌", date: "2026.06.13 - 06.14", location: "뚝섬 한강공원", artists: "Lauv, Dayglow, keshi 외 10팀", playlistArtistCount: 2, playlistRelevance: 75 },
  { title: "시티 사운드 페스티벌", category: "페스티벌", date: "2026.11.07 - 11.08", location: "문화비축기지", artists: "Nujabes, Joji, wave to earth 외 12팀", playlistArtistCount: 2, playlistRelevance: 73 },
  { title: "부산 원아시아 페스티벌", category: "페스티벌", date: "2026.10.23 - 10.25", location: "부산아시아드주경기장", artists: "Coldplay, LUCY, 잔나비 외 18팀", playlistArtistCount: 2, playlistRelevance: 71 },
  { title: "인디 포레스트 2026", category: "페스티벌", date: "2026.09.19 - 09.20", location: "난지 한강공원", artists: "beabadoobee, Clairo, keshi 외 9팀", playlistArtistCount: 1, playlistRelevance: 69 },
];

const ALL_CONCERTS: Concert[] = Array.from({ length: 42 }, (_, index) => {
  const template = CONCERT_TEMPLATES[index % CONCERT_TEMPLATES.length];
  const round = Math.floor(index / CONCERT_TEMPLATES.length);

  return {
    ...template,
    id: `concert-${index + 1}`,
    title: round ? `${template.title} ${round + 1}` : template.title,
  };
});

const SORT_OPTIONS: Array<{ value: ConcertSort; label: string }> = [
  { value: "recommendation", label: "관련도 높은 순" },
  { value: "date", label: "공연일순" },
];

function ConcertCard({ concert, isSaved, onToggleSaved }: { concert: Concert; isSaved: boolean; onToggleSaved: (id: string) => void }) {
  return (
    <article className="concert-card">
      <div className="concert-card__image-wrap">
        <button
          aria-label={`${concert.title} ${isSaved ? "저장 취소" : "저장"}`}
          aria-pressed={isSaved}
          className={`concert-card__save${isSaved ? " concert-card__save--active" : ""}`}
          onClick={() => onToggleSaved(concert.id)}
          type="button"
        >
          <img alt="" src={heartIcon} />
        </button>
        <span className="concert-card__category">{concert.category}</span>
      </div>
      <div className="concert-card__content">
        <h3>{concert.title}</h3>
        <dl className="concert-card__metadata">
          <div><img alt="" src={dateIcon} /><dd>{concert.date}</dd></div>
          <div><img alt="" src={locationIcon} /><dd>{concert.location}</dd></div>
          <div><img alt="" src={artistIcon} /><dd>출연: {concert.artists}</dd></div>
        </dl>
        <div className="concert-card__match">
          <p><img alt="" src={aiCyanIcon} />내 플레이리스트 아티스트 {concert.playlistArtistCount}팀 출연</p>
          <span>플레이리스트 연관도 {concert.playlistRelevance}%</span>
        </div>
      </div>
    </article>
  );
}

function ConcertGrid({ concerts, savedConcertIds, onToggleSaved }: { concerts: Concert[]; savedConcertIds: Set<string>; onToggleSaved: (id: string) => void }) {
  return (
    <div className="concert-grid">
      {concerts.map((concert) => (
        <ConcertCard concert={concert} isSaved={savedConcertIds.has(concert.id)} key={concert.id} onToggleSaved={onToggleSaved} />
      ))}
    </div>
  );
}

function ConcertCardSkeleton() {
  return (
    <article className="concert-card-skeleton" aria-hidden="true">
      <span className="concert-card-skeleton__image" />
      <div className="concert-card-skeleton__content">
        <i className="concert-card-skeleton__title" />
        <i className="concert-card-skeleton__line concert-card-skeleton__line--short" />
        <i className="concert-card-skeleton__line" />
      </div>
    </article>
  );
}

export function ConcertsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [sort, setSort] = useState<ConcertSort>("recommendation");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [visibleConcertCount, setVisibleConcertCount] = useState(INITIAL_CONCERT_COUNT);
  const [savedConcertIds, setSavedConcertIds] = useState<Set<string>>(() => new Set());
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const isLoading = searchParams.get("state") === "loading";

  const filteredConcerts = useMemo(() => {
    const normalizedSearchTerm = searchTerm.trim().toLowerCase();
    const concerts = normalizedSearchTerm
      ? ALL_CONCERTS.filter((concert) => `${concert.title} ${concert.category} ${concert.artists}`.toLowerCase().includes(normalizedSearchTerm))
      : ALL_CONCERTS;

    return sort === "date" ? [...concerts].sort((first, second) => first.date.localeCompare(second.date)) : concerts;
  }, [searchTerm, sort]);

  const visibleConcerts = filteredConcerts.slice(0, visibleConcertCount);
  const hasMoreConcerts = visibleConcertCount < filteredConcerts.length;
  const selectedSortLabel = SORT_OPTIONS.find((option) => option.value === sort)?.label ?? "관련도 높은 순";

  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target || !hasMoreConcerts) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisibleConcertCount((currentCount) => Math.min(currentCount + CONCERT_BATCH_SIZE, filteredConcerts.length));
        }
      },
      { rootMargin: "280px" },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [filteredConcerts.length, hasMoreConcerts]);

  useEffect(() => {
    if (!isLoading) {
      return undefined;
    }

    const timer = window.setTimeout(() => navigate("/concerts", { replace: true }), 1800);
    return () => window.clearTimeout(timer);
  }, [isLoading, navigate]);

  function toggleSavedConcert(concertId: string) {
    setSavedConcertIds((currentIds) => {
      const nextIds = new Set(currentIds);
      if (nextIds.has(concertId)) {
        nextIds.delete(concertId);
      } else {
        nextIds.add(concertId);
      }
      return nextIds;
    });
  }

  function updateSearchTerm(value: string) {
    setSearchTerm(value);
    setVisibleConcertCount(INITIAL_CONCERT_COUNT);
  }

  function selectSort(nextSort: ConcertSort) {
    setSort(nextSort);
    setVisibleConcertCount(INITIAL_CONCERT_COUNT);
    setIsSortOpen(false);
  }

  if (isLoading) {
    return (
      <section className="concert-home concert-home--loading" aria-labelledby="concert-home-loading-title" aria-live="polite">
        <div className="concert-home__inner concert-home__loading-inner">
          <div className="concert-home__loading-heading">
            <h1 className="sr-only" id="concert-home-loading-title">추천 공연을 찾는 중</h1>
            <span />
            <i />
          </div>
          <p className="concert-home__loading-message">추천 공연을 찾고 있어요. <span>플레이리스트와 아티스트 정보를 분석하는 중입니다.</span></p>
          <div className="concert-home__loading-grid">
            {Array.from({ length: 8 }, (_, index) => <ConcertCardSkeleton key={index} />)}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="concert-home" aria-labelledby="concert-home-title">
      <div className="concert-home__inner">
        <header className="concert-home__intro">
          <h1 id="concert-home-title">민준님을 위한 공연을 추천해 드려요.</h1>
          <p>선택한 플레이리스트와 아티스트를 기준으로 가장 잘 맞는 공연을 찾았어요.</p>
        </header>

        <section className="concert-home__criteria" aria-label="공연 추천 기준">
          <span className="concert-home__playlist-cover" aria-hidden="true" />
          <div className="concert-home__criteria-copy">
            <p>추천 기준 플레이리스트</p>
            <strong>새벽 감성</strong>
          </div>
          <div className="concert-home__criteria-metadata"><span><img alt="" src={playlistIcon} />42곡</span><span><img alt="" src={artistIcon} />선택한 아티스트 5명</span></div>
          <button type="button">변경</button>
        </section>

        <div className="concert-home__search-sticky">
          <div className="concert-home__toolbar">
            <label className="concert-home__search-field">
              <img alt="" src={searchIcon} />
              <span className="sr-only">공연 검색</span>
              <input onChange={(event) => updateSearchTerm(event.target.value)} placeholder="공연명, 아티스트, 공연장 검색" type="search" value={searchTerm} />
            </label>
            <button className="concert-home__filter-button" type="button"><img alt="" src={filterIcon} />필터</button>
            <div className="concert-home__sort">
              <button aria-expanded={isSortOpen} aria-haspopup="listbox" className="concert-home__sort-trigger" onClick={() => setIsSortOpen((isOpen) => !isOpen)} type="button">
                {selectedSortLabel}<img alt="" src={chevronDownIcon} />
              </button>
              {isSortOpen ? (
                <div className="concert-home__sort-menu" role="listbox">
                  {SORT_OPTIONS.map((option) => (
                    <button aria-selected={sort === option.value} key={option.value} onClick={() => selectSort(option.value)} role="option" type="button">
                      {option.label}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <section className="concert-home__section concert-home__section--featured" aria-labelledby="best-concert-title">
          <div className="concert-home__section-heading">
            <h2 id="best-concert-title">가장 잘 맞는 공연</h2>
            <p>선택한 플레이리스트와 아티스트를 기준으로 가장 높은 관련도를 가진 공연이에요.</p>
          </div>
          <article className="concert-featured-card">
            <div className="concert-featured-card__image-wrap">
              <span>가장 잘 맞는 공연</span>
            </div>
            <div className="concert-featured-card__content">
              <p className="concert-featured-card__category">페스티벌</p>
              <h3>2026 서울 뮤직 페스티벌</h3>
              <dl className="concert-featured-card__metadata">
                <div><img alt="" src={dateIcon} /><dd>2026.08.20</dd></div>
                <div><img alt="" src={locationIcon} /><dd>서울 올림픽공원</dd></div>
                <div><img alt="" src={artistIcon} /><dd>출연: 실리카겔, 잔나비, wave to earth 외 5팀</dd></div>
              </dl>
              <div className="concert-featured-card__match"><p><img alt="" src={aiCyanIcon} />내 플레이리스트 아티스트 3팀이 출연해요.</p><span>플레이리스트 연관도 92%</span></div>
              <div className="concert-featured-card__actions">
                <button className="concert-featured-card__detail-button" type="button">공연 상세 보기 <img alt="" src={arrowRightIcon} /></button>
                <button className="concert-featured-card__save-button" type="button"><img alt="" src={heartIcon} />저장</button>
              </div>
            </div>
          </article>
        </section>

        <section className="concert-home__section" aria-labelledby="artist-concert-title">
          <div className="concert-home__section-heading">
            <h2 id="artist-concert-title">내 플레이리스트 아티스트가 출연하는 공연</h2>
            <p>선택한 아티스트가 실제로 출연하는 공연을 모았어요.</p>
          </div>
          <ConcertGrid concerts={ALL_CONCERTS.slice(0, 6)} onToggleSaved={toggleSavedConcert} savedConcertIds={savedConcertIds} />
        </section>

        <section className="concert-home__section" aria-labelledby="similar-concert-title">
          <div className="concert-home__section-heading">
            <h2 id="similar-concert-title">내 취향과 비슷한 공연</h2>
            <p>장르와 음악 분위기가 비슷한 공연을 추천했어요.</p>
          </div>
          <ConcertGrid concerts={ALL_CONCERTS.slice(6, 12)} onToggleSaved={toggleSavedConcert} savedConcertIds={savedConcertIds} />
        </section>

        <section className="concert-home__section concert-home__section--all" aria-labelledby="all-concert-title">
          <div className="concert-home__all-heading">
            <div><h2 id="all-concert-title">전체 추천 공연 <span>총 {filteredConcerts.length}개</span></h2><p>플레이리스트 분석 결과를 바탕으로 추천된 모든 공연을 확인해보세요.</p></div>
          </div>
          {visibleConcerts.length ? (
            <ConcertGrid concerts={visibleConcerts} onToggleSaved={toggleSavedConcert} savedConcertIds={savedConcertIds} />
          ) : <p className="concert-home__empty">검색 결과가 없어요. 다른 검색어로 다시 찾아보세요.</p>}
          {hasMoreConcerts ? <div aria-hidden="true" className="concert-home__load-more" ref={loadMoreRef} /> : null}
          {!hasMoreConcerts && visibleConcerts.length ? <div className="concert-home__all-complete"><span><img alt="" src={aiCyanIcon} /></span><h3>추천 공연을 모두 확인했어요.</h3><p>새로운 공연이 등록되면 추천 목록도 업데이트돼요.</p></div> : null}
        </section>
      </div>
    </section>
  );
}
