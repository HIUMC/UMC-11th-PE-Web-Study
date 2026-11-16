import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Route } from "../../routes/movies.$movieId";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import { useAuthStore } from "../../stores/auth-store";
import { getFavoriteStatus } from "../../api/favorites/get-favorite-status";
import { createFavorite } from "../../api/favorites/create-favorite";
import { deleteFavorite } from "../../api/favorites/delete-favorite";
import {
  getTmdbPosterUrl,
  getTmdbBackdropUrl,
} from "../../utils/movies/tmdb-image";
import { getMovieDetailErrorMessage } from "../../utils/movies/get-movie-detail-error-message";
import { cn } from "../../utils/cn";
import { MemberRatingPanel } from "../../components/movies/member-rating-panel";

export function MovieDetailPage() {
  const { movieId: movieIdParam } = Route.useParams();
  const movieId = Number(movieIdParam);
  const isValidMovieId = Number.isInteger(movieId) && movieId > 0;

  const movieDetailQuery = useQuery({
    queryKey: ["movies", "detail", movieId],
    queryFn: () => getMovieDetail(movieId),
    enabled: isValidMovieId,
    staleTime: 30 * 1000,
  });

  const queryClient = useQueryClient();
  const accessToken = useAuthStore((state) => state.accessToken);

  const favoriteStatusQuery = useQuery({
    queryKey: ["favorites", "status", movieId, accessToken],
    queryFn: () => getFavoriteStatus(movieId),
    enabled: Boolean(accessToken) && isValidMovieId,
  });

  const isBookmarked =
    favoriteStatusQuery.data?.isFavorite ?? false;

  const favoriteMutation = useMutation({
    mutationFn: async (wasFavorite: boolean) => {
      if (wasFavorite) {
        await deleteFavorite(movieId);
      } else {
        await createFavorite(movieId);
      }
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["favorites", "status", movieId, accessToken],
        }),
        queryClient.invalidateQueries({
          queryKey: ["favorites", "list", accessToken],
        }),
      ]);
    },
    onError: () => {
      alert("즐겨찾기를 변경하지 못했어요. 다시 시도해 주세요.");
    },
  });

  function handleToggleFavorite() {
    if (!accessToken) {
      alert("로그인 후 이용해 주세요.");
      return;
    }

    if (
      !favoriteStatusQuery.isSuccess ||
      favoriteStatusQuery.isFetching ||
      favoriteMutation.isPending
    ) {
      return;
    }

    favoriteMutation.mutate(isBookmarked);
  }

  const isFavoriteButtonDisabled =
    favoriteMutation.isPending ||
    Boolean(
      accessToken &&
        (!favoriteStatusQuery.isSuccess ||
          favoriteStatusQuery.isFetching),
    );

  if (!isValidMovieId) {
    return (
      <main className="page-container py-24 text-center text-gray-500">
        올바르지 않은 영화 번호예요.
      </main>
    );
  }

  if (movieDetailQuery.isPending) {
    return (
      <main className="page-container py-24 text-center text-gray-500">
        영화 상세 정보를 불러오는 중이에요.
      </main>
    );
  }

  if (movieDetailQuery.isError) {
    return (
      <main
        role="alert"
        className="page-container py-24 text-center text-gray-500"
      >
        {getMovieDetailErrorMessage(movieDetailQuery.error)}
      </main>
    );
  }

  const movie = movieDetailQuery.data;
  const posterUrl = getTmdbPosterUrl(movie.poster_path);
  const backdropUrl = getTmdbBackdropUrl(movie.backdrop_path);
  const genreNames = movie.genres.map((genre) => genre.name).join(", ");

  const runtimeText =
    typeof movie.runtime === "number"
      ? `${Math.floor(movie.runtime / 60)}시간 ${movie.runtime % 60}분`
      : "상영 시간 정보가 없어요.";

  return (
    <main className="flex-1">
      <div className="relative flex h-[300px] flex-col justify-end overflow-hidden bg-gray-200 pb-6 text-white">
        {backdropUrl ? (
          <img
            src={backdropUrl}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-600">
            이미지 없음
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

        <div className="absolute inset-x-0 top-5 z-10">
            <div className="page-container">
              <Link
                to="/"
                className="inline-flex items-center gap-1 py-1 text-xs font-medium text-white drop-shadow-md hover:underline"
              >
                <img
                  src="/icons/chevron-left.svg"
                  alt=""
                  className="h-4 w-4 shrink-0 invert"
                />
                영화 목록
              </Link>
            </div>
          </div>

        <div className="page-container relative z-10">
          <h1 className="text-[28px] font-bold tracking-tight sm:text-[36px]">
            {movie.title}
          </h1>

          <p className="mt-1 text-xs text-gray-300">
            {movie.original_title}
          </p>

          <div className="mt-1 flex flex-wrap gap-x-2 gap-y-1 text-xs font-semibold text-white">
            <span>{movie.release_date}</span>
            {genreNames && <span>{genreNames}</span>}
            <span>{runtimeText}</span>
          </div>
        </div>
      </div>

      <div className="page-container grid grid-cols-1 gap-6 py-5 sm:grid-cols-[165px_minmax(0,1fr)] lg:grid-cols-[165px_minmax(0,1fr)_300px]">
        <div>
          {posterUrl ? (
            <img
              src={posterUrl}
              alt={movie.title}
              className="w-[165px] rounded-lg shadow-lg"
            />
          ) : (
            <div className="flex aspect-[2/3] w-[165px] items-center justify-center rounded-lg bg-gray-200 text-gray-500">
              이미지 없음
            </div>
          )}
        </div>

        <div>
          <h2 className="mb-3 text-base font-bold text-gray-900">
            {movie.tagline}
          </h2>

          <p className="whitespace-pre-line text-xs leading-6 text-gray-500">
            {movie.overview}
          </p>

          <button
            type="button"
            aria-pressed={isBookmarked}
            onClick={handleToggleFavorite}
            disabled={isFavoriteButtonDisabled}
            className={cn(
              "mt-4 flex items-center gap-2 rounded border border-blue-600 bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition-colors",
              "hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50",
            )}
          >
            <img
              src={
                isBookmarked
                  ? "/icons/bookmark.svg"
                  : "/icons/bookmark-outline.svg"
              }
              alt=""
              className={cn("h-4 w-4", isBookmarked && "invert")}
            />

            {favoriteMutation.isPending
              ? "변경 중…"
              : accessToken && favoriteStatusQuery.isPending
                ? "확인 중…"
                : isBookmarked
                  ? "즐겨찾기 완료"
                  : "즐겨찾기"}
           </button>

          {accessToken && favoriteStatusQuery.isError && (
            <div role="alert" className="mt-2 text-xs text-red-600">
              <p>즐겨찾기 상태를 불러오지 못했어요.</p>
              <button
                type="button"
                onClick={() => void favoriteStatusQuery.refetch()}
                disabled={favoriteStatusQuery.isFetching}
                className="mt-1 underline disabled:opacity-50"
              >
                {favoriteStatusQuery.isFetching ? "확인 중…" : "다시 시도"}
              </button>
            </div>
          )}
        </div>

        <MemberRatingPanel movieId={movie.id} />
      </div>
    </main>
  );
}