import { RatingForm } from "@/components/movies/rating-form";
import { Link, useParams } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { HTTPError } from 'ky'
import { getMovieDetail } from '@/api/movies/get-movie-detail'
import { useFavorite, useToggleFavorite } from '@/hooks/use-favorites'
import { useAuthStore } from '@/stores/auth-store'
import { FavoriteFeedback } from '@/components/movies/favorite-feedback'
import { toMovie } from '@/utils/movies/to-movie'
import { RequestStatus } from '@/components/movies/request-status'
import { cn } from '@/utils/cn'

function getMovieDetailErrorMessage(error: unknown) {
  if (error instanceof HTTPError && (error.response.status === 401 || error.response.status === 403)) {
    return '영화 정보를 불러올 권한이 없어요. API 인증 설정을 확인해 주세요.'
  }
  return '영화 정보를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.'
}

export function MovieDetailPage() {
  const { movieId: movieIdParam } = useParams({ from: '/movies/$movieId' })
  const movieId = Number(movieIdParam)
  const isValidMovieId = Number.isInteger(movieId) && movieId > 0

  const movieDetailQuery = useQuery({
    queryKey: ['movies', 'detail', movieId],
    queryFn: ({ signal }) => getMovieDetail(movieId, signal),
    enabled: isValidMovieId,
  })
  const accessToken = useAuthStore((state) => state.accessToken)
  const favoriteQuery = useFavorite(movieId)
  const favoriteMutation = useToggleFavorite()
  const bookmarkDisabled = favoriteMutation.isPending || (Boolean(accessToken) && !favoriteQuery.isSuccess)
  const movie = movieDetailQuery.data ? toMovie(movieDetailQuery.data, Boolean(accessToken) && favoriteQuery.data === true) : null

  return (
    <>
      {!isValidMovieId ? (
        <main className="mx-auto w-[calc(100%-32px)] max-w-7xl flex-1 py-20">
          <p>올바르지 않은 영화 번호예요.</p>
          <Link to="/" className="mt-5 inline-block text-[#4f60ee]">영화 목록으로 돌아가기</Link>
        </main>
      ) : movieDetailQuery.isPending ? (
        <main className="mx-auto w-[calc(100%-32px)] max-w-7xl flex-1">
          <p role="status" className="py-20 text-center text-gray-500">영화 상세 정보를 불러오는 중이에요.</p>
          <Link to="/" className="text-[#4f60ee]">영화 목록으로 돌아가기</Link>
        </main>
      ) : movieDetailQuery.isError ? (
        <main className="mx-auto w-[calc(100%-32px)] max-w-7xl flex-1">
          <RequestStatus isLoading={false} error={getMovieDetailErrorMessage(movieDetailQuery.error)} retry={() => { void movieDetailQuery.refetch() }} />
          <Link to="/" className="text-[#4f60ee]">영화 목록으로 돌아가기</Link>
        </main>
      ) : !movie ? (
        <main className="mx-auto w-[calc(100%-32px)] max-w-7xl flex-1 py-20">
          <h1 className="text-2xl font-bold">영화를 찾을 수 없어요.</h1>
          <Link to="/" className="mt-5 inline-block text-[#4f60ee]">영화 목록으로 돌아가기</Link>
        </main>
      ) : (
    <main className="flex-1">
      <section className="relative isolate h-[360px] overflow-hidden bg-gray-900 text-white">
        <img src={movie.backdropPath} alt="" className="absolute inset-0 -z-20 h-full w-full object-cover object-center" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/70 via-black/25 to-transparent" />
        <div className="mx-auto flex h-full w-[calc(100%-32px)] max-w-7xl flex-col py-7 sm:w-[calc(100%-64px)]">
          <Link to="/" className="flex w-fit items-center gap-2 text-xs"><img src="/icons/movie-icons/chevron-left.svg" alt="" width={16} height={16} className="invert" />영화 목록</Link>
          <div className="mt-auto">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-[40px]">{movie.title}</h1>
            <p className="mt-2 text-sm">{movie.originalTitle}</p>
            <p className="mt-1 text-sm"><time dateTime={movie.releaseDate.replaceAll('.', '-')}>{movie.releaseDate}</time><span className="ml-2">{movie.genres.join(' · ')}</span><span className="ml-2">{movie.runtime}</span></p>
          </div>
        </div>
      </section>
      <section aria-label="영화 정보" className="mx-auto grid w-[calc(100%-32px)] max-w-7xl gap-8 py-6 pb-16 sm:w-[calc(100%-64px)] sm:grid-cols-[200px_1fr] lg:grid-cols-[200px_1fr_360px]">
        <img src={movie.posterPath} alt={`${movie.title} 포스터`} className="w-[200px] rounded-lg shadow-xl" />
        <div>
          <h2 className="text-lg font-bold">{movie.tagline}</h2>
          <p className="mt-3 text-sm leading-7 text-gray-500">{movie.overview}</p>
          <button type="button" disabled={bookmarkDisabled} aria-busy={favoriteMutation.isPending} aria-pressed={movie.isBookmarked} onClick={() => favoriteMutation.toggle(movie.id, movie.isBookmarked)} className={cn('mt-4 flex items-center gap-2 rounded-md px-4 py-3 text-xs font-bold text-white disabled:cursor-not-allowed disabled:opacity-50', movie.isBookmarked ? 'bg-[#4050d4]' : 'bg-[#4f60ee]')}>
            <img className="invert" src={`/icons/movie-icons/${movie.isBookmarked ? 'bookmark' : 'bookmark-outline'}.svg`} alt="" width={16} height={16} />{favoriteMutation.isPending ? '변경 중' : movie.isBookmarked ? '즐겨찾기 해제' : '즐겨찾기'}
          </button>
          <FavoriteFeedback isLoading={Boolean(accessToken) && favoriteQuery.isPending} queryError={favoriteQuery.isError} mutationError={favoriteMutation.isError} retry={() => void favoriteQuery.refetch()} />
        </div>
        <RatingForm key={movie.id} movieId={movie.id} />
      </section>
    </main>
      )}
    </>
  )
}
