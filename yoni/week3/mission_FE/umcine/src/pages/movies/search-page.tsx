import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Route } from "../../routes/search";
import { movies } from "../../data/movies";

export function SearchPage() {
  const { query } = Route.useSearch();
  const navigate = useNavigate();

  const [inputValue, setInputValue] = useState(query);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    navigate({
      to: "/search",
      search: {
        query: inputValue.trim(),
      },
    });
  };

  const normalizedQuery = query.trim().toLowerCase();

  const results = normalizedQuery
    ? movies.filter(
        (movie) =>
          movie.title.toLowerCase().includes(normalizedQuery) ||
          movie.originalTitle.toLowerCase().includes(normalizedQuery),
      )
    : [];

  return (
    <main className="min-h-[calc(100vh-76px)] bg-[#f7f8fa]">
      <div className="mx-auto max-w-[1120px] px-10 pt-[145px]">
        {/* 제목 */}
        <h1 className="text-center text-[38px] leading-[1.3] font-bold text-[#1f1f1f]">
          어떤 영화를 찾고 있나요?
        </h1>

        {/* 검색창 */}
        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-9 flex h-[64px] max-w-[700px] items-center rounded-[12px] border-2 border-[#1f2329] bg-white px-4"
        >
          <img
            src="/icons/movie-icons/search.svg"
            alt=""
            className="mr-3 h-5 w-5 opacity-60"
          />

          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="예: 스파이더맨"
            className="h-full flex-1 border-none bg-transparent text-[14px] text-[#1f1f1f] outline-none placeholder:text-[#9ca3af]"
          />

          <button
            type="submit"
            className="h-[38px] rounded-[6px] bg-[#1f2329] px-[18px] text-[12px] font-semibold text-white"
          >
            검색
          </button>
        </form>

        {/* 검색 전 */}
        {!normalizedQuery && (
          <p className="mt-5 text-center text-[12px] text-[#9ca3af]">
            검색어를 입력해주세요.
          </p>
        )}

        {/* 검색 결과 없음 */}
        {normalizedQuery && results.length === 0 && (
          <p className="mt-10 text-center text-[14px] text-[#6b7280]">
            검색 결과가 없어요.
          </p>
        )}

        {results.length > 0 && (
          <section className="mx-auto mt-10 max-w-[1120px]">
            <div className="flex items-end justify-between border-b border-[#e5e7eb] pb-4">
              <h2 className="text-[20px] font-bold text-[#1f1f1f]">
                ‘{query}’ 검색 결과
              </h2>

              <p className="text-[12px] text-[#9ca3af]">
                영화 {results.length}편 · 1페이지
              </p>
            </div>

            <div className="grid grid-cols-2 gap-x-9">
              {results.map((movie) => (
                <article
                  key={movie.id}
                  className="flex gap-4 border-b border-[#e5e7eb] py-5"
                >
                  <img
                    src={movie.posterPath}
                    alt={`${movie.title} 포스터`}
                    className="h-[165px] w-[110px] rounded-lg object-cover"
                  />

                  <div className="flex min-w-0 flex-1 flex-col">
                    <h3 className="text-[16px] font-bold text-[#1f1f1f]">
                      {movie.title}
                    </h3>

                    <div className="mt-2 flex flex-wrap gap-x-3 text-[12px] text-[#9ca3af]">
                      <span>{movie.originalTitle}</span>
                      <span>{movie.releaseDate}</span>
                    </div>

                    <p className="mt-3 line-clamp-2 text-[13px] leading-6 text-[#6b7280]">
                      {movie.overview}
                    </p>

                    <Link
                      to="/movies/$movieId"
                      params={{ movieId: String(movie.id) }}
                      className="mt-4 w-fit text-[12px] font-semibold text-[#2563eb]"
                    >
                      상세 보기 →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
