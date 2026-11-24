import Link from "next/link";

export default function Header() {
  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-left">
          <strong className="logo">🎞 UMCine</strong>

          <nav className="nav">
            <Link href="/">영화</Link>
            <Link href="/search">검색</Link>
            <span>내 정보</span>
          </nav>
        </div>

        <div className="header-right">
          <Link
            href="/search"
            className="search-button"
            aria-label="영화 검색"
          >
            ⌕
          </Link>
          <button type="button" className="login-button">
            로그인
          </button>
        </div>
      </div>
    </header>
  );
}
