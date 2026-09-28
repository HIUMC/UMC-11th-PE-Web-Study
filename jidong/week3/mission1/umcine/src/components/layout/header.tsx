import { Link } from "@tanstack/react-router";

export function Header() {
  return (
    <header className="bg-[#111]">
      <div className="mx-auto flex max-w-[1200px] items-center gap-8 px-6 py-4">
        <a href="#" className="flex items-center gap-2 font-bold text-white no-underline">
          <img src="/icons/movie.svg" alt="" className="h-5 w-5" />
          <span>UMCine</span>
        </a>
        <nav className="flex flex-1 gap-5">
          <Link to="/" className="text-sm text-white font-bold no-underline">영화</Link>
          <Link to="/search" className="text-sm text-[#ccc] no-underline">검색</Link>
          <a href="#" className="text-sm text-[#ccc] no-underline">내 정보</a>
        </nav>
        <div className="flex items-center gap-3">
          <button type="button" className="cursor-pointer border-none bg-transparent" aria-label="검색">
            <img src="/icons/search.svg" alt="" className="h-5 w-5" />
          </button>
          <button type="button" className="cursor-pointer rounded-md border-none bg-blue-600 px-4 py-2 text-white">
            로그인
          </button>
        </div>
      </div>
    </header>
  );
}
