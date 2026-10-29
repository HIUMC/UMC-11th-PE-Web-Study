import type { MovieCardData } from '../types/movie.ts'
import type { MovieSort } from '../stores/display-settings-store.ts'

const titleCollator = new Intl.Collator('ko', { numeric: true })
export function sortMovies<T extends MovieCardData>(movies: readonly T[], sort: MovieSort): T[] {
  // API 인기순을 유지한다. 이전 mock ID로 TMDB 영화 순서를 바꾸지 않는다.
  if (sort === 'default') return [...movies]
  return [...movies].sort((a, b) => {
    let comparison: number
    switch (sort) {
      case 'release-desc':
        comparison = compareDates(a.releaseDate, b.releaseDate, true)
        break
      case 'release-asc':
        comparison = compareDates(a.releaseDate, b.releaseDate, false)
        break
      case 'title-asc':
        comparison = titleCollator.compare(a.title, b.title)
        break
    }
    // 데이터의 개봉일은 YYYY.MM.DD 형식이다. 같은 값은 ID로 순서를 고정한다.
    return comparison || a.id - b.id
  })
}

function compareDates(a: string, b: string, descending: boolean): number {
  const aKnown = /^\d{4}\.\d{2}\.\d{2}$/.test(a), bKnown = /^\d{4}\.\d{2}\.\d{2}$/.test(b)
  if (aKnown !== bKnown) return aKnown ? -1 : 1
  return aKnown ? (descending ? b.localeCompare(a) : a.localeCompare(b)) : 0
}
