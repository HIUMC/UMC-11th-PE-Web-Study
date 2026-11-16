import { Link } from "@tanstack/react-router";
import { useMyInfoQuery } from "../../hooks/use-my-info-query";
import { useLogout } from "../../hooks/use-logout";
import { useAuthStore } from "../../stores/auth-store";

export function Header() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const myInfoQuery = useMyInfoQuery();
  const logout = useLogout();

  return (
    <header className="sticky top-0 z-40 border-b border-gray-100 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
        {/* 좌측 로고 및 네비게이션 */}
        <div className="flex items-center gap-8">
          <Link to="/" className="flex shrink-0 items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg border-2 border-black bg-white">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect x="2" y="3" width="20" height="18" rx="2" />
                <path d="M7 3v18M17 3v18M2 8h20M2 16h20" />
              </svg>
            </div>
            <span className="text-xl font-black tracking-tight text-gray-950">UMCine</span>
          </Link>

          <nav className="flex items-center gap-6 whitespace-nowrap">
            <Link
              to="/"
              activeOptions={{ exact: true }}
              className="text-sm font-medium text-gray-500 transition-colors hover:text-gray-900"
              activeProps={{
                className: "font-bold text-gray-950",
              }}
            >
              영화 목록
            </Link>
            <Link
              to="/search"
              className="text-sm font-medium text-gray-500 transition-colors hover:text-gray-900"
              activeProps={{
                className: "font-bold text-gray-950",
              }}
            >
              영화 검색
            </Link>
            <span className="cursor-pointer text-sm font-medium text-gray-500 hover:text-gray-900">
              내 평점
            </span>
          </nav>
        </div>

        {/* 우측 검색 아이콘 및 로그인 상태별 버튼 */}
        <div className="flex shrink-0 items-center gap-4 whitespace-nowrap">
          <Link
            to="/search"
            aria-label="영화 검색"
            className="text-gray-600 transition-colors hover:text-gray-950"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </Link>

          {accessToken ? (
            <>
              {/* 로그인 상태: 내 정보 이동 + 로그아웃 */}
              <Link
                to="/me"
                className="flex items-center gap-2 text-sm font-medium text-gray-700 transition-colors hover:text-gray-950"
                activeProps={{ className: "font-bold text-gray-950" }}
              >
                <span
                  aria-hidden="true"
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white"
                >
                  {myInfoQuery.data?.nickname.charAt(0).toUpperCase() ?? "?"}
                </span>
                <span className="max-w-[8rem] truncate">
                  {myInfoQuery.data ? `${myInfoQuery.data.nickname}님` : "내 정보"}
                </span>
              </Link>
              <button
                type="button"
                onClick={logout}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              {/* 로그아웃 상태: 로그인 + 회원가입 */}
              <Link
                to="/login"
                className="text-sm font-semibold text-gray-700 transition-colors hover:text-gray-950"
              >
                로그인
              </Link>
              <Link
                to="/signup"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
              >
                회원가입
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
