import type { Movie } from "../types/movie";

interface MovieCardProps {
    movie: Movie;
    onToggleBookmark: (id:number) => void;
}

export default function MovieCard({
    movie,
    onToggleBookmark,
    }: MovieCardProps) {
    return (
        <article className="movie-card">
            <div className="movie-card__poster">
                <img 
                    src={movie.posterPath}
                    alt={movie.title} 
                    className="movie-card__image"
                />

                <button 
                    type="button"
                    className={
                        movie.isBookmarked
                        ? "movie-card__bookmark movie-card__bookmark--active"
                        : "movie-card__bookmark"
                    }
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
                      className="movie-card__bookmark-icon"
                    />
                </button>
            </div>

            <h2 className="movie-card__title">{movie.title}</h2>
            <p className="movie-card__release-date">{movie.releaseDate}</p>
        </article>
    );
}