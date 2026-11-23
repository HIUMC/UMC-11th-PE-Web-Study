import { apiClient } from './api-client'
import { authApi } from './auth-api'
import { unwrap, type ApiResponse } from './api-response'

export type Favorite = { favoriteId: number; movieId: number; createdAt: string }
export type Rating = { ratingId: number; movieId: number; score: number; comment: string | null }
type RatingInput = { score: number; comment: string }

export function getFavorites(signal: AbortSignal) {
  return unwrap(authApi.get('favorites', { signal }).json<ApiResponse<Favorite[]>>())
}

export function getFavoriteStatus(movieId: number, signal: AbortSignal) {
  return unwrap(authApi.get(`favorites/${movieId}`, { signal }).json<ApiResponse<{ isFavorite: boolean }>>())
}

export function addFavorite(movieId: number) {
  return unwrap(authApi.post('favorites', { json: { movieId } }).json<ApiResponse<Favorite>>())
}

export function removeFavorite(movieId: number) {
  return unwrap(authApi.delete(`favorites/${movieId}`).json<ApiResponse<null>>())
}

export function getRatings(memberId: number, signal: AbortSignal) {
  return apiClient.get(`members/${memberId}/ratings`, { signal }).json<Rating[]>()
}

export function saveRating(movieId: number, ratingId: number | undefined, input: RatingInput) {
  return unwrap((ratingId === undefined
    ? authApi.post('ratings', { json: { movieId, ...input } })
    : authApi.patch(`ratings/${ratingId}`, { json: input })).json<ApiResponse<Rating>>())
}

export function removeRating(ratingId: number) {
  return unwrap(authApi.delete(`ratings/${ratingId}`).json<ApiResponse<null>>())
}
