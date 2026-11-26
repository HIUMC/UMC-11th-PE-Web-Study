import type { KyInstance } from 'ky'
import { getMemberClient } from '../api-client.ts'
import { getAuthApi } from './auth-api.ts'
import { MemberResponseError, readJson, record } from '../members/member-api.ts'

export interface LoginRequest { email: string; password: string }
export interface LoginResult { nickname: string; accessToken: string }
export interface MemberInfo { email: string; nickname: string; createdAt: string }
export interface Favorite { favoriteId: number; movieId: number; createdAt: string }
export interface FavoriteStatus { isFavorite: boolean }
export interface Rating { ratingId: number; movieId: number; score: number; comment: string | null; createdAt: string; updatedAt: string }
export interface RatingInput { score: number; comment?: string }
export function positiveId(value: unknown): value is number { return typeof value === 'number' && Number.isSafeInteger(value) && value > 0 }
function validMember(value: unknown): value is MemberInfo { return record(value) && typeof value.email === 'string' && typeof value.nickname === 'string' && typeof value.createdAt === 'string' }
function validFavorite(value: unknown): value is Favorite { return record(value) && positiveId(value.favoriteId) && positiveId(value.movieId) && typeof value.createdAt === 'string' }
function validRating(value: unknown): value is Rating {
  return record(value) && positiveId(value.ratingId) && positiveId(value.movieId) && typeof value.score === 'number' && Number.isInteger(value.score) && value.score >= 1 && value.score <= 5 && (value.comment === null || typeof value.comment === 'string') && typeof value.createdAt === 'string' && typeof value.updatedAt === 'string'
}
async function result<T>(request: PromiseLike<Response>, validate: (value: unknown) => value is T): Promise<T> {
  const data = await readJson(request)
  if (!record(data) || data.isSuccess !== true || typeof data.code !== 'string' || !validate(data.result)) throw new MemberResponseError()
  return data.result
}
export function login(body: LoginRequest, client = getMemberClient()): Promise<LoginResult> {
  return result(client.post('auth/login', { json: { email: body.email.trim(), password: body.password } }), (value): value is LoginResult => record(value) && typeof value.nickname === 'string' && typeof value.accessToken === 'string' && value.accessToken.length > 0 && !/\s/.test(value.accessToken))
}
export function getMe(signal?: AbortSignal, client = getAuthApi()) { return result(client.get('members/me', { signal }), validMember) }
export function updateMe(body: { nickname: string }, client = getAuthApi()) { return result(client.patch('members/me', { json: { nickname: body.nickname.trim() } }), validMember) }
export function getFavorites(signal?: AbortSignal, client = getAuthApi()) { return result(client.get('favorites', { signal }), (value): value is Favorite[] => Array.isArray(value) && value.every(validFavorite)) }
export function getFavoriteStatus(movieId: number, signal?: AbortSignal, client = getAuthApi()) { return result(client.get(`favorites/${movieId}`, { signal }), (value): value is FavoriteStatus => record(value) && typeof value.isFavorite === 'boolean') }
export function addFavorite(movieId: number, client = getAuthApi()) { return result(client.post('favorites', { json: { movieId } }), validFavorite) }
export function removeFavorite(movieId: number, client = getAuthApi()) { return result(client.delete(`favorites/${movieId}`), (value): value is null => value === null) }
// 이 endpoint만 공통 envelope 없는 공개 조회다. 현재 회원의 sub에서 얻은 ID만 UI가 전달한다.
export async function getRatings(memberId: number, signal?: AbortSignal, client: KyInstance = getMemberClient()): Promise<Rating[]> {
  const data = await readJson(client.get(`members/${memberId}/ratings`, { signal }))
  if (!Array.isArray(data) || !data.every(validRating)) throw new MemberResponseError()
  return data
}
export function addRating(movieId: number, body: RatingInput, client = getAuthApi()) { return result(client.post('ratings', { json: { movieId, score: body.score, comment: body.comment } }), validRating) }
export function updateRating(ratingId: number, body: RatingInput, client = getAuthApi()) { return result(client.patch(`ratings/${ratingId}`, { json: { score: body.score, comment: body.comment } }), validRating) }
export function removeRating(ratingId: number, client = getAuthApi()) { return result(client.delete(`ratings/${ratingId}`), (value): value is null => value === null) }
