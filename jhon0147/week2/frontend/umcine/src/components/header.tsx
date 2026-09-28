export function Header() {
  return (
    <header className="header">
      <div className="header-inner">
        <a className="brand" href="#movie-list-title" aria-label="UMCine 홈">
          <span className="brand-icon" aria-hidden="true">
            <img src="/icons/movie.svg" alt="" />
          </span>
          <span>UMCine</span>
        </a>

        <nav className="navigation" aria-label="주요 메뉴">
          <a className="navigation-link is-active" href="#movie-list-title">
            영화
          </a>
          <a className="navigation-link" href="#upcoming">
            상영 예정
          </a>
          <a className="navigation-link" href="#bookmarks">
            내 영화관
          </a>
        </nav>

        <div className="header-actions">
          <button className="search-button" type="button" aria-label="영화 검색">
            <img src="/icons/search.svg" alt="" />
          </button>
          <button className="login-button" type="button">
            로그인
          </button>
        </div>
      </div>
    </header>
  );
}
