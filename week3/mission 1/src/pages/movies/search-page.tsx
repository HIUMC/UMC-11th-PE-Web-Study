import { Link, useNavigate, useSearch } from '@tanstack/react-router'
import { useState, type SubmitEvent } from 'react'
import { movies } from '../../data/movies'
import { cn } from '../../utils/cn'

function SearchForm({ query, compact }: { query: string; compact: boolean }) {
  const [text, setText] = useState(query)
  const navigate = useNavigate({ from: '/search' })
  function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    void navigate({ search: text.trim() ? { query: text.trim() } : {} })
  }
  return (
    <form role="search" onSubmit={submit} className={cn('flex items-center gap-3 rounded-lg bg-white p-2 pl-5', compact ? 'border border-gray-200' : 'border-2 border-[#191b20] p-3 shadow-lg')}>
      <img src="/icons/movie-icons/search.svg" alt="" width={20} height={20} />
      <input type="search" aria-label="검색어" placeholder="예: 스파이더맨" value={text} onChange={(event) => setText(event.target.value)} className="min-w-0 flex-1 bg-transparent py-2 text-sm outline-none placeholder:text-gray-400" />
      {text && <button type="button" aria-label="검색어 지우기" onClick={() => setText('')} className="p-2"><img src="/icons/movie-icons/close.svg" alt="" width={16} height={16} /></button>}
      <button type="submit" className="shrink-0 rounded-md bg-[#191b20] px-4 py-3 text-xs font-bold text-white">{compact ? '다시 검색' : '검색'}</button>
    </form>
  )
}

export function SearchPage() {
  const { query } = useSearch({ from: '/search' })
  const searchTerm = query?.trim() ?? ''
  const normalized = searchTerm.toLocaleLowerCase()
  const results = normalized ? movies.filter((movie) => movie.title.toLocaleLowerCase().includes(normalized) || movie.originalTitle.toLocaleLowerCase().includes(normalized)) : []
  if (!searchTerm) return (
    <main className="mx-auto w-[calc(100%-32px)] max-w-[790px] flex-1 pt-32 pb-20 sm:pt-52">
      <h1 className="mb-10 text-center text-3xl font-bold tracking-tighter sm:text-4xl">어떤 영화를 찾고 있나요?</h1>
      <SearchForm key={query ?? ''} query="" compact={false} />
      <p className="mt-5 text-center text-sm text-gray-500">검색어를 입력해 주세요.</p>
    </main>
  )
  return (
    <main className="mx-auto w-[calc(100%-32px)] max-w-7xl flex-1 py-7 sm:w-[calc(100%-64px)]">
      <h1 className="mb-4 text-3xl font-bold tracking-tighter sm:text-4xl">영화 검색</h1>
      <SearchForm key={query} query={searchTerm} compact />
      <div className="mt-4 flex items-center justify-between gap-4 border-b border-gray-200 pb-4" role="status">
        <h2 className="font-bold">‘{searchTerm}’ 검색 결과</h2>
        <span className="shrink-0 text-xs text-gray-400">영화 {results.length}편</span>
      </div>
      {results.length === 0 ? <p className="py-24 text-center text-gray-500">검색 결과가 없어요. 다른 검색어로 찾아보세요.</p> : (
        <ul className="grid gap-x-10 md:grid-cols-2" aria-label="영화 검색 결과">
          {results.map((movie) => (
            <li key={movie.id} className="flex gap-5 border-b border-gray-200 py-5">
              <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }} className="shrink-0" aria-label={movie.title}><img src={movie.posterPath} alt={`${movie.title} 포스터`} className="h-48 w-32 rounded-lg object-cover" /></Link>
              <div className="flex min-w-0 flex-1 flex-col">
                <h3 className="font-bold"><Link to="/movies/$movieId" params={{ movieId: String(movie.id) }}>{movie.title}</Link></h3>
                <p className="mt-2 text-xs leading-relaxed text-gray-400">{movie.originalTitle} <time className="ml-2 inline-block" dateTime={movie.releaseDate.replaceAll('.', '-')}>{movie.releaseDate}</time></p>
                <p className="mt-3 text-xs leading-6 text-gray-500">{movie.overview}</p>
                <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }} className="mt-auto flex items-center gap-2 pt-4 text-xs font-bold text-[#4f60ee]">상세 보기 <span aria-hidden="true">→</span></Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
