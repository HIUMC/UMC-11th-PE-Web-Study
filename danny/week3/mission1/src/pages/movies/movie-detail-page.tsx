import { Link, useParams } from "@tanstack/react-router";
import { useState, type SubmitEvent } from "react";
import { movies } from "../../data/movies";
import type { Movie } from "../../types/movie";
import { cn } from "../../utils/cn";

const STAR_VALUES = [1, 2, 3, 4, 5];

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const movie = movies.find((item) => item.id === Number(movieId));

  if (!movie) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-24 text-center">
        <p className="text-ink-muted">영화를 찾을 수 없어요.</p>
        <Link
          to="/"
          className="mt-4 inline-block text-sm font-bold text-brand"
        >
          영화 목록
        </Link>
      </main>
    );
  }

  return <MovieDetail key={movie.id} movie={movie} />;
}

function MovieDetail({ movie }: { movie: Movie }) {
  const [isBookmarked, setIsBookmarked] = useState(movie.isBookmarked);

  return (
    <main>
      <section className="relative h-[360px] overflow-hidden">
        <img
          src={movie.backdropPath}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />
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
              <span>{movie.genres.join(" · ")}</span>
              <span>{movie.runtime}</span>
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-[1312px] grid-cols-1 gap-8 px-4 py-6 lg:grid-cols-[1fr_360px]">
        <div className="flex flex-col gap-8 sm:flex-row">
          <img
            src={movie.posterPath}
            alt={`${movie.title} 포스터`}
            className="w-[200px] shrink-0 self-start rounded-lg shadow-xl shadow-ink/20"
          />
          <div className="flex flex-col items-start">
            <h2 className="text-xl font-bold text-ink">{movie.tagline}</h2>
            <p className="mt-4 text-sm leading-relaxed text-ink-muted">
              {movie.overview}
            </p>
            <button
              type="button"
              aria-pressed={isBookmarked}
              onClick={() => setIsBookmarked((prev) => !prev)}
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
      <div className="mt-3 flex gap-1.5">
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
              className={cn("h-5 w-5 opacity-70", value <= rating && "invert opacity-100")}
            />
          </button>
        ))}
      </div>
      <textarea
        aria-label="후기"
        value={review}
        onChange={(event) => setReview(event.target.value)}
        placeholder="영화를 보고 느낀 점을 남겨보세요."
        className="mt-3 h-[100px] w-full resize-none rounded-lg border border-border bg-surface p-3 text-sm text-ink placeholder:text-ink-subtle focus:border-ink focus:outline-none"
      />
      <button
        type="submit"
        className="mt-2 h-10 w-full rounded-md bg-ink text-sm font-bold text-surface"
      >
        평점 저장
      </button>
    </form>
  );
}
