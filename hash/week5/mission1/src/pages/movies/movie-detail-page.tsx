import { useEffect, useState } from "react";
import { Link, useParams } from "@tanstack/react-router";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import MovieRatingForm from "../../components/movies/movie-rating-form";
import MovieImage from "../../components/movies/movie-image";
import RequestMessage from "../../components/movies/request-message";
import { useBookmarkStore } from "../../stores/bookmark-store";
import type { MovieDetailData } from "../../types/movie";
import { cn } from "../../utils/cn";
import { toMovieDetail } from "../../utils/movies/movie-adapter";
import { getMovieDetailErrorMessage } from "../../utils/movies/get-movie-detail-error-message";

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const parsedMovieId = Number(movieId);

  if (!Number.isSafeInteger(parsedMovieId) || parsedMovieId <= 0) {
    return (
      <main className="flex-1 px-6">
        <RequestMessage message="올바르지 않은 영화 번호예요." isError />
        <div className="pb-12 text-center">
          <Link to="/" className="font-semibold text-[#4765df] hover:underline">
            영화 목록으로 돌아가기
          </Link>
        </div>
      </main>
    );
  }

  return <MovieDetailContent key={parsedMovieId} movieId={parsedMovieId} />;
}

function MovieDetailContent({ movieId }: { movieId: number }) {
  const [movie, setMovie] = useState<MovieDetailData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const isBookmarked = useBookmarkStore(
    (state) => state.bookmarkedMovieIds.includes(movieId),
  );
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);

  useEffect(() => {
    let ignore = false;

    async function loadMovie() {
      try {
        const result = await getMovieDetail(movieId);
        if (!ignore) setMovie(toMovieDetail(result));
      } catch (error) {
        if (!ignore) setErrorMessage(getMovieDetailErrorMessage(error));
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    void loadMovie();
    return () => { ignore = true; };
  }, [movieId, attempt]);

  function retry() {
    setIsLoading(true);
    setErrorMessage(null);
    setAttempt((value) => value + 1);
  }

  if (isLoading || errorMessage || !movie) {
    return (
      <main className="flex-1 bg-[#f5f6f8] px-6">
        {isLoading ? (
          <RequestMessage message="영화 정보를 불러오는 중이에요." />
        ) : (
          <RequestMessage
            message={errorMessage ?? "영화를 찾을 수 없어요."}
            isError
            onRetry={retry}
          />
        )}
        {!isLoading && (
          <div className="pb-12 text-center">
            <Link to="/" className="font-semibold text-[#4765df] hover:underline">
              영화 목록으로 돌아가기
            </Link>
          </div>
        )}
      </main>
    );
  }

  return (
    <main className="flex-1 bg-[#f5f6f8]">
      <section className="relative isolate overflow-hidden bg-gray-700 text-white">
        <MovieImage
          src={movie.backdropPath}
          alt=""
          className="absolute inset-0 -z-20 h-full w-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-linear-to-r from-black/75 via-black/35 to-black/10" />
        <div className="mx-auto flex min-h-[360px] max-w-[1328px] flex-col justify-between gap-12 px-6 py-6 sm:min-h-[380px]">
          <Link to="/" className="inline-flex items-center gap-2 self-start text-sm font-semibold hover:underline">
            <img src="/icons/chevron-left.svg" alt="" className="h-5 w-5 invert" />
            영화 목록
          </Link>
          <div>
            <h1 className="max-w-[900px] text-3xl font-extrabold leading-tight tracking-tight sm:text-[40px]">
              {movie.title}
            </h1>
            <p className="mt-3 text-sm text-white/90">{movie.originalTitle}</p>
            <p className="mt-2 text-sm font-semibold text-white/90">
              {movie.releaseDate || "개봉일 정보 없음"} · {movie.genres.join(", ") || "장르 정보 없음"} · {movie.runtime}
            </p>
          </div>
        </div>
      </section>
      <div className="mx-auto grid max-w-[1328px] gap-8 px-6 pb-20 pt-6 lg:grid-cols-[200px_minmax(0,1fr)_328px]">
        <MovieImage
          src={movie.posterPath}
          alt={`${movie.title} 포스터`}
          className="aspect-[2/3] w-[200px] max-w-full rounded-lg object-cover shadow-lg"
        />
        <section className="min-w-0">
          <h2 className="text-lg font-bold leading-snug">{movie.tagline}</h2>
          <p className="mt-4 whitespace-pre-line text-sm leading-7 text-[#6b7280]">{movie.overview}</p>
          <button
            type="button"
            aria-pressed={isBookmarked}
            onClick={() => toggleBookmark(movie.id)}
            className={cn(
              "mt-5 inline-flex cursor-pointer items-center gap-2 rounded-lg px-4 py-3 text-sm font-bold text-white transition-colors",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4765df]",
              isBookmarked ? "bg-[#344fc4] hover:bg-[#2b42a8]" : "bg-[#4765df] hover:bg-[#3b56ca]",
            )}
          >
            <img
              src={isBookmarked ? "/icons/bookmark.svg" : "/icons/bookmark-outline.svg"}
              alt=""
              className="h-4 w-4 invert"
            />
            {isBookmarked ? "즐겨찾기 해제" : "즐겨찾기"}
          </button>
        </section>
        <MovieRatingForm key={movie.id} />
      </div>
    </main>
  );
}
