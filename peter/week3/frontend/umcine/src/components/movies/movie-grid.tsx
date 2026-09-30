import MovieCard from "./movie-card";
import {movies} from "../../data/movies";
import { useEffect, useState } from "react";
import type {Movie} from "../../types/movie";

export default function MovieGrid () {

    const [movieList, setMovieList] = useState<Movie[]>(() => {
    const savedBookmarks = localStorage.getItem("bookmarkedMovieIds");

    if (!savedBookmarks) {
        return movies;
    }

    const bookmarkedIds = JSON.parse(savedBookmarks) as number[];

    return movies.map((movie) => ({
        ...movie,
        isBookmarked: bookmarkedIds.includes(movie.id),
    }));
    });

    useEffect(() => {
    const bookmarkedIds = movieList
        .filter((movie) => movie.isBookmarked)
        .map((movie) => movie.id);

    localStorage.setItem(
        "bookmarkedMovieIds",
        JSON.stringify(bookmarkedIds)
    );
    }, [movieList]);

    const handleToggleBookmark = (id: number) => {
    setMovieList((previousMovies) =>
        previousMovies.map((movie) =>
        movie.id === id
            ? { ...movie, isBookmarked: !movie.isBookmarked }
            : movie
        )
    );
    };
    return (
        <section className = "grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {movieList.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  onToggleBookmark={handleToggleBookmark}
                />
            ))}
        </section>
    );
}
