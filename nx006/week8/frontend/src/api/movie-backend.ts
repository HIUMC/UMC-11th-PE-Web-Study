import { getMemberClient } from './api-client'
import { memberFailure } from './members/member-api'

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
  try {
    const response = await getMemberClient().get(path.replace(/^\//, ''))
    const data = await response.json<T>()
    return { url: response.url, status: response.status, data }
  } catch (error) {
    const failure = await memberFailure(error)
    throw new Error(failure.message)
  }
}

export const checkNickname = (value: string) => get<CheckResponse>(`/members/nickname/${encodeURIComponent(value)}`)
export const checkEmail = (value: string) => get<CheckResponse>(`/members/email/${encodeURIComponent(value)}`)
export const getMemberRatings = (value: string) => get<RatingResponse[]>(`/members/${encodeURIComponent(value)}/ratings`)
