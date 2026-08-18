import { apiRequest } from "@/api/api-client";
import type {
  CreateFavoriteRequest,
  CreateFavoriteResult,
  FavoritePage,
  GetFavoritesParams,
} from "@/api/favorites/favorite-types";

const FAVORITES_PATH = "/api/v1/favorites";

export function getFavorites({
  page = 0,
  size = 20,
  sort = "savedAt,desc",
}: GetFavoritesParams = {}) {
  const searchParams = new URLSearchParams({
    page: String(page),
    size: String(size),
    sort,
  });

  return apiRequest<FavoritePage>(`${FAVORITES_PATH}?${searchParams}`);
}

export function createFavorite(performanceId: number) {
  const body: CreateFavoriteRequest = { performanceId };

  return apiRequest<CreateFavoriteResult>(FAVORITES_PATH, {
    method: "POST",
    body,
  });
}

export function deleteFavorite(favoriteId: number) {
  return apiRequest<string>(`${FAVORITES_PATH}/${favoriteId}`, {
    method: "DELETE",
  });
}
