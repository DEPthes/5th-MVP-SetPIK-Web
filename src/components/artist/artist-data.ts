export type ArtistLoadState = "loading" | "ready" | "error" | "disconnected";
export type ArtistSortOption = "appearance" | "name";

export interface Artist {
  id: string;
  name: string;
  description: string;
  appearanceCount: number;
  isMainArtist?: boolean;
  imageUrl?: string;
}

export const ARTIST_SORT_OPTIONS: Array<{ value: ArtistSortOption; label: string }> = [
  { value: "appearance", label: "등장 횟수 높은 순" },
  { value: "name", label: "이름순" },
];

export function getArtistPreviewState(value: string | null): Exclude<ArtistLoadState, "error"> | null {
  return value === "loading" || value === "disconnected" ? value : null;
}
