import { Link } from "@tanstack/react-router";

interface HeaderProps {
  isLoggedIn?: boolean;
}

export function Header({ isLoggedIn = false }: HeaderProps) {
  return (
    <header className="mx-auto flex max-w-[1200px] items-center justify-between gap-6 border-b border-neutral-200 px-6 py-4">
      <div className="flex items-center gap-8">
        <Link to="/" className="flex items-center gap-2 text-lg font-bold text-neutral-900">
          <img className="h-6 w-6" src="/icons/movie.svg" alt="" />
          <span>UMCine</span>
        </Link>

        <nav className="flex gap-5 text-[15px] text-neutral-500">
          <a href="#" className="hover:text-neutral-900">영화</a>
          <Link to="/search" className="hover:text-neutral-900">검색</Link>
          <a href="#" className="hover:text-neutral-900">내 정보</a>
        </nav>
      </div>

      <div className="flex items-center gap-3">
        <Link to="/search" aria-label="검색" className="cursor-pointer">
          <img className="block h-5 w-5" src="/icons/search.svg" alt="" />
        </Link>

        <button
          type="button"
          className="cursor-pointer rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white"
        >
          {isLoggedIn ? "마이페이지" : "로그인"}
        </button>
      </div>
    </header>
  );
}