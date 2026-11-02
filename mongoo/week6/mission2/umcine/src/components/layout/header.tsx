import { Link } from "@tanstack/react-router";

const navLinkClass =
  "text-[13px] font-medium text-[#4b5563] [&.active]:font-bold [&.active]:text-[#171717] [&.active]:underline [&.active]:underline-offset-4";

export function Header() {
  return (
    <header className="h-[72px] shrink-0 border-b border-[#e5e7eb] bg-white">
      <div className="page-container flex h-full items-center">
        <Link to="/" className="flex shrink-0 items-center gap-[9px] text-lg font-bold text-[#171717]">
          <img src="/icons/movie.svg" alt="" className="h-[26px] w-[26px]" />
          UMCine
        </Link>
        <nav className="ml-5 flex items-center gap-4 sm:ml-[38px] sm:gap-[27px]">
          <Link to="/" activeOptions={{ exact: true }} className={navLinkClass}>영화</Link>
          <Link to="/search" className={navLinkClass}>검색</Link>
          <span className="hidden text-[13px] font-medium text-[#4b5563] sm:inline">내 정보</span>
        </nav>
        <div className="ml-auto flex items-center gap-[9px] pl-3">
          <Link to="/search" aria-label="영화 검색" className="flex h-[34px] w-[34px] items-center justify-center rounded-[7px] border border-[#dfe3e8] bg-white">
            <img src="/icons/search.svg" alt="" className="h-4 w-4" />
          </Link>
          <button type="button" className="h-[34px] cursor-pointer rounded-[5px] bg-[#2563eb] px-3 text-xs font-semibold text-white">로그인</button>
        </div>
      </div>
    </header>
  );
}
