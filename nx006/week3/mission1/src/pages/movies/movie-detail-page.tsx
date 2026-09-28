import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Icon } from '../../components/icon'
import type { Movie } from '../../types/movie'
import type { Review } from '../../types/profile'
import { cn } from '../../utils/cn'

interface Props { movie: Movie; onToggleBookmark: (id: number) => void; review?: Review; onSaveReview: (review: Review) => void }

export function MovieDetailPage({ movie, onToggleBookmark, review, onSaveReview }: Props) {
  const [rating, setRating] = useState(review?.rating ?? 0)
  const [text, setText] = useState(review?.text ?? '')
  const [message, setMessage] = useState('')
  return <main className="flex-1" id="main-content">
    <section className="relative h-[360px] overflow-hidden bg-[#17191e] text-white">
      {movie.backdropPath && <img className="absolute h-full w-full object-cover" src={movie.backdropPath} alt="" aria-hidden="true" />}
      <div className="relative mx-auto flex h-full w-full max-w-[1440px] flex-col justify-between px-5 py-6 md:px-8 xl:px-20"><Link className="inline-flex w-fit items-center gap-1 text-[13px] font-bold" to="/"><Icon name="back" />영화 목록</Link>
        <div><h1 className="text-[34px] leading-[42px] font-bold tracking-[-2px] min-[701px]:text-[46px] min-[701px]:leading-[50px]">{movie.title}</h1><p className="mt-2 text-sm">{movie.originalTitle}</p>
          <p className="mt-2 flex flex-wrap gap-2 text-[13px] font-bold"><span>{movie.releaseDate}</span><span>{movie.genres.join(' · ')}</span><span>{movie.runtime}</span></p>
        </div>
      </div>
    </section>
    <div className="mx-auto flex w-full max-w-[1440px] flex-wrap items-start gap-5 px-5 py-6 md:gap-8 md:px-8 xl:flex-nowrap xl:px-20"><img className="h-[143px] w-[100px] shrink-0 rounded-[10px] object-cover shadow-[0_12px_30px_#0c0f141f] min-[421px]:h-[186px] min-[421px]:w-[130px] min-[701px]:h-[286px] min-[701px]:w-[200px]" src={movie.posterPath} alt={movie.title + ' 포스터'} />
      <section className="min-w-0 flex-1"><h2 className="text-lg leading-[25px] font-bold tracking-[-0.63px] min-[701px]:text-[21px]">{movie.tagline}</h2><p className="my-3 text-[13px] leading-[21px] text-[#606774] min-[701px]:text-sm min-[701px]:leading-6">{movie.overview}</p>
        <button type="button" className="inline-flex h-[42px] items-center justify-center gap-2 rounded-lg bg-[#2563eb] px-4 text-sm font-extrabold text-white" aria-pressed={movie.isBookmarked} onClick={() => onToggleBookmark(movie.id)}><Icon name="detail-bookmark" />{movie.isBookmarked ? '즐겨찾기 해제' : '즐겨찾기'}</button>
      </section>
      <form className="flex w-full flex-col gap-2 border-t border-[#e3e6eb] py-6 xl:w-[360px] xl:shrink-0 xl:border-t-0 xl:border-l xl:py-0 xl:pb-10 xl:pl-[30px]" onSubmit={event => { event.preventDefault(); if (!rating) { setMessage('별점을 선택해 주세요.'); return }; onSaveReview({ rating, text: text.trim() }); setMessage('평점을 저장했어요.') }}>
        <h2 className="text-[21px] leading-[25px] font-bold">내 평점</h2><p className="text-[11px] text-[#969da8]">별점은 필수, 후기는 선택이에요.</p>
        <div className="flex gap-1" role="group" aria-label="영화 별점">{[1, 2, 3, 4, 5].map(value => <button type="button" aria-label={`${value}점`} aria-pressed={rating === value} className={cn('grid size-[38px] place-items-center rounded-lg border border-[#e3e6eb] bg-white', value <= rating && 'border-[#2563eb] bg-[#dce8ff]')} key={value} onClick={() => { setRating(value); setMessage('') }}><Icon name="star" /></button>)}</div>
        <textarea className="min-h-[102px] w-full resize-y rounded-lg border border-[#e3e6eb] px-3 py-4 text-[13px] leading-5" id="movie-review" name="review" aria-label="영화 후기" placeholder="영화를 보고 느낀 점을 남겨보세요." maxLength={2000} value={text} onChange={event => setText(event.target.value)} />
        <button className="inline-flex h-[42px] items-center justify-center rounded-lg bg-[#17191e] px-4 text-sm font-extrabold text-white" type="submit">평점 저장</button>{message && <p className="text-[13px] leading-5 text-[#2563eb]" role="status">{message}</p>}
      </form>
    </div>
  </main>
}
