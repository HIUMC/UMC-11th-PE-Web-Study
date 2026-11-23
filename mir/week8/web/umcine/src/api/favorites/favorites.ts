import { queryOptions } from "@tanstack/react-query";
import { authApi } from "../auth-api";

export interface FavoriteItem {
  favoriteId: number;
  movieId: number;
  createdAt: string;
}

export interface FavoriteStatus {
  isFavorite: boolean;
}

interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

export async function getFavorites(): Promise<FavoriteItem[]> {
  const response = await authApi
    .get("favorites")
    .json<ApiResponse<FavoriteItem[]>>();
  return response.result;
}

export async function getFavoriteStatus(
  movieId: number,
): Promise<FavoriteStatus> {
  const response = await authApi
    .get(`favorites/${movieId}`)
    .json<ApiResponse<FavoriteStatus>>();
  return response.result;
}

export function createFavorite(movieId: number) {
  return authApi
    .post("favorites", { json: { movieId } })
    .json<ApiResponse<FavoriteItem>>();
}

export function deleteFavorite(movieId: number) {
  return authApi.delete(`favorites/${movieId}`).json<ApiResponse<null>>();
}

export function favoritesQueryOptions(enabled: boolean) {
  return queryOptions({
    queryKey: ["favorites"],
    queryFn: getFavorites,
    enabled,
    staleTime: 60 * 1000,
    retry: false,
  });
}

export function favoriteStatusQueryOptions(movieId: number, enabled: boolean) {
  return queryOptions({
    queryKey: ["favorites", movieId],
    queryFn: () => getFavoriteStatus(movieId),
    enabled: enabled && Number.isInteger(movieId) && movieId > 0,
    staleTime: 60 * 1000,
    retry: false,
  });
}
