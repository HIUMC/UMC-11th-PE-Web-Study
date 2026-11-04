import { useEffect, useState } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { MovieGrid } from "../../components/movies/movie-grid";
import { Pagination } from "../../components/movies/pagination";
import { useBookmarkStore } from "../../stores/bookmark-store.ts";
import { toMovie } from "../../api/movies/movie-adapter";
import { getMovies } from "../../api/movies/get-movies.ts";
import type { TmdbMovieListItem } from "../../api/movies/models.ts";

const ITEMS_PER_PAGE = 10; //한페이지당 보여줄 영화 개수를 적음

type SortOrder = "default" | "title";
const SORT_STORAGE_KEY = "umcine-sort-order";
export function MovieListPage() {
  const { page: currentPage } = useSearch({ from: "/" });
  const navigate = useNavigate({ from: "/" });

  const [totalPages, setTotalPages] = useState(0);
  const [retryCount, setRetryCount] = useState(0);

  const [movies, setMovies] = useState<TmdbMovieListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const bookmarkIds = useBookmarkStore((state) => state.bookmarkedMovieIds);
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);

  // 영화 데이터에 현재 북마크 상태 반영(목데이터에서 API 연동 데이터로 변경)
  // adapter로 UI 타입 변환 + 북마크 상태 반영
  const APImovies = movies.map((movie) =>
    toMovie(movie, bookmarkIds.includes(movie.id)),
  );

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
      ? [...APImovies].sort((a, b) => a.title.localeCompare(b.title, "ko"))
      : APImovies;

  //영화목록 API 호출
  useEffect(() => {
    let ignore = false;
    async function loadMovies() {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const response = await getMovies({ page: currentPage });

        if (!ignore) {
          setMovies(response.results);
          setTotalPages(Math.min(response.total_pages, 500));
        }
      } catch {
        //로딩중
        if (!ignore) setErrorMessage("영화 목록을 불러오지 못했어요.");
      } finally {
        // 마지막에는 로딩 false
        if (!ignore) setIsLoading(false);
      }
    }

    loadMovies();

    return () => {
      ignore = true;
    };
  }, [currentPage, retryCount]);

  if (isLoading) {
    return <p>영화 목록을 불러오는 중이에요.</p>;
  }

  if (errorMessage) {
    return (
      <div className="flex flex-col items-center gap-4 py-20">
        <p>{errorMessage}</p>
        {/* 리트라이 버튼 */}
        <button
          type="button"
          onClick={() => setRetryCount((count) => count + 1)}
          className="cursor-pointer rounded-lg bg-black px-5 py-2 text-white"
        >
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <div>
      {sortedMovies.length === 0 ? (
        <p className="py-20 text-center">표시할 영화가 없어요.</p>
      ) : (
        <>
          <MovieGrid
            APImovies={sortedMovies}
            onToggleBookMark={toggleBookmark}
            sortOrder={sortOrder}
            onSortChange={setSortOrder}
          />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => {
              navigate({
                search: (prev) => ({ ...prev, page }),
              });
            }}
          />
        </>
      )}
    </div>
  );
}
