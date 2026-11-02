const baseUrl = (import.meta.env.VITE_MOVIE_API_BASE_URL ?? 'http://localhost:3000').replace(/\/+$/, '')

export interface CheckResponse { available: boolean }
export interface RatingResponse {
  ratingId: number
  movieId: number
  score: number
  comment: string | null
  createdAt: string
  updatedAt: string
}
export interface ApiResult<T> { url: string; status: number; data: T }

async function get<T>(path: string): Promise<ApiResult<T>> {
  const url = baseUrl + path
  const response = await fetch(url)
  const data: unknown = await response.json()
  if (!response.ok) {
    const message = typeof data === 'object' && data && 'message' in data ? String(data.message) : '요청에 실패했습니다.'
    throw new Error(`HTTP ${response.status}: ${message}`)
  }
  return { url, status: response.status, data: data as T }
}

export const checkNickname = (value: string) => get<CheckResponse>(`/members/nickname/${encodeURIComponent(value)}`)
export const checkEmail = (value: string) => get<CheckResponse>(`/members/email/${encodeURIComponent(value)}`)
export const getMemberRatings = (value: string) => get<RatingResponse[]>(`/members/${encodeURIComponent(value)}/ratings`)
