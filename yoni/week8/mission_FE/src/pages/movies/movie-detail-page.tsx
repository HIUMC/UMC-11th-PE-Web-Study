import { Link, useNavigate, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import { getMovieDetailErrorMessage } from "../../utils/movies/get-movie-detail-error-message";
import {
  getTmdbPosterUrl,
  getTmdbBackdropUrl,
} from "../../utils/movies/tmdb-image";
import { getMe } from "../../api/members/me";
import { getFavoriteStatus } from "../../api/favorites/get-favorite-status";
import { useAuthStore } from "../../stores/auth-store";
import { useAddFavoriteMutation } from "../../hooks/use-add-favorite-mutation";
import { useDeleteFavoriteMutation } from "../../hooks/use-delete-favorite-mutation";

export function MovieDetailPage() {
  const { movieId: movieIdParam } = useParams({
    from: "/movies/$movieId",
  });
  const movieId = Number(movieIdParam);
  const isValidMovieId = Number.isInteger(movieId) && movieId > 0;

  const movieDetailQuery = useQuery({
    queryKey: ["movies", "detail", movieId],
    queryFn: () => getMovieDetail(movieId),
    enabled: isValidMovieId,
    staleTime: 30 * 1000,
  });

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

  const favoriteStatusQuery = useQuery({
    queryKey: ["members", "favorite-status", memberEmail, movieId],
    queryFn: () => getFavoriteStatus(movieId),
    enabled: Boolean(accessToken && memberEmail) && isValidMovieId,
    retry: false,
  });

  const addFavoriteMutation = useAddFavoriteMutation();
  const deleteFavoriteMutation = useDeleteFavoriteMutation();

  const movie = movieDetailQuery.data;
  const isBookmarked =
    Boolean(accessToken && memberEmail) && favoriteStatusQuery.data === true;

  const isUpdatingFavorite =
    addFavoriteMutation.isPending || deleteFavoriteMutation.isPending;

  const cannotToggleFavorite =
    isUpdatingFavorite ||
    (Boolean(accessToken) && (!memberEmail || !favoriteStatusQuery.isSuccess));

  const handleToggleFavorite = () => {
    if (!accessToken) {
      void navigate({ to: "/login" });
      return;
    }

    if (cannotToggleFavorite) return;

    if (isBookmarked) {
      deleteFavoriteMutation.mutate(movieId);
    } else {
      addFavoriteMutation.mutate(movieId);
    }
  };
  const posterUrl = movie ? getTmdbPosterUrl(movie.poster_path) : null;

  const backdropUrl = movie ? getTmdbBackdropUrl(movie.backdrop_path) : null;

  const genresText = movie?.genres.map((genre) => genre.name).join(", ") ?? "";

  const runtimeText =
    typeof movie?.runtime === "number"
      ? `${Math.floor(movie.runtime / 60)}시간 ${movie.runtime % 60}분`
      : "상영 시간 정보가 없어요.";

  return (
    <>
      {!isValidMovieId ? (
        <p>올바르지 않은 영화 번호예요.</p>
      ) : movieDetailQuery.isPending ? (
        <p>영화 상세 정보를 불러오는 중이에요.</p>
      ) : movieDetailQuery.isError ? (
        <p>{getMovieDetailErrorMessage(movieDetailQuery.error)}</p>
      ) : movie ? (
        <>
          {
            <main className="min-h-screen bg-[#f7f8fa]">
              <section className="relative h-[330px] overflow-hidden">
                {backdropUrl ? (
                  <img
                    src={backdropUrl}
                    alt={`${movie.title} 배경`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gray-200 text-gray-500">
                    이미지 없음
                  </div>
                )}

                <div className="absolute inset-0 bg-black/45" />

                <div className="absolute inset-0 mx-auto flex max-w-[1120px] flex-col justify-between px-10 py-6 text-white">
                  <Link
                    to="/"
                    className="w-fit text-[12px] font-medium text-white/90"
                  >
                    ← 영화 목록
                  </Link>

                  <div className="pb-4">
                    <h1 className="text-[30px] leading-tight font-bold">
                      {movie.title}
                    </h1>

                    <p className="mt-2 text-[12px] text-white/90">
                      {movie.original_title}
                    </p>

                    <p className="mt-1 text-[12px] text-white/90">
                      <span className="font-bold">{movie.release_date}</span>
                      {" · "}
                      <span className="font-bold">{genresText}</span>
                      {" · "}
                      <span className="font-bold">{runtimeText}</span>
                    </p>
                  </div>
                </div>
              </section>

              <section className="mx-auto grid max-w-[1120px] grid-cols-[176px_1fr_300px] gap-7 px-10 py-6">
                <div>
                  {posterUrl ? (
                    <img
                      src={posterUrl}
                      alt={`${movie.title} 포스터`}
                      className="w-full rounded-lg object-cover shadow-md"
                    />
                  ) : (
                    <div className="flex aspect-[2/3] w-full items-center justify-center rounded-lg bg-gray-200 text-sm text-gray-500">
                      이미지 없음
                    </div>
                  )}
                </div>

                <div className="pt-1 pr-6">
                  <h2 className="text-[18px] font-bold text-[#1f1f1f]">
                    {movie.tagline}
                  </h2>

                  <p className="mt-4 text-[13px] leading-6 text-[#6b7280]">
                    {movie.overview}
                  </p>

                  <button
                    type="button"
                    onClick={handleToggleFavorite}
                    disabled={cannotToggleFavorite}
                    aria-pressed={isBookmarked}
                    aria-label={isBookmarked ? "북마크 해제" : "북마크 추가"}
                    className="mt-6 flex h-[42px] items-center gap-2 rounded-md bg-[#2563eb] px-5 text-[13px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <img
                      src={
                        isBookmarked
                          ? "/icons/movie-icons/bookmark.svg"
                          : "/icons/movie-icons/bookmark-outline.svg"
                      }
                      alt=""
                      className="h-[16px] w-[16px] brightness-0 invert"
                    />

                    {isUpdatingFavorite
                      ? "처리 중"
                      : isBookmarked
                        ? "즐겨찾기 해제"
                        : "즐겨찾기"}
                  </button>

                  {accessToken &&
                    (meQuery.isError || favoriteStatusQuery.isError) && (
                      <p role="alert" className="mt-2 text-xs text-red-500">
                        즐겨찾기 상태를 불러오지 못했어요.{" "}
                        <button
                          type="button"
                          className="underline"
                          onClick={() => {
                            if (meQuery.isError) {
                              void meQuery.refetch();
                            } else {
                              void favoriteStatusQuery.refetch();
                            }
                          }}
                        >
                          다시 시도
                        </button>
                      </p>
                    )}
                </div>

                <aside className="border-l border-[#e5e7eb] pl-7">
                  <h2 className="text-[18px] font-bold text-[#1f1f1f]">
                    내 평점
                  </h2>

                  <p className="mt-1 text-[11px] text-[#9ca3af]">
                    별점을 남기고 후기를 남겨보세요.
                  </p>

                  <div className="mt-5 flex gap-2">
                    {[1, 2, 3, 4, 5].map((score) => (
                      <button
                        key={score}
                        type="button"
                        className="flex h-9 w-9 items-center justify-center rounded-md border border-[#d1d5db] bg-white text-[18px] text-[#6b7280]"
                      >
                        ★
                      </button>
                    ))}
                  </div>

                  <textarea
                    placeholder="영화를 보고 느낀 점을 남겨보세요."
                    className="mt-5 h-[96px] w-full resize-none rounded-md border border-[#d1d5db] bg-white p-3 text-[12px] outline-none"
                  />

                  <button
                    type="button"
                    className="mt-4 h-10 w-full rounded-md bg-[#1f2329] text-[13px] font-semibold text-white"
                  >
                    평점 저장
                  </button>
                </aside>
              </section>
            </main>
          }
        </>
      ) : (
        <p>영화를 찾을 수 없어요.</p>
      )}
    </>
  );
}
