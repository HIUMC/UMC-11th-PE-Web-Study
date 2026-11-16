import { Link } from "@tanstack/react-router";

export function Header() {
  const linkClass = "transition-colors hover:text-zinc-950";

  return (
    <header className="sticky top-0 z-20 border-b border-zinc-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-[76px] w-[min(1180px,calc(100%-48px))] items-center gap-8">
        <Link to="/" className="text-[26px] font-black tracking-[-1.4px] text-zinc-900">UMC<span className="font-medium">ine</span></Link>
        <nav className="flex flex-1 items-center gap-7 text-[15px] font-semibold text-zinc-500" aria-label="주요 메뉴">
          <Link to="/" activeProps={{ className: "text-zinc-950" }} className={linkClass}>영화</Link>
          <Link to="/search" activeProps={{ className: "text-zinc-950" }} className={linkClass}>검색</Link>
        </nav>
        <div className="flex items-center gap-1">
          <Link to="/search" aria-label="영화 검색" className="grid size-10 place-items-center rounded-full hover:bg-zinc-100"><img src="/icons/search.svg" alt="" className="size-5" /></Link>
          <Link to="/login" activeProps={{ className: "bg-zinc-100" }} aria-label="로그인" className="grid size-10 place-items-center rounded-full hover:bg-zinc-100"><img src="/icons/person.svg" alt="" className="size-5" /></Link>
        </div>
      </div>
    </header>
  );
}
