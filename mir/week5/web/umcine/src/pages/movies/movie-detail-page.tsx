import { Link, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import type { TmdbMovieDetail } from "../../api/movies/models";
import { BookmarkButton } from "../../components/bookmark-button";
import { getMovieDetailErrorMessage } from "../../utils/movies/get-movie-detail-error-message";
import {
  getTmdbBackdropUrl,
  getTmdbPosterUrl,
} from "../../utils/movies/tmdb-image";

function formatRuntime(runtime: number | null) {
  if (runtime === null || runtime === undefined) {
    return "상영 시간 정보가 없어요.";
  }
  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;
  if (hours > 0 && minutes > 0) {
    return `${hours}시간 ${minutes}분`;
  }
  if (hours > 0) {
    return `${hours}시간`;
  }
  return `${minutes}분`;
}

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const parsedMovieId = Number(movieId);
  const isValidMovieId = Number.isInteger(parsedMovieId) && parsedMovieId > 0;

  const [movie, setMovie] = useState<TmdbMovieDetail | null>(null);
  const [isLoading, setIsLoading] = useState(isValidMovieId);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isValidMovieId) {
      return;
    }

    let ignore = false;

    async function loadMovie() {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const response = await getMovieDetail(parsedMovieId);
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

    loadMovie();

    return () => {
      ignore = true;
    };
  }, [parsedMovieId, isValidMovieId]);

  if (!isValidMovieId) {
    return <main>올바르지 않은 영화 번호예요.</main>;
  }

  if (isLoading) {
    return <main>영화 정보를 불러오는 중이에요.</main>;
  }

  if (errorMessage || !movie) {
    return <main>{errorMessage ?? "영화 정보를 불러오지 못했어요."}</main>;
  }

  const posterUrl = getTmdbPosterUrl(movie.poster_path);
  const backdropUrl = getTmdbBackdropUrl(movie.backdrop_path);

  return (
    <main>
      {backdropUrl ? (
        <img src={backdropUrl} alt="" aria-hidden="true" />
      ) : (
        <div>이미지 없음</div>
      )}
      <Link to="/">영화 목록</Link>
      {posterUrl ? (
        <img src={posterUrl} alt={`${movie.title} 포스터`} />
      ) : (
        <div>이미지 없음</div>
      )}

      <h1>{movie.title}</h1>
      <p>{movie.original_title}</p>
      <p>{movie.release_date}</p>
      <p>{movie.genres.map((genre) => genre.name).join(", ")}</p>
      <p>{formatRuntime(movie.runtime)}</p>
      {movie.tagline && <h2>{movie.tagline}</h2>}
      <p>{movie.overview}</p>

      <div style={{ marginTop: "20px" }}>
        <BookmarkButton movieId={movie.id} />
      </div>
    </main>
  );
}
