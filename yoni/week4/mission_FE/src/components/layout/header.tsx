import { Link, useRouterState } from "@tanstack/react-router";

export function Header() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  const isMovieActive = pathname === "/" || pathname.startsWith("/movies/");

  const isSearchActive = pathname.startsWith("/search");
  return (
    <header className="flex h-[76px] items-center justify-between border-b border-[#e5e7eb] bg-white px-4 sm:px-6 md:px-10 xl:h-[88px] xl:px-[80px]">
      <div className="flex items-center gap-12">
        <Link
          to="/"
          className="flex items-center gap-2 text-[18px] font-bold text-[#1f1f1f]"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-[7px] border-2 border-[#1f1f1f]">
            <img
              src="/icons/movie-icons/movie.svg"
              alt=""
              className="h-[19px] w-[19px]"
            />
          </div>

          <span>UMCine</span>
        </Link>

        <nav className="flex items-center gap-8">
          <Link
            to="/"
            className={
              isMovieActive
                ? "text-[12px] font-bold text-[#1f1f1f] underline"
                : "text-[12px] font-normal text-[#4b5563]"
            }
          >
            영화
          </Link>

          <Link
            to="/search"
            search={{ query: "" }}
            className={
              isSearchActive
                ? "text-[12px] font-bold text-[#1f1f1f] underline"
                : "text-[12px] font-normal text-[#4b5563]"
            }
          >
            검색
          </Link>

          <span className="text-[12px] font-normal text-[#4b5563]">
            내 정보
          </span>
        </nav>
      </div>

      <div className="flex items-center gap-3">
        <Link
          to="/search"
          search={{ query: "" }}
          className="flex h-[38px] w-[38px] items-center justify-center rounded-lg border border-[#dfe3e8] bg-white"
          aria-label="영화 검색"
        >
          <img src="/icons/movie-icons/search.svg" alt="" className="h-5 w-5" />
        </Link>

        <button
          type="button"
          className="h-[38px] cursor-pointer rounded-md bg-[#2563eb] px-[18px] text-[12px] font-semibold text-white"
        >
          로그인
        </button>
      </div>
    </header>
  );
}
