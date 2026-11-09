const tmdbKey = import.meta.env.VITE_TMDB_KEY?.trim()

if (!tmdbKey) {
  throw new Error('VITE_TMDB_KEY가 설정되지 않았어요.')
}

export const env = {
  tmdbApiBaseUrl: 'https://api.themoviedb.org/3',
  tmdbKey,
}
