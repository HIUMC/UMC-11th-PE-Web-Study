import { Link } from "@tanstack/react-router";
import { useMeQuery } from "../../hooks/use-me-query";
import { useAuthStore } from "../../stores/auth-store";

export function Header() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const meQuery = useMeQuery();

  return (
    <header className="bg-[#111]">
      <div className="mx-auto flex max-w-[1200px] items-center gap-8 px-6 py-4">
        <Link to="/" className="flex items-center gap-2 font-bold text-white no-underline">
          <img src="/icons/movie.svg" alt="" className="h-5 w-5" />
          <span>UMCine</span>
        </Link>
        <nav className="flex flex-1 gap-5">
          <Link to="/" className="text-sm text-white font-bold no-underline">영화</Link>
          <Link to="/search" className="text-sm text-[#ccc] no-underline">검색</Link>
          <Link to="/mypage" className="text-sm text-[#ccc] no-underline">내 정보</Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link to="/search" className="cursor-pointer border-none bg-transparent" aria-label="검색">
            <img src="/icons/search.svg" alt="" className="h-5 w-5" />
          </Link>
          {/* 토큰 없음 → 로그인/회원가입, 첫 조회 중 → 버튼 크기 로딩, 토큰 있음 → 마이페이지 */}
          {/* 토큰이 만료돼서 401이 오면 authApi가 토큰을 지우니까 다시 로그인 링크로 바뀜 */}
          {!accessToken ? (
            <>
              <Link to="/login" className="text-sm text-white no-underline">
                로그인
              </Link>
              <Link to="/signup" className="cursor-pointer rounded-md border-none bg-blue-600 px-4 py-2 text-sm text-white">
                회원가입
              </Link>
            </>
          ) : meQuery.isLoading ? (
            <span aria-label="내 정보를 불러오는 중" className="h-9 w-24 animate-pulse rounded-md bg-gray-600" />
          ) : (
            <Link to="/mypage" className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white no-underline">
              마이페이지
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
