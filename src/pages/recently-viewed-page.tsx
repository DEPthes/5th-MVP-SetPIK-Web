import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ALL_CONCERTS, type Concert } from "@/components/concert/concert-data";
import { useRecentlyViewed } from "@/contexts/recently-viewed-context";
import "@/styles/recently-viewed.css";

const imgArrowLeft = "https://www.figma.com/api/mcp/asset/1cf27b9c-452d-4d7d-84c8-b1adc02fecaf.svg";
const imgSearchIcon = "https://www.figma.com/api/mcp/asset/840487b1-c29a-480c-a3da-cfbadb1abdd9.svg";
const imgSortIcon = "https://www.figma.com/api/mcp/asset/ff14dddb-391d-45e7-b862-ce603abef5f3.svg";
const imgChevronDown = "https://www.figma.com/api/mcp/asset/a27ceec7-162f-410b-a8fa-29760434cec5.svg";
const imgDotsIcon = "https://www.figma.com/api/mcp/asset/11309a53-ac57-42fc-a4d7-1b76d12a4f15.svg";
const imgTicketIcon = "https://www.figma.com/api/mcp/asset/e80a7015-979f-4d7d-84c8-b1adc02fecaf.svg";
const imgSparkleIcon = "https://www.figma.com/api/mcp/asset/6f53b2b6-5f82-4db4-8d93-8e8907458d83.svg";
const imgTrashIcon = "https://www.figma.com/api/mcp/asset/62445f92-442f-48ce-894e-f94800942ec6.svg";

export function RecentlyViewedPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortMode, setSortMode] = useState<"recent" | "alphabetical">("recent");
  const [isManageMode, setIsManageMode] = useState(false);
  const { recentlyViewedConcertIds, removeRecentlyViewedConcert } = useRecentlyViewed();

  const recentConcerts = useMemo(
    () => recentlyViewedConcertIds
      .map((id) => ALL_CONCERTS.find((concert) => concert.id === id))
      .filter((concert): concert is Concert => Boolean(concert)),
    [recentlyViewedConcertIds],
  );

  const visibleConcerts = useMemo(() => {
    const filtered = recentConcerts.filter((concert) => concert.title.includes(searchTerm));
    if (sortMode === "alphabetical") {
      return [...filtered].sort((a, b) => a.title.localeCompare(b.title, "ko"));
    }
    return filtered;
  }, [recentConcerts, searchTerm, sortMode]);

  const deleteRecentConcert = (concertId: string) => {
    removeRecentlyViewedConcert(concertId);
  };

  const toggleManageMode = () => {
    setIsManageMode((current) => !current);
  };

  return (
    <section className="recently-viewed-page page-shell" aria-labelledby="recently-viewed-title">
      <div className="recently-viewed-page__back">
        <Link to="/mypage" className="recently-viewed-page__back-button">
          <img src={imgArrowLeft} alt="뒤로가기" />
          <span>마이페이지로</span>
        </Link>
      </div>

      <div className="recently-viewed-page__heading">
        <h1 className="recently-viewed-page__title" id="recently-viewed-title">
          최근 본 공연
        </h1>
        <p className="recently-viewed-page__subtitle">최근 확인한 공연을 다시 빠르게 찾아볼 수 있어요.</p>
      </div>

      <div className="recently-viewed-page__controls">
        <label className="recently-viewed-page__search-box">
          <img src={imgSearchIcon} alt="검색" />
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="공연명, 아티스트, 공연장 검색"
            className="recently-viewed-page__search-input"
          />
        </label>
        <button type="button" className="recently-viewed-page__sort-button" onClick={() => setSortMode((current) => (current === "recent" ? "alphabetical" : "recent"))}>
          <img src={imgSortIcon} alt="정렬" />
          <span>{sortMode === "recent" ? "최근 조회한 순" : "가나다 순"}</span>
          <img src={imgChevronDown} alt="펼치기" />
        </button>
        <button type="button" className="recently-viewed-page__manage-button" onClick={toggleManageMode}>
          <img src={imgDotsIcon} alt="조회 기록 관리" />
          <span>{isManageMode ? "관리 종료" : "조회 기록 관리"}</span>
        </button>
      </div>

      <div className="recently-viewed-page__summary-row">
        <p>최근 본 공연 {visibleConcerts.length}개</p>
        <p>{sortMode === "recent" ? "최근 조회한 순으로 표시하고 있어요." : "가나다 순으로 표시하고 있어요."}</p>
      </div>

      <div className="recently-viewed-page__card-grid">
        {visibleConcerts.map((concert) => (
          <article className="recently-viewed-page__concert-card" key={concert.id}>
            <div className="recently-viewed-page__concert-thumb">
              <div className="recently-viewed-page__concert-thumb-icon">
                <img src={imgTicketIcon} alt="공연 카드 아이콘" />
              </div>
              <div className="recently-viewed-page__concert-type">페스티벌</div>
            </div>

            <div className="recently-viewed-page__concert-body">
              <div className="recently-viewed-page__concert-info">
                <h2>{concert.title}</h2>
                <p>{concert.date} · {concert.location}</p>
                <div className="recently-viewed-page__concert-meta">
                  <img src={imgSparkleIcon} alt="Sparkle" />
                  <span>내 플레이리스트 아티스트 {concert.playlistArtistCount}팀 출연</span>
                </div>
                <p className="recently-viewed-page__concert-saved">저장일 2026.07.20</p>
              </div>

              <div className="recently-viewed-page__concert-actions">
                <Link to={`/concerts/${concert.id}`} className="recently-viewed-page__concert-detail-button">
                  공연 상세 보기
                </Link>
                {isManageMode && (
                  <button
                    type="button"
                    className="recently-viewed-page__concert-delete-button"
                    onClick={() => deleteRecentConcert(concert.id)}
                  >
                    <img src={imgTrashIcon} alt="기록 삭제" />
                    기록 삭제
                  </button>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
