'use client'

import type { ReactNode } from 'react'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { Icon } from '../../components/icon'
import type { Movie } from '../../types/movie'
import { BookmarkButton } from '../../components/movies/bookmark-button'
import { MovieImage } from '../../components/movies/movie-image'
import { MovieQueryFeedback } from '../../components/movies/movie-query-feedback'
import { movieDetailOptions } from '../../queries/movie-queries'
import { RatingEditor } from '../../components/movies/rating-editor'
import { toMovieDetail } from '../../utils/movies/tmdb-adapter'
import type { TmdbMovieDetail } from '../../api/movies/models'

export function MovieDetailScreen({ id, initialDetail }: { id: number | null; initialDetail?: TmdbMovieDetail }) {
  const detailQuery = useQuery({ ...movieDetailOptions(id), initialData: initialDetail })
  if (id !== null && detailQuery.data !== undefined) {
    const movie = toMovieDetail(detailQuery.data)
    return <MovieDetailPage key={movie.id} movie={movie} feedback={<MovieQueryFeedback query={detailQuery} detail />} />
  }
  return <main id="main-content" className="mx-auto w-full max-w-[1440px] flex-1 px-5 py-8 md:px-8 xl:px-20">
    <Link className="inline-block text-[#2563eb]" href="/">영화 목록으로 돌아가기</Link>
    {id === null ? <h1 className="py-16 text-2xl font-bold">올바르지 않은 영화 번호예요.</h1> : <MovieQueryFeedback query={detailQuery} detail />}
  </main>
}

interface Props { movie: Movie; feedback?: ReactNode }

export function MovieDetailPage({ movie, feedback }: Props) {
  return <main className="flex-1" id="main-content">
    {feedback}
    <section className="relative h-[360px] overflow-hidden bg-[#17191e] text-white">
      <MovieImage className="absolute h-full w-full object-cover" src={movie.backdropPath} alt="" decorative />
      <div className="absolute inset-0 bg-gradient-to-t from-[#17191ee6] to-[#17191e33]" aria-hidden="true" />
      <div className="relative mx-auto flex h-full w-full max-w-[1440px] flex-col justify-between px-5 py-6 md:px-8 xl:px-20"><Link className="inline-flex w-fit items-center gap-1 text-[13px] font-bold" href="/"><Icon name="back" />영화 목록</Link>
        <div><h1 className="text-[34px] leading-[42px] font-bold tracking-[-2px] min-[701px]:text-[46px] min-[701px]:leading-[50px]">{movie.title}</h1><p className="mt-2 text-sm">{movie.originalTitle}</p>
          <p className="mt-2 flex flex-wrap gap-2 text-[13px] font-bold"><span>{movie.releaseDate}</span><span>{movie.genres.join(' · ')}</span><span>{movie.runtime}</span></p>
        </div>
      </div>
    </section>
    <div className="mx-auto flex w-full max-w-[1440px] flex-wrap items-start gap-5 px-5 py-6 md:gap-8 md:px-8 xl:flex-nowrap xl:px-20"><MovieImage className="h-[143px] w-[100px] shrink-0 rounded-[10px] object-cover shadow-[0_12px_30px_#0c0f141f] min-[421px]:h-[186px] min-[421px]:w-[130px] min-[701px]:h-[286px] min-[701px]:w-[200px]" src={movie.posterPath} alt={movie.title + ' 포스터'} />
      <section className="min-w-0 flex-1"><h2 className="text-lg leading-[25px] font-bold tracking-[-0.63px] min-[701px]:text-[21px]">{movie.tagline}</h2><p className="my-3 text-[13px] leading-[21px] text-[#606774] min-[701px]:text-sm min-[701px]:leading-6">{movie.overview}</p>
        <BookmarkButton movieId={movie.id} title={movie.title} variant="detail" />
      </section>
      <RatingEditor movieId={movie.id} />
    </div>
  </main>
}
