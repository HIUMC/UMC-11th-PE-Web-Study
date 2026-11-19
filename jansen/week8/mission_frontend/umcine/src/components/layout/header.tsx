import { Link } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useMeQuery } from "@/hooks/use-me-query";
import { useAuthStore } from "@/stores/auth-store";
import { LogoIcon, SearchIcon } from "../icons";

const navItemClass = "text-sm text-muted";
const activeNavProps = {
  className: "font-semibold text-ink underline underline-offset-4",
};

export default function Header() {
  const queryClient = useQueryClient();
  const accessToken = useAuthStore((state) => state.accessToken);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const { data: me, isLoading } = useMeQuery();

  const handleLogout = () => {
    setAccessToken(null);
    queryClient.removeQueries({ queryKey: ["members", "me"] });
  };

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
          <Link to="/my" activeProps={activeNavProps} className={navItemClass}>
            내 정보
          </Link>
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
        {!accessToken ? (
          <Link
            to="/login"
            className="flex h-[42px] items-center rounded-lg border border-white bg-brand px-4 text-sm font-semibold text-white"
          >
            로그인
          </Link>
        ) : isLoading ? (
          <div className="h-[42px] w-28 animate-pulse rounded-lg bg-gray-200" />
        ) : (
          <>
            <Link
              to="/my"
              className="flex h-[42px] items-center rounded-lg border border-line bg-white px-4 text-sm font-semibold text-ink"
            >
              {me?.nickname ?? "마이페이지"}
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="h-[42px] rounded-lg border border-line bg-white px-4 text-sm text-muted"
            >
              로그아웃
            </button>
          </>
        )}
      </div>
    </header>
  );
}