import type { Movie } from "../types/movie";
import MovieCard from "./movie-card";
interface MovieGridProps { movies: Movie[]; onToggleBookmark: (movieId: number) => void; }
export default function MovieGrid({ movies, onToggleBookmark }: MovieGridProps) { if (!movies.length) return <p className="empty-message">표시할 영화가 없어요.</p>; return <section className="movie-grid" aria-label="영화 목록">{movies.map((movie) => <MovieCard key={movie.id} movie={movie} onToggleBookmark={onToggleBookmark} />)}</section>; }
