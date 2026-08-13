import aiCyanIcon from "@/assets/icons/ic_shine_cyan.svg";
import artistIcon from "@/assets/icons/ic_artist.svg";
import arrowRightIcon from "@/assets/icons/ic_arrow_right.svg";
import dateIcon from "@/assets/icons/ic_date_gray.svg";
import locationIcon from "@/assets/icons/ic_location.svg";
import { Button } from "@/components/common/button";
import { SaveButton } from "@/components/common/save-button";
import { Link, useNavigate } from "react-router-dom";
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
      <Link className="concert-card__detail-link" to={`/concerts/${concert.id}`}>
        <div className="concert-card__image-wrap">
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
      </Link>
      <SaveButton className="concert-card__save" isSaved={isSaved} label={concert.title} onClick={() => onToggleSaved(concert.id)} />
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
  isSaved: boolean;
  onToggleSaved: (id: string) => void;
}

export function FeaturedConcertCard({ concert, isSaved, onToggleSaved }: FeaturedConcertCardProps) {
  const navigate = useNavigate();

  return (
    <article className="concert-featured-card">
      <div className="concert-featured-card__image-wrap">
        <span>가장 잘 맞는 공연</span>
      </div>
      <div className="concert-featured-card__content">
        <p className="concert-featured-card__category">{concert.category}</p>
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
          <Button className="concert-featured-card__detail-button" onClick={() => navigate(`/concerts/${concert.id}`)} trailingIcon={<img alt="" src={arrowRightIcon} />}>
            공연 상세 보기
          </Button>
          <SaveButton className="concert-featured-card__save-button" isSaved={isSaved} onClick={() => onToggleSaved(concert.id)} variant="label" />
        </div>
      </div>
    </article>
  );
}
