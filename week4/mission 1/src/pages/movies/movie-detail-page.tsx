import { Link, useParams } from '@tanstack/react-router'
import { useState, type SubmitEvent } from 'react'
import { useMovies } from '../../hooks/use-movies'
import { cn } from '../../utils/cn'

function RatingForm({ movieId }: { movieId: number }) {
  const storageKey = `umcine:rating:${movieId}`
  const [initial] = useState(() => {
    try {
      const value = JSON.parse(localStorage.getItem(storageKey) ?? 'null')
      return { rating: Number.isInteger(value?.rating) && value.rating >= 1 && value.rating <= 5 ? value.rating as number : 0, review: typeof value?.review === 'string' ? value.review as string : '' }
    } catch {
      return { rating: 0, review: '' }
    }
  })
  const [rating, setRating] = useState(initial.rating)
  const [review, setReview] = useState(initial.review)
  const [message, setMessage] = useState('')
  function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    try {
      localStorage.setItem(storageKey, JSON.stringify({ rating, review }))
      setMessage('이 브라우저에 평점을 저장했어요.')
    } catch {
      setMessage('평점을 저장하지 못했어요. 브라우저 저장 공간을 확인해 주세요.')
    }
  }
  return (
    <form onSubmit={submit} className="border-t border-gray-200 pt-6 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8">
      <h2 className="text-lg font-bold">내 평점</h2>
      <p className="mt-2 text-xs text-gray-400">별점을 매긴 뒤, 후기를 남겨보세요.</p>
      <div className="my-3 flex gap-1.5" role="group" aria-label="별점 선택">
        {[1, 2, 3, 4, 5].map((star) => <button type="button" key={star} aria-label={`${star}점`} aria-pressed={rating === star} onClick={() => { setRating(star); setMessage('') }} className={cn('grid size-9 place-items-center rounded-md border border-gray-200 bg-white text-2xl', star <= rating ? 'text-[#4f60ee]' : 'text-gray-500')}>★</button>)}
      </div>
      <textarea aria-label="영화 후기" placeholder="영화를 보고 느낀 점을 남겨보세요." value={review} onChange={(event) => { setReview(event.target.value); setMessage('') }} className="h-24 w-full resize-y rounded-lg border border-gray-200 bg-white p-3 text-xs placeholder:text-gray-400" />
      <button type="submit" disabled={rating === 0} className="mt-2 w-full rounded-md bg-[#191b20] py-3 text-xs font-bold text-white disabled:opacity-40">평점 저장</button>
      <p role="status" className="mt-2 text-xs text-gray-500">{message}</p>
    </form>
  )
}

export function MovieDetailPage() {
  const { movieId } = useParams({ from: '/movies/$movieId' })
  const { movies, toggleBookmark } = useMovies()
  const movie = movies.find((item) => String(item.id) === movieId)
  if (!movie) return <main className="mx-auto w-[calc(100%-32px)] max-w-7xl flex-1 py-20"><h1 className="text-2xl font-bold">영화를 찾을 수 없어요.</h1><Link to="/" className="mt-5 inline-block text-[#4f60ee]">영화 목록으로 돌아가기</Link></main>
  return (
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
          <button type="button" aria-pressed={movie.isBookmarked} onClick={() => toggleBookmark(movie.id)} className={cn('mt-4 flex items-center gap-2 rounded-md px-4 py-3 text-xs font-bold text-white', movie.isBookmarked ? 'bg-[#4050d4]' : 'bg-[#4f60ee]')}>
            <img className="invert" src={`/icons/movie-icons/${movie.isBookmarked ? 'bookmark' : 'bookmark-outline'}.svg`} alt="" width={16} height={16} />{movie.isBookmarked ? '즐겨찾기 해제' : '즐겨찾기'}
          </button>
        </div>
        <RatingForm key={movie.id} movieId={movie.id} />
      </section>
    </main>
  )
}
