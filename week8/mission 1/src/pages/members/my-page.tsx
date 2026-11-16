import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useQueries } from "@tanstack/react-query";
import { AccountLayout } from "@/components/layout/account-layout";
import { ProfileAvatar } from "@/components/members/profile-avatar";
import { MovieCard } from "@/components/movies/movie-card";
import { Pagination } from "@/components/movies/pagination";
import { useMemberProfile } from "@/hooks/use-member-profile";
import { useBookmarks } from "@/hooks/use-favorites";
import { FavoriteFeedback } from "@/components/movies/favorite-feedback";
import { getMovieDetail } from "@/api/movies/get-movie-detail";
import { toMovie } from "@/utils/movies/to-movie";

export function MyPage() {
  const { profile, query } = useMemberProfile();
  const bookmarks = useBookmarks();
  const { bookmarkedMovieIds: ids, toggleBookmark } = bookmarks;
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(ids.length / 5));
  const currentPage = Math.min(page, totalPages);
  const movies = useQueries({ queries: ids.slice((currentPage - 1) * 5, currentPage * 5).map((id) => ({
    queryKey: ["movies", "detail", id],
    queryFn: ({ signal }: { signal: AbortSignal }) => getMovieDetail(id, signal),
  })) });

  return (
    <AccountLayout title="내 정보" action={
      <Link to="/mypage/edit" className="shrink-0 rounded-md bg-[#4f60ee] px-4 py-3 text-xs font-bold text-white hover:bg-[#4052de]">정보 수정</Link>
    }>
      <section className="border-y border-gray-200 py-3" aria-labelledby="basic-info-title">
        <h2 id="basic-info-title" className="text-base font-bold">기본 정보</h2>
        <div className="mt-4 flex items-center gap-7 pb-1">
          <ProfileAvatar />
          {profile ? <dl className="grid flex-1 gap-5 sm:grid-cols-3">
            <div><dt className="mb-1 text-[11px] text-gray-400">닉네임</dt><dd className="break-all text-sm font-bold">{profile.nickname}</dd></div>
            <div className="sm:col-span-2"><dt className="mb-1 text-[11px] text-gray-400">이메일</dt><dd className="break-all text-sm font-bold">{profile.email}</dd></div>
          </dl> : <p role="status" className="text-sm text-gray-500">{query.isError ? "회원 정보를 불러오지 못했어요." : "회원 정보를 불러오는 중이에요."}</p>}
        </div>
      </section>
      <section className="pt-6" aria-labelledby="favorites-title">
        <h2 id="favorites-title" className="mb-3 text-base font-bold">내 즐겨찾기</h2>
        <FavoriteFeedback isLoading={bookmarks.isLoading} queryError={bookmarks.query.isError} mutationError={bookmarks.mutation.isError} retry={() => void bookmarks.query.refetch()} />
        {bookmarks.query.isSuccess && (ids.length === 0 ? <p className="rounded-lg border border-dashed border-gray-200 py-20 text-center text-sm text-gray-400">아직 즐겨찾기한 영화가 없어요.</p> : <>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-5">
            {movies.map((movie, index) => movie.data ? <MovieCard key={ids[(currentPage - 1) * 5 + index]} movie={toMovie(movie.data, true)} onToggleBookmark={toggleBookmark} bookmarkDisabled={bookmarks.disabled} /> : <li key={ids[(currentPage - 1) * 5 + index]} className="min-w-0">
              {movie.isPending ? <div className="aspect-[242/276] animate-pulse rounded-lg bg-gray-200" aria-label="영화 불러오는 중" /> : <div className="grid aspect-[242/276] place-content-center rounded-lg bg-gray-100 p-4 text-center text-xs text-gray-500"><p>영화를 불러오지 못했어요.</p><button type="button" className="mt-3 text-[#4f60ee]" onClick={() => void movie.refetch()}>다시 시도</button></div>}
            </li>)}
          </ul>
          {totalPages === 1 ? <nav aria-label="영화 목록 페이지" className="mt-8 flex items-center justify-center gap-3"><button disabled aria-label="이전 페이지" className="size-9 text-[#4f60ee]/20">‹</button><span aria-current="page" className="grid size-9 place-items-center rounded-md bg-[#191b20] text-sm font-bold text-white">1</span><button disabled aria-label="다음 페이지" className="size-9 text-[#4f60ee]/20">›</button></nav> : <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setPage} />}
        </>)}
      </section>
    </AccountLayout>
  );
}
