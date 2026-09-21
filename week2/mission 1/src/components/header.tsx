export function Header() {
  return (
    <header className="site-header">
      <div className="header-inner container">
        <a className="brand" href="#movie-list" aria-label="UMCine 영화 목록">
          <span className="brand-mark"><img src="/icons/movie-icons/movie.svg" alt="" width="24" height="24" /></span>
          <span>UMCine</span>
        </a>
        <nav className="main-nav" aria-label="주 메뉴">
          <a href="#movie-list" aria-current="page">영화</a>
          <button type="button" disabled title="검색 기능은 준비 중입니다">검색</button>
          <button type="button" disabled title="내 정보 기능은 준비 중입니다">내 정보</button>
        </nav>
        <div className="header-actions">
          <button className="search-button" type="button" disabled aria-label="영화 검색 (준비 중)">
            <img src="/icons/movie-icons/search.svg" alt="" width="20" height="20" />
          </button>
          <button className="login-button" type="button" disabled title="로그인 기능은 준비 중입니다">로그인</button>
        </div>
      </div>
    </header>
  )
}
