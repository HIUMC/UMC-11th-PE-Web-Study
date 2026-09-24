export default function Header() {
  return (
    <header className="header">
      <div className="header-container">
        <div className="header-left">
          <a href="/" className="logo-link">
            <img
              src="/icons/movie.svg"
              alt="UMCine 로고"
              className="logo-icon"
            />
            <span className="logo-text">UMCine</span>
          </a>

          <nav className="nav-menu">
            <a href="#movies" className="nav-item">
              영화
            </a>
            <a href="#search" className="nav-item">
              검색
            </a>
            <a href="#my" className="nav-item">
              내 정보
            </a>
          </nav>
        </div>

        <div className="header-right">
          <button type="button" className="icon-button" aria-label="검색">
            <img
              src="/icons/search.svg"
              alt="검색 아이콘"
              className="search-icon"
            />
          </button>
          <button type="button" className="login-button">
            로그인
          </button>
        </div>
      </div>
    </header>
  );
}