import { Link } from "@tanstack/react-router";
import type { Movie } from "../../types/movie";
import { BookmarkButton } from "../bookmark-button";

interface MovieCardProps {
    movie: Movie;
}

export default function MovieCard({
    movie,
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

                <BookmarkButton movieId={movie.id} />
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
