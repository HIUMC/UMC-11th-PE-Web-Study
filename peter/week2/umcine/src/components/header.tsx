export default function Header() {
    return (
        <header className="topbar">
            <div className="brand-row">
                <div className="brand">
                    <span className="brand-mark">
                        <img
                          src="/icons/movie-icons/movie.svg"
                          alt=""
                          className="brand-icon"
                        />
                    </span>
                    <span className="brand-name">UMCine</span>
                </div>

                <nav className="main-nav">
                    <a href="#" className="nav-item nav-item--active">
                        영화
                    </a>
                    <a href="#" className="nav-item">
                        검색
                    </a>
                    <a href="#" className="nav-item">
                        내 정보
                    </a>
                </nav>
            </div>

            <div className="top-actions">
                <button
                  type="button"
                  className="search-button"
                  aria-label="영화 검색"
                >
                  <img
                    src="/icons/movie-icons/search.svg"
                    alt=""
                    className="search-icon"
                  />
                </button>

                <button type="button" className="login-button">
                  로그인
                </button>
            </div>
        </header>
    );
}