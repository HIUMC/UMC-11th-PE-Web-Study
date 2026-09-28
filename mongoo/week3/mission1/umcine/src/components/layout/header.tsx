import { Link } from "@tanstack/react-router";

const navLinkClass =
  "text-[13px] font-medium text-[#4b5563] [&.active]:font-bold [&.active]:text-[#171717]";

export function Header() {
  return (
    <header className="h-[72px] border-b border-[#e5e7eb] bg-white">
      <div className="mx-auto flex h-full w-[1050px] items-center">
        <Link to="/" className="flex items-center gap-[9px] text-lg font-bold text-[#171717]">
          <img src="/icons/movie.svg" alt="" className="h-[26px] w-[26px]" />
          UMCine
        </Link>

        <nav className="ml-[38px] flex items-center gap-[27px]">
          <Link to="/" activeOptions={{ exact: true }} className={navLinkClass}>
            영화
          </Link>
          <Link to="/search" className={navLinkClass}>
            검색
          </Link>
          <span className="text-[13px] font-medium text-[#4b5563]">내 정보</span>
        </nav>

        <div className="ml-auto flex items-center gap-[9px]">
          <button
            type="button"
            className="flex h-[38px] w-[38px] cursor-pointer items-center justify-center rounded-[7px] border border-[#dfe3e8] bg-white"
          >
            <img src="/icons/search.svg" alt="검색" className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="h-[38px] cursor-pointer rounded-[7px] bg-[#2563eb] px-4 text-[13px] font-semibold text-white"
          >
            로그인
          </button>
        </div>
      </div>
    </header>
  );
}