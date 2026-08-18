import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ALL_CONCERTS, type Concert } from "@/components/concert/concert-data";
import { useRecentlyViewed } from "@/hooks/use-recently-viewed";
import { BackLink } from "@/components/common/back-link";
import searchIcon from "@/assets/icons/ic_search.svg";
import sortIcon from "@/assets/icons/ic_sort.svg";
import chevronDownIcon from "@/assets/icons/ic_chevron_down.svg";
import sparkleIcon from "@/assets/icons/ic_sparkle_cyan.svg";
import trashIcon from "@/assets/icons/ic_trash.svg";
import checkedCircleIcon from "@/assets/icons/ic_check_circle_pink.svg";
import uncheckedCircleIcon from "@/assets/icons/ic_check_circle_gray.svg";
import kebabMenuIcon from "@/assets/icons/ic_kebab_menu.svg";
import { RecentlyViewedDeleteModal } from "@/components/common/recently-viewed-delete-modal";
import "@/styles/recently-viewed.css";

const SORT_OPTIONS = [
  { value: "recent", label: "최근 조회한 순" },
  { value: "name", label: "이름순" },
] as const;

type SortMode = (typeof SORT_OPTIONS)[number]["value"];

function getCardPresentation(index: number) {
  const variant = index % 4;

  return {
    category: variant === 0 ? "페스티벌" : variant === 1 ? "단독 공연" : "콘서트",
    status: variant === 2 ? "매진" : variant === 3 ? "종료" : null,
    variant,
  };
}

