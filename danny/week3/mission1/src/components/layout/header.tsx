import { Link, useRouterState } from "@tanstack/react-router";
import { cn } from "../../utils/cn";

const NAV_ITEMS = [
  { to: "/", label: "영화" },
  { to: "/search", label: "검색" },
] as const;

export function Header() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex h-[90px] max-w-[1312px] items-center justify-between px-4">
        <div className="flex items-center gap-11">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg border-2 border-ink">
              <img src="/icons/movie.svg" alt="" className="h-5 w-5" />
            </span>
            <span className="text-xl font-extrabold text-ink">UMCine</span>
          </Link>
          <nav className="flex items-center gap-8 text-sm font-medium">
            {NAV_ITEMS.map((item) => {
              const isActive =
                item.to === "/"
                  ? pathname === "/" || pathname.startsWith("/movies")
                  : pathname.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "text-ink-muted underline-offset-4",
                    isActive && "font-bold text-ink underline",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
            <span className="text-ink-muted">내 정보</span>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/search"
            aria-label="검색"
            className="flex h-[42px] w-[42px] items-center justify-center rounded-lg border border-border bg-surface"
          >
            <img src="/icons/search.svg" alt="" className="h-6 w-6" />
          </Link>
          <button
            type="button"
            className="h-10 rounded-md bg-brand px-4 text-sm font-bold text-surface transition-colors hover:bg-brand-hover active:bg-brand-pressed"
          >
            로그인
          </button>
        </div>
      </div>
    </header>
  );
}
