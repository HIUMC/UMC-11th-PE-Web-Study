"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const linkClass = (href: string) =>
    `font-semibold ${pathname === href ? "text-zinc-950" : "text-zinc-500"}`;

  return (
    <header className="sticky top-0 z-20 border-b border-zinc-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-[76px] w-[min(1180px,calc(100%-48px))] items-center gap-8">
        <Link href="/" className="text-[26px] font-black tracking-[-1.4px] text-zinc-900">
          UMC<span className="font-medium">ine</span>
        </Link>
        <nav className="flex flex-1 items-center gap-7 text-[15px]">
          <Link href="/" className={linkClass("/")}>영화</Link>
          <Link href="/search" className={linkClass("/search")}>검색</Link>
        </nav>
        <Link href="/login" className="rounded-lg px-3 py-2 text-sm font-bold hover:bg-zinc-100">로그인</Link>
      </div>
    </header>
  );
}
