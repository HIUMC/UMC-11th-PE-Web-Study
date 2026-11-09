import { Link, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { BookmarkButton } from "../../components/movies/bookmark-button";
import { movies } from "../../data/movies";

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const movie = movies.find((item) => item.id === Number(movieId));
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  if (!movie) {
    return <main className="p-16 text-center">영화를 찾을 수 없어요.</main>;
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <Link
          to="/"
          className="absolute left-6 top-6 flex items-center gap-1 text-sm text-white no-underline"
        >
          ← 영화 목록
        </Link>
      </div>

      <div className="mx-auto max-w-[1200px] px-6 pb-16 pt-6">
        <h1 className="text-3xl font-bold">{movie.title}</h1>
        <p className="mt-1 text-sm text-gray-500">{movie.originalTitle}</p>
        <p className="mt-2 text-sm text-gray-500">
          {movie.releaseDate} · {movie.genres.join(" · ")} · {movie.runtime}
        </p>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[240px_1fr_280px]">
          <img
            src={movie.posterPath}
            alt={`${movie.title} 포스터`}
            className="w-full max-w-[240px] rounded-lg object-cover"
          />

          <div>
            <h2 className="text-xl font-bold">{movie.tagline}</h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              {movie.overview}
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
              className="mt-3 h-24 w-full resize-none rounded-md border border-gray-300 p-3 text-sm outline-none"
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
