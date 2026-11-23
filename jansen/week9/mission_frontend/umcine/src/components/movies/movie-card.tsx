import Image from "next/image";
import Link from "next/link";
import type { TmdbMovieListItem } from "../../api/movies/models";
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";
import { BookmarkButton } from "./bookmark-button";

interface MovieCardProps {
  movie: TmdbMovieListItem;
  // 화면 맨 위에 보이는 카드는 이미지를 먼저 불러온다 (LCP 개선)
  priority?: boolean;
}

export default function MovieCard({ movie, priority = false }: MovieCardProps) {
  const posterUrl = getTmdbPosterUrl(movie.poster_path);
  const releaseDate = movie.release_date.replace(/-/g, ".");

  return (
    <article>
      <div className="relative aspect-[7/8] overflow-hidden rounded-xl bg-line">
        <Link className="relative block h-full" href={`/movies/${movie.id}`}>
          {posterUrl ? (
            <Image
              src={posterUrl}
              alt={movie.title}
              fill
              priority={priority}
              sizes="(max-width: 560px) 50vw, (max-width: 960px) 33vw, 20vw"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[13px] text-muted">
              이미지 없음
            </div>
          )}
        </Link>
        <BookmarkButton movieId={movie.id} className="absolute right-2 top-2" />
      </div>

      <h3 className="mt-2.5 truncate text-[15px] font-bold text-ink">
        <Link href={`/movies/${movie.id}`}>{movie.title}</Link>
      </h3>
      <p className="mt-1 text-[13px] text-muted">
        {releaseDate || "개봉일 정보 없음"}
      </p>
    </article>
  );
}
