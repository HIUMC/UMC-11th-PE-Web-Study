import type { Movie } from "../../types/movie";
import MovieCard from "./movie-card";
interface MovieGridProps { movies: Movie[]; onToggleBookmark: (movieId: number) => void; }
export default function MovieGrid({ movies, onToggleBookmark }: MovieGridProps) {
  if (!movies.length) return <p className="py-20 text-center text-zinc-500">표시할 영화가 없어요.</p>;
  return <section className="grid grid-cols-1 gap-x-5 gap-y-9 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5" aria-label="영화 목록">{movies.map((movie) => <MovieCard key={movie.id} movie={movie} onToggleBookmark={onToggleBookmark} />)}</section>;
}
