import type { ReactNode, RefObject } from "react";
import { useNavigate } from "react-router-dom";
import aiCyanIcon from "@/assets/icons/ic_shine_cyan.svg";
import artistIcon from "@/assets/icons/ic_artist.svg";
import playlistIcon from "@/assets/icons/ic_playlist.svg";
import { ConcertGrid, FeaturedConcertCard } from "./concert-card";
import { ALL_CONCERTS, type Concert } from "./concert-data";

interface ConcertRecommendationsProps {
  filteredConcertCount: number;
  hasMoreConcerts: boolean;
  loadMoreRef: RefObject<HTMLDivElement | null>;
  savedConcertIds: Set<string>;
  visibleConcerts: Concert[];
  onToggleSaved: (concertId: string) => void;
}

interface ConcertSectionProps {
  children: ReactNode;
  description: string;
  id: string;
  title: string;
}

function ConcertSection({ children, description, id, title }: ConcertSectionProps) {
  return (
    <section className="concert-home__section" aria-labelledby={id}>
      <div className="concert-home__section-heading">
        <h2 id={id}>{title}</h2>
        <p>{description}</p>
      </div>
      {children}
    </section>
  );
}

export function ConcertRecommendationCriteria() {
  const navigate = useNavigate();

  return (
    <section className="concert-home__criteria" aria-label="공연 추천 기준">
      <span className="concert-home__playlist-cover" aria-hidden="true" />
      <div className="concert-home__criteria-copy">
        <p>추천 기준 플레이리스트</p>
        <strong>새벽 감성</strong>
      </div>
      <div className="concert-home__criteria-metadata">
        <span><img alt="" src={playlistIcon} />42곡</span>
        <span><img alt="" src={artistIcon} />선택한 아티스트 5명</span>
      </div>
      <button onClick={() => navigate("/onboarding/playlist-selection")} type="button">변경</button>
    </section>
  );
}

export function ConcertRecommendations({
  filteredConcertCount,
  hasMoreConcerts,
  loadMoreRef,
  savedConcertIds,
  visibleConcerts,
  onToggleSaved,
}: ConcertRecommendationsProps) {
  return (
    <>
      <section className="concert-home__section concert-home__section--featured" aria-labelledby="best-concert-title">
        <div className="concert-home__section-heading">
          <h2 id="best-concert-title">가장 잘 맞는 공연</h2>
          <p>선택한 플레이리스트와 아티스트를 기준으로 가장 높은 관련도를 가진 공연이에요.</p>
        </div>
        <FeaturedConcertCard
          concert={ALL_CONCERTS[0]}
          isSaved={savedConcertIds.has(ALL_CONCERTS[0].id)}
          onToggleSaved={onToggleSaved}
        />
      </section>

      <ConcertSection
        id="artist-concert-title"
        title="내 플레이리스트 아티스트가 출연하는 공연"
        description="선택한 아티스트가 실제로 출연하는 공연을 모았어요."
      >
        <ConcertGrid concerts={ALL_CONCERTS.slice(0, 6)} onToggleSaved={onToggleSaved} savedConcertIds={savedConcertIds} />
      </ConcertSection>

      <ConcertSection
        id="similar-concert-title"
        title="내 취향과 비슷한 공연"
        description="장르와 음악 분위기가 비슷한 공연을 추천했어요."
      >
        <ConcertGrid concerts={ALL_CONCERTS.slice(6, 12)} onToggleSaved={onToggleSaved} savedConcertIds={savedConcertIds} />
      </ConcertSection>

      <section className="concert-home__section concert-home__section--all" aria-labelledby="all-concert-title">
        <div className="concert-home__all-heading">
          <div>
            <h2 id="all-concert-title">
              전체 추천 공연 <span>총 {filteredConcertCount}개</span>
            </h2>
            <p>플레이리스트 분석 결과를 바탕으로 추천된 모든 공연을 확인해보세요.</p>
          </div>
        </div>
        {visibleConcerts.length ? (
          <ConcertGrid concerts={visibleConcerts} onToggleSaved={onToggleSaved} savedConcertIds={savedConcertIds} />
        ) : (
          <p className="concert-home__empty">검색 결과가 없어요. 다른 검색어로 다시 찾아보세요.</p>
        )}
        {hasMoreConcerts ? (
          <div aria-hidden="true" className="concert-home__load-more" ref={loadMoreRef} />
        ) : null}
        {!hasMoreConcerts && visibleConcerts.length ? (
          <div className="concert-home__all-complete">
            <span><img alt="" src={aiCyanIcon} /></span>
            <h3>추천 공연을 모두 확인했어요.</h3>
            <p>새로운 공연이 등록되면 추천 목록도 업데이트돼요.</p>
          </div>
        ) : null}
      </section>
    </>
  );
}
