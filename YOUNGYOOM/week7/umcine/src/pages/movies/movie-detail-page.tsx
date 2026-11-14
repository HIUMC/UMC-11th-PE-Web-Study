import { useParams, useRouter } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { BookmarkButton } from "../../components/bookmark-button";
import { useQuery } from "@tanstack/react-query";
import { getMovieDetail } from "../../api/movies/get-movies";
import {
  getTmdbPosterUrl,
  getTmdbBackdropUrl,
} from "../../utils/movies/tmdb-image";
import { HTTPError } from "ky";
import { movieDetailOptions } from "../../api/movies/movie-query-options";

export function MovieDetailPage() {
  const router = useRouter();

  //URL 경로에서 영화 ID를 가져와서 movieIdParam 이라는 이름으로 사용
  const { movieId: movieIDParam } = useParams({ from: "/movies/$movieId" });

  //URL 에서 가져온 문자열 ID 를 숫자로 변환
  const movieId = Number(movieIDParam);

  //영화 ID가 정수이면서 0보다 큰지 확인
  const isValidMovieId = Number.isInteger(movieId) && movieId > 0;

  //영화 상세 데이터 + 로딩 + 오류 상태를 Tanstack Query로 관리
  const movieDetailQuery = useQuery(movieDetailOptions(movieId));

  const [rating] = useState(0);
  const [comment] = useState("");
  const [ratingMessage] = useState("");

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
              onClick={() => router.history.back()}
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
          <div className="flex w-[294px] shrink-0 flex-col gap-2 border-l border-gray-300 pl-6">
            <h2 className="text-lg font-bold">내 평점</h2>
            <p className="text-[11px] text-gray-500">
              {ratingMessage || "등록한 평점과 후기예요."}
            </p>

            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  aria-label={`${star}점`}
                  aria-pressed={rating === star}
                  disabled
                  className={`flex h-7 w-7 cursor-pointer items-center justify-center rounded border ${
                    star <= rating ? "border-black" : "border-gray-300 bg-white"
                  }`}
                >
                  <img
                    src={
                      star <= rating
                        ? "/icons/star.svg"
                        : "/icons/star-outline.svg"
                    }
                  />
                </button>
              ))}
            </div>

            <textarea
              value={comment}
              readOnly
              placeholder="영화를 보고 느낀 점을 남겨보세요."
              className="h-[72px] w-full resize-none rounded-md border border-gray-300 bg-white p-2 text-xs outline-none"
            />
            <button
              type="button"
              disabled
              className="w-full cursor-pointer rounded-md bg-gray-900 py-2 text-sm font-bold text-white"
            >
              평점 저장
            </button>
          </div>
        </section>
      </main>
    </>
  );
}
