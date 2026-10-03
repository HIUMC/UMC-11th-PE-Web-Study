import { Link, useRouterState } from "@tanstack/react-router";
import { cn } from "../../utils/cn";

export default function Header() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });
  const isMovieRoute = pathname === "/" || pathname.startsWith("/movies/");
  const isSearchRoute = pathname === "/search";

  return (
    <header className="h-[72px] border-b border-[#eceef2] bg-white">
      <div className="mx-auto flex h-full max-w-[1120px] items-center">
        <Link
          className="mr-12 flex items-center gap-2 text-lg"
          to="/"
        >
          <img
            className="size-7"
            src="/icons/movie-icons/movie.svg"
            alt=""
          />
          <strong>UMCine</strong>
        </Link>

        <nav
          className="flex items-center gap-8 text-sm text-[#767676]"
          aria-label="주요 메뉴"
        >
          <Link
            className={cn(
              "border-b-2 border-transparent py-[25px]",
              isMovieRoute && "border-[#171719] font-bold text-[#171719]",
            )}
            to="/"
          >
            영화
          </Link>

          <Link
            className={cn(
              "border-b-2 border-transparent py-[25px]",
              isSearchRoute && "border-[#171719] font-bold text-[#171719]",
            )}
            to="/search"
          >
            검색
          </Link>

          {/* 아직 /profile 경로가 없어서 주석 처리 */}
          {/* <Link className="py-[25px]" to="/profile">
            내 정보
          </Link> */}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <Link
            to="/search"
            className="grid size-10 place-items-center bg-transparent p-0"
            aria-label="영화 검색"
          >
            <img
              className="size-5"
              src="/icons/movie-icons/search.svg"
              alt=""
            />
          </Link>

          <button
            type="button"
            className="h-10 rounded-[6px] bg-[#4f6ef7] px-5 font-semibold text-white"
          >
            로그인
          </button>
        </div>
      </div>
    </header>
  );
}
