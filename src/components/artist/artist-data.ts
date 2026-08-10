export type ArtistLoadState = "loading" | "ready" | "disconnected";
export type ArtistSortOption = "appearance" | "name";

export interface Artist {
  id: string;
  name: string;
  description: string;
  appearanceCount: number;
  isMainArtist?: boolean;
  imageUrl?: string;
}

export const MOCK_ARTISTS: Artist[] = [
  { id: "coldplay", name: "Coldplay", description: "플레이리스트에 8곡 포함", appearanceCount: 8, isMainArtist: true },
  { id: "the-1975", name: "The 1975", description: "플레이리스트에 7곡 포함", appearanceCount: 7, isMainArtist: true },
  { id: "frank-ocean", name: "Frank Ocean", description: "플레이리스트에 6곡 포함", appearanceCount: 6, isMainArtist: true },
  { id: "keshi", name: "keshi", description: "플레이리스트에 5곡 포함", appearanceCount: 5 },
  { id: "wave-to-earth", name: "wave to earth", description: "플레이리스트에 5곡 포함", appearanceCount: 5 },
  { id: "lauv", name: "Lauv", description: "플레이리스트에 4곡 포함", appearanceCount: 4 },
  { id: "joji", name: "Joji", description: "플레이리스트에 4곡 포함", appearanceCount: 4 },
  { id: "dayglow", name: "Dayglow", description: "플레이리스트에 3곡 포함", appearanceCount: 3 },
  { id: "cigarettes-after-sex", name: "Cigarettes After Sex", description: "플레이리스트에 3곡 포함", appearanceCount: 3 },
  { id: "beabadoobee", name: "beabadoobee", description: "플레이리스트에 2곡 포함", appearanceCount: 2 },
  { id: "nujabes", name: "Nujabes", description: "플레이리스트에 2곡 포함", appearanceCount: 2 },
  { id: "clairo", name: "Clairo", description: "플레이리스트에 2곡 포함", appearanceCount: 2 },
  { id: "sza", name: "SZA", description: "플레이리스트에 1곡 포함", appearanceCount: 1 },
  { id: "daniel-caesar", name: "Daniel Caesar", description: "플레이리스트에 1곡 포함", appearanceCount: 1 },
  { id: "tame-impala", name: "Tame Impala", description: "플레이리스트에 1곡 포함", appearanceCount: 1 },
];

export const ARTIST_SORT_OPTIONS: Array<{ value: ArtistSortOption; label: string }> = [
  { value: "appearance", label: "등장 횟수 높은 순" },
  { value: "name", label: "이름순" },
];

export function getArtistPreviewState(value: string | null): ArtistLoadState | null {
  return value === "loading" || value === "disconnected" ? value : null;
}
