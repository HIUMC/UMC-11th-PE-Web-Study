import { useState } from 'react'
import { Link, useParams } from '@tanstack/react-router'
import { movies } from '../../data/movies'
import type { Movie } from '../../types/movie'
import { cn } from '../../utils/cn'

export function MovieDetailPage() {
  const { movieId } = useParams({ from: '/movies/$movieId' })
  const movie = movies.find((item) => String(item.id) === movieId)

  if (!movie) {
    return (
      <main className="bg-[#f5f6f8]">
        <div className="mx-auto w-[calc(100%-48px)] max-w-[1296px] pt-[25px] pb-[54px] max-[680px]:w-[calc(100%-32px)]">
          <h1 className="mt-0 mb-[23px] text-[36px] leading-[1.2] font-extrabold tracking-[-1.8px] text-[#15171b] max-[680px]:text-[30px]">영화를 찾을 수 없어요.</h1>
          <Link className="text-[#2f67e8] hover:underline" to="/">영화 목록으로 돌아가기</Link>
        </div>
      </main>
    )
  }

  return (
    <main className="bg-[#f5f6f8]">
      <div className="min-h-[360px] bg-cover bg-center text-white max-[680px]:min-h-[300px]" style={{ backgroundImage: `linear-gradient(0deg, rgba(10, 12, 18, .82), transparent 65%), url("${movie.backdropPath}")` }}>
        <div className="mx-auto flex min-h-[360px] w-[calc(100%-48px)] max-w-[1120px] flex-col justify-between pt-[26px] pb-6 max-[680px]:min-h-[300px] max-[680px]:w-[calc(100%-32px)]">
          <Link to="/" className="text-white no-underline focus-visible:outline-[3px] focus-visible:outline-[rgba(47,103,232,0.35)] focus-visible:outline-offset-2">‹ 영화 목록</Link>
          <div>
            <h1 className="m-0 text-[clamp(32px,3vw,44px)] leading-[1.2] font-extrabold">{movie.title}</h1>
            <p className="my-1.5 text-base">{movie.originalTitle}</p>
            <p className="m-0 text-sm">{movie.releaseDate} · {movie.genres.join(' · ')} · {movie.runtime}</p>
          </div>
        </div>
      </div>
      <div className="mx-auto grid min-h-[440px] w-[calc(100%-48px)] max-w-[1120px] grid-cols-[180px_minmax(0,1fr)_300px] items-start gap-7 pt-[25px] pb-[54px] max-[1050px]:grid-cols-[180px_minmax(0,1fr)] max-[680px]:w-[calc(100%-32px)] max-[680px]:grid-cols-[110px_minmax(0,1fr)] max-[680px]:gap-5">
        <img className="w-[180px] rounded-lg object-cover shadow-[0_10px_20px_rgba(22,27,35,0.15)] max-[680px]:w-[110px]" src={movie.posterPath} alt={`${movie.title} 포스터`} />
        <div>
          <p className="mt-0 mb-3.5 text-xl font-extrabold">{movie.tagline}</p>
          <p className="mt-0 mb-5 text-sm leading-[1.8] text-[#727985]">{movie.overview}</p>
          <BookmarkButton movie={movie} />
        </div>
        <RatingPanel key={movie.id} movieId={movie.id} />
      </div>
    </main>
  )
}

function BookmarkButton({ movie }: { movie: Movie }) {
  const [bookmarked, setBookmarked] = useState(movie.isBookmarked)

  return (
    <button
      className={cn(
        'inline-flex min-h-9 cursor-pointer items-center gap-1.5 rounded-md border-0 px-3 text-[13px] font-bold text-white focus-visible:outline-[3px] focus-visible:outline-[rgba(47,103,232,0.35)] focus-visible:outline-offset-2',
        bookmarked ? 'bg-[#285dcc]' : 'bg-[#2f67e8]',
      )}
      type="button"
      aria-pressed={bookmarked}
      onClick={() => setBookmarked((current) => !current)}
    >
      <img className="size-4 invert" src={bookmarked ? '/icons/bookmark.svg' : '/icons/bookmark-outline.svg'} alt="" />
      {bookmarked ? '즐겨찾기 해제' : '즐겨찾기'}
    </button>
  )
}

function RatingPanel({ movieId }: { movieId: number }) {
  const storageKey = `movie-review-${movieId}`
  const [initialReview] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) ?? '{}') as { rating?: unknown; review?: unknown }
      return {
        rating: typeof saved.rating === 'number' && saved.rating >= 1 && saved.rating <= 5 ? saved.rating : 0,
        review: typeof saved.review === 'string' ? saved.review : '',
      }
    } catch {
      return { rating: 0, review: '' }
    }
  })
  const [rating, setRating] = useState(initialReview.rating)
  const [review, setReview] = useState(initialReview.review)
  const [saved, setSaved] = useState(false)

  function saveReview() {
    localStorage.setItem(storageKey, JSON.stringify({ rating, review }))
    setSaved(true)
  }

  return (
    <aside className="flex flex-col border-l border-[#e4e7eb] pl-7 max-[1050px]:col-start-2 max-[1050px]:border-l-0 max-[1050px]:pl-0 max-[680px]:col-span-full max-[680px]:col-start-1" aria-label="내 평점">
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
            onClick={() => { setRating(star); setSaved(false) }}
          >★</button>
        ))}
      </div>
      <label className="sr-only" htmlFor="movie-review">영화 후기</label>
      <textarea
        className="min-h-[100px] w-full resize-y rounded-md border border-[#e4e7eb] bg-white p-3 text-[13px] focus-visible:outline-[3px] focus-visible:outline-[rgba(47,103,232,0.35)] focus-visible:outline-offset-2"
        id="movie-review"
        value={review}
        onChange={(event) => { setReview(event.target.value); setSaved(false) }}
        placeholder="영화를 보고 느낀 점을 남겨보세요."
      />
      <button className="mt-2.5 min-h-[38px] cursor-pointer rounded-[5px] border-0 bg-[#1b1e24] text-[13px] font-bold text-white focus-visible:outline-[3px] focus-visible:outline-[rgba(47,103,232,0.35)] focus-visible:outline-offset-2" type="button" onClick={saveReview}>평점 저장</button>
      {saved && <p className="mt-2 text-xs text-[#2f67e8]" role="status">평점이 저장됐어요.</p>}
    </aside>
  )
}
