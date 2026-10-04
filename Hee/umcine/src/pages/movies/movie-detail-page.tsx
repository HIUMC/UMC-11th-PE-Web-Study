import { Link, useParams } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { movies } from "../../data/movie";
import { useBookmarkStore } from "../../stores/bookmark-store";
import { cn } from "../../utils/cn";

const bookmarkIcon = "/icons/movie-icons/movie-icons/bookmark-outline.svg";
const starIcon = "/icons/movie-icons/movie-icons/star.svg";
const starOutlineIcon = "/icons/movie-icons/movie-icons/star-outline.svg";

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const movie = movies.find((item) => item.id === Number(movieId));
  const isBookmarked = useBookmarkStore((state) =>
    movie ? state.bookmarkedMovieIds.includes(movie.id) : false,
  );
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  if (!movie) {
    return (
      <main className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-[#F7F8FA] px-5 text-center">
        <div>
          <h1 className="text-2xl font-bold text-[#191D23]">영화를 찾을 수 없어요.</h1>
          <p className="mt-2 text-sm text-[#8A929E]">존재하지 않거나 삭제된 영화입니다.</p>
          <Link
            to="/"
            className="mt-6 inline-flex rounded-lg bg-[#191D23] px-5 py-3 text-sm font-semibold text-white"
          >
            영화 목록으로 돌아가기
          </Link>
        </div>
      </main>
    );
  }

  function handleReviewSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaved(true);
  }

  return (
    <main className="min-h-[calc(100vh-64px)] bg-[#F7F8FA]">
      <section className="relative min-h-[350px] overflow-hidden sm:min-h-[390px]">
        <img
          src={movie.backdropPath}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/10" />

        <div className="relative mx-auto flex min-h-[350px] max-w-[1100px] flex-col px-5 py-7 text-white sm:min-h-[390px] sm:py-8">
          <Link to="/" className="flex w-fit items-center gap-2 text-xs font-semibold hover:underline">
            <span aria-hidden="true">‹</span>
            영화 목록
          </Link>

          <div className="mt-auto pb-2">
            <h1 className="max-w-3xl text-3xl font-bold tracking-[-0.04em] drop-shadow sm:text-[40px] sm:leading-tight">
              {movie.title}
            </h1>
            <p className="mt-3 text-sm text-white/90">{movie.originalTitle}</p>
            <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-semibold text-white/95">
              <span>{movie.releaseDate}</span>
              <span aria-hidden="true">·</span>
              <span>{movie.genres.join(" · ")}</span>
              <span aria-hidden="true">·</span>
              <span>{movie.runtime}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1100px] gap-10 px-5 py-8 md:grid-cols-[180px_minmax(0,1fr)] lg:grid-cols-[180px_minmax(0,1fr)_300px] lg:gap-8">
        <div>
          <img
            src={movie.posterPath}
            alt={`${movie.title} 포스터`}
            className="aspect-[2/3] w-full max-w-[180px] rounded-xl object-cover shadow-lg"
          />
        </div>

        <div className="min-w-0 pt-1">
          <h2 className="text-xl font-bold tracking-[-0.025em] text-[#191D23]">{movie.tagline}</h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#68707C]">{movie.overview}</p>
          <button
            type="button"
            onClick={() => toggleBookmark(movie.id)}
            aria-pressed={isBookmarked}
            className={cn(
              "mt-5 inline-flex h-10 items-center gap-2 rounded-lg border px-4 text-sm font-semibold transition",
              isBookmarked
                ? "border-[#2F6FED] bg-[#2F6FED] text-white"
                : "border-[#D8DEE8] bg-white text-[#353B45] hover:border-[#2F6FED] hover:text-[#2F6FED]",
            )}
          >
            <img
              src={bookmarkIcon}
              alt=""
              className={cn("h-4 w-4", isBookmarked && "invert")}
            />
            {isBookmarked ? "즐겨찾기 해제" : "즐겨찾기"}
          </button>
        </div>

        <aside className="border-t border-[#DCE1E8] pt-6 md:col-span-2 lg:col-span-1 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-1">
          <h2 className="text-lg font-bold text-[#191D23]">내 평점</h2>
          <p className="mt-1 text-xs text-[#9CA3AF]">별점을 필수, 후기는 선택이에요.</p>

          <form onSubmit={handleReviewSubmit} className="mt-3">
            <fieldset>
              <legend className="sr-only">별점 선택</legend>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((score) => (
                  <button
                    key={score}
                    type="button"
                    onClick={() => {
                      setRating(score);
                      setIsSaved(false);
                    }}
                    aria-label={`${score}점`}
                    aria-pressed={rating === score}
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-lg border bg-white transition",
                      score <= rating ? "border-[#F6B923]" : "border-[#DCE1E8] hover:border-[#AEB6C2]",
                    )}
                  >
                    <img
                      src={score <= rating ? starIcon : starOutlineIcon}
                      alt=""
                      className="h-5 w-5"
                    />
                  </button>
                ))}
              </div>
            </fieldset>

            <textarea
              value={review}
              onChange={(event) => {
                setReview(event.target.value);
                setIsSaved(false);
              }}
              placeholder="영화를 보고 느낀 점을 남겨보세요."
              className="mt-3 h-24 w-full resize-none rounded-lg border border-[#DCE1E8] bg-white p-3 text-sm text-[#353B45] outline-none transition placeholder:text-[#A7ADB7] focus:border-[#2F6FED]"
            />
            <button
              type="submit"
              disabled={rating === 0}
              className="mt-2 h-10 w-full rounded-lg bg-[#191D23] text-sm font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isSaved ? "저장 완료" : "평점 저장"}
            </button>
          </form>
        </aside>
      </section>

      <footer className="mt-12 border-t border-[#E1E5EA] bg-white px-5 py-5">
        <div className="mx-auto flex max-w-[1100px] items-center justify-center gap-2 text-center text-[11px] text-[#8A929E] sm:justify-end">
          <img src="/umcine-images/images/logos/tmdb-logo.svg" alt="TMDB" className="h-3 w-auto" />
          <span>This product uses the TMDB API but is not endorsed or certified by TMDB.</span>
        </div>
      </footer>
    </main>
  );
}
