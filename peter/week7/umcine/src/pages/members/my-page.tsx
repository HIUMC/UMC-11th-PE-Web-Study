import { movies } from "@/data/movies";
import { Link } from "@tanstack/react-router";

const previewMovies = movies.filter((movie) =>
  [1, 2, 5].includes(movie.id),
);

export function MyPage() {
  return (
    <main className="flex min-h-[calc(100vh-148px)] w-full flex-col gap-7 bg-[#f6f7f9] px-4 py-6 sm:px-10 xl:px-20">
      <div className="flex items-center justify-between">
        <h1 className="text-[28px] font-extrabold text-[#17191e]">
          내 정보
        </h1>
        <Link
        to="/me/edit"
        className="rounded-lg bg-[#2563eb] px-4 py-3 text-sm font-extrabold text-white"
        >
        정보 수정
        </Link>
      </div>

      {/* 기본 정보 */}
      <section className="border-y border-[#e3e6eb] py-4">
            <h2 className="mb-4 text-base font-bold text-[#17191e]">
                기본 정보
            </h2>

            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-[#e3e6eb]">
                <img
                    src="/icons/movie-icons/person.svg"
                    alt=""
                    className="h-10 w-10"
                />
                </div>
                {/*dl은 항목 이름과 값을 짝지어 표시, dt에 실제 항목 이름, dd에 실제 값*/}
                <dl className="grid flex-1 grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                    <dt className="mb-1 text-xs text-[#969da8]">닉네임</dt>
                    <dd className="text-sm font-bold text-[#17191e]">USER</dd>
                </div>

                <div>
                    <dt className="mb-1 text-xs text-[#969da8]">이메일</dt>
                    <dd className="break-all text-sm font-bold text-[#17191e]">
                    name@example.com
                    </dd>
                </div>
                </dl>
            </div>
        </section>
        {/* 내 즐겨찾기 */}
        <section>
    <h2 className="mb-4 text-base font-bold text-[#17191e]">
        내 즐겨찾기
    </h2>

    <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 xl:grid-cols-5">
        {previewMovies.map((movie) => (
        <article key={movie.id}>
            <img
            src={movie.posterPath}
            alt={`${movie.title} 포스터`}
            className="aspect-[241.6/274] w-full rounded-[10px] object-cover"
            />
            <h3 className="mt-2 text-sm font-extrabold text-[#17191e]">
            {movie.title}
            </h3>
            <p className="mt-1 text-xs text-[#969da8]">
            {movie.releaseDate}
            </p>
        </article>
        ))}
    </div>

    <nav
        aria-label="즐겨찾기 페이지"
        className="mt-7 flex items-center justify-center gap-3"
    >
        <button type="button" disabled aria-label="이전 페이지">
        <img
            src="/icons/movie-icons/chevron-left.svg"
            alt=""
            className="h-6 w-6 opacity-20"
        />
        </button>
        <span
        aria-current="page"
        className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#17191e] text-sm font-bold text-white"
        >
        1
        </span>
        <button type="button" disabled aria-label="다음 페이지">
        <img
            src="/icons/movie-icons/chevron-right.svg"
            alt=""
            className="h-6 w-6 opacity-20"
        />
        </button>
    </nav>
    </section>
    </main>
  );
}