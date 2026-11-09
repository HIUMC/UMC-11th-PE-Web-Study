export default function Header() {
  return (
    <header className="header">
      <div className="header-inner">
        <a href="#" className="logo">
          <img src="/icons/movie.svg" alt="" className="logo-icon" />
          <span>UMCine</span>
        </a>
        <nav className="nav">
          <a href="#" className="nav-link active">영화</a>
          <a href="#" className="nav-link">검색</a>
          <a href="#" className="nav-link">내 정보</a>
        </nav>
        <div className="header-actions">
          <button type="button" className="icon-button" aria-label="검색">
            <img src="/icons/search.svg" alt="" />
          </button>
          <button type="button" className="login-button">로그인</button>
        </div>
      </div>
    </header>
  );
}