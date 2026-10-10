import { Link, useRouterState } from "@tanstack/react-router";
import { cn } from "../../utils/cn";

export default function Header() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });
  const isMoviesRoute = pathname === "/" || pathname.startsWith("/movies/");
  const isSearchRoute = pathname === "/search";
  const navigationClassName =
    "shrink-0 text-sm leading-[17px] font-bold no-underline";

  return (
    <header className="box-border flex h-[91px] w-full items-center justify-between bg-white px-4 py-6 sm:px-10 xl:px-20">
      <div className="flex h-8 min-w-0 items-center gap-3 sm:gap-[30px] xl:gap-[42px]">
        <div className="flex h-8 w-[116px] shrink-0 items-center gap-2.5">
          <span className="box-border flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border-2 border-[#17191e]">
            <img
              src="/icons/movie-icons/movie.svg"
              alt=""
              className="block h-6 w-6"
            />
          </span>
          <span className="text-xl leading-6 font-black tracking-[-0.7px] text-[#17191e]">
            UMCine
          </span>
        </div>

        <Link
          to="/"
          className={cn(
            navigationClassName,
            isMoviesRoute
              ? "text-[#17191e] underline"
              : "text-[#606774]",
          )}
        >
          영화
        </Link>
        <Link
          to="/search"
          className={cn(
            navigationClassName,
            isSearchRoute
              ? "text-[#17191e] underline"
              : "text-[#606774]",
          )}
        >
          검색
        </Link>
        <a
          href="#"
          className={cn(
            navigationClassName,
            "hidden text-[#606774] sm:inline",
          )}
        >
          내 정보
        </a>
      </div>

      <div className="flex h-[42px] shrink-0 items-center gap-2.5">
        <Link
          to="/search"
          className="box-border flex h-[42px] w-[42px] items-center justify-center rounded-lg border border-[#e3e6eb] bg-white p-0"
          aria-label="영화 검색"
        >
          <img
            src="/icons/movie-icons/search.svg"
            alt=""
            className="block h-6 w-6 opacity-60"
          />
        </Link>

        <button
          type="button"
          className="box-border flex h-[42px] w-[71px] cursor-pointer items-center justify-center rounded-lg border border-white bg-[#2563eb] px-4 text-sm leading-[17px] font-extrabold text-white"
        >
          로그인
        </button>
      </div>
    </header>
  );
}
