export default function Header() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <a className="site-header__brand" href="#movie-list">
          <span className="site-header__brand-icon">
            <img src="/icons/movie.svg" alt="" />
          </span>
          <span>UMCine</span>
        </a>

        <nav className="site-header__nav" aria-label="주 메뉴">
          <a href="#movie-list" aria-current="page">
            영화
          </a>
          <span>검색</span>
          <span>내 정보</span>
        </nav>

        <div className="site-header__actions">
          <span className="site-header__search-icon">
            <img src="/icons/search.svg" alt="" />
          </span>
          <span className="site-header__login">로그인</span>
        </div>
      </div>
    </header>
  );
}