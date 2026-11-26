import { authApi } from "./auth-api";
import type { ApiResponse } from "./members/login";
export interface Favorite { favoriteId: number; movieId: number; createdAt: string }
export async function getFavorites(signal?: AbortSignal) {
  return (await authApi.get("favorites", { signal }).json<ApiResponse<Favorite[]>>()).result;
}
export async function getFavorite(movieId: number, signal?: AbortSignal) {
  return (await authApi.get(`favorites/${movieId}`, { signal }).json<ApiResponse<{ isFavorite: boolean }>>()).result;
}
export function addFavorite(movieId: number) {
  return authApi.post("favorites", { json: { movieId } }).json<ApiResponse<Favorite>>();
}
export function removeFavorite(movieId: number) {
  return authApi.delete(`favorites/${movieId}`).json<ApiResponse<null>>();
}
