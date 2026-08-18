import { ArtistCard } from "./artist-card";
import type { Artist } from "./artist-data";

interface ArtistSelectionGridProps {
  artists: Artist[];
  selectedArtistIds: string[];
  onToggleArtist: (artistId: string) => void;
}

export function ArtistSelectionGrid({ artists, selectedArtistIds, onToggleArtist }: ArtistSelectionGridProps) {
  return (
    <div className="artist-selection__grid">
      {artists.map((artist, index) => (
        <ArtistCard
          artist={artist}
          isSelected={selectedArtistIds.includes(artist.id)}
          key={artist.id}
          onToggle={onToggleArtist}
          reserveTagSpace={index < 5}
        />
      ))}
    </div>
  );
}
