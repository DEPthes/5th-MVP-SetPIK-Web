import checkIcon from "@/assets/icons/ic_check_pink.svg";
import type { Artist } from "./artist-data";
import "./artist-card.css";

interface ArtistCardProps {
  artist: Artist;
  isSelected: boolean;
  onToggle: (artistId: string) => void;
}

export function ArtistCard({ artist, isSelected, onToggle }: ArtistCardProps) {
  return (
    <button
      aria-pressed={isSelected}
      className={`artist-card${isSelected ? " artist-card--selected" : ""}`}
      onClick={() => onToggle(artist.id)}
      type="button"
    >
      <span className="artist-card__cover-wrap">
        <span
          aria-hidden="true"
          className="artist-card__cover"
          style={artist.imageUrl ? { backgroundImage: `url(${artist.imageUrl})` } : undefined}
        />
        <span className="artist-card__selection-mark" aria-hidden="true">
          {isSelected ? <img src={checkIcon} alt="" /> : null}
        </span>
      </span>
      <span className="artist-card__content">
        {artist.isMainArtist ? <span className="artist-card__tag">주요 아티스트</span> : null}
        <strong>{artist.name}</strong>
        <small>{artist.description}</small>
      </span>
    </button>
  );
}
