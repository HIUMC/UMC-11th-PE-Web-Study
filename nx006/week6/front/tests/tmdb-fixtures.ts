import type { TmdbMovieDetail, TmdbMovieListItem, TmdbMovieListResponse } from '../src/api/movies/models.ts'
export const fixtureMovie: TmdbMovieListItem = {
  id: 101, title: '모의 영화 101', original_title: 'Mock Movie 101', overview: '검증용 모의 응답입니다. 실제 TMDB 영화 결과가 아닙니다.',
  release_date: '2026-01-02', poster_path: null, backdrop_path: null, vote_average: 7.5, vote_count: 10, genre_ids: [18],
}
export function fixtureList(page = 1, query = ''): TmdbMovieListResponse {
  return {
    page, total_pages: 3, total_results: 15,
    results: Array.from({ length: 5 }, (_, index) => ({ ...fixtureMovie, id: 101 + (page - 1) * 5 + index, title: `${query ? query + ' · ' : ''}모의 영화 ${101 + (page - 1) * 5 + index}` })),
  }
}
export function fixtureDetail(id = 101): TmdbMovieDetail {
  const { genre_ids: _genreIds, ...common } = fixtureMovie
  return { ...common, id, title: `모의 영화 ${id}`, genres: [{ id: 18, name: '드라마' }], runtime: id === 102 ? null : 125, tagline: id === 102 ? '' : '모의 응답으로 상세 화면을 검증합니다.' }
}
