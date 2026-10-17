import { Link, useLocation } from "@tanstack/react-router";
import { cn } from "../../utils/cn";

const menus = [
  { to: "/", label: "영화" },
  { to: "/search", label: "검색" },
] as const;

export default function Header() {
  const pathname = useLocation({ select: (location) => location.pathname });

  function isActive(to: "/" | "/search") {
    if (to === "/") return pathname === "/" || pathname.startsWith("/movies");
    return pathname.startsWith(to);
  }

  return (
    <header className="sticky top-0 z-10 border-b border-[#262626] bg-[#141414]/92 backdrop-blur">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-4">
        <Link to="/" className="text-2xl font-extrabold text-[#b2dab1]">
          UMC<span className="text-[#f5f5f5]">ine</span>
        </Link>
        <nav className="flex items-center gap-1">
          {menus.map((menu) => {
            const active = isActive(menu.to);
            return (
              <Link
                key={menu.to}
                to={menu.to}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-lg px-3 py-2 text-[15px] font-semibold",
                  active
                    ? "bg-[#b2dab1]/15 text-[#b2dab1]"
                    : "text-[#a0a0a0] hover:text-[#f5f5f5]",
                )}
              >
                {menu.label}
              </Link>
            );
          })}
          <div className="ml-2 hidden gap-2 sm:flex">
            <button type="button" className="rounded-lg px-4 py-2 text-[15px] text-[#f5f5f5]">
              로그인
            </button>
            <button type="button" className="rounded-lg bg-[#b2dab1] px-4 py-2 text-[15px] font-bold text-[#141414]">
              회원가입
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}
