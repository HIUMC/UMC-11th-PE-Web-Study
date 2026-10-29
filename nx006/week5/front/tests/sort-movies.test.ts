import assert from 'node:assert/strict'
import { test } from 'node:test'
import { movies } from '../src/data/movies.ts'
import { sortMovies } from '../src/utils/sort-movies.ts'

test('기본 순서는 서버 순서를 보존하고 원본 배열을 변경하지 않음', () => {
  const original = movies.map(movie => movie.id)
  assert.deepEqual(sortMovies(movies, 'default').map(movie => movie.id), original)
  assert.deepEqual(movies.map(movie => movie.id), original)
})

test('실제 영화 데이터의 개봉일을 최신/오래된 순서로 정렬', () => {
  const frozen = Object.freeze([...movies])
  assert.deepEqual(sortMovies(frozen, 'release-desc').map(movie => movie.id), [9, 4, 2, 1, 5, 10, 8, 7, 6, 3])
  assert.deepEqual(sortMovies(frozen, 'release-asc').map(movie => movie.id), [3, 6, 7, 8, 10, 5, 1, 2, 4, 9])
})

test('한국어 제목순과 같은 제목·개봉일의 ID 순서를 고정; 빈 목록도 허용', () => {
  const fixture = [
    { ...movies[0]!, id: 3, title: '나', releaseDate: '2026.02.01' },
    { ...movies[0]!, id: 2, title: '가', releaseDate: '2026.01.01' },
    { ...movies[0]!, id: 1, title: '가', releaseDate: '2026.01.01' },
  ]
  assert.deepEqual(sortMovies(fixture, 'title-asc').map(movie => movie.id), [1, 2, 3])
  assert.deepEqual(sortMovies(fixture, 'release-asc').map(movie => movie.id), [1, 2, 3])
  assert.deepEqual(sortMovies(fixture, 'release-desc').map(movie => movie.id), [3, 1, 2])
  assert.deepEqual(sortMovies([], 'title-asc'), [])
})
