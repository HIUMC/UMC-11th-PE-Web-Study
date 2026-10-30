import { Link, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import BookmarkButton from "../../components/bookmark-button";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import type { TmdbMovieDetail } from "../../api/movies/models";
import { getMovieDetailErrorMessage } from "../../utils/movies/get-movie-detail-error-message";
import {
  getTmdbPosterUrl,
  getTmdbBackdropUrl,
} from "../../utils/movies/tmdb-image";

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const parsedMovieId = Number(movieId);

  return <MovieDetail key={movieId} movieId={parsedMovieId} />;
}

function MovieDetail({ movieId }: { movieId: number }) {
  const isValidId = Number.isInteger(movieId) && movieId > 0;

  const [movie, setMovie] = useState<TmdbMovieDetail | null>(null);
  const [isLoading, setIsLoading] = useState(isValidId);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    if (!Number.isInteger(movieId) || movieId <= 0) return;

    async function loadMovie() {
      try {
        const response = await getMovieDetail(movieId);

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

    void loadMovie();

    return () => {
      ignore = true;
    };
  }, [movieId]);

  if (!isValidId || isLoading || errorMessage || !movie) {
    const message = !isValidId
      ? "올바르지 않은 영화 번호예요."
      : isLoading
        ? "영화 정보를 불러오는 중이에요."
        : errorMessage ?? "영화를 찾을 수 없어요.";

    return (
      <main className="main">
        <div className="page-content">
          <p role={isValidId && isLoading ? "status" : "alert"}>
            {message}
          </p>

          <Link to="/">영화 목록으로 돌아가기</Link>
        </div>
      </main>
    );
  }

  const posterUrl = getTmdbPosterUrl(movie.poster_path);
  const backdropUrl = getTmdbBackdropUrl(movie.backdrop_path);

  const runtime =
    typeof movie.runtime === "number"
      ? `${Math.floor(movie.runtime / 60)}시간 ${movie.runtime % 60}분`
      : "상영 시간 정보가 없어요.";

  return (
    <main className="main">
      <div className="page-content">
        <Link to="/">← 영화 목록</Link>

        {backdropUrl ? (
          <img
            className="detail-backdrop"
            src={backdropUrl}
            alt=""
            aria-hidden="true"
          />
        ) : (
          <div className="detail-backdrop image-placeholder">
            이미지 없음
          </div>
        )}

        <div className="detail-content">
          {posterUrl ? (
            <img
              className="detail-poster"
              src={posterUrl}
              alt={`${movie.title} 포스터`}
            />
          ) : (
            <div className="detail-poster image-placeholder">
              이미지 없음
            </div>
          )}

          <div>
            <h1>{movie.title}</h1>
            <p>{movie.original_title}</p>
            <p>{movie.release_date}</p>
            <p>{movie.genres.map((genre) => genre.name).join(", ")}</p>
            <p>{runtime}</p>
            <h2>{movie.tagline}</h2>
            <p>{movie.overview}</p>

            <BookmarkButton movieId={movie.id} />
          </div>
        </div>
      </div>
    </main>
  );
}