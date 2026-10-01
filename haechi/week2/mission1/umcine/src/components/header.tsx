import "../styles/header.css";

const NAV_ITEMS = [
  { label: "영화", href: "/" },
  { label: "검색", href: "/search" },
  { label: "내 정보", href: "/my" },
];

interface HeaderProps {
  activePath: string;
}

export default function Header({ activePath }: HeaderProps) {
  return (
    <header className="header">
      <div className="header__left">
        <a className="header__brand" href="/">
          <span className="header__mark">
            <img src="/icons/movie.svg" alt="" width={24} height={24} />
          </span>
          <span className="header__logo-text">UMCine</span>
        </a>

        <nav aria-label="주요 메뉴">
          <ul className="header__nav">
            {NAV_ITEMS.map((item) => {
              const isActive = item.href === activePath;
              return (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className={isActive ? "header__nav-link header__nav-link--active" : "header__nav-link"}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      <div className="header__actions">
        <button type="button" className="header__search" aria-label="영화 검색">
          <img src="/icons/search.svg" alt="" width={24} height={24} />
        </button>
        <button type="button" className="header__login">
          로그인
        </button>
      </div>
    </header>
  );
}
