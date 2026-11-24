import Image from "next/image";
import Link from "next/link";
import type { TmdbMovieListItem } from "../api/movies/models";
import { getTmdbPosterUrl } from "../utils/movies/tmdb-image";
import BookmarkButton from "./bookmark-button";

interface MovieCardProps {
  movie: TmdbMovieListItem;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const posterUrl = getTmdbPosterUrl(movie.poster_path);
  const detailHref = `/movies/${movie.id}`;

  return (
    <article className="movie-card">
      <div className="poster-wrapper">
        <Link href={detailHref}>
          {posterUrl ? (
            <Image
              className="movie-poster"
              src={posterUrl}
              alt={`${movie.title} 포스터`}
              width={440}
              height={500}
              sizes="(max-width: 768px) calc((100vw - 68px) / 2), (max-width: 1328px) calc((100vw - 128px) / 5), 240px"
            />
          ) : (
            <div className="movie-poster movie-poster-placeholder">
              이미지 없음
            </div>
          )}
        </Link>

        <BookmarkButton movieId={movie.id} variant="icon" />
      </div>

      <h3>
        <Link href={detailHref}>
          {movie.title}
        </Link>
      </h3>

      <p>{movie.release_date}</p>
    </article>
  );
}
