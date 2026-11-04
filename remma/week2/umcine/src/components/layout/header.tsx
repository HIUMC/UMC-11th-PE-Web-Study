import { Link } from "@tanstack/react-router";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-gray-100 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
        {/* 좌측 로고 및 내비게이션 */}
        <div className="flex items-center gap-10">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg border-2 border-black bg-white">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect x="2" y="3" width="20" height="18" rx="2" />
                <path d="M7 3v18M17 3v18M2 8h20M2 16h20" />
              </svg>
            </div>
            <span className="text-xl font-black tracking-tight text-gray-950">UMCine</span>
          </Link>

          <nav className="flex items-center gap-7">
            {/* 영화 링크: exact 일치 시에만 활성화되도록 activeOptions 지정 */}
            <Link
              to="/"
              activeOptions={{ exact: true }}
              className="text-sm font-medium text-gray-500 transition-colors hover:text-gray-900"
              activeProps={{
                className: "font-bold text-gray-950",
              }}
            >
              영화
            </Link>

            {/* 검색 링크 */}
            <Link
              to="/search"
              className="text-sm font-medium text-gray-500 transition-colors hover:text-gray-900"
              activeProps={{
                className: "font-bold text-gray-950",
              }}
            >
              검색
            </Link>

            <span className="cursor-pointer text-sm font-medium text-gray-500 hover:text-gray-900">
              내 정보
            </span>
          </nav>
        </div>

        {/* 우측 검색 아이콘 및 로그인 버튼 */}
        <div className="flex items-center gap-5">
          <Link
            to="/search"
            aria-label="검색창 이동"
            className="text-gray-600 transition-colors hover:text-gray-950"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </Link>
          <button
            type="button"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
          >
            로그인
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;