import aiCyanIcon from "@/assets/icons/ic-ai-cyan.svg";
import artistIcon from "@/assets/icons/ic-artist.svg";
import arrowRightIcon from "@/assets/icons/ic-arrow-right.svg";
import dateIcon from "@/assets/icons/ic-date-gray.svg";
import heartIcon from "@/assets/icons/ic-heart-icon.svg";
import locationIcon from "@/assets/icons/ic-location.svg";
import { Button } from "@/components/common/button";
import type { Concert } from "./concert-data";
import "./concert-card.css";

interface ConcertCardProps {
  concert: Concert;
  isSaved: boolean;
  onToggleSaved: (id: string) => void;
}

interface ConcertGridProps {
  concerts: Concert[];
  savedConcertIds: Set<string>;
  onToggleSaved: (id: string) => void;
}

export function ConcertCard({ concert, isSaved, onToggleSaved }: ConcertCardProps) {
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
          <p>
            <img alt="" src={aiCyanIcon} />
            내 플레이리스트 아티스트 {concert.playlistArtistCount}팀 출연
          </p>
          <span>플레이리스트 연관도 {concert.playlistRelevance}%</span>
        </div>
      </div>
    </article>
  );
}

export function ConcertGrid({ concerts, savedConcertIds, onToggleSaved }: ConcertGridProps) {
  return (
    <div className="concert-grid">
      {concerts.map((concert) => (
        <ConcertCard concert={concert} isSaved={savedConcertIds.has(concert.id)} key={concert.id} onToggleSaved={onToggleSaved} />
      ))}
    </div>
  );
}

export function ConcertCardSkeleton() {
  return (
    <article className="concert-card-skeleton" aria-hidden="true">
      <span className="concert-card-skeleton__image skeleton-reflection" />
      <div className="concert-card-skeleton__content">
        <i className="concert-card-skeleton__title skeleton-reflection" />
        <i className="concert-card-skeleton__line concert-card-skeleton__line--short skeleton-reflection" />
        <i className="concert-card-skeleton__line skeleton-reflection" />
      </div>
    </article>
  );
}

interface FeaturedConcertCardProps {
  concert: Concert;
}

export function FeaturedConcertCard({ concert }: FeaturedConcertCardProps) {
  return (
    <article className="concert-featured-card">
      <div className="concert-featured-card__image-wrap">
        <span>가장 잘 맞는 공연</span>
      </div>
      <div className="concert-featured-card__content">
        <p className="concert-featured-card__category">페스티벌</p>
        <h3>{concert.title}</h3>
        <dl className="concert-featured-card__metadata">
          <div><img alt="" src={dateIcon} /><dd>{concert.date}</dd></div>
          <div><img alt="" src={locationIcon} /><dd>{concert.location}</dd></div>
          <div><img alt="" src={artistIcon} /><dd>출연: {concert.artists}</dd></div>
        </dl>
        <div className="concert-featured-card__match">
          <p>
            <img alt="" src={aiCyanIcon} />
            내 플레이리스트 아티스트 {concert.playlistArtistCount}팀이 출연해요.
          </p>
          <span>플레이리스트 연관도 {concert.playlistRelevance}%</span>
        </div>
        <div className="concert-featured-card__actions">
          <Button className="concert-featured-card__detail-button" trailingIcon={<img alt="" src={arrowRightIcon} />}>
            공연 상세 보기
          </Button>
          <button className="concert-featured-card__save-button" type="button">
            <img alt="" src={heartIcon} />
            저장
          </button>
        </div>
      </div>
    </article>
  );
}
