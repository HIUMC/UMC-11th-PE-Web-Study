import { useEffect, useState } from "react";
import { MovieGrid } from "../../components/movies/movie-grid";
import { movies as initialMovies } from "../../data/movies";
import { Pagination } from "../../components/movies/pagination";
import {
  readBookmarkIds,
  saveBookmarkIds,
} from "../../utils/bookmark-storage.ts";
import { useBookmarkStore } from "../../stores/bookmark-store.ts";

const ITEMS_PER_PAGE = 10; //한페이지당 보여줄 영화 개수를 적음

type SortOrder = "default" | "title";
const SORT_STORAGE_KEY = "umcine-sort-order";
export function MovieListPage() {
  const [currentPage, setCurrentPage] = useState(1);

  const bookmarkIds = useBookmarkStore((state) => state.bookmarkedMovieIds);

  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);

  // 영화 데이터에 현재 북마크 상태 반영
  const movies = initialMovies.map((movie) => ({
    ...movie,
    isBookmarked: bookmarkIds.includes(movie.id),
  }));

  //영화 정렬 기준을 설정해 브라우저에만 저장할 화면 설정 추가하기
  //저장된 설정이 'title' 이면 -> 제목순, 나머지는 기본순
  const [sortOrder, setSortOrder] = useState<SortOrder>(() =>
    localStorage.getItem(SORT_STORAGE_KEY) === "title" ? "title" : "default",
  );

  // 정렬 설정이 바뀌면 브라우저에 저장
  useEffect(() => {
    localStorage.setItem(SORT_STORAGE_KEY, sortOrder);
  }, [sortOrder]);

  //원본 배열을 복사해서 제목순으로 정렬
  const sortedMovies =
    sortOrder === "title"
      ? [...movies].sort((a, b) => a.title.localeCompare(b.title, "ko"))
      : movies;

  // 저장한 전체 목록을 페이지별로 나누기
  const totalPages = Math.ceil(sortedMovies.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentMovies = sortedMovies.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  return (
    <div className="">
      <MovieGrid
        movies={currentMovies}
        onToggleBookMark={toggleBookmark}
        sortOrder={sortOrder}

        onSortChange={(value) => {
          setSortOrder(value);
          setCurrentPage(1);
        }}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
