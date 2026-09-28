import { Link, useLocation } from '@tanstack/react-router'
import { cn } from '../../utils/cn'

export function Header() {
  const pathname = useLocation({ select: (location) => location.pathname })
  return (
    <header className="shrink-0 border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-[90px] w-[calc(100%-32px)] max-w-7xl items-center gap-5 sm:w-[calc(100%-64px)] sm:gap-11">
        <Link to="/" className="flex shrink-0 items-center gap-2.5 text-xl font-extrabold tracking-tight" aria-label="UMCine 홈">
          <span className="grid size-8 place-items-center rounded-lg border-2 border-[#191b20]"><img src="/icons/movie-icons/movie.svg" alt="" width={24} height={24} /></span>
          UMCine
        </Link>
        <nav className="flex items-center gap-4 text-sm sm:gap-8" aria-label="주 메뉴">
          <Link to="/" className={cn('underline-offset-4', pathname !== '/search' && 'font-bold underline')}>영화</Link>
          <Link to="/search" search={{}} className={cn('underline-offset-4', pathname === '/search' && 'font-bold underline')}>검색</Link>
          <button type="button" disabled title="내 정보 기능은 준비 중입니다" className="hidden text-gray-500 sm:block">내 정보</button>
        </nav>
        <div className="ml-auto flex items-center gap-3">
          <Link to="/search" search={{}} aria-label="영화 검색" className="hidden size-10 place-items-center rounded-lg border border-gray-200 sm:grid"><img src="/icons/movie-icons/search.svg" alt="" width={20} height={20} /></Link>
          <button type="button" disabled title="로그인 기능은 준비 중입니다" className="rounded-md bg-[#4f60ee] px-4 py-3 text-xs font-bold text-white">로그인</button>
        </div>
      </div>
    </header>
  )
}
