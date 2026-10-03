import { useState } from "react";
import MovieGrid from "../../components/movies/movie-grid";
import { initialMovies } from "../../data/movies";
import "../../App.css";

function MovieListPage() {
    const [movies, setMovies] = useState(initialMovies);

    function handleToggleBookmark(movieId: number) {
        setMovies((currentMovies) =>
            currentMovies.map((movie) =>
                movie.id === movieId
                    ? { ...movie, isBookmarked: !movie.isBookmarked }
                    : movie,
            ),
        );
    }

    return (
        <main className="container">
            <h1 className="container-title">영화 목록</h1>
            <MovieGrid movies={movies} onToggleBookmark={handleToggleBookmark} />
        </main>
    );
}

export default MovieListPage;