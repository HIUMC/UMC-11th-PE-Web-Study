import { movies } from "../../data/movies";
import { MovieGrid } from "../../components/movies/movie-grid";

export function MovieListPage() {
  return (
    <main className="min-h-[calc(100vh-72px)] border-t-2 border-[#2696e8] bg-[#f5f6f8]">
      <div className="mx-auto w-[1050px] pb-[60px] pt-[45px]">
        <h1 className="mb-[15px] text-[30px] font-bold leading-[1.3] text-[#171717]">
          영화 목록
        </h1>
        <MovieGrid movies={movies} />
      </div>
    </main>
  );
}