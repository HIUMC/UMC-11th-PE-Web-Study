export const MAX_TMDB_PAGE = 500
export function parsePage(value: unknown): number {
  const page = typeof value === 'number' ? value : typeof value === 'string' && /^\d+$/.test(value) ? Number(value) : NaN
  return Number.isSafeInteger(page) && page >= 1 && page <= MAX_TMDB_PAGE ? page : 1
}
export function parseMovieId(value: string): number | null {
  const id = /^[1-9]\d*$/.test(value) ? Number(value) : NaN
  return Number.isSafeInteger(id) ? id : null
}
export function moviePageCount(totalPages: number): number {
  return Math.min(MAX_TMDB_PAGE, Math.max(1, totalPages))
}
