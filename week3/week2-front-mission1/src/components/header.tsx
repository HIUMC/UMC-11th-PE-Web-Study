import { cn } from "../utils/cn";

interface HeaderProps {
  searchQuery?: string;
  activePage?: "movies" | "search";
}

function Header({ searchQuery = "", activePage }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex h-[76px] items-center justify-between border-b border-white/8 bg-[#101114]/90 px-[72px] backdrop-blur-[18px] max-[1024px]:px-10 max-[720px]:gap-5 max-[720px]:px-6 max-[480px]:h-auto max-[480px]:min-h-[76px]">
      <a
        className="flex min-w-[190px] items-center gap-3 text-[22px] font-extrabold max-[720px]:min-w-0"
        href="/"
        aria-label="UMCine 홈"
      >
        <img
          className="h-7 w-[38px] object-contain"
          src="/images/logos/tmdb-logo.svg"
          alt=""
        />
        <span className="text-white max-[480px]:hidden">UMCine</span>
      </a>
      <nav
        className="flex items-center gap-[38px] text-[15px] font-bold text-[#a8adb8] max-[720px]:gap-5 max-[480px]:hidden"
        aria-label="주요 메뉴"
      >
        <a
          className={cn(
            "relative py-7 transition-colors hover:text-white",
            activePage === "movies" &&
              "text-white after:absolute after:right-0 after:bottom-[18px] after:left-0 after:h-[3px] after:rounded-full after:bg-[#f04252] after:content-['']",
          )}
          href="/"
          aria-current={activePage === "movies" ? "page" : undefined}
        >
          영화
        </a>
        <a
          className={cn(
            "relative py-7 transition-colors hover:text-white",
            activePage === "search" &&
              "text-white after:absolute after:right-0 after:bottom-[18px] after:left-0 after:h-[3px] after:rounded-full after:bg-[#f04252] after:content-['']",
          )}
          href="/search"
          aria-current={activePage === "search" ? "page" : undefined}
        >
          검색
        </a>
      </nav>
      <form
        className="flex min-w-[260px] items-center justify-end gap-2.5 max-[720px]:min-w-0 max-[480px]:flex-1"
        action="/search"
      >
        <label className="sr-only" htmlFor="movie-search">
          영화 검색
        </label>
        <input
          className="h-11 w-[190px] rounded-lg border border-white/12 bg-white/8 px-3.5 text-white outline-none placeholder:text-[#8f96a3] focus:border-[#f04252]/70 max-[720px]:w-[150px] max-[480px]:w-full"
          id="movie-search"
          name="query"
          type="search"
          placeholder="영화 검색"
          defaultValue={searchQuery}
        />
        <button
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white/8"
          type="submit"
          aria-label="검색"
        >
          <img className="h-[22px] w-[22px]" src="/icons/search.svg" alt="" />
        </button>
      </form>
    </header>
  );
}

export default Header;
