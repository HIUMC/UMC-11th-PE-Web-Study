import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useSearch } from '@tanstack/react-router'
import { movies } from '../../data/movies'
import { BookmarkIconButton } from '../../components/movies/bookmark-icon-button'

export function SearchPage() {
  const { query } = useSearch({ from: '/search' })
  const navigate = useNavigate({ from: '/search' })
  const keyword = query.trim()
  const results = keyword
    ? movies.filter((movie) =>
        [movie.title, movie.originalTitle].some((title) =>
          title.toLocaleLowerCase().includes(keyword.toLocaleLowerCase()),
        ),
      )
    : []

  return (
    <main className="bg-[#f5f6f8]">
      <div className="mx-auto w-[calc(100%-48px)] max-w-[900px] pt-[clamp(180px,20vh,210px)] pb-[70px] max-[680px]:w-[calc(100%-32px)] max-[680px]:pt-[110px]">
        <div className="mx-auto max-w-[700px] text-center">
          <h1 className="mt-0 mb-6 text-[36px] leading-[1.2] font-extrabold tracking-[-1.5px] max-[680px]:text-[26px]">어떤 영화를 찾고 있나요?</h1>
          <SearchForm key={query} initialQuery={query} onSearch={(nextQuery) => navigate({ search: { query: nextQuery } })} />
        </div>

        {keyword && (results.length === 0 ? (
          <p className="mt-8 text-[#727985]">검색 결과가 없어요.</p>
        ) : (
          <>
            <p className="mt-8 text-[#727985]">‘{keyword}’ 검색 결과 {results.length}건</p>
            <div className="mt-5 grid max-w-[900px] gap-4">
              {results.map((movie) => (
                <article className="relative" key={movie.id}>
                  <Link
                    className="flex min-w-0 gap-[22px] rounded-[10px] border border-[#e4e7eb] bg-white p-4 text-inherit no-underline hover:border-[#a9bdf5] focus-visible:outline-[3px] focus-visible:outline-[rgba(47,103,232,0.35)] focus-visible:outline-offset-2 max-[680px]:gap-3.5"
                    to="/movies/$movieId"
                    params={{ movieId: String(movie.id) }}
                  >
                    <img className="h-40 w-[115px] shrink-0 rounded-[7px] object-cover max-[680px]:h-[120px] max-[680px]:w-[85px]" src={movie.posterPath} alt={`${movie.title} 포스터`} />
                    <div>
                      <h2 className="mt-0 mb-[5px] text-[21px]">{movie.title}</h2>
                      <p className="mt-0 mb-[9px] text-sm text-[#727985]">{movie.originalTitle}</p>
                      <p className="mt-0 mb-[9px] text-sm text-[#727985]">개봉일 {movie.releaseDate}</p>
                      <p className="mt-4 mb-0 leading-[1.6] max-[680px]:mt-2">{movie.overview}</p>
                    </div>
                  </Link>
                  <div className="pointer-events-none absolute top-[17px] left-[17px] h-40 w-[115px] max-[680px]:h-[120px] max-[680px]:w-[85px]">
                    <BookmarkIconButton movie={movie} />
                  </div>
                </article>
              ))}
            </div>
          </>
        ))}
      </div>
    </main>
  )
}

function SearchForm({ initialQuery, onSearch }: { initialQuery: string; onSearch: (query: string) => void }) {
  const [value, setValue] = useState(initialQuery)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onSearch(value.trim())
  }

  return (
    <form className="relative flex h-[62px] max-w-[700px] items-center rounded-[9px] border border-[#1b1e24] bg-white p-[7px] shadow-[0_7px_14px_rgba(20,24,31,0.09)] max-[680px]:h-[54px]" role="search" onSubmit={handleSubmit}>
      <label className="sr-only" htmlFor="movie-query">영화 제목 검색</label>
      <img className="mx-3 size-5 shrink-0 opacity-[.65]" src="/icons/search.svg" alt="" />
      <input
        className="h-full min-w-0 flex-1 border-0 bg-white px-2 font-[inherit] outline-none focus-visible:outline-[3px] focus-visible:outline-[rgba(47,103,232,0.35)] focus-visible:outline-offset-2"
        id="movie-query"
        type="search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="예: 스파이더맨"
      />
      <button className="h-10 min-w-[58px] cursor-pointer rounded-md border-0 bg-[#1b1e24] font-[inherit] font-bold text-white focus-visible:outline-[3px] focus-visible:outline-[rgba(47,103,232,0.35)] focus-visible:outline-offset-2" type="submit">검색</button>
    </form>
  )
}
