interface HeaderProps {
  isLoggedIn: boolean;
}

export default function Header({ isLoggedIn }: HeaderProps) {
  return (
    <header>
      <div className="header__left">
        <a href="#" className="header__logo">
          <img src="/icons/movie.svg" alt="" />
          <span>UMCine</span>
        </a>
        <nav className="header__nav">
          <a href="#">영화</a>
          <a href="#">검색</a>
          <a href="#">내 정보</a>
        </nav>
      </div>

      <div className="header__right">
        <button className="header__search" type="button">
          <img
          src="/icons/search.svg"
          alt=""
          />
        </button>
        <button className="header__login" type="button">{isLoggedIn ? "마이페이지" : "로그인"}</button>
      </div>
    </header>
  );
}
