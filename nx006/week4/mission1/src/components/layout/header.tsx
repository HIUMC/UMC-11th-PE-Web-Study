import { Link, useRouterState } from '@tanstack/react-router'
import { Icon } from '../icon'

export function Header({ loggedIn }: { loggedIn: boolean }) {
  const path = useRouterState({ select: state => state.location.pathname })
  const section = path === '/search' ? 'search' : path.startsWith('/profile') ? 'profile' : path === '/' || path.startsWith('/movies/') ? 'movies' : ''
  const navClass = (active: boolean) => `text-sm font-bold ${active ? 'text-[#17191e] underline underline-offset-4' : 'text-[#606774]'}`
  return <header className="shrink-0 border-b border-[#e3e6eb] bg-white"><div className="mx-auto flex min-h-[90px] w-full max-w-[1440px] flex-wrap items-center justify-between gap-x-6 gap-y-3 px-5 py-4 md:px-8 xl:px-20">
    <div className="contents items-center gap-[42px] min-[701px]:flex">
      <Link to="/" aria-label="UMCine 홈" className="order-1 flex items-center gap-2.5 text-xl font-black tracking-[-0.7px] min-[701px]:order-none"><span className="grid size-8 place-items-center rounded-lg border-2 border-[#17191e]"><Icon name="movie" /></span>UMCine</Link>
      <nav aria-label="주요 메뉴" className="order-3 flex w-full gap-7 whitespace-nowrap min-[701px]:order-none min-[701px]:w-auto min-[701px]:gap-[30px]">
        <Link className={navClass(section === 'movies')} to="/">영화</Link><Link className={navClass(section === 'search')} to="/search" search={{}}>검색</Link><Link className={navClass(section === 'profile')} to="/profile">내 정보</Link>
      </nav>
    </div>
    <div className="order-2 flex gap-2.5 min-[701px]:order-none"><Link to="/search" search={{}} aria-label="영화 검색" className="grid size-[42px] place-items-center rounded-lg border border-[#e3e6eb]"><Icon name="search" /></Link>
      <Link to={loggedIn ? '/profile' : '/login'} className="inline-flex h-[42px] items-center justify-center whitespace-nowrap rounded-lg bg-[#2563eb] px-4 text-sm font-extrabold text-white">{loggedIn ? '마이페이지' : '로그인'}</Link>
    </div>
  </div></header>
}
