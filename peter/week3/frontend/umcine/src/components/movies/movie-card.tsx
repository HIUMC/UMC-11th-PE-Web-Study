import { cn } from "../../utils/cn";
import { Link } from "@tanstack/react-router";
import type { Movie } from "../../types/movie";

interface MovieCardProps {
    movie: Movie;
    onToggleBookmark: (id:number) => void;
}

export default function MovieCard({
    movie,
    onToggleBookmark,
    }: MovieCardProps) {
    return (
        <article className="flex w-full flex-col items-start gap-1">
            <div className="relative aspect-[241.6/274]
                w-full overflow-hidden rounded-[10px] bg-[#f6f7f9]"
            >
                <Link
                  to="/movies/$movieId"
                  params={{ movieId: String(movie.id) }}
                  aria-label={`${movie.title} 상세 보기`}
                  className="block h-full w-full"
                >
                  <img
                    src={movie.posterPath}
                    alt={movie.title}
                    className="block h-full w-full object-cover"
                  />
                </Link>

                <button
                    type="button"
                    className={cn(
                        "absolute right-2 top-2",
                        "flex h-[34px] w-[34px] items-center justify-center",
                        "rounded-lg border p-0 text-white",
                        movie.isBookmarked
                            ? "border-blue-600 bg-blue-600"
                            : "border-white bg-black/60"
                    )}
                    aria-label={movie.isBookmarked ? "북마크 해제" : "북마크 추가"}
                    aria-pressed={movie.isBookmarked}
                    onClick={()=>onToggleBookmark(movie.id)}
                >
                    <img
                      src={
                        movie.isBookmarked
                        ? "/icons/movie-icons/bookmark.svg"
                        : "/icons/movie-icons/bookmark-outline.svg"
                      }
                      alt=""
                      className="block h-6 w-6 brightness-0 invert"
                    />
                </button>
            </div>

            <h2 className="m-0 w-full pt-[5px] text-[14px]
                font-extrabold leading-[17px] text-[#17191e]">
                <Link
                  to="/movies/$movieId"
                  params={{ movieId: String(movie.id)}}
                  className="text-inherit no-underline"
                >
                  {movie.title}
                </Link>
            </h2>
            <p className="m-0 w-full text-xs font-normal leading-[14px] text-[#969da8]">
                {movie.releaseDate}
            </p>
        </article>
    );
}
