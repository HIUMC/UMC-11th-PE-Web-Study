import Image from "next/image";
import Link from "next/link";
import type { TmdbMovie } from "@/api/movies/models";
import { getTmdbPosterUrl } from "@/utils/movies/tmdb-image";
import { FavoriteToggleButton } from "./favorite-toggle-button";

interface MovieCardProps {
  movie: TmdbMovie;
}

// Server Component입니다. 안에서 쓰는 FavoriteToggleButton만 Client Component예요.
export function MovieCard({ movie }: MovieCardProps) {
  const posterUrl = getTmdbPosterUrl(movie.poster_path);

  return (
    <li>
      <div className="relative overflow-hidden rounded-lg">
        <Link href={`/movies/${movie.id}`}>
          {posterUrl ? (
            <div className="relative aspect-2/3 w-full">
              <Image
                className="object-cover"
                src={posterUrl}
                alt={`${movie.title} 포스터`}
                fill
                sizes="(max-width: 768px) 50vw, 240px"
              />
            </div>
          ) : (
            <div className="flex aspect-2/3 w-full items-center justify-center bg-neutral-200 text-xs text-neutral-500">
              이미지 없음
            </div>
          )}
        </Link>
        <FavoriteToggleButton
          movieId={movie.id}
          className="absolute top-2 right-2 h-8 w-8 border-transparent"
        />
      </div>
      <p className="mt-2 text-sm font-medium text-neutral-900">{movie.title}</p>
      <p className="mt-1 text-xs text-neutral-500">{movie.release_date}</p>
    </li>
  );
}
