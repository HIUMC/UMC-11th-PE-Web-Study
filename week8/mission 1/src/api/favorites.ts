import { authApi } from "./auth-api";
import { checkMutationResponse, unwrapResponse, type ApiResponse } from "./response";

export interface Favorite {
  favoriteId: number;
  movieId: number;
  createdAt: string;
}

export async function getFavorites(signal?: AbortSignal): Promise<number[]> {
  const response = await authApi.get("favorites", { signal }).json<ApiResponse<Favorite[]>>();
  const favorites = unwrapResponse(response);
  if (!Array.isArray(favorites) || favorites.some((favorite) => !favorite || !Number.isSafeInteger(favorite.movieId) || favorite.movieId <= 0)) {
    throw new Error("즐겨찾기 목록의 응답 형식을 확인해 주세요.");
  }
  return [...new Set(favorites.map((favorite) => favorite.movieId))];
}

export async function getFavorite(movieId: number, signal?: AbortSignal): Promise<boolean> {
  const response = await authApi.get(`favorites/${movieId}`, { signal }).json<ApiResponse<unknown>>();
  const result = unwrapResponse(response);
  if (typeof result === "boolean") return result;
  if (result === null) return false;
  if (typeof result === "object") {
    const status = result as Record<string, unknown>;
    // boolean 상태 DTO와 등록된 Favorite DTO를 화면의 boolean 값으로 변환합니다.
    for (const key of ["isFavorite", "isFavorited", "favorited", "favorite"]) {
      if (typeof status[key] === "boolean") return status[key];
    }
    if (typeof status.favoriteId === "number" && status.movieId === movieId) return true;
  }
  throw new Error("즐겨찾기 여부의 응답 형식을 확인해 주세요.");
}

export async function addFavorite(movieId: number): Promise<void> {
  await checkMutationResponse(await authApi.post("favorites", { json: { movieId }, retry: 0 }));
}

export async function deleteFavorite(movieId: number): Promise<void> {
  await checkMutationResponse(await authApi.delete(`favorites/${movieId}`, { retry: 0 }));
}
