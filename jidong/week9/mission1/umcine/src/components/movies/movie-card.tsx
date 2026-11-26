import Link from "next/link";
import type { TmdbMovieListItem } from "../../api/movies/models";
import { formatReleaseDate } from "../../utils/movies/format-movie";
import { FavoriteButton } from "./favorite-button";
import { MoviePoster } from "./movie-poster";

interface MovieCardProps {
  movie: TmdbMovieListItem;
  isFavorite: boolean;
}

export default function MovieCard({ movie, isFavorite }: MovieCardProps) {
  return (
    <article className="flex flex-col gap-2">
      <div className="relative aspect-[2/3] overflow-hidden rounded-[10px]">
        <Link href={`/movies/${movie.id}`} className="block h-full w-full">
          <MoviePoster
            posterPath={movie.poster_path}
            title={movie.title}
            sizes="(min-width: 1280px) 220px, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          />
        </Link>
        <FavoriteButton
          movieId={movie.id}
          movieTitle={movie.title}
          isFavorite={isFavorite}
          className="absolute right-2 top-2"
        />
      </div>
      <Link href={`/movies/${movie.id}`}>
        <h3 className="text-sm">{movie.title}</h3>
      </Link>
      <p className="text-[13px] text-gray-500">
        {formatReleaseDate(movie.release_date)}
      </p>
    </article>
  );
}
