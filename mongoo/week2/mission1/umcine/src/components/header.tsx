export default function Header() {
  return (
    <header className="header">
      <div className="header-inner">
        <div className="logo">
          <div className="logo-icon">
            ▥
          </div>
          <span>UMCine</span>
        </div>

        <nav className="navigation">
          <a className="active" href="#">
            영화
          </a>
          <a href="#">검색</a>
          <a href="#">내 정보</a>
        </nav>

        <div className="header-actions">
          <button className="search-button" aria-label="검색">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="11"
                cy="11"
                r="6.5"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M16 16L21 21"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>

          <button className="login-button">
            로그인
          </button>
        </div>
      </div>
    </header>
  );
}