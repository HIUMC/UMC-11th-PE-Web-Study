import { apiClient, authenticatedResult, authHeaders, type ApiResponse } from "./api-client";

export interface Favorite { favoriteId: number; movieId: number; createdAt: string }
export function getFavorites() { return authenticatedResult(apiClient.get("favorites", { headers: authHeaders() }).json<ApiResponse<Favorite[]>>()); }
export function getFavorite(movieId: number) { return authenticatedResult(apiClient.get(`favorites/${movieId}`, { headers: authHeaders() }).json<ApiResponse<{ isFavorite: boolean }>>()); }
export function addFavorite(movieId: number) { return authenticatedResult(apiClient.post("favorites", { headers: authHeaders(), json: { movieId } }).json<ApiResponse<Favorite>>()); }
export function removeFavorite(movieId: number) { return authenticatedResult(apiClient.delete(`favorites/${movieId}`, { headers: authHeaders() }).json<ApiResponse<null>>()); }
