import { useRef, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import arrowLeftIcon from "@/assets/icons/ic_chevron_left_thick.svg";
import chevronLeftIcon from "@/assets/icons/ic_chevron_left_thick.svg";
import externalLinkIcon from "@/assets/icons/ic_externallink_pink.svg";
import musicIcon from "@/assets/icons/ic_music1.svg";
import musicCyanIcon from "@/assets/icons/ic_music1_cyan.svg";
import playIcon from "@/assets/icons/ic_play.svg";
import starIcon from "@/assets/icons/ic_star_cyan.svg";
import { Button } from "@/components/common/button";
import { SaveButton } from "@/components/common/save-button";
import { ALL_CONCERTS } from "@/components/concert/concert-data";
import "@/styles/concert-detail.css";

const ARTISTS = [
  { name: "실리카겔", initial: "실", gradient: "purple" },
  { name: "잔나비", initial: "잔", gradient: "blue" },
  { name: "wave to earth", initial: "w", gradient: "teal" },
  { name: "HYUKOH", initial: "H", gradient: "yellow" },
  { name: "이날치", initial: "이", gradient: "red" },
  { name: "The Black Skirts", initial: "B", gradient: "navy" },
  { name: "ADOY", initial: "A", gradient: "orange" },
  { name: "새소년", initial: "새", gradient: "green" },
];

export function ConcertDetailPage() {
  const { concertId } = useParams();
  const concert = ALL_CONCERTS.find((item) => item.id === concertId);
  const [isSaved, setIsSaved] = useState(false);
  const lineupTrackRef = useRef<HTMLDivElement>(null);

  function slideLineup(direction: "next" | "previous") {
    const track = lineupTrackRef.current;
    const firstCard = track?.firstElementChild;
    if (!track || !firstCard) return;

    const maximumScrollLeft = track.scrollWidth - track.clientWidth;
    const cardWidth = firstCard.getBoundingClientRect().width;
    const isAtStart = track.scrollLeft <= 1;
    const isAtEnd = track.scrollLeft >= maximumScrollLeft - 1;
    const nextScrollLeft = direction === "next"
      ? (isAtEnd ? 0 : Math.min(track.scrollLeft + cardWidth + 16, maximumScrollLeft))
      : (isAtStart ? maximumScrollLeft : Math.max(track.scrollLeft - cardWidth - 16, 0));

    track.scrollTo({ left: nextScrollLeft, behavior: "smooth" });
  }

  if (!concert) return <Navigate replace to="/concerts" />;

  const details = [
    ["공연 장소", "서울 올림픽공원"],
    ["공연 일시", "2026.08.20 목요일 · 오후 7:00"],
    ["티켓 오픈", "2026.07.19 일요일 · 오후 4:00"],
    ["티켓 가격", "150,000원"],
    ["공연 유형", concert.category],
    ["관람 시간", "약 180분"],
    ["관람 연령", "만 12세 이상"],
  ];

  return (
    <section className="concert-detail" aria-labelledby="concert-detail-title">
      <div className="concert-detail__inner">
        <Link className="concert-detail__back" to="/concerts">
          <img alt="" src={arrowLeftIcon} />
          공연 목록으로
        </Link>

        <header className="concert-detail__heading">
          <h1 id="concert-detail-title">{concert.title}</h1>
          <div className="concert-detail__recommendation" aria-label="AI 추천 이유">
            <span className="concert-detail__recommendation-label"><img alt="" src={starIcon} />AI 추천 이유</span>
            <ul>
              <li>플레이리스트 연관도 {concert.playlistRelevance}%</li>
              <li>내 취향과 높은 관련</li>
              <li>선택한 아티스트 3팀 출연</li>
            </ul>
          </div>
        </header>

        <div className="concert-detail__overview">
          <div className="concert-detail__poster" aria-label={`${concert.title} 공연 포스터`}>
            <img alt="" src={musicIcon} />
            <p>공연 이미지가 없습니다</p>
          </div>

          <div className="concert-detail__information">
            <dl>
              {details.map(([term, description]) => (
                <div key={term}>
                  <dt>{term}</dt>
                  <dd>{description}</dd>
                </div>
              ))}
            </dl>
            <div className="concert-detail__actions">
              <a className="concert-detail__action concert-detail__action--ticket" href="https://tickets.interpark.com" rel="noreferrer" target="_blank">
                예매 페이지로 이동 <img alt="" src={externalLinkIcon} />
              </a>
              <Link className="concert-detail__action concert-detail__action--playlist" to="/pre-study-playlists">
                <img alt="" src={musicCyanIcon} /> 예습 플리 만들기
              </Link>
              <SaveButton className="concert-detail__action concert-detail__action--neutral" isSaved={isSaved} label="공연 저장" onClick={() => setIsSaved((saved) => !saved)} variant="label" />
            </div>
          </div>
        </div>
      </div>

      <section className="concert-lineup" aria-labelledby="concert-lineup-title">
        <div className="concert-lineup__inner">
          <header className="concert-lineup__heading">
            <div>
              <h2 id="concert-lineup-title">아티스트 라인업</h2>
              <p>공연과 관련도가 높은 순으로 정렬했어요.</p>
            </div>
            <div className="concert-lineup__controls" aria-label="아티스트 목록 이동">
              <button aria-label="이전 아티스트" onClick={() => slideLineup("previous")} type="button"><img alt="" src={chevronLeftIcon} /></button>
              <button aria-label="다음 아티스트" onClick={() => slideLineup("next")} type="button"><img alt="" src={chevronLeftIcon} /></button>
            </div>
          </header>

          <div className="concert-lineup__cards" ref={lineupTrackRef}>
            {ARTISTS.map((artist) => (
              <article className="concert-artist-card" key={artist.name}>
                <div className={`concert-artist-card__image concert-artist-card__image--${artist.gradient}`}>
                  <strong>{artist.initial}</strong>
                  <span><img alt="" src={starIcon} />내 플레이리스트</span>
                </div>
                <div className="concert-artist-card__content">
                  <h3>{artist.name}</h3>
                  <Button className="concert-artist-card__play" leadingIcon={<img alt="" src={playIcon} />} variant="neutral">
                    관련 곡 재생
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </section>
  );
}
