"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Header() {
  const pathname = usePathname();
  const [loggedIn, setLoggedIn] = useState(false);
  useEffect(() => { const timer=setTimeout(()=>setLoggedIn(Boolean(localStorage.getItem("umcine-access-token"))),0); return ()=>clearTimeout(timer); }, [pathname]);
  if (pathname === "/signup") return null;
  const active = (href:string) => href === "/" ? pathname === "/" || pathname.startsWith("/movies/") : pathname.startsWith(href);
  return <header className="flex h-16 items-center justify-between border-b border-gray-100 bg-white px-5 sm:px-8">
    <div className="flex items-center gap-6 sm:gap-10">
      <Link href="/" className="flex items-center gap-2 font-bold"><Image src="/icons/movie-icons/movie-icons/movie.svg" alt="" width={20} height={20}/>UMCine</Link>
      <nav className="flex gap-4 text-sm sm:gap-8">{[["/","영화"],["/search","검색"],["/my","내 정보"]].map(([href,label])=><Link key={href} href={href} className={active(href)?"font-semibold underline underline-offset-4":"text-gray-500 hover:text-gray-900"}>{label}</Link>)}</nav>
    </div>
    <Link href={loggedIn?"/my":"/login"} className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white">{loggedIn?"마이페이지":"로그인"}</Link>
  </header>;
}
