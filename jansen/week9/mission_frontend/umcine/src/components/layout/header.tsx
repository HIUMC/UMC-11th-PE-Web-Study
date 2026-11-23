"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useMeQuery } from "@/hooks/use-me-query";
import { useAuthStore } from "@/stores/auth-store";
import { cn } from "@/utils/cn";
import { LogoIcon, SearchIcon } from "../icons";

interface NavLinkProps {
  href: string;
  exact?: boolean;
  children: ReactNode;
}

// TanStack Router의 activeProps / activeOptions를 대신한다
function NavLink({ href, exact = false, children }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = exact
    ? pathname === href
    : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      className={cn(
        "text-sm text-muted",
        isActive && "font-semibold text-ink underline underline-offset-4",
      )}
    >
      {children}
    </Link>
  );
}

export default function Header() {
  const queryClient = useQueryClient();
  const accessToken = useAuthStore((state) => state.accessToken);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const { data: me, isLoading } = useMeQuery();

  const handleLogout = () => {
    setAccessToken(null);
    queryClient.removeQueries({ queryKey: ["members", "me"] });
  };

  return (
    <header className="flex items-center justify-between border-b border-line bg-white px-20 py-6">
      <div className="flex items-center gap-10">
        <Link href="/" className="flex items-center gap-2.5 text-xl font-extrabold">
          <LogoIcon className="size-8" />
          UMCine
        </Link>

        <nav className="flex gap-6">
          <NavLink href="/" exact>
            영화
          </NavLink>
          <NavLink href="/search">검색</NavLink>
          <NavLink href="/my">내 정보</NavLink>
        </nav>
      </div>

      <div className="flex items-center gap-2.5">
        <Link
          href="/search"
          aria-label="검색"
          className="flex size-[42px] items-center justify-center rounded-lg border border-line bg-white"
        >
          <SearchIcon className="size-5" />
        </Link>
        {!accessToken ? (
          <Link
            href="/login"
            className="flex h-[42px] items-center rounded-lg border border-white bg-brand px-4 text-sm font-semibold text-white"
          >
            로그인
          </Link>
        ) : isLoading ? (
          <div className="h-[42px] w-28 animate-pulse rounded-lg bg-gray-200" />
        ) : (
          <>
            <Link
              href="/my"
              className="flex h-[42px] items-center rounded-lg border border-line bg-white px-4 text-sm font-semibold text-ink"
            >
              {me?.nickname ?? "마이페이지"}
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="h-[42px] rounded-lg border border-line bg-white px-4 text-sm text-muted"
            >
              로그아웃
            </button>
          </>
        )}
      </div>
    </header>
  );
}
