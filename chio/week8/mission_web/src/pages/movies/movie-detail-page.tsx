import { useState } from 'react'
import { Link, useNavigate, useParams } from '@tanstack/react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { movieQueries } from '../../queries/movies'
import { QueryStatus } from '../../components/movies/query-status'
import { isHTTPError } from 'ky'
import { getMovieDetailErrorMessage } from '../../utils/movies/get-movie-detail-error-message'
import { getTmdbBackdropUrl, getTmdbPosterUrl } from '../../utils/movies/tmdb-image'
import type { TmdbMovieDetail } from '../../api/movies/models'
import { cn } from '../../utils/cn'
import { getTokenMemberId, useAuthStore } from '../../stores/auth-store'
import { ratingsKey, useFavoriteStatus, useMe, useToggleFavorite } from '../../queries/member'
import { getRatings, removeRating, saveRating, type Rating } from '../../api/movie-records'
import { apiErrorMessage } from '../../api/api-response'

export function MovieDetailPage() {
  const { movieId } = useParams({ from: '/movies/$movieId' })
  const id = Number(movieId)
  const validId = /^\d+$/.test(movieId) && Number.isSafeInteger(id) && id > 0
  const { data: movie, isPending, isError, error, refetch } = useQuery({
    ...movieQueries.detail(id),
    enabled: validId,
  })

  if (validId && (isPending || (isError && !(isHTTPError(error) && error.response.status === 404)))) {
    return (
      <main className="bg-[#f5f6f8]">
        <QueryStatus error={error} errorMessage={getMovieDetailErrorMessage(error)} onRetry={isError ? () => { void refetch() } : undefined} />
      </main>
    )
  }

  if (!movie) {
    return (
      <main className="bg-[#f5f6f8]">
        <div className="mx-auto w-[calc(100%-48px)] max-w-[1296px] pt-[25px] pb-[54px] max-[680px]:w-[calc(100%-32px)]">
          <h1 className="mt-0 mb-[23px] text-[36px] leading-[1.2] font-extrabold tracking-[-1.8px] text-[#15171b] max-[680px]:text-[30px]">{validId ? '영화를 찾을 수 없어요.' : '올바르지 않은 영화 번호예요.'}</h1>
          <Link className="text-[#2f67e8] hover:underline" to="/">영화 목록으로 돌아가기</Link>
        </div>
      </main>
    )
  }

  const posterUrl = getTmdbPosterUrl(movie.poster_path)
  const backdropUrl = getTmdbBackdropUrl(movie.backdrop_path)
  const runtime = typeof movie.runtime === 'number'
    ? `${Math.floor(movie.runtime / 60)}시간 ${movie.runtime % 60}분`
    : '상영 시간 정보가 없어요.'

  return (
    <main className="bg-[#f5f6f8]">
      <div className="min-h-[360px] bg-[#1b1e24] bg-cover bg-center text-white max-[680px]:min-h-[300px]" style={{ backgroundImage: backdropUrl ? `linear-gradient(0deg, rgba(10, 12, 18, .82), transparent 65%), url("${backdropUrl}")` : undefined }}>
        {!backdropUrl && <p className="m-0 pt-3 text-center text-sm text-[#9aa1ac]">이미지 없음</p>}
        <div className="mx-auto flex min-h-[360px] w-[calc(100%-48px)] max-w-[1120px] flex-col justify-between pt-[26px] pb-6 max-[680px]:min-h-[300px] max-[680px]:w-[calc(100%-32px)]">
          <Link to="/" className="text-white no-underline focus-visible:outline-[3px] focus-visible:outline-[rgba(47,103,232,0.35)] focus-visible:outline-offset-2">‹ 영화 목록</Link>
          <div>
            <h1 className="m-0 text-[clamp(32px,3vw,44px)] leading-[1.2] font-extrabold">{movie.title}</h1>
            <p className="my-1.5 text-base">{movie.original_title}</p>
            <p className="m-0 text-sm">{movie.release_date?.replaceAll('-', '.') || '개봉일 미정'} · {movie.genres.map((genre) => genre.name).join(' · ')} · {runtime}</p>
          </div>
        </div>
      </div>
      <div className="mx-auto grid min-h-[440px] w-[calc(100%-48px)] max-w-[1120px] grid-cols-[180px_minmax(0,1fr)_300px] items-start gap-7 pt-[25px] pb-[54px] max-[1050px]:grid-cols-[180px_minmax(0,1fr)] max-[680px]:w-[calc(100%-32px)] max-[680px]:grid-cols-[110px_minmax(0,1fr)] max-[680px]:gap-5">
        <div className="aspect-[2/3] w-[180px] overflow-hidden rounded-lg bg-[#e4e7eb] shadow-[0_10px_20px_rgba(22,27,35,0.15)] max-[680px]:w-[110px]">
          {posterUrl ? (
            <img className="size-full object-cover" src={posterUrl} alt={`${movie.title} 포스터`} />
          ) : (
            <span className="grid size-full place-items-center text-sm text-[#727985]">이미지 없음</span>
          )}
        </div>
        <div>
          <p className="mt-0 mb-3.5 text-xl font-extrabold">{movie.tagline}</p>
          <p className="mt-0 mb-5 text-sm leading-[1.8] text-[#727985]">{movie.overview || '등록된 줄거리가 없어요.'}</p>
          <BookmarkButton movie={movie} />
        </div>
        <RatingPanel key={movie.id} movieId={movie.id} />
      </div>
    </main>
  )
}

