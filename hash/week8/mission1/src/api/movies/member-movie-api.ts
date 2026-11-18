import { apiClient, authApi, type ApiResponse } from "../api-client";

export type Favorite = { favoriteId: number; movieId: number; createdAt: string };

export type Rating = {
  ratingId: number;
  movieId: number;
  score: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
};

type RatingInput = { score: number; comment: string };

export async function getFavorites(sessionId: number, signal: AbortSignal) {
  const response = await authApi.get("favorites", { signal, context: { sessionId } })
    .json<ApiResponse<Favorite[]>>();
  return response.result;
}

export async function getFavoriteStatus(sessionId: number, movieId: number, signal: AbortSignal) {
  const response = await authApi.get("favorites/" + movieId, { signal, context: { sessionId } })
    .json<ApiResponse<{ isFavorite: boolean }>>();
  return response.result.isFavorite;
}

export async function setFavorite(sessionId: number, movieId: number, add: boolean) {
  const context = { sessionId };
  if (add) {
    await authApi.post("favorites", { json: { movieId }, context });
  } else {
    await authApi.delete("favorites/" + movieId, { context });
  }
}

export async function getMemberRatings(memberId: number, signal: AbortSignal) {
  const response = await apiClient.get("members/" + memberId + "/ratings", { signal })
    .json<ApiResponse<Rating[]>>();
  return response.result;
}

export async function saveRating(
  sessionId: number, movieId: number, input: RatingInput, ratingId?: number,
) {
  const context = { sessionId };
  if (ratingId === undefined) {
    await authApi.post("ratings", { json: { movieId, ...input }, context });
  } else {
    await authApi.patch("ratings/" + ratingId, { json: input, context });
  }
}

export async function deleteRating(sessionId: number, ratingId: number) {
  await authApi.delete("ratings/" + ratingId, { context: { sessionId } });
}
