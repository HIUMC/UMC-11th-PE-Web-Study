import { Link } from "@tanstack/react-router";
import { useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../../stores/auth-store";

function Header() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isAuthenticated = useAuthStore((state) => Boolean(state.accessToken));
  const clearAccessToken = useAuthStore((state) => state.clearAccessToken);

  function handleAuthAction() {
    clearAccessToken();
    queryClient.clear();
    void navigate({ to: "/login" });
  }

  return (
    <header className="flex h-14 w-full items-center justify-between gap-4 border-b border-border-default bg-bg-surface px-4 sm:px-6 lg:px-10 xl:px-20">
      <div className="flex min-w-0 items-center gap-6">
        <Link
          className="flex shrink-0 items-center gap-2"
          to="/"
          aria-label="UMCine 홈"
        >
          <span className="flex size-7 items-center justify-center rounded-md border-2 border-text-primary">
            <img className="size-5" src="/icons/movie.svg" alt="" />
          </span>
          <span className="text-lg leading-6 font-black tracking-tight text-text-primary">
            UMCine
          </span>
        </Link>

        <nav className="hidden items-center gap-5 md:flex" aria-label="주 메뉴">
          <Link
            className="text-xs font-bold text-text-secondary hover:text-text-primary"
            to="/"
          >
            영화
          </Link>
          <Link
            className="text-xs font-bold text-text-secondary hover:text-text-primary"
            to="/search"
          >
            검색
          </Link>
          <Link
            className="text-xs font-bold text-text-secondary hover:text-text-primary"
            to="/my-info"
          >
            내 정보
          </Link>
        </nav>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <Link
          className="flex size-8 items-center justify-center rounded-md border border-border-default bg-bg-surface"
          to="/search"
          aria-label="영화 검색"
        >
          <img className="size-5" src="/icons/search.svg" alt="" />
        </Link>
        {isAuthenticated ? (
          <Link to="/my-info" aria-label="내 정보" className="flex size-8 items-center justify-center md:hidden">
            <img className="size-5" src="/icons/person.svg" alt="" />
          </Link>
        ) : null}
        {isAuthenticated ? (
          <button
            className="flex h-8 items-center justify-center rounded-md bg-action-primary px-3 text-xs font-extrabold text-bg-surface transition-colors hover:bg-action-primary-hover"
            type="button"
            onClick={handleAuthAction}
          >
            로그아웃
          </button>
        ) : (
          <Link
            className="flex h-8 items-center justify-center rounded-md bg-action-primary px-3 text-xs font-extrabold text-bg-surface transition-colors hover:bg-action-primary-hover"
            to="/login"
          >
            로그인
          </Link>
        )}
      </div>
    </header>
  );
}

export default Header;