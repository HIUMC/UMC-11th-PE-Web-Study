import { Link, useRouterState } from "@tanstack/react-router";
import { cn } from "../../utils/cn";
import { useQuery } from "@tanstack/react-query";
import { getMe } from "@/api/members/me";
import { useAuthStore } from "@/stores/auth-store";

export default function Header() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });
  const isMoviesRoute = pathname === "/" || pathname.startsWith("/movies/");
  const isSearchRoute = pathname === "/search";
  const isMemberRoute = pathname === "/me" || pathname.startsWith("/me/");
  const navigationClassName =
    "shrink-0 text-sm leading-[17px] font-bold no-underline";
  const authLinkClassName =
    "box-border flex h-[42px] min-w-[71px] cursor-pointer items-center justify-center rounded-lg border border-white bg-[#2563eb] px-4 text-sm leading-[17px] font-extrabold whitespace-nowrap text-white no-underline";

  const accessToken = useAuthStore((state) => state.accessToken);
  const meQuery = useQuery({
    queryKey: ["members", "me"],
    queryFn: getMe,
    enabled: Boolean(accessToken),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

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
        <Link
          to="/me"
          className={cn(
            navigationClassName,
            "hidden sm:inline",
            isMemberRoute
              ? "text-[#17191e] underline"
              : "text-[#606774]",
          )}
        >
          내 정보
        </Link>
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

        {!accessToken ? (
          <Link to="/login" className={authLinkClassName}>로그인</Link>
        ) : meQuery.isLoading ? (
          <span className="h-10 w-24 animate-pulse rounded-lg bg-gray-200" />
        ) : (
          <Link to="/me" className={authLinkClassName}>마이페이지</Link>
        )}
      </div>
    </header>
  );
}
