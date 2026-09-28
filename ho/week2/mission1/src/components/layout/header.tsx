import { Link, useRouterState } from "@tanstack/react-router";
import { cn } from "../../utils/cn";

const navItems = [
  { label: "영화", to: "/" as const },
  { label: "검색", to: "/search" as const },
];

export function Header() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-8 lg:px-12">
        <div className="flex items-center gap-11">
          <Link to="/" className="flex items-center gap-2.5" aria-label="UMCine 홈">
            <span className="flex size-8 items-center justify-center rounded-lg border-2 border-[#17191d]">
              <img src="/icons/movie.svg" alt="" className="size-5" />
            </span>
            <span className="text-xl font-extrabold tracking-[-0.04em]">UMCine</span>
          </Link>

          <nav aria-label="주요 메뉴">
            <ul className="flex items-center gap-8">
              {navItems.map((item) => {
                const isActive =
                  item.to === "/"
                    ? pathname === "/" || pathname.startsWith("/movies/")
                    : pathname === item.to;

                return (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      className={cn(
                        "text-sm font-medium text-slate-500 transition-colors hover:text-slate-950",
                        isActive &&
                          "font-semibold text-slate-950 underline decoration-1 underline-offset-4",
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
              <li>
                <span className="text-sm font-medium text-slate-500">내 정보</span>
              </li>
            </ul>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/search"
            aria-label="영화 검색"
            className="flex size-11 items-center justify-center rounded-lg border border-slate-200 bg-white transition-colors hover:bg-slate-50"
          >
            <img src="/icons/search.svg" alt="" className="size-5 opacity-60" />
          </Link>
          <button
            type="button"
            className="h-11 rounded-lg bg-blue-600 px-5 text-sm font-bold text-white transition-colors hover:bg-blue-700"
          >
            로그인
          </button>
        </div>
      </div>
    </header>
  );
}
