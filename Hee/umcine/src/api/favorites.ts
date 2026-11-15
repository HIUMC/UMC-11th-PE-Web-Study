import { authApi } from "./auth-api";

export interface Favorite {
  favoriteId?: number;
  movieId: number;
  createdAt?: string;
}

type FavoritesPayload = Favorite[] | number[];
type FavoritesResponse = FavoritesPayload | { result: FavoritesPayload };

function unwrapFavorites(response: FavoritesResponse): FavoritesPayload {
  return "result" in response ? response.result : response;
}

export async function getFavorites(): Promise<number[]> {
  const response = await authApi.get("favorites").json<FavoritesResponse>();
  return unwrapFavorites(response).map((favorite) =>
    typeof favorite === "number" ? favorite : favorite.movieId,
  );
}

export function addFavorite(movieId: number) {
  return authApi.post("favorites", { json: { movieId } }).json();
}

export function deleteFavorite(movieId: number) {
  return authApi.delete(`favorites/${movieId}`).json();
}
