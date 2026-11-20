import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";
import { useState } from "react";
import { getMovies } from "../../api/movies/get-movies";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useAuthStore } from "../../stores/auth-store";
import { getMe } from "../../api/members/me";
import { getFavorites } from "../../api/favorites/get-favorites";
import { useAddFavoriteMutation } from "../../hooks/use-add-favorite-mutation";
import { useDeleteFavoriteMutation } from "../../hooks/use-delete-favorite-mutation";

export function MovieListPage() {
  const navigate = useNavigate();
  const accessToken = useAuthStore((state) => state.accessToken);

  const meQuery = useQuery({
    queryKey: ["members", "me"],
    queryFn: getMe,
    enabled: Boolean(accessToken),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  const memberEmail = accessToken ? meQuery.data?.email : undefined;

  const favoritesQuery = useQuery({
    queryKey: ["members", "favorites", memberEmail],
    queryFn: getFavorites,
    enabled: Boolean(accessToken && memberEmail),
    retry: false,
  });

  const addFavoriteMutation = useAddFavoriteMutation();
  const deleteFavoriteMutation = useDeleteFavoriteMutation();

  const bookmarkedMovieIds =
    accessToken && memberEmail
      ? (favoritesQuery.data ?? []).map((favorite) => favorite.movieId)
      : [];

  const toggleBookmark = (movieId: number) => {
    if (!accessToken) {
      void navigate({ to: "/login" });
      return;
    }

    if (
      !memberEmail ||
      !favoritesQuery.isSuccess ||
      addFavoriteMutation.isPending ||
      deleteFavoriteMutation.isPending
    ) {
      return;
    }

    if (bookmarkedMovieIds.includes(movieId)) {
      deleteFavoriteMutation.mutate(movieId);
    } else {
      addFavoriteMutation.mutate(movieId);
    }
  };
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const moviesQuery = useQuery({
    queryKey: ["movies", "list", { page, pageSize }],
    queryFn: async () => {
      // TMDB returns 20 movies per API page; display 10 per screen.
      const apiPageSize = 20;
      const start = (page - 1) * pageSize;
      const firstApiPage = Math.floor(start / apiPageSize) + 1;
      const lastApiPage = Math.floor((start + pageSize - 1) / apiPageSize) + 1;
      const responses = await Promise.all(
        Array.from({ length: lastApiPage - firstApiPage + 1 }, (_, index) =>
          getMovies({ page: firstApiPage + index }),
        ),
      );
      const offset = start % apiPageSize;
      return {
        results: responses
          .flatMap((response) => response.results)
          .slice(offset, offset + pageSize),
        // TMDB exposes at most 500 API pages.
        totalPages: Math.ceil(
          Math.min(responses[0].total_results, 500 * apiPageSize) / pageSize,
        ),
      };
    },
  });

  const movies = moviesQuery.data?.results ?? [];

  return (
    <main className="mx-auto w-full max-w-[1440px] flex-1 px-5 pb-14 pt-8 sm:px-8 md:px-10 xl:px-20">
      <h1 className="mb-4 text-left text-[32px] leading-[1.3] font-bold text-[#1f1f1f]">
        영화 목록
      </h1>
      {accessToken && (meQuery.isError || favoritesQuery.isError) && (
        <p role="alert" className="mb-4 text-sm text-red-500">
          즐겨찾기 상태를 불러오지 못했어요.{" "}
          <button
            type="button"
            className="underline"
            onClick={() => {
              if (meQuery.isError) {
                void meQuery.refetch();
              } else {
                void favoritesQuery.refetch();
              }
            }}
          >
            다시 시도
          </button>
        </p>
      )}
      {moviesQuery.isPending ? (
        <p>영화 목록을 불러오는 중이에요.</p>
      ) : moviesQuery.isError ? (
        <p role="alert">{moviesQuery.error.message}</p>
      ) : movies.length === 0 ? (
        <p>조건에 맞는 영화가 없어요.</p>
      ) : (
        <MovieGrid
          movies={movies}
          bookmarkedMovieIds={bookmarkedMovieIds}
          onToggleBookmark={toggleBookmark}
        />
      )}

      {moviesQuery.isSuccess && movies.length > 0 && (
        <Pagination
          currentPage={page}
          totalPages={moviesQuery.data.totalPages}
          onPageChange={setPage}
        />
      )}
    </main>
  );
}
