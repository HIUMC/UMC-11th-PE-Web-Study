import { Link } from "@tanstack/react-router";

export default function Header() {
  return (
    <header className="header">
      <div className="header-inner">
        <Link className="brand" to="/">
          <img
            src="/icons/movie-icons/movie.svg"
            alt=""
          />
          <strong>UMCine</strong>
        </Link>

        <nav className="main-nav" aria-label="주요 메뉴">
          <Link className="active" to="/">
            영화
          </Link>

          <Link to="/search">
            검색
          </Link>

          {/* <Link to="/profile">
            내 정보
          </Link> */}
        </nav>

        <div className="header-actions">
          <Link
            to="/search"
            className="search-button"
            aria-label="영화 검색"
          >
            <img
              src="/icons/movie-icons/search.svg"
              alt=""
            />
          </Link>

          <button type="button" className="login-button">
            로그인
          </button>
        </div>
      </div>
    </header>
  );
}