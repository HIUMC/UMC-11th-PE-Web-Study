import {useState} from "react";
import Header from "./components/header";
import MovieGrid from "./components/movie-grid";
import Pagination from "./components/pagination";
import {movies as initialMovies} from "./data/movies";
import "./App.css"


export default function App(){
    const [movies, setMovies] = useState(initialMovies);

    const toggleBookmark = (id: number) => {
        setMovies((currentMovies) =>
            currentMovies.map((movie) =>
                movie.id===id
                    ? {...movie, isBookmarked: !movie.isBookmarked}
                    : movie));
    };

    return (
        <>
            <Header />
            <main className="main-content">
                <h1 className="page-title">영화 목록</h1>
                <MovieGrid
                    movies={movies}
                    onToggleBookmark={toggleBookmark} />

                <Pagination />
            </main>
        </>
    );
}