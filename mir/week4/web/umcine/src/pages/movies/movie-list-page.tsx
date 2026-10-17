import { useState } from "react";
import { MovieGrid } from "../../components/movies/movie-grid";
import { Pagination } from "../../components/movies/pagination";
import { movies } from "../../data/movies";
import { useUIStore } from "../../stores/ui-store";

export function MovieListPage() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const cardSize = useUIStore((state) => state.cardSize);
  const setCardSize = useUIStore((state) => state.setCardSize);

  return (
    <>
      <main className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col gap-5 px-5 py-6 md:px-[80px]">
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => setCardSize("sm")}
            className={`rounded px-3 py-1 text-sm ${cardSize === "sm" ? "bg-[#2563EB] text-white" : "bg-[#F6F7F9] text-[#475569]"}`}
          >
            작게
          </button>
          <button
            type="button"
            onClick={() => setCardSize("md")}
            className={`rounded px-3 py-1 text-sm ${cardSize === "md" ? "bg-[#2563EB] text-white" : "bg-[#F6F7F9] text-[#475569]"}`}
          >
            기본
          </button>
          <button
            type="button"
            onClick={() => setCardSize("lg")}
            className={`rounded px-3 py-1 text-sm ${cardSize === "lg" ? "bg-[#2563EB] text-white" : "bg-[#F6F7F9] text-[#475569]"}`}
          >
            크게
          </button>
        </div>

        <MovieGrid movies={movies} />
        <Pagination currentPage={currentPage} onPageChange={setCurrentPage} />
      </main>

      <footer className="mt-auto flex min-h-[57px] items-center border-t border-[#E3E6EB] bg-white px-5 py-4 md:px-[80px]">
        <div className="mx-auto flex w-full max-w-[1440px] items-center justify-end gap-2 text-xs font-normal leading-none text-[#606774]">
          <img
            className="block h-6 w-6"
            src="/images/logos/tmdb-logo.svg"
            alt="TMDB Logo"
          />
          <p>
            This product uses the TMDB API but is not endorsed or certified by{" "}
            <span className="underline decoration-solid">TMDB</span>.
          </p>
        </div>
      </footer>
    </>
  );
}
