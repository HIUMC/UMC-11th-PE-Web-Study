"use client";

import Image from "next/image";
import Link from "next/link";
import { FavoriteButton } from "../../components/movies/favorite-button";
import { MoviePoster } from "../../components/movies/movie-poster";
import { useFavoritesQuery } from "../../hooks/use-favorites";
import { useLogout } from "../../hooks/use-logout";
import { useMeQuery } from "../../hooks/use-me-query";
import { useMovieDetails } from "../../hooks/use-movie-details";
import { useMemberRatingsQuery, useMyMemberId } from "../../hooks/use-ratings";
import { formatReleaseDate } from "../../utils/movies/format-movie";

export function MyPage() {
  return (
    <main className="mx-auto max-w-[1200px] px-6 py-8">
      <h1 className="text-2xl font-bold">마이페이지</h1>
      <ProfileSection />
      <FavoritesSection />
      <MyRatingsSection />
    </main>
  );
}

function ProfileSection() {
  const meQuery = useMeQuery();
  const logout = useLogout();

  return (
    <section className="mt-6 flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-6 sm:flex-row sm:items-center">
      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gray-100">
        <Image src="/icons/person.svg" alt="" width={32} height={32} className="h-8 w-8 opacity-60" />
      </div>
      {meQuery.isPending ? (
        <p aria-busy="true" className="flex-1 text-sm text-gray-500">
          내 정보를 불러오는 중이에요.
        </p>
      ) : meQuery.isError ? (
        <p role="alert" className="flex-1 text-sm text-red-500">
          내 정보를 불러오지 못했어요.
        </p>
      ) : (
        <dl className="flex flex-1 flex-col gap-1">
          <dt className="sr-only">닉네임</dt>
          <dd className="text-lg font-bold">{meQuery.data.nickname}</dd>
          <dt className="sr-only">이메일</dt>
          <dd className="text-sm text-gray-500">{meQuery.data.email}</dd>
          <dt className="sr-only">가입일</dt>
          <dd className="text-xs text-gray-400">
            {formatReleaseDate(meQuery.data.createdAt.slice(0, 10))} 가입
          </dd>
        </dl>
      )}
      <div className="flex gap-2 self-start sm:self-center">
        <Link
          href="/mypage/edit"
          className="flex items-center justify-center gap-1.5 rounded-md border border-gray-300 px-4 py-2 text-sm font-bold text-gray-700"
        >
          <Image src="/icons/edit.svg" alt="" width={16} height={16} className="h-4 w-4" />
          수정하기
        </Link>
        <button
          type="button"
          onClick={logout}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-500"
        >
          로그아웃
        </button>
      </div>
    </section>
  );
}

function FavoritesSection() {
  const favoritesQuery = useFavoritesQuery();
  const favorites = favoritesQuery.data ?? [];
  const movies = useMovieDetails(favorites.map((favorite) => favorite.movieId));

  return (
    <section className="mt-8 border-t border-gray-200 pt-6">
      <h2 className="text-base font-bold">
        즐겨찾기한 영화
        {favoritesQuery.isSuccess && (
          <span className="ml-2 text-sm font-normal text-gray-400">
            {favorites.length}편
          </span>
        )}
      </h2>

      {favoritesQuery.isPending ? (
        <p aria-busy="true" className="mt-4 text-sm text-gray-500">
          즐겨찾기를 불러오는 중이에요.
        </p>
      ) : favoritesQuery.isError ? (
        <p role="alert" className="mt-4 text-sm text-red-500">
          즐겨찾기를 불러오지 못했어요.
        </p>
      ) : favorites.length === 0 ? (
        <p className="mt-4 text-sm text-gray-500">
          아직 즐겨찾기한 영화가 없어요. 영화 상세에서 즐겨찾기를 눌러 보세요.
        </p>
      ) : (
        <ul className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {favorites.map((favorite) => {
            const movie = movies.get(favorite.movieId);
            const title = movie?.title ?? `영화 #${favorite.movieId}`;
            return (
              <li key={favorite.favoriteId} className="flex flex-col gap-2">
                <div className="relative aspect-[2/3] overflow-hidden rounded-md">
                  <Link
                    href={`/movies/${favorite.movieId}`}
                    className="block h-full w-full"
                  >
                    <MoviePoster
                      posterPath={movie?.poster_path ?? null}
                      title={title}
                      sizes="(min-width: 1024px) 180px, (min-width: 640px) 33vw, 50vw"
                    />
                  </Link>
                  <FavoriteButton
                    movieId={favorite.movieId}
                    movieTitle={title}
                    isFavorite
                    className="absolute right-1.5 top-1.5"
                  />
                </div>
                <Link
                  href={`/movies/${favorite.movieId}`}
                  className="text-sm"
                >
                  {title}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

function MyRatingsSection() {
  const memberId = useMyMemberId();
  const ratingsQuery = useMemberRatingsQuery(memberId);
  const ratings = ratingsQuery.data ?? [];
  const movies = useMovieDetails(ratings.map((rating) => rating.movieId));

  return (
    <section className="mt-8 border-t border-gray-200 pt-6">
      <h2 className="text-base font-bold">내가 남긴 평점</h2>

      {ratingsQuery.isPending ? (
        <p aria-busy="true" className="mt-4 text-sm text-gray-500">
          평점 목록을 불러오는 중이에요.
        </p>
      ) : ratingsQuery.isError ? (
        <p role="alert" className="mt-4 text-sm text-red-500">
          평점 목록을 불러오지 못했어요.
        </p>
      ) : ratings.length === 0 ? (
        <p className="mt-4 text-sm text-gray-500">아직 남긴 평점이 없어요.</p>
      ) : (
        <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {ratings.map((rating) => {
            const movie = movies.get(rating.movieId);
            const title = movie?.title ?? `영화 #${rating.movieId}`;
            return (
              <li
                key={rating.ratingId}
                className="flex gap-4 rounded-lg border border-gray-200 bg-white p-4"
              >
                <Link
                  href={`/movies/${rating.movieId}`}
                  className="relative block h-[120px] w-[80px] flex-shrink-0 overflow-hidden rounded-md"
                >
                  <MoviePoster
                    posterPath={movie?.poster_path ?? null}
                    title={title}
                    sizes="80px"
                  />
                </Link>
                <div className="flex flex-1 flex-col gap-1">
                  <Link
                    href={`/movies/${rating.movieId}`}
                    className="font-bold"
                  >
                    {title}
                  </Link>
                  <p className="text-yellow-400" aria-label={`${rating.score}점`}>
                    {"★".repeat(rating.score)}
                    <span className="text-gray-300">{"★".repeat(5 - rating.score)}</span>
                  </p>
                  <p className="text-sm text-gray-600">
                    {rating.comment || "코멘트가 없어요."}
                  </p>
                  <p className="mt-auto text-xs text-gray-400">
                    {formatReleaseDate(rating.createdAt.slice(0, 10))}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
