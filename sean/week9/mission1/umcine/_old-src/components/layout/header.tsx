import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getMe } from "@/api/members/me";
import { useAuthStore } from "@/stores/auth-store";

const AUTH_BUTTON_CLASS =
  "inline-flex h-9 items-center rounded-md bg-blue-600 px-4 text-sm font-medium text-white";

export function Header() {
  const accessToken = useAuthStore((state) => state.accessToken);

  const meQuery = useQuery({
    queryKey: ["members", "me"],
    queryFn: getMe,
    enabled: Boolean(accessToken),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  return (
    <header className="mx-auto flex max-w-[1200px] items-center justify-between gap-6 border-b border-neutral-200 px-6 py-4">
      <div className="flex items-center gap-8">
        <Link to="/" className="flex items-center gap-2 text-lg font-bold text-neutral-900">
          <img className="h-6 w-6" src="/icons/movie.svg" alt="" />
          <span>UMCine</span>
        </Link>

        <nav className="flex gap-5 text-[15px] text-neutral-500">
          <a href="#" className="hover:text-neutral-900">영화</a>
          <Link to="/search" className="hover:text-neutral-900">검색</Link>
          <Link to="/my" className="hover:text-neutral-900">내 정보</Link>
        </nav>
      </div>

      <div className="flex items-center gap-3">
        <Link to="/search" aria-label="검색" className="cursor-pointer">
          <img className="block h-5 w-5" src="/icons/search.svg" alt="" />
        </Link>

        {!accessToken ? (
          <Link to="/login" className={AUTH_BUTTON_CLASS}>
            로그인
          </Link>
        ) : meQuery.isLoading ? (
          <span className="h-9 w-[86px] animate-pulse rounded-md bg-neutral-200" />
        ) : (
          <Link to="/my" className={AUTH_BUTTON_CLASS}>
            마이페이지
          </Link>
        )}
      </div>
    </header>
  );
}