import "./header.css";

interface HeaderProps {
  isLoggedIn: boolean;
}

const NAV_ITEMS = [
  { label: "영화", href: "/", isActive: true },
  { label: "검색", href: "/search", isActive: false },
  { label: "내 정보", href: "/me", isActive: false },
];

export default function Header({ isLoggedIn }: HeaderProps) {
  return (
    <header className="header">
      <div className="container header-inner">
        <div className="header-left">
          <a href="/" className="header-logo">
            <span className="header-logo-box">
              <span
                className="icon"
                style={{ "--icon": "url(/icons/movie.svg)" } as React.CSSProperties}
              />
            </span>
            UMCine
          </a>
          <nav>
            <ul className="header-nav">
              {NAV_ITEMS.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className={`header-nav-link${item.isActive ? " is-active" : ""}`}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="header-right">
          <button type="button" className="header-search" aria-label="검색">
            <span
              className="icon"
              style={{ "--icon": "url(/icons/search.svg)" } as React.CSSProperties}
            />
          </button>
          <button type="button" className="header-auth">
            {isLoggedIn ? "마이페이지" : "로그인"}
          </button>
        </div>
      </div>
    </header>
  );
}
