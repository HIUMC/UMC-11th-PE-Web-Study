import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getMe } from "../../api/members/me";
import { useAuthStore } from "../../stores/auth-store";

export function Header() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  const handleLogout = async () => {
    setAccessToken(null);
    await queryClient.cancelQueries({ queryKey: ["members"] });
    queryClient.removeQueries({ queryKey: ["members"] });
    await navigate({ to: "/" });
  };
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });
  const accessToken = useAuthStore((state) => state.accessToken);
  const meQuery = useQuery({
    queryKey: ["members", "me"],
    queryFn: getMe,
    enabled: Boolean(accessToken),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
  const isMovieActive = pathname === "/" || pathname.startsWith("/movies/");

  const isSearchActive = pathname.startsWith("/search");
  return (
    <header className="shrink-0 border-b border-[#e5e7eb] bg-white">
      <div className="mx-auto flex min-h-[90px] w-full max-w-[1440px] flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8 md:px-10 xl:px-20">
      <div className="flex flex-wrap items-center gap-4 sm:gap-7 md:gap-8">
        <Link
          to="/"
          className="flex items-center gap-2 text-xl font-bold text-[#1f1f1f]"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-[6px] border-2 border-[#1f1f1f]">
            <img
              src="/icons/movie-icons/movie.svg"
              alt=""
              className="h-6 w-6"
            />
          </div>

          <span>UMCine</span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            to="/"
            className={
              isMovieActive
                ? "px-3 py-3 text-sm font-bold text-[#1f1f1f] underline decoration-1 underline-offset-4 sm:px-3 sm:text-sm"
                : "px-3 py-3 text-sm font-semibold text-[#4b5563] transition-colors hover:text-[#1f1f1f] sm:px-3 sm:text-sm"
            }
          >
            영화
          </Link>

          <Link
            to="/search"
            search={{ query: "" }}
            className={
              isSearchActive
                ? "px-3 py-3 text-sm font-bold text-[#1f1f1f] underline decoration-1 underline-offset-4 sm:px-3 sm:text-sm"
                : "px-3 py-3 text-sm font-semibold text-[#4b5563] transition-colors hover:text-[#1f1f1f] sm:px-3 sm:text-sm"
            }
          >
            검색
          </Link>

          <Link
            to="/account"
            className={
              pathname === "/account"
                ? "px-3 py-3 text-sm font-bold text-[#1f1f1f] underline decoration-1 underline-offset-4 sm:px-3 sm:text-sm"
                : "px-3 py-3 text-sm font-semibold text-[#4b5563] transition-colors hover:text-[#1f1f1f] sm:px-3 sm:text-sm"
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
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#dfe3e8] bg-white"
          aria-label="영화 검색"
        >
          <img src="/icons/movie-icons/search.svg" alt="" className="h-5 w-5" />
        </Link>

        {!accessToken ? (
          <Link to="/login" className="inline-flex h-10 items-center justify-center rounded-md bg-[#2563eb] px-4 text-sm font-semibold text-white hover:bg-blue-700">로그인</Link>
        ) : meQuery.isLoading ? (
          <span className="h-10 w-20 animate-pulse rounded-lg bg-gray-200" />
        ) : (
          <Link to="/account" className="inline-flex h-10 items-center justify-center rounded-md bg-[#2563eb] px-4 text-sm font-semibold text-white hover:bg-blue-700">마이페이지</Link>
        )}
        {accessToken && (
          <button
            type="button"
            onClick={() => void handleLogout()}
            className="inline-flex h-10 items-center justify-center rounded-md border border-gray-300 bg-white px-4 text-sm font-semibold text-gray-600 hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            로그아웃
          </button>
        )}
      </div>
      </div>
    </header>
  );
}
