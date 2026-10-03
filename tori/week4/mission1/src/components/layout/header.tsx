import { Link } from "@tanstack/react-router";

export function Header() {
  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex h-[72px] w-full max-w-[1280px] items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2.5">
            <img className="h-8 w-8" src="/icons/movie.svg" alt="" />
            <span className="text-xl font-extrabold tracking-tight">UMCine</span>
          </Link>
          <nav className="flex gap-6">
            <Link
              to="/"
              activeOptions={{ exact: true }}
              className="text-sm font-semibold text-text-sub"
              activeProps={{ className: "!text-text" }}
            >
              영화
            </Link>
            <Link
              to="/search"
              className="text-sm font-semibold text-text-sub"
              activeProps={{ className: "!text-text" }}
            >
              검색
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-surface"
            aria-label="검색"
          >
            <img className="h-5 w-5" src="/icons/search.svg" alt="" />
          </button>
          <button
            type="button"
            className="h-10 rounded-lg bg-primary px-[18px] text-sm font-semibold text-white"
          >
            로그인
          </button>
        </div>
      </div>
    </header>
  );
}