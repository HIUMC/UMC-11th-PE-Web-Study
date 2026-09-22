import { Icon } from './icon'

export function Header({ path, loggedIn }: { path: string; loggedIn: boolean }) {
  const section = path.startsWith('/search') ? 'search' : path.startsWith('/profile') ? 'profile' : path === '/' || path.startsWith('/movies') ? 'movies' : ''
  return <header className="site-header"><div className="header-inner">
    <div className="brand-row">
      <a className="brand" href="#/" aria-label="UMCine 홈"><span className="brand-mark"><Icon name="movie" /></span><span>UMCine</span></a>
      <nav className="main-nav" aria-label="주요 메뉴">
        <a href="#/" aria-current={section === 'movies' ? 'page' : undefined}>영화</a>
        <a href="#/search" aria-current={section === 'search' ? 'page' : undefined}>검색</a>
        <a href="#/profile" aria-current={section === 'profile' ? 'page' : undefined}>내 정보</a>
      </nav>
    </div>
    <div className="top-actions"><a className="icon-button" href="#/search" aria-label="영화 검색"><Icon name="search" /></a>
      <a className="button primary" href={loggedIn ? '#/profile' : '#/login'}>{loggedIn ? '마이페이지' : '로그인'}</a>
    </div>
  </div></header>
}
