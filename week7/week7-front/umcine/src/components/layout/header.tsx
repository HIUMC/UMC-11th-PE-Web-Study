import { Link } from "@tanstack/react-router";

export function Header() {
  return (
    <header className="site-header">
      <Link className="brand" to="/" aria-label="UMCine 홈">
        <img className="brand-logo" src="/images/logos/tmdb-logo.svg" alt="" />
        <span className="brand-name">UMCine</span>
      </Link>
      <nav className="main-nav" aria-label="주요 메뉴">
        <Link to="/" activeProps={{ className: "active" }} activeOptions={{ exact: true }}>
          영화
        </Link>
        <Link to="/search" activeProps={{ className: "active" }}>
          검색
        </Link>
      </nav>
      <div className="header-actions">
        <Link className="icon-button" to="/search" aria-label="영화 검색">
          <img src="/icons/search.svg" alt="" />
        </Link>
        <Link className="login-link" to="/login" activeProps={{ className: "active" }}>
          로그인
        </Link>
        <Link className="profile-button" to="/my" aria-label="내 정보">
          <img src="/icons/person.svg" alt="" />
        </Link>
      </div>
    </header>
  );
}
