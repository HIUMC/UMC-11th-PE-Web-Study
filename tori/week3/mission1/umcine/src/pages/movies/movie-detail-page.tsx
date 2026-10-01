import { Link, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { movies } from "../../data/movies";
import { cn } from "../../utils/cn";

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const movie = movies.find((item) => item.id === Number(movieId));

  const [isBookmarked, setIsBookmarked] = useState(movie?.isBookmarked ?? false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState("");

  if (!movie) {
    return <main className="py-24 text-center">영화를 찾을 수 없어요.</main>;
  }

  function handleSubmitReview() {
    // 실제 서버 저장은 아직 없어요. 필요하면 여기서 API 호출을 추가해요.
    setReview("");
    setRating(0);
  }

  return (
    <main>
      <div className="relative h-[360px] w-full overflow-hidden">
        <img
          src={movie.backdropPath}
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        <Link
          to="/"
          className="absolute left-6 top-6 flex items-center gap-1 text-sm font-semibold text-white"
        >
          <img src="/icons/chevron-left.svg" alt="" className="h-4 w-4 invert" />
          영화 목록
        </Link>

        <div className="absolute bottom-6 left-0 w-full px-6">
          <div className="mx-auto max-w-[1280px]">
            <h1 className="text-3xl font-bold text-white">{movie.title}</h1>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-[1280px] grid-cols-[auto_1fr_320px] gap-8 px-6 py-8">
        <img
          src={movie.posterPath}
          alt={`${movie.title} 포스터`}
          className="h-[240px] w-[160px] shrink-0 rounded-lg object-cover"
        />

        <div className="min-w-0">
          <p className="text-sm text-text-muted">{movie.originalTitle}</p>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-text-sub">
            <span>{movie.releaseDate}</span>
            <span>·</span>
            <span>{movie.genres.join(" · ")}</span>
            <span>·</span>
            <span>{movie.runtime}</span>
          </div>

          <div className="mt-4 rounded-lg border border-border bg-surface p-4">
            <p className="font-bold">{movie.tagline}</p>
            <p className="mt-2 text-sm text-text-sub">{movie.overview}</p>
          </div>

          <button
            type="button"
            onClick={() => setIsBookmarked((prev) => !prev)}
            aria-pressed={isBookmarked}
            className={cn(
              "mt-4 flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold",
              isBookmarked
                ? "border-primary bg-primary text-white"
                : "border-border bg-surface text-text",
            )}
          >
            <img
              src={isBookmarked ? "/icons/bookmark.svg" : "/icons/bookmark-outline.svg"}
              alt=""
              className={cn("h-4 w-4", isBookmarked && "brightness-0 invert")}
            />
            {isBookmarked ? "북마크됨" : "북마크"}
          </button>
        </div>

        <div className="rounded-lg border border-border bg-surface p-4">
          <p className="font-bold">내 평점</p>
          <div className="mt-2 flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                aria-label={`${star}점`}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
                className="text-2xl leading-none"
              >
                <span
                  className={
                    star <= (hoverRating || rating) ? "text-yellow-400" : "text-gray-300"
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
            placeholder="영화에 대한 감상평을 남겨주세요."
            rows={4}
            className="mt-3 w-full resize-none rounded-lg border border-border bg-bg p-3 text-sm outline-none focus:border-primary"
          />
          <button
            type="button"
            onClick={handleSubmitReview}
            className="mt-3 w-full rounded-lg bg-gray-900 py-2 text-sm font-semibold text-white"
          >
            평점 저장
          </button>
        </div>
      </div>
    </main>
  );
}