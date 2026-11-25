"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { memberQueries } from "@/api/members/member-queries";
import { useAuthStore } from "@/stores/auth-store";
import { cn } from "../../utils/cn";

const navLinkBase = "text-sm font-bold text-[#606774]";
const navLinkActive = "text-[#17191e] underline underline-offset-4";

export function Header() {
  const pathname = usePathname();
  const accessToken = useAuthStore((state) => state.accessToken);
  // 토큰이 있을 때만 내 정보 조회
  const meQuery = useQuery({
    ...memberQueries.me(),
    enabled: Boolean(accessToken),
  });

  const isMovieMenuActive = pathname === "/" || pathname.startsWith("/movies/");
  const isSearchMenuActive = pathname === "/search";
  const isMyMenuActive = pathname === "/my" || pathname.startsWith("/my/");

  return (
    <header className="flex items-center justify-between border-b border-[#e3e6eb] bg-white px-20 py-6">
      <div className="flex items-center gap-[42px]">
        <div className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-lg border-2 border-[#17191e]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icons/movie.svg" alt="" className="size-6" />
          </span>
          <span className="text-xl font-black tracking-[-0.7px] text-[#17191e]">
            UMCine
          </span>
        </div>
        <nav aria-label="주요 메뉴" className="flex items-center gap-[30px]">
          <Link
            href="/"
            aria-current={isMovieMenuActive ? "page" : undefined}
            className={cn(navLinkBase, isMovieMenuActive && navLinkActive)}
          >
            영화
          </Link>
          <Link
            href="/search"
            aria-current={isSearchMenuActive ? "page" : undefined}
            className={cn(navLinkBase, isSearchMenuActive && navLinkActive)}
          >
            검색
          </Link>
          <Link
            href="/my"
            aria-current={isMyMenuActive ? "page" : undefined}
            className={cn(navLinkBase, isMyMenuActive && navLinkActive)}
          >
            내 정보
          </Link>
        </nav>
      </div>
      <div className="flex items-center gap-2.5">
        <Link
          href="/search"
          aria-label="검색"
          className="flex size-[42px] items-center justify-center rounded-lg border border-[#e3e6eb] bg-white"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icons/search.svg" alt="" className="size-6" />
        </Link>
        {!accessToken ? (
          <Link
            href="/login"
            className="flex h-[42px] items-center rounded-lg bg-blue-600 px-4 text-sm font-extrabold text-white"
          >
            로그인
          </Link>
        ) : meQuery.isLoading ? (
          <span
            aria-label="내 정보를 불러오는 중"
            className="h-[42px] w-24 animate-pulse rounded-lg bg-gray-200"
          />
        ) : (
          <Link
            href="/my"
            className="flex h-[42px] items-center rounded-lg bg-blue-600 px-4 text-sm font-extrabold text-white"
          >
            마이페이지
          </Link>
        )}
      </div>
    </header>
  );
}
