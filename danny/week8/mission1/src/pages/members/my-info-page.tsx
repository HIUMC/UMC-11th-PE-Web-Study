import { useQueries, useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { favoritesQueryOptions } from "../../api/favorite-queries";
import { myInfoQueryOptions } from "../../api/member-queries";
import { movieDetailQueryOptions } from "../../api/movie-queries";
import { getServerErrorMessage } from "../../api/request-error";
import {
  ErrorState,
  LoadingState,
} from "../../components/feedback/request-status";
import { ProfileAvatar } from "../../components/members/profile-avatar";
import { Pagination } from "../../components/movies/pagination";
import { useProfileStore } from "../../stores/profile-store";
import type { MovieSummary } from "../../types/movie";

const BOOKMARK_PAGE_SIZE = 10;

export function MyInfoPage() {
  const profileImageUrl = useProfileStore((state) => state.profileImageUrl);
  const myInfoQuery = useQuery(myInfoQueryOptions());

  return (
    <main className="mx-auto max-w-[1312px] px-4 pt-6 pb-16">
      <div className="flex items-center justify-between gap-4 border-b border-border pb-8">
        <h1 className="text-4xl font-bold text-ink">내 정보</h1>
        <Link
          to="/me/edit"
          className="flex h-10 items-center rounded-md bg-brand px-4 text-sm font-bold text-surface transition-colors hover:bg-brand-hover active:bg-brand-pressed"
        >
          정보 수정
        </Link>
      </div>

      <section className="border-b border-border pt-2 pb-3">
        <h2 className="text-lg font-bold text-ink">기본 정보</h2>
        <div className="mt-3 flex flex-wrap items-center gap-x-7 gap-y-3">
          <ProfileAvatar imageUrl={profileImageUrl} />
          {myInfoQuery.isError && !myInfoQuery.isFetching ? (
            <p role="alert" className="text-sm text-danger">
              {getServerErrorMessage(myInfoQuery.error)}
              <button
                type="button"
                onClick={() => myInfoQuery.refetch()}
                className="ml-2 font-bold text-ink underline"
              >
                다시 시도
              </button>
            </p>
          ) : (
            <>
              <InfoItem
                label="닉네임"
                value={myInfoQuery.data?.nickname ?? "불러오는 중…"}
                className="sm:w-[366px]"
              />
              <InfoItem
                label="이메일"
                value={myInfoQuery.data?.email ?? "불러오는 중…"}
              />
            </>
          )}
        </div>
      </section>

      <BookmarkedMovies />
    </main>
  );
}

interface InfoItemProps {
  label: string;
  value: string;
  className?: string;
}

function InfoItem({ label, value, className }: InfoItemProps) {
  return (
    <div className={className}>
      <p className="text-xs text-ink-subtle">{label}</p>
      <p className="mt-0.5 text-[15px] leading-6 font-bold break-all text-ink">{value}</p>
    </div>
  );
}

function BookmarkedMovies() {
  const favoritesQuery = useQuery(favoritesQueryOptions());

  return (
    <section className="pt-6">
      <h2 className="text-lg font-bold text-ink">내 즐겨찾기</h2>

      {favoritesQuery.data ? (
        favoritesQuery.data.length === 0 ? (
          <p className="py-16 text-center text-sm text-ink-muted">
            아직 즐겨찾기한 영화가 없어요.
          </p>
        ) : (
          <FavoriteMovieGrid
            movieIds={favoritesQuery.data.map((favorite) => favorite.movieId)}
          />
        )
      ) : favoritesQuery.isError && !favoritesQuery.isFetching ? (
        <ErrorState
          error={favoritesQuery.error}
          onRetry={() => favoritesQuery.refetch()}
          message={getServerErrorMessage(favoritesQuery.error)}
        />
      ) : (
        <LoadingState label="즐겨찾기를 불러오는 중이에요." />
      )}
    </section>
  );
}

function FavoriteMovieGrid({ movieIds }: { movieIds: number[] }) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(movieIds.length / BOOKMARK_PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageIds = movieIds.slice(
    (currentPage - 1) * BOOKMARK_PAGE_SIZE,
    currentPage * BOOKMARK_PAGE_SIZE,
  );
  const movieQueries = useQueries({
    queries: pageIds.map((movieId) => movieDetailQueryOptions(movieId)),
  });

  return (
    <>
      <ul className="mt-3 grid grid-cols-1 gap-x-[18px] gap-y-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {movieQueries.map((query, index) => (
          <li key={pageIds[index]}>
            {query.data ? (
              <BookmarkCard movie={query.data} />
            ) : (
              <div className="flex aspect-[242/274] items-center justify-center rounded-xl bg-border px-3 text-center text-xs text-ink-subtle">
                {query.isError && !query.isFetching
                  ? "영화 정보를 불러오지 못했어요."
                  : "불러오는 중…"}
              </div>
            )}
          </li>
        ))}
      </ul>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </>
  );
}

function BookmarkCard({ movie }: { movie: MovieSummary }) {
  return (
    <Link
      to="/movies/$movieId"
      params={{ movieId: String(movie.id) }}
      className="group block"
    >
      <div className="aspect-[242/274] overflow-hidden rounded-xl bg-border">
        {movie.posterPath ? (
          <img
            src={movie.posterPath}
            alt={`${movie.title} 포스터`}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-ink-subtle">
            이미지 없음
          </div>
        )}
      </div>
      <h3 className="mt-1.5 truncate text-sm font-bold text-ink">
        {movie.title}
      </h3>
      <p className="mt-0.5 text-xs text-ink-subtle">{movie.releaseDate}</p>
    </Link>
  );
}
