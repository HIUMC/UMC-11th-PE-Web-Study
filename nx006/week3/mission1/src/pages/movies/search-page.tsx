import { useState } from 'react'
import { Link, useNavigate, useSearch } from '@tanstack/react-router'
import { Icon } from '../../components/icon'
import { useUmcineContext } from '../../hooks/umcine-store'
import { cn } from '../../utils/cn'

export function SearchPage() {
  const { query } = useSearch({ from: '/search' })
  const navigate = useNavigate({ from: '/search' })
  const { movies } = useUmcineContext()
  const [draft, setDraft] = useState({ query: query ?? '', value: query ?? '' })
  const input = draft.query === (query ?? '') ? draft.value : (query ?? '')
  const setInput = (value: string) => setDraft({ query: query ?? '', value })
  const normalized = (query ?? '').trim().toLocaleLowerCase().replace(/\s/g, '')
  const results = Boolean(normalized)
  const order = [11, 1, 12, 3, 13, 14]
  const found = normalized ? movies.filter(movie => `${movie.title}${movie.originalTitle}`.toLocaleLowerCase().replace(/\s/g, '').includes(normalized))
    .sort((a, b) => (order.indexOf(a.id) < 0 ? 99 : order.indexOf(a.id)) - (order.indexOf(b.id) < 0 ? 99 : order.indexOf(b.id))) : []
  const searchForm = <form className={cn('flex min-h-[54px] items-center gap-2.5 rounded-lg border border-[#e3e6eb] bg-white py-[5px] pr-2.5 pl-4 min-[701px]:gap-[18px]', !results && 'min-h-[74px] gap-3.5 rounded-xl border-2 border-[#17191e] px-3 py-3.5 shadow-[0_12px_34px_#11131814] min-[701px]:px-[21px]')} onSubmit={event => {
    event.preventDefault()
    navigate({ search: input.trim() ? { query: input.trim() } : {} })
  }} role="search">
    <Icon name="search" /><input className="min-w-0 flex-1 bg-transparent px-0.5 py-1.5 text-sm outline-none min-[701px]:text-[17px]" id="movie-search" name="query" aria-label="영화 제목" placeholder="예: 스파이더맨" value={input} onChange={event => setInput(event.target.value)} />
    {results && <button type="button" className="shrink-0" aria-label="검색어 지우기" onClick={() => setInput('')}><Icon name="close" /></button>}
    <button className="inline-flex h-[42px] shrink-0 items-center justify-center rounded-lg bg-[#17191e] px-4 text-sm font-extrabold whitespace-nowrap text-white" type="submit">{results ? '다시 검색' : '검색'}</button>
  </form>
  if (!results) return <main className="flex-1 px-6 pt-[110px] pb-20 min-[701px]:pt-[209px]" id="main-content"><div className="mx-auto w-full max-w-[790px]"><h1 className="mb-9 text-center text-[32px] leading-[42px] font-bold tracking-[-1.3px] min-[701px]:text-[46px] min-[701px]:leading-[52px]">어떤 영화를 찾고 있나요?</h1>{searchForm}<p className="mt-5 text-center text-sm text-[#606774]">검색어를 입력해 주세요.</p></div></main>
  return <main className="mx-auto w-full max-w-[1440px] flex-1 px-5 py-6 md:px-8 xl:px-20" id="main-content"><h1 className="mb-[17px] text-[32px] leading-10 font-bold tracking-[-1.7px] min-[701px]:text-[38px]">영화 검색</h1>{searchForm}
    <div className="flex min-h-[54px] items-center justify-between gap-4 border-b border-[#e3e6eb]"><h2 className="text-base font-bold min-[701px]:text-lg">‘{query}’ 검색 결과</h2><span className="shrink-0 text-[10px] text-[#969da8] min-[701px]:text-xs">영화 {found.length}편 · 1페이지</span></div>
    {found.length ? <div className="grid grid-cols-1 gap-x-6 min-[701px]:grid-cols-2 xl:gap-x-10">{found.map(movie => <article className="flex min-h-[240px] gap-3.5 border-b border-[#e3e6eb] py-5 min-[421px]:gap-[18px]" key={movie.id}>
      <Link className="shrink-0" to="/movies/$movieId" params={{ movieId: String(movie.id) }}><img className="h-[136px] w-[90px] rounded-[10px] object-cover min-[421px]:h-[190px] min-[421px]:w-[126px]" src={movie.posterPath} alt={movie.title + ' 포스터'} /></Link>
      <div className="min-w-0 flex-1 pt-1"><h3 className="mb-2 text-base leading-6 font-bold min-[421px]:text-lg">{movie.title}</h3><p className="mb-2 flex flex-wrap gap-2 text-xs text-[#969da8]"><span>{movie.originalTitle}</span><span>{movie.releaseDate}</span></p>
        <p className="mb-2 text-[12.5px] leading-[20.25px] text-[#606774]">{movie.overview}</p><Link className="inline-flex items-center gap-1 text-xs font-extrabold text-[#2563eb]" to="/movies/$movieId" params={{ movieId: String(movie.id) }}>상세 보기 <Icon name="arrow-right" /></Link>
      </div>
    </article>)}</div> : <p className="py-[60px] text-center leading-relaxed text-[#606774]" role="status">검색 결과가 없어요. 다른 영화 제목으로 검색해 보세요.</p>}
  </main>
}
