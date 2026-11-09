import { Link, useRouterState } from "@tanstack/react-router";

export function Header() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  const isMovieActive = pathname === "/" || pathname.startsWith("/movies/");

  const isSearchActive = pathname.startsWith("/search");
  return (
    <header className="flex min-h-[88px] flex-wrap items-center justify-between gap-4 py-4 border-b border-[#e5e7eb] bg-white px-4 sm:px-6 md:px-10 xl:min-h-[96px] xl:px-[80px]">
      <div className="flex flex-wrap items-center gap-4 sm:gap-8 md:gap-12">
        <Link
          to="/"
          className="flex items-center gap-3 text-[24px] font-bold text-[#1f1f1f]"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-[7px] border-2 border-[#1f1f1f]">
            <img
              src="/icons/movie-icons/movie.svg"
              alt=""
              className="h-7 w-7"
            />
          </div>

          <span>UMCine</span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            to="/"
            className={
              isMovieActive
                ? "px-3 py-3 text-[16px] font-bold text-[#1f1f1f] underline decoration-2 underline-offset-[8px] sm:px-5 sm:text-[18px]"
                : "px-3 py-3 text-[16px] font-semibold text-[#4b5563] transition-colors hover:text-[#1f1f1f] sm:px-5 sm:text-[18px]"
            }
          >
            영화
          </Link>

          <Link
            to="/search"
            search={{ query: "" }}
            className={
              isSearchActive
                ? "px-3 py-3 text-[16px] font-bold text-[#1f1f1f] underline decoration-2 underline-offset-[8px] sm:px-5 sm:text-[18px]"
                : "px-3 py-3 text-[16px] font-semibold text-[#4b5563] transition-colors hover:text-[#1f1f1f] sm:px-5 sm:text-[18px]"
            }
          >
            검색
          </Link>

          <Link
            to="/account"
            className={
              pathname === "/account"
                ? "px-3 py-3 text-[16px] font-bold text-[#1f1f1f] underline decoration-2 underline-offset-[8px] sm:px-5 sm:text-[18px]"
                : "px-3 py-3 text-[16px] font-semibold text-[#4b5563] transition-colors hover:text-[#1f1f1f] sm:px-5 sm:text-[18px]"
            }
          >
            내 정보
          </Link>
        </nav>
      </div>

      <div className="flex items-center gap-3">
        <Link
          to="/search"
          search={{ query: "" }}
          className="flex h-[44px] w-[44px] items-center justify-center rounded-lg border border-[#dfe3e8] bg-white"
          aria-label="영화 검색"
        >
          <img src="/icons/movie-icons/search.svg" alt="" className="h-5 w-5" />
        </Link>

        <button
          type="button"
          className="h-[44px] cursor-pointer rounded-md bg-[#2563eb] px-[18px] text-[15px] font-semibold text-white"
        >
          로그인
        </button>
      </div>
    </header>
  );
}
