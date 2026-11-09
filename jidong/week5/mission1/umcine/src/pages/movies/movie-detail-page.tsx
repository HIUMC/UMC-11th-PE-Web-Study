import { Link, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import type { TmdbMovieDetail } from "../../api/movies/models";
import { BookmarkButton } from "../../components/movies/bookmark-button";
import { MoviePoster } from "../../components/movies/movie-poster";
import {
  formatReleaseDate,
  formatRuntime,
} from "../../utils/movies/format-movie";
import { getMovieDetailErrorMessage } from "../../utils/movies/get-movie-detail-error-message";
import { getTmdbBackdropUrl } from "../../utils/movies/tmdb-image";

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const parsedMovieId = Number(movieId);

  // 양의 정수가 아닌 ID는 요청하지 않아요.
  if (!Number.isInteger(parsedMovieId) || parsedMovieId <= 0) {
    return (
      <main className="p-16 text-center">올바르지 않은 영화 번호예요.</main>
    );
  }

  // 영화 ID가 바뀌면 key가 바뀌어 이전 영화의 상태가 남지 않아요.
  return <MovieDetailContent key={parsedMovieId} movieId={parsedMovieId} />;
}

function MovieDetailContent({ movieId }: { movieId: number }) {
  const [movie, setMovie] = useState<TmdbMovieDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  useEffect(() => {
    let ignore = false;

    getMovieDetail(movieId)
      .then((response) => {
        if (!ignore) setMovie(response);
      })
      .catch((error: unknown) => {
        if (!ignore) setErrorMessage(getMovieDetailErrorMessage(error));
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [movieId]);

  if (isLoading) {
    return (
      <main aria-busy="true" className="p-16 text-center text-gray-500">
        영화 정보를 불러오는 중이에요.
      </main>
    );
  }

  if (errorMessage || !movie) {
    return (
      <main role="alert" className="p-16 text-center">
        {errorMessage ?? "영화 정보를 불러오지 못했어요."}
      </main>
    );
  }

  const backdropUrl = getTmdbBackdropUrl(movie.backdrop_path);
  const genreText = movie.genres.map((genre) => genre.name).join(", ");

  return (
    <main>
      <div className="relative h-[360px] w-full overflow-hidden bg-gray-300">
        {backdropUrl ? (
          <img
            src={backdropUrl}
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-gray-500">
            이미지 없음
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <Link
          to="/"
          className="absolute left-6 top-6 flex items-center gap-1 text-sm text-white no-underline"
        >
          ← 영화 목록
        </Link>
        <div className="absolute bottom-6 left-6 right-6 text-white">
          <h1 className="text-3xl font-bold">{movie.title}</h1>
          <p className="mt-1 text-sm text-white/80">{movie.original_title}</p>
          <p className="mt-2 text-sm font-medium">
            {formatReleaseDate(movie.release_date)}
            {genreText && ` · ${genreText}`} · {formatRuntime(movie.runtime)}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-[1200px] px-6 pb-16 pt-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[240px_1fr_280px]">
          <div className="aspect-[2/3] w-full max-w-[240px] overflow-hidden rounded-lg shadow-md">
            <MoviePoster posterPath={movie.poster_path} title={movie.title} />
          </div>

          <div>
            {movie.tagline && (
              <h2 className="text-xl font-bold">{movie.tagline}</h2>
            )}
            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              {movie.overview || "줄거리 정보가 없어요."}
            </p>
            <BookmarkButton
              movieId={movie.id}
              movieTitle={movie.title}
              variant="label"
              className="mt-6"
            />
          </div>

          <div>
            <h2 className="text-base font-bold">내 평점</h2>
            <div className="mt-3 flex gap-1">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRating(value)}
                  aria-label={`${value}점`}
                  className="text-2xl leading-none"
                >
                  <span
                    className={
                      value <= rating ? "text-yellow-400" : "text-gray-300"
                    }
                  >
                    ★
                  </span>
                </button>
              ))}
            </div>
            <textarea
              value={review}
              onChange={(event) => setReview(event.target.value)}
              placeholder="영화를 보고 느낀 점을 남겨보세요."
              className="mt-3 h-24 w-full resize-none rounded-md border border-gray-300 bg-white p-3 text-sm outline-none"
            />
            <button
              type="button"
              className="mt-3 w-full rounded-md bg-black py-2 text-sm text-white"
            >
              평점 저장
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
