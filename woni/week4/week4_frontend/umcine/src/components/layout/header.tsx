import { Link, useLocation } from "@tanstack/react-router";
import { cn } from "../../utils/cn";

const navLinkBase = "text-sm font-bold text-[#606774]";
const navLinkActive = "text-[#17191e] underline underline-offset-4";

export function Header() {
  const pathname = useLocation({ select: (location) => location.pathname });

  const isMovieMenuActive = pathname === "/" || pathname.startsWith("/movies/");
  const isSearchMenuActive = pathname === "/search";

  return (
    <header className="flex items-center justify-between border-b border-[#e3e6eb] bg-white px-20 py-6">
      <div className="flex items-center gap-[42px]">
        <div className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-lg border-2 border-[#17191e]">
            <img src="/icons/movie.svg" alt="" className="size-6" />
          </span>
          <span className="text-xl font-black tracking-[-0.7px] text-[#17191e]">
            UMCine
          </span>
        </div>
        <nav aria-label="주요 메뉴" className="flex items-center gap-[30px]">
          <Link
            to="/"
            aria-current={isMovieMenuActive ? "page" : undefined}
            className={cn(navLinkBase, isMovieMenuActive && navLinkActive)}
          >
            영화
          </Link>
          <Link
            to="/search"
            aria-current={isSearchMenuActive ? "page" : undefined}
            className={cn(navLinkBase, isSearchMenuActive && navLinkActive)}
          >
            검색
          </Link>
        </nav>
      </div>
      <div className="flex items-center gap-2.5">
        <Link
          to="/search"
          aria-label="검색"
          className="flex size-[42px] items-center justify-center rounded-lg border border-[#e3e6eb] bg-white"
        >
          <img src="/icons/search.svg" alt="" className="size-6" />
        </Link>
        <button
          type="button"
          className="h-[42px] rounded-lg bg-blue-600 px-4 text-sm font-extrabold text-white"
        >
          로그인
        </button>
      </div>
    </header>
  );
}
