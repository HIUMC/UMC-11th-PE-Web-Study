import { Link, useRouterState } from "@tanstack/react-router";
import { changeSession } from "../../api/account-session";
import { useMe } from "../../hooks/use-account-queries";
import { useAuthStore } from "../../stores/auth-store";
import { cn } from "../../utils/cn";

export default function Header() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const meQuery = useMe();
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
          className="order-3 flex w-full items-center gap-7 text-sm sm:order-none sm:ml-5 sm:w-auto lg:ml-10"
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

          <Link
            to="/backend-check"
            className={cn(menuClassName, "text-[#6b7280]")}
          >
            회원 API
          </Link>

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

          {!accessToken ? (
            <Link to="/login" className="rounded-md bg-[#4765df] px-4 py-3 text-xs font-bold text-white hover:bg-[#3954c7]">
              로그인
            </Link>
          ) : (
            <>
              {meQuery.isLoading ? (
                <span role="status" className="rounded-md bg-gray-100 px-3 py-3 text-xs">회원 정보 조회 중…</span>
              ) : (
                <Link to="/mypage" className="max-w-[140px] truncate rounded-md bg-[#4765df] px-3 py-3 text-xs font-bold text-white">
                  {meQuery.data?.nickname ?? "마이페이지"}
                </Link>
              )}
              <button
                type="button"
                onClick={() => changeSession(null)}
                className="rounded-md border border-[#e0e4ed] bg-white px-3 py-3 text-xs font-bold hover:bg-gray-50"
              >
                로그아웃
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}