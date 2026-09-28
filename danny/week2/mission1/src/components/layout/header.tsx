import "./header.css";

export function Header() {
  return (
    <header className="header">
      <div className="header__inner">
        <div className="header__left">
          <div className="header__brand">
            <span className="header__logo">
              <img src="/icons/movie.svg" alt="" />
            </span>
            <span className="header__brand-name">UMCine</span>
          </div>
          <nav className="header__nav">
            <span className="header__nav-item--active">영화</span>
            <span className="header__nav-item--inactive">검색</span>
            <span className="header__nav-item--inactive">내 정보</span>
          </nav>
        </div>

        <div className="header__right">
          <button type="button" aria-label="검색" className="header__search-button">
            <img src="/icons/search.svg" alt="" />
          </button>
          <button type="button" className="header__login-button">
            로그인
          </button>
        </div>
      </div>
    </header>
  );
}
