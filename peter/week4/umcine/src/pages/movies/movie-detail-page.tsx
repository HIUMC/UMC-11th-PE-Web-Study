import { useState } from "react";
import { Link, useParams } from "@tanstack/react-router";
import { movies } from "../../data/movies";
import { cn } from "../../utils/cn";
import { BookmarkButton } from "../../components/bookmark-button";

// 평점 저장
type MovieRatings = Record<number, number>;

const RATING_STORAGE_KEY = "umcine-ratings";

function readRatings(): MovieRatings {
  try {
    const savedRatings = localStorage.getItem(RATING_STORAGE_KEY);

    return savedRatings ? JSON.parse(savedRatings) : {};
  } catch {
    return {};
  }
}

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const movie = movies.find((item) => item.id === Number(movieId));

  const [ratings, setRatings] = useState<MovieRatings>(readRatings);

  if (!movie) {
    return <main>영화를 찾을 수 없어요.</main>;
  }

  const currentMovieId = movie.id;
  const rating = ratings[movie.id] ?? 0;

  // 클릭 구현
    function handleRatingClick(score: number) {
    setRatings((currentRatings) => ({
      ...currentRatings,
      [currentMovieId]: score,
    }));
  }
  // 평점 저장 함수
  function handleSaveRating() {
    if (rating === 0) {
      alert("별점을 선택해 주세요.");
      return;
    }

    const savedRatings = readRatings();

    const nextRatings = {
      ...savedRatings,
      [currentMovieId]: rating,
    };

    localStorage.setItem(
      RATING_STORAGE_KEY,
      JSON.stringify(nextRatings),
    );

    alert(`${rating}점이 저장되었습니다.`);
  }
  return (
    <main>
      <section className="relative mx-auto h-[360px] w-full max-w-[1440px] overflow-hidden">
        <img
          src={movie.backdropPath}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 flex h-full w-full flex-col justify-between px-6 py-6 text-white sm:px-10 xl:px-20">
          <Link
            to="/"
            className="flex h-6 w-[76px] items-center gap-1 text-white no-underline"
          >
            <span className="relative h-6 w-6 shrink-0" aria-hidden="true">
              <svg
                viewBox="0 0 6 12"
                fill="none"
                className="absolute top-1.5 left-[9px] h-3 w-1.5"
              >
                <path
                  d="M5 1L1 6L5 11"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className="flex h-4 w-12 shrink-0 items-center justify-center text-center text-[13px] leading-none font-bold whitespace-nowrap text-white">
              영화 목록
            </span>
          </Link>

          <div className="flex h-[99px] w-full max-w-[800px] flex-col gap-2">
            <h1 className="h-[50px] w-full text-[46px] leading-[49.68px] font-bold tracking-[-2.3px] text-white">
              {movie.title}
            </h1>

            <div className="h-[17px] w-full text-sm leading-none font-normal text-white">
              {movie.originalTitle}
            </div>

            <div className="flex h-4 w-full items-center gap-2 text-[13px] leading-none font-bold text-white">
              <span className="min-w-[70px] shrink-0 whitespace-nowrap">
                {movie.releaseDate}
              </span>
              <span>·</span>
              <span className="min-w-[80px] shrink-0 whitespace-nowrap">
                {movie.genres.join(" · ")}
              </span>
              <span>·</span>
              <span className="min-w-[61px] shrink-0 whitespace-nowrap">
                {movie.runtime}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto box-border flex h-auto w-full max-w-[1440px] flex-col items-start gap-8 px-6 py-6 sm:px-10 xl:h-[342px] xl:flex-row xl:px-20">
        <img
          src={movie.posterPath}
          alt={`${movie.title} 포스터`}
          className="h-[286px] w-[200px] shrink-0 rounded-[10px] bg-[#f6f7f9] object-cover shadow-[0px_12px_30px_0px_#0C0F141F]"
        />

        <section className="flex h-[163px] w-full max-w-[656px] flex-col gap-3 xl:min-w-0 xl:flex-1">
          <h2 className="h-[25px] w-full text-[21px] leading-none font-bold tracking-[-0.63px] text-[#17191e]">
            {movie.tagline}
          </h2>

          <p className="h-[72px] w-full text-sm leading-6 font-normal text-[#606774]">
            {movie.overview}
          </p>

          <BookmarkButton movieId={movie.id} variant="detail" />
      
        </section>

        <aside className="box-border flex h-[294px] w-full max-w-[360px] shrink-0 flex-col gap-2 border-l border-[#e3e6eb] pb-[41px] pl-[30px]">
          <h2 className="h-[25px] w-full text-[21px] leading-none font-bold tracking-[-0.63px] text-[#17191e]">
            내 평점
          </h2>

          <p className="h-3.5 w-full text-xs leading-none font-normal text-[#969da8]">
            별점은 필수, 후기는 선택이에요.
          </p>
          <div className="flex h-[38px] w-full items-center gap-1">
            {[1, 2, 3, 4, 5].map((score) => {
              const isSelected = score <= rating;

              return (
                <button
                  key={score}
                  type="button"
                  onClick={() => handleRatingClick(score)}
                  aria-label={`${score}점`}
                  aria-pressed={isSelected}
                  className={cn(
                    "box-border flex h-[38px] w-[38px] items-center justify-center rounded-lg border px-1.5 py-px",
                    isSelected
                      ? "border-[#2563eb] bg-blue-50"
                      : "border-[#e3e6eb] bg-white",
                  )}
                >
                  <img
                    src={
                      isSelected
                      ? "/icons/movie-icons/star.svg"
                      : "/icons/movie-icons/star-outline.svg"
                    }
                    alt=""
                    aria-hidden="true"
                    className="block h-6 w-6"
                  />
                </button>
              );
            })}
          </div>
          <textarea
            id="review-text"
            aria-label="한줄평"
            placeholder="영화를 보고 느낀 점을 남겨보세요."
            className="box-border h-[102px] w-full resize-none rounded-lg border border-[#e3e6eb] bg-white pt-4 pr-3 pb-[18px] pl-3"
          />

          <button
            id="save-rating"
            type="button"
            onClick={handleSaveRating}
            className="box-border flex h-[42px] w-full items-center justify-center rounded-lg border border-white bg-[#17191e] px-4 text-white"
          >
            <span className="flex h-[17px] w-[52px] items-center justify-center text-center text-sm leading-none font-extrabold">
              평점 저장
            </span>
          </button>
        </aside>
      </section>
    </main>
  );
}
