import { Link, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import BookmarkButton from "../../components/bookmark-button";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
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

  const movieDetailQuery = useQuery({
    queryKey: ["movies", "detail", movieId],
    queryFn: () => getMovieDetail(movieId),
    enabled: isValidId,
    staleTime: 30 * 1000, // 30초 동안 캐시 유지
  });

  const movie = movieDetailQuery.data;

  if (
    !isValidId ||
    movieDetailQuery.isPending ||
    movieDetailQuery.isError ||
    !movie
  ) {
    const message = !isValidId
      ? "올바르지 않은 영화 번호예요."
      : movieDetailQuery.isPending
        ? "영화 정보를 불러오는 중이에요."
        : movieDetailQuery.isError
          ? getMovieDetailErrorMessage(movieDetailQuery.error)
          : "영화를 찾을 수 없어요.";

    return (
      <main className="main">
        <div className="page-content">
          <p role={isValidId && movieDetailQuery.isPending ? "status" : "alert"}>
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