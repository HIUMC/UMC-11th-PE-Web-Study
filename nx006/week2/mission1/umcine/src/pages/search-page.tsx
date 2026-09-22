import { useState } from 'react'
import { Icon } from '../components/icon'
import { navigate } from '../hooks/use-route'
import type { Movie } from '../types/movie'

export function SearchPage({ query, movies, results }: { query: string; movies: Movie[]; results: boolean }) {
  const [input, setInput] = useState(query)
  const normalized = query.toLocaleLowerCase().replace(/\s/g, '')
  const order = [11, 1, 12, 3, 13, 14]
  const found = normalized ? movies.filter(movie => `${movie.title}${movie.originalTitle}`.toLocaleLowerCase().replace(/\s/g, '').includes(normalized))
    .sort((a, b) => (order.indexOf(a.id) < 0 ? 99 : order.indexOf(a.id)) - (order.indexOf(b.id) < 0 ? 99 : order.indexOf(b.id))) : []
  const searchForm = <form className={`search-form ${results ? '' : 'search-form-large'}`} onSubmit={event => {
    event.preventDefault()
    if (input.trim()) navigate(`/search/results?q=${encodeURIComponent(input.trim())}`)
  }} role="search">
    <Icon name="search" /><input id="movie-search" name="q" aria-label="영화 제목" placeholder="예: 스파이더맨" value={input} onChange={event => setInput(event.target.value)} required />
    {results && <button type="button" className="clear-button" aria-label="검색어 지우기" onClick={() => setInput('')}><Icon name="close" /></button>}
    <button className="button dark" type="submit">{results ? '다시 검색' : '검색'}</button>
  </form>
  if (!results) return <main className="search-page" id="main-content"><div className="search-inner"><h1>어떤 영화를 찾고 있나요?</h1>{searchForm}</div></main>
  return <main className="container results-page" id="main-content"><h1>영화 검색</h1>{searchForm}
    <div className="results-toolbar"><h2>‘{query}’ 검색 결과</h2><span>영화 {found.length}편 · 1페이지</span></div>
    {found.length ? <div className="results-list">{found.map(movie => <article className="result-card" key={movie.id}>
      <a href={`#/movies/${movie.id}`}><img src={movie.posterPath} alt={movie.title + ' 포스터'} /></a>
      <div className="result-copy"><h3>{movie.title}</h3><p className="result-meta"><span>{movie.originalTitle}</span><span>{movie.releaseDate}</span></p>
        <p className="result-overview">{movie.overview}</p><a className="text-link result-link" href={`#/movies/${movie.id}`}>상세 보기 <Icon name="arrow-right" /></a>
      </div>
    </article>)}</div> : <p className="empty-state" role="status">검색 결과가 없어요. 다른 영화 제목으로 검색해 보세요.</p>}
  </main>
}
