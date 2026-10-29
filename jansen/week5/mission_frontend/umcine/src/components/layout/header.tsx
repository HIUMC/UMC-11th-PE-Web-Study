import { Link } from "@tanstack/react-router";
import { LogoIcon, SearchIcon } from "../icons";

const navItemClass = "text-sm text-muted";
const activeNavProps = {
  className: "font-semibold text-ink underline underline-offset-4",
};

export default function Header() {
  return (
    <header className="flex items-center justify-between border-b border-line bg-white px-20 py-6">
      <div className="flex items-center gap-10">
        <Link to="/" className="flex items-center gap-2.5 text-xl font-extrabold">
          <LogoIcon className="size-8" />
          UMCine
        </Link>

        <nav className="flex gap-6">
          <Link
            to="/"
            activeOptions={{ exact: true }}
            activeProps={activeNavProps}
            className={navItemClass}
          >
            영화
          </Link>
          <Link to="/search" activeProps={activeNavProps} className={navItemClass}>
            검색
          </Link>
          <span className={navItemClass}>내 정보</span>
        </nav>
      </div>

      <div className="flex items-center gap-2.5">
        <Link
          to="/search"
          aria-label="검색"
          className="flex size-[42px] items-center justify-center rounded-lg border border-line bg-white"
        >
          <SearchIcon className="size-5" />
        </Link>
        <button
          type="button"
          className="h-[42px] rounded-lg border border-white bg-brand px-4 text-sm font-semibold text-white"
        >
          로그인
        </button>
      </div>
    </header>
  );
}