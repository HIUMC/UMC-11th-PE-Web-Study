import bookmarkIcon from "../assets/bookmark.svg" 
import bookmarkFillIcon from "../assets/bookmark-fill.svg"
import "./movie-card.css"
import type { Movie } from "../types/movie";

interface MovieCardProps {
    movie: Movie;
    onToggleBookmark: (movieId: number) => void;
}

function MovieCard({ movie, onToggleBookmark }: MovieCardProps)
{
    return (
        <article className="movie-card">
            <div className = "poster">
                <img className = "poster-image" src={movie.posterUrl} alt="Movie Poster" />
                <div
                    className = {movie.bookmarked ? "bookmark active" : "bookmark"}
                    onClick={() => onToggleBookmark(movie.id)}
                >
                    <img src={movie.bookmarked ? bookmarkFillIcon : bookmarkIcon} alt="Bookmark" />
                </div>
            </div>
            <div className = "movie-title">{movie.title}</div>
            <div className = "movie-meta">{movie.releaseDate}</div>
        </article>
    )
}

export default MovieCard;