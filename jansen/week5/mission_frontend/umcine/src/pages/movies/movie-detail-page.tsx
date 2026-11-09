import { useEffect, useState } from "react";
import { Link, useParams } from "@tanstack/react-router";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import type { TmdbMovieDetail } from "../../api/movies/models";
import { useBookmarkStore } from "../../stores/bookmark-store";
import { cn } from "../../utils/cn";
import { getMovieDetailErrorMessage } from "../../utils/movies/get-movie-detail-error-message";
import {
  getTmdbBackdropUrl,
  getTmdbPosterUrl,
} from "../../utils/movies/tmdb-image";
import { BookmarkIcon, ChevronLeftIcon, StarIcon } from "../../components/icons";

function formatRuntime(runtime: number | null) {
  if (typeof runtime !== "number" || runtime <= 0) {
    return "상영 시간 정보가 없어요.";
  }

  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;

  if (hours === 0) return `${minutes}분`;
  if (minutes === 0) return `${hours}시간`;
  return `${hours}시간 ${minutes}분`;
}

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const parsedMovieId = Number(movieId);
  const isValidMovieId = Number.isInteger(parsedMovieId) && parsedMovieId > 0;

  const [movie, setMovie] = useState<TmdbMovieDetail | null>(null);
  const [isLoading, setIsLoading] = useState(isValidMovieId);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [rating, setRating] = useState(0);

  const isBookmarked = useBookmarkStore((state) =>
    state.bookmarkedMovieIds.includes(parsedMovieId),
  );
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);

  useEffect(() => {
    let ignore = false;

    setMovie(null);
    setErrorMessage(null);

    if (!isValidMovieId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    async function loadMovie() {
      try {
        const response = await getMovieDetail(parsedMovieId);
        if (!ignore) setMovie(response);
      } catch (error) {
        if (!ignore) setErrorMessage(getMovieDetailErrorMessage(error));
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    loadMovie();

    return () => {
      ignore = true;
    };
  }, [parsedMovieId, isValidMovieId]);

  if (!isValidMovieId) {
    return <main className="px-20 py-10">올바르지 않은 영화 번호예요.</main>;
  }

  if (isLoading) {
    return <main className="px-20 py-10">영화 정보를 불러오는 중이에요.</main>;
  }

  if (errorMessage) {
    return <main className="px-20 py-10">{errorMessage}</main>;
  }

  if (!movie) {
    return <main className="px-20 py-10">영화를 찾을 수 없어요.</main>;
  }

  const posterUrl = getTmdbPosterUrl(movie.poster_path);
  const backdropUrl = getTmdbBackdropUrl(movie.backdrop_path);
  const releaseDate = movie.release_date.replace(/-/g, ".");
  const genres = movie.genres.map((genre) => genre.name).join(", ");

  return (
    <main>
      <section className="relative h-[360px] overflow-hidden bg-ink text-white">
        {backdropUrl ? (
          <img
            src={backdropUrl}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 size-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-line text-sm text-muted">
            이미지 없음
          </div>
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-black/30" />

        <Link
          to="/"
          className="absolute left-20 top-8 flex items-center gap-1 text-sm font-semibold"
        >
          <ChevronLeftIcon className="size-4" />
          영화 목록
        </Link>

        <div className="absolute bottom-8 left-20">
          <h1 className="text-[48px] font-extrabold leading-tight">{movie.title}</h1>
          <p className="mt-2 text-base">{movie.original_title}</p>
          <p className="mt-2 text-sm font-semibold">
            {releaseDate || "개봉일 정보 없음"} · {genres || "장르 정보 없음"} ·{" "}
            {formatRuntime(movie.runtime)}
          </p>
        </div>
      </section>

      <div className="flex gap-10 px-20 py-8 max-[960px]:flex-col">
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={`${movie.title} 포스터`}
            className="aspect-[2/3] w-[200px] shrink-0 rounded-xl object-cover shadow-lg"
          />
        ) : (
          <div className="flex aspect-[2/3] w-[200px] shrink-0 items-center justify-center rounded-xl bg-line text-sm text-muted shadow-lg">
            이미지 없음
          </div>
        )}

        <div className="min-w-0 flex-1">
          {movie.tagline && <h2 className="text-xl font-bold">{movie.tagline}</h2>}
          <p className="mt-4 max-w-[640px] whitespace-pre-line leading-7 text-muted">
            {movie.overview || "줄거리 정보가 없어요."}
          </p>
          <button
            type="button"
            aria-pressed={isBookmarked}
            onClick={() => toggleBookmark(movie.id)}
            className={cn(
              "mt-6 flex h-11 cursor-pointer items-center gap-2 rounded-lg px-4 text-sm font-semibold",
              isBookmarked ? "bg-ink text-white" : "bg-brand text-white",
            )}
          >
            <BookmarkIcon className="size-4" filled={isBookmarked} />
            즐겨찾기
          </button>
        </div>

        <aside className="w-[330px] shrink-0 border-l border-line pl-10 max-[960px]:w-full max-[960px]:border-l-0 max-[960px]:pl-0">
          <h2 className="text-xl font-bold">내 평점</h2>
          <p className="mt-1 text-sm text-muted">별점은 필수, 후기는 선택이에요.</p>

          <div className="mt-3 flex gap-1.5">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                aria-label={`${value}점`}
                onClick={() => setRating(value)}
                className={cn(
                  "flex size-[42px] cursor-pointer items-center justify-center rounded-lg border border-line bg-white",
                  value <= rating ? "text-yellow-400" : "text-muted",
                )}
              >
                <StarIcon className="size-5" />
              </button>
            ))}
          </div>

          <textarea
            placeholder="영화를 보고 느낀 점을 남겨보세요."
            className="mt-3 h-[120px] w-full resize-none rounded-lg border border-line bg-white p-3 text-sm outline-none placeholder:text-muted"
          />
          <button
            type="button"
            className="mt-3 h-11 w-full cursor-pointer rounded-lg bg-ink text-sm font-semibold text-white"
          >
            평점 저장
          </button>
        </aside>
      </div>
    </main>
  );
}