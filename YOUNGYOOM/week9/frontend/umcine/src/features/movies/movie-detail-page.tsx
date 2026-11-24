"use client";

import { useRouter } from "next/navigation";

import { BookmarkButton } from "../../components/bookmark-button";
import { useQuery } from "@tanstack/react-query";
import {
  getTmdbPosterUrl,
  getTmdbBackdropUrl,
} from "../../utils/movies/tmdb-image";
import { HTTPError } from "ky";
import { movieDetailOptions } from "../../api/movies/movie-query-options";

import { RatingForm } from "../../components/ratings/rating-form";
import { useAuthStore } from "../../stores/auth-store";

export function MovieDetailPage({ movieIdParam }: { movieIdParam: string }) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const memberId = useAuthStore((state) => state.memberId);
  const router = useRouter();

  //URL 에서 가져온 문자열 ID 를 숫자로 변환
  const movieId = Number(movieIdParam);
  //영화 ID가 정수이면서 0보다 큰지 확인
  const isValidMovieId = Number.isInteger(movieId) && movieId > 0;
  //영화 상세 데이터 + 로딩 + 오류 상태를 Tanstack Query로 관리
  const movieDetailQuery = useQuery(movieDetailOptions(movieId));

  //잘못된 ID -> 요청하지 않고 안내
  if (!isValidMovieId) {
    return (
      <main className="p-20 text-center">올바르지 않은 영화 번호예요</main>
    );
  }

  //상세 데이터를 기다리는 동안 로딩 표시
  if (movieDetailQuery.isPending) {
    return (
      <main className="p-20 text-center">
        영화 상세 정보를 불러오는 중이에요.
      </main>
    );
  }

  //요청 실패 시 상태 코드에 따라 오류 메시지 표시
  if (movieDetailQuery.isError) {
    const error = movieDetailQuery.error;

    const message =
      error instanceof HTTPError && error.response.status === 404
        ? "영화를 찾을 수 없어요."
        : "영화 정보를 불러오지 못했어요.";
    return <main className="p-20 text-center">{message}</main>;
  }

  //요청 성공 후 받은 데이터를 기존 UI의 movie 변수로 사용
  const movie = movieDetailQuery.data;

  const posterUrl = getTmdbPosterUrl(movie.poster_path);
  const backdropUrl = getTmdbBackdropUrl(movie.backdrop_path);

  const movieInfo = [
    movie.release_date,
    ...movie.genres.map((genre) => genre.name),
    movie.runtime != null && movie.runtime > 0 ? `${movie.runtime}분` : "",
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <>
      <main>
        <section className="relative h-[360px] w-full overflow-hidden">
          {backdropUrl && (
            <img
              src={backdropUrl}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}

          <div className="absolute inset-0" />
          <div className="relative mx-auto flex h-full  flex-col justify-between px-20 py-6">
            <button
              onClick={() => router.back()}
              className="flex w-fit cursor-pointer items-center gap-1 text-sm text-white"
            >
              <img
                src="/icons/chevron-left.svg"
                alt=""
                className="h-6 w-6 brightness-0 invert"
              />
              영화 목록
            </button>

            <div className="text-white">
              <h1 className="text-[40px] font-bold">{movie.title}</h1>
              <p className="mt-2 text-xs">{movie.original_title}</p>
              <p className="mt-2 text-sm font-bold">{movieInfo}</p>
            </div>
          </div>
        </section>

        <section className="flex  gap-8 px-20 py-8 justify-between">
          {/* 포스터 */}
          {posterUrl ? (
            <img
              src={posterUrl}
              alt={`${movie.title} 포스터`}
              className="h-[202px] w-[141px] shrink-0 rounded-lg object-cover shadow-lg"
            />
          ) : (
            <div className="flex h-[202px] w-[141px] shrink-0 items-center justify-center rounded-lg bg-gray-200 text-sm text-gray-500">
              포스터 없음
            </div>
          )}

          {/* 소개 */}
          <div className="flex flex-1 flex-col gap-3">
            <h2 className="text-lg font-bold">{movie.tagline}</h2>
            <p className="text-sm leading-relaxed text-gray-700">
              {movie.overview}
            </p>
            {/* absolute 버튼이 이 영역 안에 배치되도록 설정 */}
            <div className="relative h-8 w-8">
              <BookmarkButton movieId={movie.id}>즐겨찾기</BookmarkButton>
            </div>
          </div>

          {/* 내 평점 */}
          {!accessToken ? (
            <p className="text-sm text-gray-500">
              평점을 남기려면 로그인해 주세요.
            </p>
          ) : memberId != null ? (
            <RatingForm
              key={`${memberId}:${movie.id}`}
              movieId={movie.id}
              memberId={memberId}
            />
          ) : (
            <p className="text-sm text-gray-500">
              회원 정보가 확인되면 평점을 표시해요.
            </p>
          )}
        </section>
      </main>
    </>
  );
}
