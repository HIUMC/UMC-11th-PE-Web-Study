import { Link } from "@tanstack/react-router";

export function Header() {
  return (
    <header className="h-16 border-b border-border bg-white">
      <div className="mx-auto flex h-full max-w-[1280px] items-center justify-between px-10">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2">
            <img
              className="h-8 w-8"
              src="/icons/movie.svg"
              alt=""
            />
            <span className="text-lg font-extrabold">UMCine</span>
          </Link>

          <nav className="flex items-center gap-6 text-sm">
            <Link
              to="/"
              activeOptions={{ exact: true }}
              className="text-text-sub"
              activeProps={{ className: "!text-text font-semibold" }}
            >
              영화
            </Link>

            <Link
              to="/search"
              className="text-text-sub"
              activeProps={{ className: "!text-text font-semibold" }}
            >
              검색
            </Link>

            <Link
              to="/mypage"
              className="text-text-sub"
              activeProps={{ className: "!text-text font-semibold" }}
            >
              내 정보
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/search"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border"
          >
            <img
              src="/icons/search.svg"
              alt="검색"
              className="h-4 w-4"
            />
          </Link>

          <Link
            to="/login"
            className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white"
          >
            로그인
          </Link>
        </div>
      </div>
    </header>
  );
}