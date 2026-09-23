export default function Header() {
  return (
    <header className="header">
      <div className="header-logo">
        <img src="/icons/movie.svg" alt="" />
        <span>UMCine</span>
      </div>
      <nav className="header-nav">
        <a href="#">영화</a>
        <a href="#">검색</a>
        <a href="#">내 정보</a>
      </nav>
      <div className="header-actions">
        <button className="icon-button" aria-label="검색">
          <img src="/icons/search.svg" alt="" />
        </button>
        <button className="login-button">로그인</button>
      </div>
    </header>
  );
}
