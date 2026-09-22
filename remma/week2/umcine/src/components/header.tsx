export default function Header() {
  return (
    <header className="header">
      <div className="header-left">
        <div className="logo">
          <img src="/icons.svg" alt="UMCine Logo" width="24" />
          <span>UMCine</span>
        </div>
        <nav className="nav-links">
          <a href="#" className="active">영화</a>
          <a href="#">검색</a>
          <a href="#">내 정보</a>
        </nav>
      </div>
      <div className="header-right">
        <button className="search-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </button>
        <button className="login-btn">로그인</button>
      </div>
    </header>
  );
}