"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getMe } from "@/api/members/me";
import { useAuthStore } from "@/stores/auth-store";

export function Header() {
  const pathname = usePathname();
  const accessToken = useAuthStore((state) => state.accessToken);

  const meQuery = useQuery({
    queryKey: ["members", "me"],
    queryFn: getMe,
    enabled: Boolean(accessToken),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  const activeClass = (path: string) =>
    pathname === path
      ? "!text-text font-semibold"
      : "text-text-sub";

  return (
    <header className="h-16 border-b border-border bg-white">
      <div className="mx-auto flex h-full max-w-[1280px] items-center justify-between px-10">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <img
              className="h-8 w-8"
              src="/icons/movie.svg"
              alt=""
            />
            <span className="text-lg font-extrabold">UMCine</span>
          </Link>

          <nav className="flex items-center gap-6 text-sm">
            <Link href="/" className={activeClass("/")}>
              영화
            </Link>

            <Link href="/search" className={activeClass("/search")}>
              검색
            </Link>

            <Link
              href="/mypage"
              className={activeClass("/mypage")}
            >
              내 정보
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/search"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border"
          >
            <img
              src="/icons/search.svg"
              alt="검색"
              className="h-4 w-4"
            />
          </Link>

          {!accessToken ? (
            <Link
              href="/login"
              className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white"
            >
              로그인
            </Link>
          ) : meQuery.isLoading ? (
            <span className="h-10 w-24 animate-pulse rounded-lg bg-gray-200" />
          ) : (
            <Link
              href="/mypage"
              className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white"
            >
              마이페이지
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}