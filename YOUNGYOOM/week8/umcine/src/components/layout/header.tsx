import { Link } from "@tanstack/react-router";
import { cn } from "../../utils/cn";

import { useQuery } from "@tanstack/react-query";
import { getMe } from "../../api/members/me";
import { useAuthStore } from "../../stores/auth-store";

export function Header() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const meQuery = useQuery({
    //로그인 훅에서 invalidateQueries에 전달하는 키와 동일하게 설정
    queryKey: ["members", "me"],
    queryFn: getMe,
    enabled: Boolean(accessToken), //토큰 있을때만 내정보 요청
    staleTime: 5 * 50 * 1000, //내 정보는 자주 바뀌지 않으니까 5분으로 설정
    retry: false, //같은 조회를 자동 재시도 하지 않도록 retry를 끔
  });

  return (
    <header className="flex items-center gap-10.5 py-4 border-b bg-white px-20">
      <Link to="/" search={{ page: 1 }} className="flex items-center gap-2">
        <div className="rounded-lg p-1.5 border-2">
          <img src="/icons/movie.svg" alt="영화" />
        </div>
        <h1 className="font-bold text-xl">UMCine</h1>
      </Link>
      <div className="flex items-center flex-1 justify-between">
        <div className="flex items-center gap-7.5">
          <Link
            to="/"
            search={{ page: 1 }}
            activeProps={{ className: "underline underline-offset-4" }}
            activeOptions={{ exact: true }}
          >
            영화
          </Link>

          <Link
            to="/search"
            className={cn("text-gray-600 transition-colors hover:text-black")}
            activeProps={{ className: "underline underline-offset-4" }}
            activeOptions={{ exact: true }}
          >
            검색
          </Link>
          <Link
            to="/mypage"
            className={cn("text-gray-600 transition-colors hover:text-black")}
            activeProps={{ className: "underline underline-offset-4" }}
            activeOptions={{ exact: true }}
          >
            내 정보
          </Link>
        </div>
        <div className="flex gap-3">
          <Link
            to="/search"
            className="bg-white border border-[#E3E6EB] flex items-center justify-center w-10 h-10 rounded-xl"
          >
            <img src={"/icons/search.svg"} />
          </Link>
          {!accessToken ? (
            <Link
              to="/login"
              className="bg-[#2563EB] border border-white flex items-center justify-center px-4 rounded-xl text-white font-semibold"
            >
              로그인
            </Link>
          ) : meQuery.isLoading ? ( //첫 조회 중인 상태인가?
            <span className="h-10 w-24 animate-pulse rounded-lg bg-gray-200" />
          ) : (
            <Link
              to="/mypage"
              className="bg-[#2563EB] border border-white flex items-center justify-center px-4 rounded-xl text-white font-semibold"
            >
              마이페이지
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
