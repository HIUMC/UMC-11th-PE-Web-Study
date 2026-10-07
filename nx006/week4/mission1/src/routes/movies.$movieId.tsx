import { createFileRoute, Link, useParams } from '@tanstack/react-router'
import { movieDetails } from '../data/movie-details'
import { useUmcineContext } from '../hooks/umcine-store'
import { MovieDetailPage } from '../pages/movies/movie-detail-page'

export const Route = createFileRoute('/movies/$movieId')({ component: function DetailRoute() {
  const { movieId } = useParams({ from: '/movies/$movieId' })
  const { movies, reviews, saveReview } = useUmcineContext()
  const id = /^[1-9]\d*$/.test(movieId) ? Number(movieId) : NaN
  const movie = Number.isSafeInteger(id) ? movies.find(item => item.id === id) : undefined
  if (!movie) return <main id="main-content" className="mx-auto w-full max-w-[1440px] flex-1 px-5 py-12 md:px-8 xl:px-20"><h1 className="text-3xl font-bold">영화를 찾을 수 없어요.</h1><Link className="mt-4 inline-block text-[#2563eb]" to="/">영화 목록으로 돌아가기</Link></main>
  return <MovieDetailPage key={id} movie={{ ...movie, ...movieDetails[id] }} review={reviews[id]} onSaveReview={review => saveReview(id, review)} />
} })
