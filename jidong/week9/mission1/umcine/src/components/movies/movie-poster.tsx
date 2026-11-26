import Image from "next/image";
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";
import { cn } from "../../utils/cn";

interface MoviePosterProps {
  posterPath: string | null;
  title: string;
  sizes?: string;
  className?: string;
}

export function MoviePoster({
  posterPath,
  title,
  sizes = "240px",
  className,
}: MoviePosterProps) {
  const posterUrl = getTmdbPosterUrl(posterPath);

  if (!posterUrl) {
    return (
      <div
        className={cn(
          "flex h-full w-full items-center justify-center bg-gray-200 text-xs text-gray-500",
          className,
        )}
      >
        이미지 없음
      </div>
    );
  }

  return (
    <Image
      src={posterUrl}
      alt={`${title} 포스터`}
      fill
      sizes={sizes}
      className={cn("object-cover", className)}
    />
  );
}
