export interface Favorite {
  favoriteId: number;
  performanceId: number;
  performanceName: string;
  posterUrl: string;
  startDate: string;
  venueName: string;
  savedAt: string;
}

export interface FavoritePage {
  content: Favorite[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
}

export interface GetFavoritesParams {
  page?: number;
  size?: number;
  sort?: string;
}

export interface CreateFavoriteRequest {
  performanceId: number;
}

export interface CreateFavoriteResult {
  favoriteId: number;
}
