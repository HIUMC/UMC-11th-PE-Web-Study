function Header() {
  return (
    <header className="site-header">
      <a className="brand" href="/" aria-label="UMCine 홈">
        <img className="brand-logo" src="/images/logos/tmdb-logo.svg" alt="" />
        <span className="brand-name">UMCine</span>
      </a>
      <nav className="main-nav" aria-label="주요 메뉴">
        <a className="active" href="#movies">영화</a>
        <a href="#bookmarks">내가 찜한 영화</a>
      </nav>
      
      <div className="header-actions">
        <button className="icon-button" type="button" aria-label="영화 검색">
          <img src="/icons/search.svg" alt="" />
        </button>
        <button className="profile-button" type="button" aria-label="프로필 메뉴">
          <img src="/icons/person.svg" alt="" />
        </button>
      </div>
    </header>
  );
}

export default Header;
