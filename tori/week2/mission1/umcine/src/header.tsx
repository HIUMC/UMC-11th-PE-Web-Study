import "./header.css";
 
export default function Header() {
  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-left">
          <a className="logo" href="#">
            <img className="logo-icon" src="/icons/movie.svg" alt="" />
            <span className="logo-text">UMCine</span>
          </a>
          <nav className="nav">
            <a className="nav-link nav-link-active" href="#">
              영화
            </a>
            <a className="nav-link" href="#">
              검색
            </a>
            <a className="nav-link" href="#">
              내 정보
            </a>
          </nav>
        </div>
        <div className="header-right">
          <button type="button" className="search-button" aria-label="검색">
            <img src="/icons/search.svg" alt="" />
          </button>
          <button type="button" className="login-button">
            로그인
          </button>
        </div>
      </div>
    </header>
  );
}