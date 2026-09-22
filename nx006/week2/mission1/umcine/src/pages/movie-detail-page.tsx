import { useState } from 'react'
import { Icon } from '../components/icon'
import type { Movie } from '../types/movie'
import type { Review } from '../types/profile'

interface Props { movie: Movie; onToggleBookmark: (id: number) => void; review?: Review; onSaveReview: (review: Review) => void }

export function MovieDetailPage({ movie, onToggleBookmark, review, onSaveReview }: Props) {
  const [rating, setRating] = useState(review?.rating ?? 0)
  const [text, setText] = useState(review?.text ?? '')
  const [message, setMessage] = useState('')
  return <main className="detail-page" id="main-content">
    <section className={`detail-stage ${movie.backdropPath ? '' : 'detail-stage-plain'}`}>
      {movie.backdropPath && <img className="detail-backdrop" src={movie.backdropPath} alt="" />}
      <div className="detail-hero container"><a className="back-link" href="#/"><Icon name="back" />영화 목록</a>
        <div><h1>{movie.title}</h1><p className="original-title">{movie.originalTitle}</p>
          <p className="detail-meta"><span>{movie.releaseDate}</span><span>{movie.genres.join(' · ')}</span><span>{movie.runtime}</span></p>
        </div>
      </div>
    </section>
    <div className="container detail-content"><img className="detail-poster" src={movie.posterPath} alt={movie.title + ' 포스터'} />
      <section className="synopsis"><h2>{movie.tagline}</h2><p>{movie.overview}</p>
        <button type="button" className="button primary" aria-pressed={movie.isBookmarked} onClick={() => onToggleBookmark(movie.id)}><Icon name="detail-bookmark" />{movie.isBookmarked ? '즐겨찾기 해제' : '즐겨찾기'}</button>
      </section>
      <form className="rating-panel" onSubmit={event => { event.preventDefault(); if (!rating) { setMessage('별점을 선택해 주세요.'); return }; onSaveReview({ rating, text: text.trim() }); setMessage('평점을 저장했어요.') }}>
        <h2>내 평점</h2><p className="field-hint">별점은 필수, 후기는 선택이에요.</p>
        <div className="rating-stars" role="group" aria-label="영화 별점">{[1, 2, 3, 4, 5].map(value => <button type="button" aria-label={`${value}점`} aria-pressed={rating === value} className={value <= rating ? 'rated' : ''} key={value} onClick={() => { setRating(value); setMessage('') }}><Icon name="star" /></button>)}</div>
        <textarea id="movie-review" name="review" aria-label="영화 후기" placeholder="영화를 보고 느낀 점을 남겨보세요." maxLength={2000} value={text} onChange={event => setText(event.target.value)} />
        <button className="button dark" type="submit">평점 저장</button>{message && <p className="form-message" role="status">{message}</p>}
      </form>
    </div>
  </main>
}
