const iconPath = "/icons/movie-icons";

export function Header() {
  return (
    <header className="header">
      <nav className="nav" aria-label="주요 메뉴">
        <a className="brand" href="/" aria-label="UMCine 홈">
          <span className="brand-icon">
            <img src={`${iconPath}/movie.svg`} alt="" />
          </span>
          <span>UMCine</span>
        </a>
        <a className="nav-link active" href="/">
          영화
        </a>
        <a className="nav-link" href="/">
          검색
        </a>
        <a className="nav-link" href="/">
          내 정보
        </a>
      </nav>

      <div className="actions">
        <button className="icon-button" type="button" aria-label="검색">
          <img src={`${iconPath}/search.svg`} alt="" />
        </button>
        <button className="login-button" type="button">
          로그인
        </button>
      </div>
    </header>
  );
}
