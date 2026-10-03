import MovieCard from "./movie-card.tsx"
import type { Movie } from "../../types/movie.ts";

interface MovieGridProps {
    movies: Movie[];
    onToggleBookmark: (movieId: number) => void;
}

function MovieGrid({ movies, onToggleBookmark }: MovieGridProps)
{
    return(
        <div className="flex w-full flex-wrap gap-x-[18px] gap-y-5">
            {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} onToggleBookmark={onToggleBookmark} />
            ))}
        </div>
    )
}

export default MovieGrid;