function BookmarkButton({ movie }: { movie: TmdbMovieDetail }) {
  const token = useAuthStore((state) => state.accessToken)
  const navigate = useNavigate()
  const status = useFavoriteStatus(movie.id)
  const toggle = useToggleFavorite(movie.id)
  const bookmarked = status.data?.isFavorite ?? false

  return (
    <div>
      <button
        className={cn(
          'inline-flex min-h-9 cursor-pointer items-center gap-1.5 rounded-md border-0 px-3 text-[13px] font-bold text-white focus-visible:outline-[3px] focus-visible:outline-[rgba(47,103,232,0.35)] focus-visible:outline-offset-2',
          bookmarked ? 'bg-[#285dcc]' : 'bg-[#2f67e8]',
        )}
        type="button"
        aria-pressed={bookmarked}
        disabled={toggle.isPending || Boolean(token && status.isPending)}
        onClick={() => {
          if (!token) void navigate({ to: '/login' })
          else if (status.isError) void status.refetch()
          else toggle.mutate(bookmarked)
        }}
      >
        <img className="size-4 invert" src={bookmarked ? '/icons/bookmark.svg' : '/icons/bookmark-outline.svg'} alt="" />
        {token && status.isError ? '즐겨찾기 다시 확인' : bookmarked ? '즐겨찾기 해제' : '즐겨찾기'}
      </button>
      {toggle.isError && <p className="mt-2 text-xs text-red-700" role="alert">{apiErrorMessage(toggle.error, '즐겨찾기를 변경하지 못했어요.')}</p>}
    </div>
  )
}

const ratingPanelClass = 'flex flex-col border-l border-[#e4e7eb] pl-7 max-[1050px]:col-start-2 max-[1050px]:border-l-0 max-[1050px]:pl-0 max-[680px]:col-span-full max-[680px]:col-start-1'

function RatingPanel({ movieId }: { movieId: number }) {
  const token = useAuthStore((state) => state.accessToken)
  const me = useMe()
  const memberId = me.data ? getTokenMemberId(token) : undefined
  const ratings = useQuery({
    queryKey: ratingsKey(token, memberId),
    queryFn: ({ signal }) => getRatings(memberId!, signal),
    enabled: Boolean(token && memberId),
  })
  if (token && memberId && ratings.data) {
    const existing = ratings.data.find((rating) => rating.movieId === movieId)
    return <RatingForm key={`${memberId}:${existing?.ratingId ?? 'new'}`} movieId={movieId} memberId={memberId} existing={existing} />
  }
  return (
    <aside className={ratingPanelClass} aria-label="내 평점">
      <h2 className="mb-1 text-xl font-extrabold">내 평점</h2>
      {!token ? <Link className="text-sm text-[#245feb] underline" to="/login">로그인하고 평점을 남겨보세요.</Link>
        : me.isError || ratings.isError ? <button className="text-left text-sm text-[#245feb] underline" type="button"
          onClick={() => void (me.isError ? me.refetch() : ratings.refetch())}>평점 다시 불러오기</button>
          : <p className="text-sm" role="status">평점을 불러오는 중이에요.</p>}
    </aside>
  )
}

