import { Link, useLocation } from "@tanstack/react-router";
import { cn } from "../../utils/cn";

const NAV_ITEMS = [
  { label: "영화", to: "/" },
  { label: "검색", to: "/search" },
] as const;

export function Header() {
  const pathname = useLocation({ select: (location) => location.pathname });

  return (
    <header className="flex items-center justify-between border-b border-line bg-surface px-4 py-6 md:px-10 xl:px-20">
      <div className="flex items-center gap-6 md:gap-[42px]">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-lg border-2 border-ink">
            <img src="/icons/movie.svg" alt="" width={24} height={24} />
          </span>
          <span className="text-xl font-black tracking-[-0.7px]">UMCine</span>
        </Link>

        <nav aria-label="주요 메뉴">
          <ul className="flex items-center gap-5 md:gap-[30px]">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.to;
              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "text-sm font-bold",
                      isActive ? "text-ink underline" : "text-ink-secondary",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
            <li>
              {/* 내 정보 화면은 이후 주차에서 route를 추가해요. */}
              <a href="/my" className="text-sm font-bold text-ink-secondary">
                내 정보
              </a>
            </li>
          </ul>
        </nav>
      </div>

      <div className="flex items-center gap-2.5">
        <Link
          to="/search"
          aria-label="영화 검색"
          className="flex size-[42px] items-center justify-center rounded-lg border border-line bg-surface"
        >
          <img src="/icons/search.svg" alt="" width={24} height={24} />
        </Link>
        <button
          type="button"
          className="h-[42px] rounded-lg border border-surface bg-primary px-4 text-sm font-extrabold text-surface"
        >
          로그인
        </button>
      </div>
    </header>
  );
}
