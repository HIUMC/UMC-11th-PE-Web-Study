import type { Metadata } from 'next'
import { MovieDetailScreen } from '../../../screens/movies/movie-detail-page'
import { readPublicMovie } from '../../../server/tmdb'
import { parseMovieId } from '../../../utils/movie-params'

export async function generateMetadata({ params }: PageProps<'/movies/[movieId]'>): Promise<Metadata> {
  const id = parseMovieId((await params).movieId)
  const movie = id === null ? undefined : await readPublicMovie(id)
  return { title: movie?.title || '영화 상세', ...(movie?.overview && { description: movie.overview }) }
}

export default async function Page({ params }: PageProps<'/movies/[movieId]'>) {
  const id = parseMovieId((await params).movieId)
  const initialDetail = id === null ? undefined : await readPublicMovie(id)
  return <MovieDetailScreen key={id} id={id} initialDetail={initialDetail} />
}
