export default function Header() {
  return (
    <header className="header">
      <div className="header-left">
      <a href="/" className="logo">
        <span className="logo-icon-box">
        <img
          src="/icons/movie-icons/movie.svg"
          alt=""
        />
        </span>

        <strong>UMCine</strong>
      </a>

        <nav className="header-nav">
          <a href="/">영화</a>
          <a href="/">검색</a>
          <a href="/">내 정보</a>
        </nav>
      </div>

      <div className="header-right">
        <button type="button" className="search-button" aria-label="검색">
          <img src="/icons/movie-icons/search.svg" alt="" />
        </button>

        <button type="button" className="login-button">
          로그인
        </button>
      </div>
    </header>
  );
}