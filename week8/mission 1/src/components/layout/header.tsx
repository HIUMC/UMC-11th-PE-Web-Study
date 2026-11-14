import { Link, useLocation } from '@tanstack/react-router'
import { cn } from '@/utils/cn'
import { useQuery } from "@tanstack/react-query";
import { getMe } from "@/api/members/me";
import { useAuthStore } from "@/stores/auth-store";

export function Header() {
  const pathname = useLocation({ select: (location) => location.pathname })
  const accessToken = useAuthStore((state) => state.accessToken);
  const meQuery = useQuery({
    queryKey: ["members", "me"],
    queryFn: ({ signal }) => getMe(signal),
    enabled: Boolean(accessToken),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
  const authLinkClassName =
    "shrink-0 rounded-md bg-[#4f60ee] px-4 py-3 text-xs font-bold text-white hover:bg-[#4052de]";

  return (
    <header className="shrink-0 border-b border-gray-200 bg-white">
      <div className="mx-auto flex min-h-[90px] w-[calc(100%-32px)] max-w-7xl flex-wrap items-center gap-x-5 gap-y-3 py-3 sm:h-[90px] sm:w-[calc(100%-64px)] sm:flex-nowrap sm:gap-11 sm:py-0">
        <Link to="/" className="flex shrink-0 items-center gap-2.5 text-xl font-extrabold tracking-tight" aria-label="UMCine 홈">
          <span className="grid size-8 place-items-center rounded-lg border-2 border-[#191b20]"><img src="/icons/movie-icons/movie.svg" alt="" width={24} height={24} /></span>
          UMCine
        </Link>
        <nav className="order-3 flex basis-full items-center justify-center gap-6 text-sm sm:order-none sm:basis-auto sm:justify-start sm:gap-8" aria-label="주 메뉴">
          <Link to="/" className={cn('underline-offset-4', (pathname === '/' || pathname.startsWith('/movies/')) && 'font-bold underline')}>영화</Link>
          <Link to="/search" search={{}} className={cn('underline-offset-4', pathname === '/search' && 'font-bold underline')}>검색</Link>
          <Link to="/mypage" className={cn('shrink-0 underline-offset-4', pathname.startsWith('/mypage') && 'font-bold underline')}>내 정보</Link>
        </nav>
        <div className="ml-auto flex items-center gap-3">
          <Link to="/search" search={{}} aria-label="영화 검색" className="hidden size-10 place-items-center rounded-lg border border-gray-200 sm:grid"><img src="/icons/movie-icons/search.svg" alt="" width={20} height={20} /></Link>
          {!accessToken ? (
            <Link to="/login" className={authLinkClassName}>
              로그인
            </Link>
          ) : meQuery.isLoading ? (
            <span
              className="h-10 w-24 animate-pulse rounded-lg bg-gray-200"
              role="status"
              aria-label="회원 정보 불러오는 중"
            />
          ) : meQuery.isError ? (
            <button
              type="button"
              onClick={() => void meQuery.refetch()}
              className={authLinkClassName}
            >
              다시 시도
            </button>
          ) : (
            <Link to="/mypage" className={authLinkClassName}>
              마이페이지
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
