import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getMovies } from "@/api/movies/get-movies";
import { MovieGrid } from "@/components/movies/movie-grid";
import { Pagination } from "@/components/movies/pagination";

function AvatarIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20a8 8 0 0 1 16 0z" />
    </svg>
  );
}

// 8주차에 로그인 연동하면서 실제 회원 정보로 교체
const MOCK_MEMBER = {
  nickname: "gs0428",
  email: "gwangsoo@cinemalab.kr",
};

export function MyPage() {
  // 즐겨찾기 API는 8주차 예정이라, 화면 확인용으로 인기 영화 일부를 보여줘요
  const favoritesQuery = useQuery({
    queryKey: ["movies", "list", { page: 1 }],
    queryFn: () => getMovies({ page: 1 }),
  });

  const favorites = favoritesQuery.data?.results.slice(0, 3) ?? [];

  return (
    <main className="min-h-[calc(100vh-73px)] bg-[#f5f6f8] pb-20">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="flex items-center justify-between pt-10 pb-6">
          <h1 className="text-[32px] font-bold text-neutral-900">내 정보</h1>
          <Link
            to="/my/edit"
            className="inline-flex items-center rounded-md bg-blue-600 px-5 py-3 text-sm font-bold text-white"
          >
            정보 수정
          </Link>
        </div>

        <section className="border-t border-neutral-200 py-8">
          <h2 className="text-base font-bold text-neutral-900">기본 정보</h2>

          <div className="mt-6 flex items-center gap-8">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-neutral-200">
              <AvatarIcon className="h-10 w-10 text-neutral-500" />
            </div>

            <dl className="grid max-w-[720px] flex-1 grid-cols-2 gap-x-10">
              <div>
                <dt className="text-sm text-neutral-400">닉네임</dt>
                <dd className="mt-1.5 text-base font-bold text-neutral-900">
                  {MOCK_MEMBER.nickname}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-neutral-400">이메일</dt>
                <dd className="mt-1.5 text-base font-bold text-neutral-900">
                  {MOCK_MEMBER.email}
                </dd>
              </div>
            </dl>
          </div>
        </section>

        <section className="border-t border-neutral-200 py-8">
          <h2 className="text-base font-bold text-neutral-900">내 즐겨찾기</h2>

          {favoritesQuery.isPending ? (
            <p className="py-20 text-center text-neutral-500">불러오는 중이에요.</p>
          ) : favorites.length === 0 ? (
            <p className="py-20 text-center text-neutral-500">즐겨찾기한 영화가 없어요.</p>
          ) : (
            <>
              <div className="mt-5">
                <MovieGrid movies={favorites} />
              </div>
              <Pagination page={1} totalPages={1} onPageChange={() => {}} />
            </>
          )}
        </section>
      </div>
    </main>
  );
}