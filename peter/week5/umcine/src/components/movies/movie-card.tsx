import { Link } from "@tanstack/react-router";
import type { TmdbMovieListItem } from "../../api/movies/models";
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";
import { BookmarkButton } from "../bookmark-button";

interface MovieCardProps {
    movie: TmdbMovieListItem;
}

export default function MovieCard({
    movie,
    }: MovieCardProps) {
    const posterUrl = getTmdbPosterUrl(movie.poster_path);

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
                  {posterUrl ? (
                    <img
                        src={posterUrl}
                        alt={`${movie.title} 포스터`}
                        className="block h-full w-full object-cover"
                    />
                    ) : (
                    <div className="flex h-full w-full items-center justify-center bg-[#f6f7f9] text-sm text-[#606774]">
                        이미지 없음
                    </div>
                    )}
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
                {movie.release_date}
            </p>
        </article>
    );
}