function RatingForm({ movieId, memberId, existing }: {
  movieId: number; memberId: number; existing?: Rating
}) {
  const [rating, setRating] = useState(existing?.score ?? 0)
  const [review, setReview] = useState(existing?.comment ?? '')
  const client = useQueryClient()
  const token = useAuthStore((state) => state.accessToken)
  const key = ratingsKey(token, memberId)
  const save = useMutation({
    mutationFn: () => saveRating(movieId, existing?.ratingId, { score: rating, comment: review.trim() }),
    onSuccess: async (result) => {
      await client.cancelQueries({ queryKey: key })
      if (useAuthStore.getState().accessToken !== token) return
      client.setQueryData<Rating[]>(key, (old) => [result, ...(old ?? []).filter((item) => item.movieId !== movieId)])
    },
  })
  const deletion = useMutation({
    mutationFn: removeRating,
    onSuccess: async (_, ratingId) => {
      await client.cancelQueries({ queryKey: key })
      if (useAuthStore.getState().accessToken !== token) return
      client.setQueryData<Rating[]>(key, (old) => (old ?? []).filter((item) => item.ratingId !== ratingId))
    },
  })
  const busy = save.isPending || deletion.isPending
  const error = save.error ?? deletion.error

  return (
    <aside className={ratingPanelClass} aria-label="내 평점">
      <h2 className="mt-0 mb-[5px] text-xl font-extrabold">내 평점</h2>
      <p className="mt-0 mb-3 text-xs text-[#9aa1ac]">평점을 남기고, 후기를 작성해보세요.</p>
      <div className="mb-2.5 flex gap-1.5" role="group" aria-label="별점 선택">
        {Array.from({ length: 5 }, (_, index) => index + 1).map((star) => (
          <button
            key={star}
            type="button"
            aria-label={`${star}점`}
            aria-pressed={rating === star}
            className={cn(
              'size-9 cursor-pointer rounded-[5px] border bg-white text-[19px] focus-visible:outline-[3px] focus-visible:outline-[rgba(47,103,232,0.35)] focus-visible:outline-offset-2',
              star <= rating
                ? 'border-[#f5d483] text-[#f5b724]'
                : 'border-[#e4e7eb] text-[#a2a8b2]',
            )}
            disabled={busy}
            onClick={() => { setRating(star); save.reset(); deletion.reset() }}
          >★</button>
        ))}
      </div>
      <label className="sr-only" htmlFor="movie-review">영화 후기</label>
      <textarea
        className="min-h-[100px] w-full resize-y rounded-md border border-[#e4e7eb] bg-white p-3 text-[13px] focus-visible:outline-[3px] focus-visible:outline-[rgba(47,103,232,0.35)] focus-visible:outline-offset-2"
        id="movie-review"
        value={review}
        maxLength={500}
        disabled={busy}
        onChange={(event) => { setReview(event.target.value); save.reset(); deletion.reset() }}
        placeholder="영화를 보고 느낀 점을 남겨보세요."
      />
      <button className="mt-2.5 min-h-[38px] rounded-[5px] bg-[#1b1e24] text-[13px] font-bold text-white disabled:opacity-55"
        type="button" disabled={rating < 1 || busy} onClick={() => { deletion.reset(); save.mutate() }}>
        {save.isPending ? '저장 중' : existing ? '평점 수정' : '평점 저장'}
      </button>
      {existing && <button className="mt-2 self-end text-xs text-red-700 underline" type="button" disabled={busy}
        onClick={() => { save.reset(); deletion.mutate(existing.ratingId) }}>
        {deletion.isPending ? '삭제 중' : '평점 삭제'}
      </button>}
      {save.isSuccess && <p className="mt-2 text-xs text-[#2f67e8]" role="status">평점이 저장됐어요.</p>}
      {error && <p className="mt-2 text-xs text-red-700" role="alert">{apiErrorMessage(error, '평점을 변경하지 못했어요.')}</p>}
    </aside>
  )
}
