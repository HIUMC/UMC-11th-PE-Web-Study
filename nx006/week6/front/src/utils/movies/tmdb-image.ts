export function tmdbImage(path: string | null, size: 'w500' | 'w1280'): string | null {
  return path ? `https://image.tmdb.org/t/p/${size}${path}` : null
}
