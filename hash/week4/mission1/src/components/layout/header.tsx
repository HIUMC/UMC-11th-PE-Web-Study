import { Link, useRouterState } from "@tanstack/react-router";
import { cn } from "../../utils/cn";

export default function Header() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  const isMoviePage =
    pathname === "/" || pathname.startsWith("/movies/");
  const isSearchPage = pathname === "/search";

  const menuClassName =
    "transition-colors hover:text-[#191c23] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#4765df]";

  return (
    <header className="border-b border-[#e9ecf2] bg-white">
      <div className="mx-auto flex min-h-[88px] max-w-[1328px] flex-wrap items-center gap-y-3 px-6 py-4 sm:flex-nowrap sm:py-0">
        <Link
          to="/"
          className="inline-flex shrink-0 items-center gap-2 text-xl font-extrabold text-[#191c23] no-underline"
          aria-label="UMCine 영화 목록"
        >
          <span className="grid h-8 w-8 place-items-center rounded-lg border-2 border-[#191c23]">
            <img
              src="/icons/movie.svg"
              alt=""
              className="h-6 w-6"
            />
          </span>
          <span>UMCine</span>
        </Link>

        <nav
          aria-label="주 메뉴"
          className="order-3 flex w-full items-center gap-7 text-sm sm:order-none sm:ml-10 sm:w-auto"
        >
          <Link
            to="/"
            aria-current={pathname === "/" ? "page" : undefined}
            className={cn(
              menuClassName,
              isMoviePage
                ? "font-bold text-[#191c23] underline underline-offset-4"
                : "text-[#6b7280] no-underline",
            )}
          >
            영화
          </Link>

          <Link
            to="/search"
            search={{}}
            aria-current={isSearchPage ? "page" : undefined}
            className={cn(
              menuClassName,
              isSearchPage
                ? "font-bold text-[#191c23] underline underline-offset-4"
                : "text-[#6b7280] no-underline",
            )}
          >
            검색
          </Link>

          <span className="text-[#6b7280]">내 정보</span>
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <Link
            to="/search"
            search={{}}
            aria-label="영화 검색으로 이동"
            className="grid h-10 w-10 place-items-center rounded-lg border border-[#e0e4ed] hover:bg-gray-50"
          >
            <img
              src="/icons/search.svg"
              alt=""
              className="h-5 w-5"
            />
          </Link>

          <span className="rounded-md bg-[#4765df] px-4 py-3 text-xs font-bold text-white">
            로그인
          </span>
        </div>
      </div>
    </header>
  );
}