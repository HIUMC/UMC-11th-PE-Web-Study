export default function Header() {
  return (
    <header className="header">
      <div className="header__inner">
        <a className="header__logo" href="/">UMC<span>ine</span></a>
        <nav className="header__nav">
          <button type="button" className="header__link">로그인</button>
          <button type="button" className="header__link header__link--primary">회원가입</button>
        </nav>
      </div>
    </header>
  );
}
