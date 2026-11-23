import { Link, useLocation } from '@tanstack/react-router'
import { cn } from '../../utils/cn'

const navClass = 'relative inline-flex h-full items-center text-sm no-underline'
const activeClass = "font-bold text-[#181a1f] after:absolute after:right-0 after:bottom-[29px] after:left-0 after:h-px after:bg-current after:content-[''] max-[680px]:after:bottom-5"
const focusClass = 'focus-visible:outline-[3px] focus-visible:outline-[rgba(47,103,232,0.35)] focus-visible:outline-offset-2'

export function Header() {
  const pathname = useLocation({ select: (location) => location.pathname })
  const moviePage = pathname === '/' || pathname.startsWith('/movies/')
  const profilePage = pathname === '/profile' || pathname.startsWith('/profile/')

  return (
    <header className="border-b border-[#e8ebef] bg-white">
      <div className="mx-auto flex h-full w-[calc(100%-48px)] max-w-[1296px] items-center max-[680px]:w-[calc(100%-32px)]">
        <Link className="inline-flex items-center gap-2.5 text-[#181a1f] no-underline" to="/" aria-label="UMCine 홈">
          <span className="grid size-8 place-items-center rounded-[9px] border-2 border-[#20242a]" aria-hidden="true">
            <img className="size-6" src="/icons/movie.svg" alt="" />
          </span>
          <span className="text-xl font-extrabold tracking-[-0.7px] max-[680px]:hidden">UMCine</span>
        </Link>

        <nav className="ml-11 flex h-full items-center gap-[34px] max-[680px]:ml-5" aria-label="주요 메뉴">
          <Link
            className={cn(navClass, moviePage ? activeClass : 'font-semibold text-[#4c535f] max-[680px]:hidden')}
            to="/"
            aria-current={moviePage ? 'page' : undefined}
          >영화</Link>
          <Link
            className={cn(navClass, pathname === '/search' ? activeClass : 'font-semibold text-[#4c535f] max-[680px]:hidden')}
            to="/search"
            search={{ query: '' }}
            aria-current={pathname === '/search' ? 'page' : undefined}
          >검색</Link>
          <Link className={cn(navClass, 'whitespace-nowrap', profilePage ? activeClass : 'font-semibold text-[#4c535f]')}
            to="/profile" aria-current={profilePage ? 'page' : undefined}>내 정보</Link>
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <Link
            className={cn('grid size-[42px] place-items-center rounded-[7px] border border-[#dfe4ea] bg-white hover:bg-[#f7f8fa]', focusClass)}
            to="/search"
            search={{ query: '' }}
            aria-label="영화 검색"
          >
            <img className="size-[22px] opacity-[.68]" src="/icons/search.svg" alt="" />
          </Link>
          <Link className={cn('inline-flex h-[42px] min-w-[70px] items-center justify-center rounded-[7px] bg-[#245feb] px-[17px] text-sm font-bold text-white hover:bg-[#1d52ce]', focusClass)} to="/login">
            로그인
          </Link>
        </div>
      </div>
    </header>
  )
}
