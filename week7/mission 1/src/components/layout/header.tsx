import { Link, useLocation } from '@tanstack/react-router'
import { cn } from '@/utils/cn'

export function Header() {
  const pathname = useLocation({ select: (location) => location.pathname })
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
          <Link to="/login" className="shrink-0 rounded-md bg-[#4f60ee] px-4 py-3 text-xs font-bold text-white hover:bg-[#4052de]">로그인</Link>
        </div>
      </div>
    </header>
  )
}
