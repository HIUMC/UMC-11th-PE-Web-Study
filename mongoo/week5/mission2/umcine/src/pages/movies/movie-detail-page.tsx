import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Route } from "../../routes/movies.$movieId";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import type { TmdbMovieDetail } from "../../api/movies/models";
import { useBookmarkStore } from "../../stores/bookmark-store";
import {
  getTmdbPosterUrl,
  getTmdbBackdropUrl,
} from "../../utils/movies/tmdb-image";
import { getMovieDetailErrorMessage } from "../../utils/movies/get-movie-detail-error-message";
import { cn } from "../../utils/cn";
import { MemberRatingPanel } from "../../components/movies/member-rating-panel";

export function MovieDetailPage() {
  const { movieId } = Route.useParams();
  const parsedMovieId = Number(movieId);
  const isValidMovieId =
    Number.isInteger(parsedMovieId) && parsedMovieId > 0;

  const [movie, setMovie] = useState<TmdbMovieDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isBookmarked = useBookmarkStore((state) =>
    movie ? state.bookmarkedMovieIds.includes(movie.id) : false,
  );
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);

  useEffect(() => {
    let ignore = false;

    setMovie(null);
    setErrorMessage(null);

    if (!Number.isInteger(parsedMovieId) || parsedMovieId <= 0) {
      setErrorMessage("올바르지 않은 영화 번호예요.");
      setIsLoading(false);
      return;
    }

    async function loadMovie() {
      setIsLoading(true);

      try {
        const response = await getMovieDetail(parsedMovieId);

        if (!ignore) {
          setMovie(response);
        }
      } catch (error) {
        if (!ignore) {
          setErrorMessage(getMovieDetailErrorMessage(error));
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    loadMovie();

    return () => {
      ignore = true;
    };
  }, [parsedMovieId]);

  if (!isValidMovieId) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-24 text-center text-gray-500">
        올바르지 않은 영화 번호예요.
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-24 text-center text-gray-500">
        영화 정보를 불러오는 중이에요.
      </main>
    );
  }

  if (errorMessage) {
    return (
      <main
        role="alert"
        className="mx-auto max-w-6xl px-6 py-24 text-center text-gray-500"
      >
        {errorMessage}
      </main>
    );
  }

  if (!movie) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-24 text-center text-gray-500">
        영화를 찾을 수 없어요.
      </main>
    );
  }

  const posterUrl = getTmdbPosterUrl(movie.poster_path);
  const backdropUrl = getTmdbBackdropUrl(movie.backdrop_path);
  const genreNames = movie.genres.map((genre) => genre.name).join(", ");

  const runtimeText =
    typeof movie.runtime === "number"
      ? `${Math.floor(movie.runtime / 60)}시간 ${movie.runtime % 60}분`
      : "상영 시간 정보가 없어요.";

  return (
    <main>
      <div className="relative flex h-80 flex-col justify-end overflow-hidden bg-gray-200 px-6 pb-8 text-white">
        {backdropUrl ? (
          <img
            src={backdropUrl}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-600">
            이미지 없음
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

        <div className="relative z-10 mx-auto w-full max-w-6xl">
          <Link
            to="/"
            className="mb-4 flex w-fit items-center gap-1 text-sm text-gray-200"
          >
            <img
              src="/icons/chevron-left.svg"
              alt=""
              className="h-4 w-4 invert"
            />
            영화 목록
          </Link>

          <h1 className="text-3xl font-bold">{movie.title}</h1>
          <p className="text-gray-300">{movie.original_title}</p>
        </div>
      </div>

      <div className="mx-auto flex max-w-6xl flex-wrap gap-x-4 gap-y-1 px-6 py-4 text-sm text-gray-500">
        <span>{movie.release_date}</span>
        {genreNames && <span>{genreNames}</span>}
        <span>{runtimeText}</span>
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 border-t px-6 py-6 md:grid-cols-[240px_1fr_320px]">
        <div>
          {posterUrl ? (
            <img
              src={posterUrl}
              alt={movie.title}
              className="w-60 rounded-lg shadow"
            />
          ) : (
            <div className="flex aspect-[2/3] w-60 items-center justify-center rounded-lg bg-gray-200 text-gray-500">
              이미지 없음
            </div>
          )}
        </div>

        <div>
          <h2 className="mb-3 text-xl font-bold text-gray-900">
            {movie.tagline}
          </h2>

          <p className="whitespace-pre-line text-gray-800">
            {movie.overview}
          </p>

          <button
            type="button"
            aria-pressed={isBookmarked}
            onClick={() => toggleBookmark(movie.id)}
            className={cn(
              "mt-4 flex items-center gap-2 rounded border px-4 py-2 text-sm font-semibold transition-colors",
              isBookmarked
                ? "border-blue-600 bg-blue-600 text-white"
                : "border-blue-600 text-blue-600 hover:bg-blue-50",
            )}
          >
            <img
              src={
                isBookmarked
                  ? "/icons/bookmark.svg"
                  : "/icons/bookmark-outline.svg"
              }
              alt=""
              className={cn("h-4 w-4", isBookmarked && "invert")}
            />
            {isBookmarked ? "즐겨찾기 완료" : "즐겨찾기"}
          </button>
        </div>

        <MemberRatingPanel movieId={movie.id} />
      </div>
    </main>
  );
}