export function RecentlyViewedPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortMode, setSortMode] = useState<SortMode>("recent");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedConcertIds, setSelectedConcertIds] = useState<string[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<Concert | null>(null);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const { recentlyViewedConcertIds, removeRecentlyViewedConcert } = useRecentlyViewed();

  const recentConcerts = useMemo(
    () => recentlyViewedConcertIds
      .map((id) => ALL_CONCERTS.find((concert) => concert.id === id))
      .filter((concert): concert is Concert => Boolean(concert)),
    [recentlyViewedConcertIds],
  );

  const visibleConcerts = useMemo(() => {
    const normalizedSearchTerm = searchTerm.trim().toLocaleLowerCase();
    const filtered = recentConcerts.filter((concert) => [concert.title, concert.artists, concert.location]
      .some((value) => value.toLocaleLowerCase().includes(normalizedSearchTerm)));

    return sortMode === "name"
      ? [...filtered].sort((a, b) => a.title.localeCompare(b.title, "ko"))
      : filtered;
  }, [recentConcerts, searchTerm, sortMode]);

  const activeSortLabel = SORT_OPTIONS.find((option) => option.value === sortMode)?.label;

  function toggleSelectionMode() {
    setIsSelectionMode((current) => !current);
    setSelectedConcertIds([]);
  }

  function toggleConcertSelection(concertId: string) {
    setSelectedConcertIds((current) => (
      current.includes(concertId)
        ? current.filter((id) => id !== concertId)
        : [...current, concertId]
    ));
  }

  function handleConcertCardClick(concertId: string) {
    if (!isSelectionMode) return;

    toggleConcertSelection(concertId);
  }

  function closeDeleteModal() {
    setDeleteTarget(null);
    setIsBulkDeleteModalOpen(false);
  }

  function confirmDelete() {
    if (deleteTarget) {
      removeRecentlyViewedConcert(deleteTarget.id);
      setSelectedConcertIds((current) => current.filter((id) => id !== deleteTarget.id));
    }

    if (isBulkDeleteModalOpen) {
      selectedConcertIds.forEach((concertId) => removeRecentlyViewedConcert(concertId));
      setSelectedConcertIds([]);
      setIsSelectionMode(false);
    }

    closeDeleteModal();
  }

  return (
    <section className="recently-viewed-page page-shell" aria-labelledby="recently-viewed-title">
      <BackLink to="/mypage">마이페이지로</BackLink>

      <div className="recently-viewed-page__heading">
        <h1 className="text-heading-1" id="recently-viewed-title">최근 본 공연</h1>
        <p className="text-body-1 recently-viewed-page__subtitle">최근 확인한 공연을 다시 빠르게 찾아볼 수 있어요.</p>
      </div>

      <div className="recently-viewed-page__controls">
        <label className="recently-viewed-page__search-box">
          <img src={searchIcon} alt="" />
          <input
            className="recently-viewed-page__search-input"
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="공연명, 아티스트, 공연장 검색"
            type="search"
            value={searchTerm}
          />
        </label>

        <div className="recently-viewed-page__sort-menu">
          <button
            aria-expanded={isSortOpen}
            aria-haspopup="listbox"
            className="recently-viewed-page__sort-button"
            onClick={() => setIsSortOpen((current) => !current)}
            type="button"
          >
            <img src={sortIcon} alt="" />
            <span>{activeSortLabel}</span>
            <img src={chevronDownIcon} alt="" className={isSortOpen ? "recently-viewed-page__sort-chevron--open" : ""} />
          </button>
          {isSortOpen ? (
            <div aria-label="최근 본 공연 정렬" className="recently-viewed-page__sort-options" role="listbox">
              {SORT_OPTIONS.map((option) => (
                <button
                  aria-selected={sortMode === option.value}
                  className={sortMode === option.value ? "is-selected" : ""}
                  key={option.value}
                  onClick={() => {
                    setSortMode(option.value);
                    setIsSortOpen(false);
                  }}
                  role="option"
                  type="button"
                >
                  {option.label}
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className="recently-viewed-page__selection-actions">
          <button
            aria-pressed={isSelectionMode}
            className="recently-viewed-page__manage-button"
            onClick={toggleSelectionMode}
            type="button"
          >
            <img src={kebabMenuIcon} alt="" />
            선택 삭제
          </button>
          {isSelectionMode ? (
            <button
              aria-label="선택한 공연 기록 삭제"
              className="recently-viewed-page__bulk-delete-button"
              disabled={selectedConcertIds.length === 0}
              onClick={() => setIsBulkDeleteModalOpen(true)}
              type="button"
            >
              <img src={trashIcon} alt="" />
            </button>
          ) : null}
        </div>
      </div>

      <div className="recently-viewed-page__summary-row">
        <div className="recently-viewed-page__summary-copy">
          <p>최근 본 공연 {visibleConcerts.length}개</p>
          <span>{sortMode === "recent" ? "최근 조회한 순으로 표시하고 있어요." : "이름순으로 표시하고 있어요."}</span>
        </div>
      </div>

      <div className="recently-viewed-page__card-grid">
        {visibleConcerts.map((concert, index) => {
          const { category, status, variant } = getCardPresentation(index);
          const isSelected = selectedConcertIds.includes(concert.id);

          return (
            <article
              className={[
                "recently-viewed-page__concert-card",
                isSelectionMode ? "recently-viewed-page__concert-card--selecting" : "",
                isSelected ? "recently-viewed-page__concert-card--selected" : "",
              ].filter(Boolean).join(" ")}
              key={concert.id}
            >
              {isSelectionMode ? (
                <button
                  aria-label={`${concert.title} ${isSelected ? "선택 해제" : "선택"}`}
                  aria-pressed={isSelected}
                  className="recently-viewed-page__selection-checkbox"
                  onClick={() => toggleConcertSelection(concert.id)}
                  type="button"
                >
                  <img src={isSelected ? checkedCircleIcon : uncheckedCircleIcon} alt="" />
                </button>
              ) : null}
              <div
                className="recently-viewed-page__concert-card-body"
                onClick={isSelectionMode ? () => handleConcertCardClick(concert.id) : undefined}
                onKeyDown={isSelectionMode ? (event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    handleConcertCardClick(concert.id);
                  }
                } : undefined}
                role={isSelectionMode ? "button" : undefined}
                tabIndex={isSelectionMode ? 0 : undefined}
              >
                <div className="recently-viewed-page__concert-thumb">
                  {status ? (
                    <span
                      className={[
                        "recently-viewed-page__concert-status",
                        status === "매진"
                          ? "recently-viewed-page__concert-status--sold-out"
                          : "recently-viewed-page__concert-status--ended",
                      ].join(" ")}
                    >
                      {status}
                    </span>
                  ) : null}
                  <span className="recently-viewed-page__concert-category">{category}</span>
                </div>
                <div className="recently-viewed-page__concert-content">
                  <h2>{concert.title}</h2>
                  <p className="recently-viewed-page__concert-location">{concert.date} · {concert.location}</p>
                  <p className="recently-viewed-page__concert-match">
                    <img src={sparkleIcon} alt="" />
                    {variant === 2 ? "인디 록 취향과 높은 관련" : `내 플레이리스트 아티스트 ${concert.playlistArtistCount}팀 출연`}
                  </p>
                  <p className="recently-viewed-page__concert-viewed-date">저장일 2026.07.{20 - (index % 4)}</p>
                </div>
              </div>
              <div className="recently-viewed-page__concert-actions">
                <Link
                  to={`/concerts/${concert.id}`}
                >
                  공연 상세 보기
                </Link>
                <button
                  onClick={() => setDeleteTarget(concert)}
                  type="button"
                >
                  <img src={trashIcon} alt="" />
                  기록 삭제
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {deleteTarget ? (
        <RecentlyViewedDeleteModal
          onCancel={closeDeleteModal}
          onConfirm={confirmDelete}
        />
      ) : null}
      {isBulkDeleteModalOpen ? (
        <RecentlyViewedDeleteModal onCancel={closeDeleteModal} onConfirm={confirmDelete} />
      ) : null}
    </section>
  );
}
