import { useQuery } from "@tanstack/react-query";
import { Link, useRouterState } from "@tanstack/react-router";
import { getMe } from "../../api/members/me";
import { useAuthStore } from "../../stores/auth-store";
import { cn } from "../../utils/cn";

const Header = () => {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const isMoviesActive = pathname === "/" || pathname.startsWith("/movies/");
  const isSearchActive = pathname === "/search";
  const isMyActive = pathname.startsWith("/my");
  const accessToken = useAuthStore((state) => state.accessToken);
  const meQuery = useQuery({
    queryKey: ["members", "me"],
    queryFn: getMe,
    enabled: Boolean(accessToken),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  if (pathname === "/signup") {
    return null;
  }

  return (
    <header className="flex h-[64px] w-full items-center justify-between border-b border-gray-100 bg-white px-5">
      <div className="flex items-center gap-10">
        <Link to="/" className="flex items-center gap-2">
          <img src="/icons/movie-icons/movie-icons/movie.svg" alt="" className="h-5 w-5" />
          <span className="text-[18px] font-bold text-gray-900">UMCine</span>
        </Link>

        <nav className="flex items-center gap-8 text-[14px]">
          <Link
            to="/"
            className={cn(
              "font-medium text-gray-500 transition hover:text-gray-900",
              isMoviesActive && "font-semibold text-gray-900 underline underline-offset-4",
            )}
          >
            영화
          </Link>
          <Link
            to="/search"
            className={cn(
              "font-medium text-gray-500 transition hover:text-gray-900",
              isSearchActive && "font-semibold text-gray-900 underline underline-offset-4",
            )}
          >
            검색
          </Link>
          <Link
            to="/my"
            className={cn(
              "font-medium text-gray-500 transition hover:text-gray-900",
              isMyActive && "font-semibold text-gray-900 underline underline-offset-4",
            )}
          >
            내 정보
          </Link>
        </nav>
      </div>

      <div className="flex items-center gap-2">
        <Link
          to="/search"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600"
          aria-label="영화 검색"
        >
          <img src="/icons/movie-icons/movie-icons/search.svg" alt="" className="h-[18px] w-[18px]" />
        </Link>

        {!accessToken ? (
          <Link
            to="/login"
            className="flex h-9 items-center rounded-lg bg-blue-600 px-4 text-[13px] font-semibold text-white"
          >
            로그인
          </Link>
        ) : meQuery.isLoading ? (
          <span className="h-10 w-24 animate-pulse rounded-lg bg-gray-200" />
        ) : (
          <Link
            to="/my"
            className="flex h-9 items-center rounded-lg bg-blue-600 px-4 text-[13px] font-semibold text-white"
          >
            마이페이지
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
