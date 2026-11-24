import Image from "next/image";
import Link from "next/link";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import type { TmdbMovieDetail } from "../../api/movies/models";
import BookmarkButton from "../../components/bookmark-button";
import { getMovieDetailErrorMessage } from "../../utils/movies/get-movie-detail-error-message";
import {
  getTmdbPosterUrl,
  getTmdbBackdropUrl,
} from "../../utils/movies/tmdb-image";

export async function MovieDetailPage({ movieId }: { movieId: number }) {
  if (!Number.isSafeInteger(movieId) || movieId < 1) {
    return <DetailError message="올바르지 않은 영화 번호예요." />;
  }

  let movie: TmdbMovieDetail;
  try {
    movie = await getMovieDetail(movieId);
  } catch (error) {
    return <DetailError message={getMovieDetailErrorMessage(error)} />;
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
        <Link href="/">← 영화 목록</Link>

        {backdropUrl ? (
          <Image
            className="detail-backdrop"
            src={backdropUrl}
            alt=""
            aria-hidden="true"
            width={1280}
            height={720}
            sizes="(max-width: 1328px) calc(100vw - 48px), 1280px"
          />
        ) : (
          <div className="detail-backdrop image-placeholder">
            이미지 없음
          </div>
        )}

        <div className="detail-content">
          {posterUrl ? (
            <Image
              className="detail-poster"
              src={posterUrl}
              alt={`${movie.title} 포스터`}
              width={240}
              height={360}
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

function DetailError({ message }: { message: string }) {
  return (
    <main className="main">
      <div className="page-content">
        <p role="alert">{message}</p>
        <Link href="/">영화 목록으로 돌아가기</Link>
      </div>
    </main>
  );
}
