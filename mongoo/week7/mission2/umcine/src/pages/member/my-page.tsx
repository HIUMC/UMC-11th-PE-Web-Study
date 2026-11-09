import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useProfileStore } from "../../stores/profile-store";
import { useBookmarkStore } from "../../stores/bookmark-store";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";
import Pagination from "../../components/movies/pagination";

function BookmarkedMovie({ movieId }: { movieId: number }) {
  const movieQuery = useQuery({
    queryKey: ["movies", "detail", movieId],
    queryFn: () => getMovieDetail(movieId),
    staleTime: 30 * 1000,
  });

  if (movieQuery.isPending) {
    return (
      <div role="status" className="min-w-0">
        <div className="aspect-[200/228] animate-pulse rounded-lg bg-gray-200" />
        <p className="mt-2 text-xs text-gray-500">불러오는 중이에요.</p>
      </div>
    );
  }

  if (movieQuery.isError) {
    return (
      <div
        role="alert"
        className="flex aspect-[200/228] items-center justify-center rounded-lg bg-gray-200 p-3 text-center text-xs text-gray-500"
      >
        영화 정보를 불러오지 못했어요.
      </div>
    );
  }

  const movie = movieQuery.data;
  const posterUrl = getTmdbPosterUrl(movie.poster_path);

  return (
    <Link
      to="/movies/$movieId"
      params={{ movieId: String(movie.id) }}
      className="block min-w-0"
    >
      <div className="aspect-[200/228] overflow-hidden rounded-lg">
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={movie.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gray-200 text-sm text-gray-500">
            이미지 없음
          </div>
        )}
      </div>

      <p className="mt-[7px] truncate text-[13px] font-bold">
        {movie.title}
      </p>

      <p className="mt-[3px] text-[11px] text-gray-400">
        {movie.release_date}
      </p>
    </Link>
  );
}

export function MyPage() {
  const profile = useProfileStore((state) => state.profile);
  const bookmarkedMovieIds = useBookmarkStore(
    (state) => state.bookmarkedMovieIds,
  );

  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(bookmarkedMovieIds.length / 10);
  const currentPage = Math.min(page, Math.max(1, totalPages));

  const visibleMovieIds = bookmarkedMovieIds.slice(
    (currentPage - 1) * 10,
    currentPage * 10,
  );

  return (
    <main className="page-container flex-1 pb-12 pt-5">
      <div className="flex items-center justify-between gap-4 border-b border-gray-200 pb-6">
        <h1 className="text-[28px] font-bold tracking-tight">
          내 정보
        </h1>

        <Link to="/mypage/edit" className="rounded-md bg-[#2563eb] px-4 py-2.5 text-xs font-semibold text-white">
          정보 수정
        </Link>
      </div>

      <section
        aria-labelledby="profile-heading"
        className="border-b border-gray-200 py-4"
      >
        <h2 id="profile-heading" className="mb-4 text-sm font-bold">
          기본 정보
        </h2>

        <div className="flex items-center gap-6">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-200">
            <img
              src={profile.profileImage ?? "/icons/person.svg"}
              alt="프로필"
              className={
                profile.profileImage
                  ? "h-full w-full object-cover"
                  : "h-10 w-10"
              }
            />
          </div>

          <dl className="grid min-w-0 flex-1 grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <dt className="mb-1 text-[10px] text-gray-400">
                닉네임
              </dt>
              <dd className="break-words text-sm font-semibold">
                {profile.nickname}
              </dd>
            </div>

            <div>
              <dt className="mb-1 text-[10px] text-gray-400">
                이메일
              </dt>
              <dd className="break-all text-sm font-semibold">
                {profile.email}
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <section
        aria-labelledby="bookmarks-heading"
        className="pt-6"
      >
        <h2 id="bookmarks-heading" className="mb-4 text-sm font-bold">
          내 즐겨찾기
        </h2>

        {bookmarkedMovieIds.length === 0 ? (
          <p className="py-16 text-center text-sm text-gray-500">
            아직 즐겨찾기한 영화가 없어요.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-x-[15px] gap-y-[18px] sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
              {visibleMovieIds.map((movieId) => (
                <BookmarkedMovie key={movieId} movieId={movieId} />
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </>
        )}
      </section>
    </main>
  );
}