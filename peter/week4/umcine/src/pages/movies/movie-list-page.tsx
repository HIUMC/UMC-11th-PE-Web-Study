import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";
import { useMoviePreferenceStore } from "../../stores/movie-preference-store";

export function MovieListPage() {
  const sortOption = useMoviePreferenceStore(
    (state) => state.sortOption,
  );

  const setSortOption = useMoviePreferenceStore(
    (state) => state.setSortOption,
  );

  return (
    <main className="box-border flex min-h-[1185px] w-full flex-col gap-5 bg-[#f6f7f9] px-5 py-6 min-[481px]:px-10 min-[769px]:px-20">
      <div className="flex items-center justify-between gap-4">
        <h1 className="m-0 text-[32px] leading-[38px] font-extrabold tracking-[-0.8px] text-[#17191e]">
          영화 목록
        </h1>

        <select
          value={sortOption}
          onChange={(event) =>
            setSortOption(
              event.target.value === "title" ? "title" : "default",
            )
          }
          aria-label="영화 정렬"
          className="h-10 rounded-lg border border-[#e3e6eb] bg-white px-3 text-sm text-[#17191e]"
        >
          <option value="default">기본순</option>
          <option value="title">제목순</option>
        </select>
      </div>

      <MovieGrid />
      <Pagination />
    </main>
  );
}
