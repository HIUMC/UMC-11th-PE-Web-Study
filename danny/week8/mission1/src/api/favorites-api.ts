import type { Favorite, FavoriteStatus } from "../types/member";
import { getResult, umcClient } from "./umc-client";

export function getFavorites(signal?: AbortSignal) {
  return getResult<Favorite[]>(umcClient.get("favorites", { signal }));
}

export function getFavoriteStatus(movieId: number, signal?: AbortSignal) {
  return getResult<FavoriteStatus>(
    umcClient.get(`favorites/${movieId}`, { signal }),
  );
}

export function addFavorite(movieId: number) {
  return getResult<Favorite>(umcClient.post("favorites", { json: { movieId } }));
}

export function removeFavorite(movieId: number) {
  return getResult<null>(umcClient.delete(`favorites/${movieId}`));
}
