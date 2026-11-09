import { useState } from "react";
import { Link, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getMovieDetail } from "../api/movies/get-movie-detail";
import type { TmdbMovieDetail } from "../api/movies/models";
import { getMovieDetailErrorMessage } from "../utils/movies/get-movie-detail-error-message";
import { getTmdbImageUrl } from "../utils/movies/tmdb-image";
import { cn } from "../utils/cn";

function formatRuntime(runtime: number | null) {
  if (runtime === null) return "상영 시간 정보가 없어요.";

  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;
  if (hours === 0) return `${minutes}분`;
  return minutes === 0 ? `${hours}시간` : `${hours}시간 ${minutes}분`;
}

export function MovieDetailPage() {
  const { movieId: movieIdParam } = useParams({ from: "/movies/$movieId" });
  const movieId = Number(movieIdParam);
  const isValidMovieId = Number.isInteger(movieId) && movieId > 0;

  const movieDetailQuery = useQuery({
    queryKey: ["movies", "detail", movieId],
    queryFn: () => getMovieDetail(movieId),
    enabled: isValidMovieId,
  });

  // 성공했으면 상세 화면을 보여줘요. 영화가 바뀌면 찜 상태도 새로 시작해요.
  if (isValidMovieId && movieDetailQuery.isSuccess) {
    const movie = movieDetailQuery.data;
    return <MovieDetailContent key={movie.id} movie={movie} />;
  }

  const isLoading = isValidMovieId && movieDetailQuery.isPending;
  const statusMessage = !isValidMovieId
    ? "올바르지 않은 영화 번호예요."
    : isLoading
      ? "영화 정보를 불러오는 중이에요..."
      : getMovieDetailErrorMessage(movieDetailQuery.error);

  return (
    <main className="page-content detail-not-found">
      <p>{statusMessage}</p>
      {!isLoading && (
        <Link className="detail-back-link" to="/">
          영화 목록으로 돌아가기
        </Link>
      )}
    </main>
  );
}

function MovieDetailContent({ movie }: { movie: TmdbMovieDetail }) {
  const [isBookmarked, setIsBookmarked] = useState(false);

  return (
    <main className="movie-detail">
      {movie.backdrop_path && (
        <div
          className="detail-backdrop"
          style={{ backgroundImage: `url(${getTmdbImageUrl(movie.backdrop_path, "original")})` }}
          aria-hidden="true"
        />
      )}
      <div className="detail-content">
        <img className="detail-poster" src={getTmdbImageUrl(movie.poster_path)} alt={`${movie.title} 포스터`} />
        <section className="detail-info" aria-labelledby="movie-detail-title">
          <h1 id="movie-detail-title">{movie.title}</h1>
          <p className="detail-original-title">{movie.original_title}</p>
          <div className="movie-meta detail-meta">
            <span>{movie.release_date || "개봉일 미정"}</span>
            <span className="meta-divider" />
            <span>{formatRuntime(movie.runtime)}</span>
            <span className="meta-divider" />
            <span>{movie.genres.map((genre) => genre.name).join(", ")}</span>
          </div>
          {movie.tagline && <p className="detail-tagline">{movie.tagline}</p>}
          <h2 className="detail-section-title">줄거리</h2>
          <p className="detail-overview">{movie.overview}</p>
          <button
            className={cn("detail-bookmark", isBookmarked && "bookmarked")}
            type="button"
            aria-pressed={isBookmarked}
            onClick={() => setIsBookmarked((value) => !value)}
          >
            <img src={isBookmarked ? "/icons/bookmark.svg" : "/icons/bookmark-outline.svg"} alt="" />
            {isBookmarked ? "찜 해제" : "찜하기"}
          </button>
        </section>
      </div>
    </main>
  );
}

export default MovieDetailPage;
