import { authApi } from "./auth-api";

export interface Favorite { favoriteId: number; movieId: number; title?: string; posterPath?: string; }
interface ApiResponse<T> { isSuccess: boolean; code: string; message: string; result: T; }

export async function getFavorites(): Promise<Favorite[]> {
  const response = await authApi.get("favorites").json<ApiResponse<Favorite[]>>();
  return response.result;
}
export async function getFavorite(movieId: number): Promise<Favorite | null> {
  try { return (await authApi.get(`favorites/${movieId}`).json<ApiResponse<Favorite>>()).result; } catch (error) { if (error instanceof Error && "response" in error && (error as { response?: Response }).response?.status === 404) return null; throw error; }
}
export function createFavorite(movieId: number) { return authApi.post("favorites", { json: { movieId } }).json<ApiResponse<Favorite>>(); }
export function deleteFavorite(movieId: number) { return authApi.delete(`favorites/${movieId}`).json<ApiResponse<unknown>>(); }
