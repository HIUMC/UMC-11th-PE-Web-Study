import { useState } from "react";
import type { TmdbMovieListItem } from "../../api/movies/models";
import { MovieGrid } from "./movie-grid";
import Pagination from "./pagination";

// API 요청 코드를 바꾸지 않고, 이미 받은 목록을 10편씩 표시하는 화면용 컴포넌트예요.
// 워크북 3.1에서는 API의 page와 total_pages를 사용하는 방식으로 연결해요.
export function MovieListResults({ movies }: { movies: TmdbMovieListItem[] }) {
  const [displayPage, setDisplayPage] = useState(1);
  const totalPages = Math.ceil(movies.length / 10);
  const currentPage = Math.min(displayPage, Math.max(1, totalPages));
  return (
    <>
      <MovieGrid movies={movies.slice((currentPage - 1) * 10, currentPage * 10)} />
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setDisplayPage} />
    </>
  );
}
