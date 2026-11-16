import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getMe } from "../../api/members/me";
import { useAuthStore } from "../../stores/auth-store";

const navLinkClass =
  "text-[13px] font-medium text-[#4b5563] [&.active]:font-bold [&.active]:text-[#171717] [&.active]:underline [&.active]:underline-offset-4";

const accountLinkClass =
  "flex h-[34px] items-center justify-center rounded-[5px] bg-[#2563eb] px-3 text-xs font-semibold text-white";

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
    <header className="h-[72px] shrink-0 border-b border-[#e5e7eb] bg-white">
      <div className="page-container flex h-full items-center">
        <Link
          to="/"
          className="flex shrink-0 items-center gap-[9px] text-lg font-bold text-[#171717]"
        >
          <img
            src="/icons/movie.svg"
            alt=""
            className="h-[26px] w-[26px]"
          />
          UMCine
        </Link>

        <nav className="ml-5 flex items-center gap-4 sm:ml-[38px] sm:gap-[27px]">
          <Link
            to="/"
            activeOptions={{ exact: true }}
            className={navLinkClass}
          >
            영화
          </Link>

          <Link to="/search" className={navLinkClass}>
            검색
          </Link>

          <Link
            to="/mypage"
            className={`${navLinkClass} hidden sm:inline`}
          >
            내 정보
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-[9px] pl-3">
          <Link
            to="/search"
            aria-label="영화 검색"
            className="flex h-[34px] w-[34px] items-center justify-center rounded-[7px] border border-[#dfe3e8] bg-white"
          >
            <img
              src="/icons/search.svg"
              alt=""
              className="h-4 w-4"
            />
          </Link>

          {!accessToken ? (
            <Link to="/login" className={accountLinkClass}>
              로그인
            </Link>
          ) : meQuery.isLoading ? (
            <span
              role="status"
              aria-label="내 정보 확인 중"
              className="h-[34px] w-24 animate-pulse rounded-[5px] bg-gray-200"
            />
          ) : (
            <Link to="/mypage" className={accountLinkClass}>
              마이페이지
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}