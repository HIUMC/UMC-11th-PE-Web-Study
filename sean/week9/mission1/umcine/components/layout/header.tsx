"use client";

import Link from "next/link";
import { useMeQuery } from "@/hooks/use-me-query";
import { useAuthHydrated, useAuthStore } from "@/stores/auth-store";

const AUTH_BUTTON_CLASS =
  "inline-flex h-9 items-center rounded-md bg-blue-600 px-4 text-sm font-medium text-white";

export function Header() {
  const hydrated = useAuthHydrated();
  const accessToken = useAuthStore((state) => state.accessToken);
  const meQuery = useMeQuery();

  return (
    <header className="mx-auto flex w-full max-w-[1200px] items-center justify-between gap-6 border-b border-neutral-200 px-6 py-4">
      <div className="flex items-center gap-8">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-bold text-neutral-900"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="h-6 w-6" src="/icons/movie.svg" alt="" />
          <span>UMCine</span>
        </Link>

        <nav className="flex gap-5 text-[15px] text-neutral-500">
          <Link href="/" className="hover:text-neutral-900">
            영화
          </Link>
          <Link href="/search" className="hover:text-neutral-900">
            검색
          </Link>
          <Link href="/my" className="hover:text-neutral-900">
            내 정보
          </Link>
        </nav>
      </div>

      <div className="flex items-center gap-3">
        <Link href="/search" aria-label="검색" className="cursor-pointer">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="block h-5 w-5" src="/icons/search.svg" alt="" />
        </Link>

        {!hydrated ? (
          // 토큰을 아직 읽기 전입니다. 서버 HTML과 어긋나지 않도록 자리만 잡아둡니다.
          <span className="h-9 w-[86px] rounded-md bg-neutral-100" />
        ) : !accessToken ? (
          <Link href="/login" className={AUTH_BUTTON_CLASS}>
            로그인
          </Link>
        ) : meQuery.isLoading ? (
          <span className="h-9 w-[86px] animate-pulse rounded-md bg-neutral-200" />
        ) : (
          <Link href="/my" className={AUTH_BUTTON_CLASS}>
            마이페이지
          </Link>
        )}
      </div>
    </header>
  );
}
