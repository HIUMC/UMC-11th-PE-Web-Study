import { Link, useRouterState } from "@tanstack/react-router";
import { cn } from "../../utils/cn";

const navigationLinkClass =
  "relative py-2 text-sm font-semibold text-slate-500 transition-colors after:absolute after:inset-x-0 after:-bottom-1 after:h-0.5 after:origin-center after:rounded-full after:bg-slate-900 after:transition-transform hover:text-slate-900";

export function Header() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });
  const isMovieSection = pathname === "/" || pathname.startsWith("/movies/");
  const isSearchSection = pathname === "/search";

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur">
      <div className="mx-auto flex min-h-18 w-[min(1280px,calc(100%-32px))] flex-wrap items-center gap-x-6 gap-y-2 py-3 sm:w-[min(1280px,calc(100%-48px))] sm:flex-nowrap sm:py-0">
        <Link
          className="inline-flex shrink-0 items-center gap-2 text-lg font-extrabold tracking-[-0.03em] text-slate-900 outline-none focus-visible:ring-3 focus-visible:ring-blue-200"
          to="/"
          aria-label="UMCine 홈"
        >
          <span className="grid size-8 place-items-center rounded-lg border-2 border-slate-900">
            <img className="size-5.5" src="/icons/movie.svg" alt="" />
          </span>
          <span>UMCine</span>
        </Link>

        <nav
          className="order-3 flex w-full items-center gap-6 sm:order-none sm:w-auto sm:gap-8"
          aria-label="주요 메뉴"
        >
          <Link
            className={cn(
              navigationLinkClass,
              isMovieSection
                ? "text-slate-950 after:scale-x-100"
                : "after:scale-x-0",
            )}
            to="/"
          >
            영화
          </Link>
          <Link
            className={cn(
              navigationLinkClass,
              isSearchSection
                ? "text-slate-950 after:scale-x-100"
                : "after:scale-x-0",
            )}
            to="/search"
          >
            검색
          </Link>
          <span className="hidden text-sm font-semibold text-slate-400 md:inline">
            상영 예정
          </span>
          <span className="hidden text-sm font-semibold text-slate-400 md:inline">
            내 영화관
          </span>
        </nav>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <Link
            className="grid size-10 place-items-center rounded-lg bg-slate-100 transition-colors hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-blue-200"
            to="/search"
            aria-label="영화 검색"
          >
            <img className="size-5 opacity-60" src="/icons/search.svg" alt="" />
          </Link>
          <button
            className="h-10 rounded-lg bg-blue-600 px-4 text-sm font-bold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-blue-200 sm:px-5"
            type="button"
          >
            로그인
          </button>
        </div>
      </div>
    </header>
  );
}
