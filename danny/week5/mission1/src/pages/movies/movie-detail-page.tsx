import { Link, useParams } from "@tanstack/react-router";
import { useState, type SubmitEvent } from "react";
import { getMovieDetail } from "../../api/movies-api";
import { isNotFoundError } from "../../api/request-error";
import {
  ErrorState,
  LoadingState,
} from "../../components/feedback/request-status";
import { useAsync } from "../../hooks/use-async";
import { useBookmarkStore } from "../../stores/bookmark-store";
import type { Movie } from "../../types/movie";
import { cn } from "../../utils/cn";

const STAR_VALUES = [1, 2, 3, 4, 5];

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const id = Number(movieId);

  if (!Number.isInteger(id) || id <= 0) {
    return <MovieNotFound />;
  }

  return <MovieDetailLoader movieId={id} />;
}

function MovieNotFound() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-24 text-center">
      <p className="text-ink-muted">영화를 찾을 수 없어요.</p>
      <Link to="/" className="mt-4 inline-block text-sm font-bold text-brand">
        영화 목록
      </Link>
    </main>
  );
}

function MovieDetailLoader({ movieId }: { movieId: number }) {
  const { state, retry } = useAsync(`movie:${movieId}`, (signal) =>
    getMovieDetail(movieId, signal),
  );

  if (state.status === "loading") {
    return (
      <main className="mx-auto max-w-[1312px] px-4">
        <LoadingState />
      </main>
    );
  }

  if (state.status === "error") {
    if (isNotFoundError(state.error)) {
      return <MovieNotFound />;
    }
    return (
      <main className="mx-auto max-w-[1312px] px-4">
        <ErrorState error={state.error} onRetry={retry} />
      </main>
    );
  }

  return <MovieDetail key={state.data.id} movie={state.data} />;
}

function MovieDetail({ movie }: { movie: Movie }) {
  const isBookmarked = useBookmarkStore((state) =>
    state.bookmarkedIds.includes(movie.id),
  );
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);

  return (
    <main>
      <section className="relative h-[360px] overflow-hidden bg-ink">
        {movie.backdropPath && (
          <img
            src={movie.backdropPath}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-ink/70 via-ink/30 to-transparent" />
        <div className="relative mx-auto flex h-full max-w-[1312px] flex-col justify-between px-4 pt-7 pb-6 text-surface">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 self-start text-sm font-bold"
          >
            <img
              src="/icons/chevron-left.svg"
              alt=""
              className="h-6 w-6 invert"
            />
            영화 목록
          </Link>
          <div>
            <h1 className="text-5xl font-bold tracking-tight">
              {movie.title}
            </h1>
            <p className="mt-4 text-sm">{movie.originalTitle}</p>
            <p className="mt-1.5 flex flex-wrap gap-2 text-sm font-bold">
              <span>{movie.releaseDate}</span>
              {movie.genres.length > 0 && (
                <span>{movie.genres.join(" · ")}</span>
              )}
              {movie.runtime && <span>{movie.runtime}</span>}
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-[1312px] grid-cols-1 gap-8 px-4 py-6 lg:grid-cols-[1fr_360px]">
        <div className="flex flex-col gap-8 sm:flex-row">
          {movie.posterPath ? (
            <img
              src={movie.posterPath}
              alt={`${movie.title} 포스터`}
              className="h-[286px] w-[200px] shrink-0 self-start rounded-lg object-cover shadow-xl shadow-ink/20"
            />
          ) : (
            <div className="flex h-[286px] w-[200px] shrink-0 items-center justify-center rounded-lg bg-border text-sm text-ink-subtle">
              이미지 없음
            </div>
          )}
          <div className="flex flex-col items-start">
            {movie.tagline && (
              <h2 className="mb-4 text-xl font-bold text-ink">
                {movie.tagline}
              </h2>
            )}
            <p className="text-sm leading-relaxed text-ink-muted">
              {movie.overview || "줄거리 정보가 없어요."}
            </p>
            <button
              type="button"
              aria-pressed={isBookmarked}
              onClick={() => toggleBookmark(movie.id)}
              className={cn(
                "mt-4 inline-flex h-10 items-center gap-2 rounded-md bg-brand px-4 text-sm font-bold text-surface transition-colors hover:bg-brand-hover active:bg-brand-pressed",
                isBookmarked && "bg-brand-pressed",
              )}
            >
              <img
                src={
                  isBookmarked
                    ? "/icons/bookmark.svg"
                    : "/icons/bookmark-outline.svg"
                }
                alt=""
                className="h-5 w-5 invert"
              />
              즐겨찾기
            </button>
          </div>
        </div>

        <RatingForm />
      </div>
    </main>
  );
}

function RatingForm() {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border-border lg:border-l lg:pl-8"
    >
      <h2 className="text-xl font-bold text-ink">내 평점</h2>
      <p className="mt-1 text-xs text-ink-subtle">
        별점은 필수, 후기는 선택이에요.
      </p>
      <div className="mt-2.5 flex gap-1.5">
        {STAR_VALUES.map((value) => (
          <button
            key={value}
            type="button"
            aria-label={`${value}점`}
            aria-pressed={value <= rating}
            onClick={() => setRating(value)}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-md border border-border bg-surface",
              value <= rating && "border-ink bg-ink",
            )}
          >
            <img
              src="/icons/star.svg"
              alt=""
              className={cn(
                "h-5 w-5 opacity-70",
                value <= rating && "opacity-100 invert",
              )}
            />
          </button>
        ))}
      </div>
      <textarea
        aria-label="후기"
        value={review}
        onChange={(event) => setReview(event.target.value)}
        placeholder="영화를 보고 느낀 점을 남겨보세요."
        className="mt-2 block h-[100px] w-full resize-none rounded-lg border border-border bg-surface p-3 text-sm text-ink placeholder:text-ink-subtle focus:border-ink focus:outline-none"
      />
      <button
        type="submit"
        className="mt-2.5 h-10 w-full rounded-md bg-ink text-sm font-bold text-surface"
      >
        평점 저장
      </button>
    </form>
  );
}
