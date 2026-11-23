"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getMe } from "../../api/members/me";
import { useAuthStore } from "../../stores/auth-store";
import { useHydrated } from "../../hooks/use-hydrated";
import { cn } from "../../utils/cn";

const navLinkClass = "text-[13px] font-medium text-[#4b5563]";

const activeLinkClass =
  "font-bold text-[#171717] underline underline-offset-4";

const accountLinkClass =
  "flex h-[34px] items-center justify-center rounded-[5px] bg-[#2563eb] px-3 text-xs font-semibold text-white";

export function Header() {
  const pathname = usePathname();
  const hydrated = useHydrated();
  const accessToken = useAuthStore((state) => state.accessToken);

  const meQuery = useQuery({
    queryKey: ["members", "me"],
    queryFn: getMe,
    enabled: hydrated && Boolean(accessToken),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  const isMoviePage =
    pathname === "/" || pathname.startsWith("/movies/");

  const isSearchPage = pathname === "/search";
  const isMyPage = pathname.startsWith("/mypage");

  return (
    <header className="h-[72px] shrink-0 border-b border-[#e5e7eb] bg-white">
      <div className="page-container flex h-full items-center">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-[9px] text-lg font-bold"
        >
          <img
            src="/icons/movie.svg"
            alt=""
            className="h-[26px] w-[26px]"
          />
          UMCine
        </Link>

        <nav className="ml-5 flex items-center gap-4 sm:ml-[38px] sm:gap-[27px]">
          <Link
            href="/"
            aria-current={pathname === "/" ? "page" : undefined}
            className={cn(
              navLinkClass,
              isMoviePage && activeLinkClass,
            )}
          >
            영화
          </Link>

          <Link
            href="/search"
            aria-current={isSearchPage ? "page" : undefined}
            className={cn(
              navLinkClass,
              isSearchPage && activeLinkClass,
            )}
          >
            검색
          </Link>

          <Link
            href="/mypage"
            aria-current={pathname === "/mypage" ? "page" : undefined}
            className={cn(
              navLinkClass,
              "hidden sm:inline",
              isMyPage && activeLinkClass,
            )}
          >
            내 정보
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-[9px] pl-3">
          <Link
            href="/search"
            aria-label="영화 검색"
            className="flex h-[34px] w-[34px] items-center justify-center rounded-[7px] border border-[#dfe3e8] bg-white"
          >
            <img
              src="/icons/search.svg"
              alt=""
              className="h-4 w-4"
            />
          </Link>

          {!hydrated || (accessToken && meQuery.isLoading) ? (
            <span
              role="status"
              aria-label="로그인 상태 확인 중"
              className="h-[34px] w-24 animate-pulse rounded-[5px] bg-gray-200"
            />
          ) : !accessToken ? (
            <Link href="/login" className={accountLinkClass}>
              로그인
            </Link>
          ) : (
            <Link href="/mypage" className={accountLinkClass}>
              마이페이지
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}