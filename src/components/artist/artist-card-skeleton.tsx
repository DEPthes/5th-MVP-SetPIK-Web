import "./artist-card.css";

export function ArtistCardSkeleton() {
  return (
    <article className="artist-card artist-card--skeleton" aria-hidden="true">
      <span className="artist-card__skeleton-cover skeleton-reflection" />
      <span className="artist-card__skeleton-content">
        <span className="artist-card__skeleton-title skeleton-reflection" />
        <span className="artist-card__skeleton-description skeleton-reflection" />
      </span>
    </article>
  );
}
