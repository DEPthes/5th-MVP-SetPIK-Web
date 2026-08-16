import artistIcon from "@/assets/icons/ic_artist.svg";
import arrowRightIcon from "@/assets/icons/ic_arrow_right.svg";
import dateIcon from "@/assets/icons/ic_date_gray.svg";
import externalLinkIcon from "@/assets/icons/ic_externallink.svg";
import locationIcon from "@/assets/icons/ic_location.svg";
import { Button } from "@/components/common/button";
import { SaveButton } from "@/components/common/save-button";
import "./pre-study-concert-card.css";

export interface PreStudyConcert {
  artists: string;
  category: string;
  date: string;
  gradient: string;
  id: string;
  location: string;
  playlistExists?: boolean;
  price?: number;
  reason?: string;
  rank?: number;
  spotifyPlaylistUrl?: string;
  title: string;
}

interface SavedConcertCardProps {
  concert: PreStudyConcert;
  onCreate: (id: string) => void;
  onOpenPlaylist: (playlistUrl?: string) => void;
}

interface BrowseConcertCardProps {
  concert: PreStudyConcert;
  isSaved: boolean;
  onCreate: (id: string) => void;
  onToggleSaved: (id: string) => void;
  recommended?: boolean;
}

export function SavedConcertCard({ concert, onCreate, onOpenPlaylist }: SavedConcertCardProps) {
  return (
    <article className="pre-study-saved-card">
      <div className={`pre-study-saved-card__poster pre-study-poster--${concert.gradient}`}>
      </div>
      <div className="pre-study-saved-card__content">
        <div>
          <h3>{concert.title}</h3>
          <ConcertMetadata concert={concert} includeArtists />
        </div>
        <div className="pre-study-saved-card__actions">
          <Button className="pre-study-saved-card__create" onClick={() => onCreate(concert.id)} size="small">예습 플리 만들기</Button>
          {concert.playlistExists ? (
            <Button className="pre-study-saved-card__open" leadingIcon={<img alt="" src={externalLinkIcon} />} onClick={() => onOpenPlaylist(concert.spotifyPlaylistUrl)} size="small" variant="neutral">
              플리 바로가기
            </Button>
          ) : null}
        </div>
        {concert.playlistExists ? <p>이미 예습 플레이리스트가 있어요. 플리 바로가기에서 확인하세요.</p> : null}
      </div>
    </article>
  );
}

export function BrowseConcertCard({ concert, isSaved, onCreate, onToggleSaved, recommended = false }: BrowseConcertCardProps) {
  return (
    <article className={`pre-study-browse-card${recommended ? " pre-study-browse-card--recommended" : ""}`}>
      <div className={`pre-study-browse-card__poster pre-study-poster--${concert.gradient}`}>
        {recommended && concert.reason ? <span className="pre-study-browse-card__reason">{concert.reason}</span> : <span className="pre-study-browse-card__category">{concert.category}</span>}
        <SaveButton className="pre-study-browse-card__save" isSaved={isSaved} label={concert.title} onClick={() => onToggleSaved(concert.id)} />
      </div>
      <div className="pre-study-browse-card__content">
        <div>
          <h3>{concert.title}</h3>
          {!recommended ? <p className="pre-study-browse-card__category-text">{concert.category}</p> : null}
          <ConcertMetadata concert={concert} includeArtists={recommended} />
        </div>
        <Button className="pre-study-browse-card__create" onClick={() => onCreate(concert.id)} size="small" trailingIcon={<img alt="" src={arrowRightIcon} />} variant="neutral">
          이 공연으로 만들기
        </Button>
      </div>
    </article>
  );
}

function ConcertMetadata({ concert, includeArtists = false }: { concert: PreStudyConcert; includeArtists?: boolean }) {
  return (
    <dl className="pre-study-concert-metadata">
      <div><img alt="" src={dateIcon} /><dd>{concert.date}</dd></div>
      <div><img alt="" src={locationIcon} /><dd>{concert.location}</dd></div>
      {includeArtists ? <div><img alt="" src={artistIcon} /><dd>{concert.artists}</dd></div> : null}
    </dl>
  );
}
