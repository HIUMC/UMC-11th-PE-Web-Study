import "./movie-grid.css"
import MovieCard from "./movie-card.tsx"
import type { Movie } from "../types/movie.ts";

interface MovieGridProps {
    movies: Movie[];
    onToggleBookmark: (movieId: number) => void;
}

function MovieGrid({ movies, onToggleBookmark }: MovieGridProps)
{
    return(
        <div className = "movie-grid">
            {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} onToggleBookmark={onToggleBookmark} />
            ))}
        </div>
    )
}

export default MovieGrid;