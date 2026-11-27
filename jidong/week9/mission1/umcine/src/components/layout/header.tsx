"use client";

import Image from "next/image";
import Link from "next/link";
import { useAuthHydrated } from "../../hooks/use-auth-hydrated";
import { useMeQuery } from "../../hooks/use-me-query";
import { useAuthStore } from "../../stores/auth-store";

export function Header() {
  const hydrated = useAuthHydrated();
  const accessToken = useAuthStore((state) => state.accessToken);
  const meQuery = useMeQuery();

  return (
    <header className="bg-[#111]">
      <div className="mx-auto flex max-w-[1200px] items-center gap-8 px-6 py-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-white no-underline">
          <Image src="/icons/movie.svg" alt="" width={20} height={20} className="h-5 w-5" />
          <span>UMCine</span>
        </Link>
        <nav className="flex flex-1 gap-5">
          <Link href="/" className="text-sm text-white font-bold no-underline">영화</Link>
          <Link href="/search" className="text-sm text-[#ccc] no-underline">검색</Link>
          <Link href="/mypage" className="text-sm text-[#ccc] no-underline">내 정보</Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/search" className="cursor-pointer border-none bg-transparent" aria-label="검색">
            <Image src="/icons/search.svg" alt="" width={20} height={20} className="h-5 w-5" />
          </Link>
          {!hydrated || (accessToken && meQuery.isLoading) ? (
            <span aria-label="내 정보를 불러오는 중" className="h-9 w-24 animate-pulse rounded-md bg-gray-600" />
          ) : !accessToken ? (
            <>
              <Link href="/login" className="text-sm text-white no-underline">
                로그인
              </Link>
              <Link href="/signup" className="cursor-pointer rounded-md border-none bg-blue-600 px-4 py-2 text-sm text-white">
                회원가입
              </Link>
            </>
          ) : (
            <Link href="/mypage" className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white no-underline">
              마이페이지
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
