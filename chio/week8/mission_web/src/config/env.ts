const tmdbKey = import.meta.env.VITE_TMDB_KEY?.trim()

if (!tmdbKey) {
  throw new Error('VITE_TMDB_KEY가 설정되지 않았어요.')
}

export const env = {
  apiBaseUrl: `${(import.meta.env.VITE_API_BASE_URL?.trim() || 'http://localhost:8080').replace(/\/+$/, '')}/`,
  tmdbApiBaseUrl: 'https://api.themoviedb.org/3',
  tmdbKey,
}
