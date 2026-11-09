import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";

export function MovieListPage() {
  return (
    <main className="box-border flex min-h-[1185px] w-full flex-col gap-5 bg-[#f6f7f9] px-5 py-6 min-[481px]:px-10 min-[769px]:px-20">
      <h1 className="m-0 text-[32px] leading-[38px] font-extrabold tracking-[-0.8px] text-[#17191e]">
        영화 목록
      </h1>
      <MovieGrid />
      <Pagination />
    </main>
  );
}
