export default function Header() {
  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-left">
          <strong className="logo">🎞 UMCine</strong>

          <nav className="nav">
            <a href="/">영화</a>
            <a href="/">검색</a>
            <a href="/">내 정보</a>
          </nav>
        </div>

        <div className="header-right">
          <button className="search-button">⌕</button>
          <button className="login-button">로그인</button>
        </div>
      </div>
    </header>
  );
}