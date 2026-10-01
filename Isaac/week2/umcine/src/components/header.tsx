export default function Header() {
  return (
    <header className="header">
      <div className="header-inner">
        <a className="brand" href="#">
          <img
            src="/icons/movie-icons/movie.svg"
            alt=""
          />
          <strong>UMCine</strong>
        </a>

        <nav className="main-nav" aria-label="주요 메뉴">
          <a className="active" href="#">영화</a>
          <a href="#">검색</a>
          <a href="#">내 정보</a>
        </nav>

        <div className="header-actions">
          <button
            type="button"
            className="search-button"
            aria-label="영화 검색"
          >
            <img
              src="/icons/movie-icons/search.svg"
              alt=""
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