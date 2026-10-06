import { Link } from "@tanstack/react-router";

export default function Header() {
  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-left">
          <strong className="logo">🎞 UMCine</strong>

          <nav className="nav">
            <Link to="/">영화</Link>
            <Link to="/search">검색</Link>
            <span>내 정보</span>
          </nav>
        </div>

        <div className="header-right">
          <Link
            to="/search"
            className="search-button"
            aria-label="영화 검색"
          >
            ⌕
          </Link>
          <button type="button" className="login-button">
            로그인
          </button>
        </div>
      </div>
    </header>
  );
}