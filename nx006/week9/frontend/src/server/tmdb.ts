import 'server-only'
import { cache } from 'react'
import { createTmdbClient } from '../api/tmdb-client'
import { readTmdbEnv } from '../config/env'
import { getMovieDetail } from '../api/movies/get-movie-detail'

export function createServerTmdbClient() {
  return createTmdbClient(readTmdbEnv({
    TMDB_API_BASE_URL: process.env.TMDB_API_BASE_URL,
    TMDB_ACCESS_TOKEN: process.env.TMDB_ACCESS_TOKEN,
  }))
}

// React cache deduplicates metadata and page reads within the same server request.
export const readPublicMovie = cache(async (movieId: number) => {
  try {
    return await getMovieDetail(movieId, undefined, createServerTmdbClient())
  } catch {
    // The client screen keeps the existing Query error/retry flow.
    return undefined
  }
})
