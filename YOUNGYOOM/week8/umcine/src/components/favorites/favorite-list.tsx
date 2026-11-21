import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { getFavorites } from "../../api/favorites/favorites";
import { movieDetailOptions } from "../../api/movies/movie-query-options";
import { useAuthStore } from "../../stores/auth-store";
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";

function FavoriteMovieLink({ movieId }: { movieId: number }) {
  const movieQuery = useQuery(movieDetailOptions(movieId));
  const movie = movieQuery.data;
  const posterUrl = movie ? getTmdbPosterUrl(movie.poster_path) : null;

  return (
    <Link
      to="/movies/$movieId"
      params={{ movieId: String(movieId) }}
      className="group block rounded-lg"
    >
      <div className="aspect-[2/3] overflow-hidden rounded-lg bg-gray-100">
        {posterUrl ? (
          <img
            src={posterUrl}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-gray-500">
            {movieQuery.isPending
              ? "불러오는 중…"
              : movieQuery.isError
                ? "포스터를 불러오지 못했어요."
                : "포스터 없음"}
          </div>
        )}
      </div>

      <p className="mt-2 text-sm font-semibold group-hover:underline">
        {movie?.title ?? `영화 #${movieId}`}
      </p>
    </Link>
  );
}

export function FavoriteList() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const memberId = useAuthStore((state) => state.memberId);

  const favoritesQuery = useQuery({
    // BookmarkButton에서 무효화하는 키와 같은 접두사를 사용
    queryKey: ["favorites", memberId, "list"],
    queryFn: async () => {
      const response = await getFavorites();
      return response.result;
    },
    enabled: Boolean(accessToken) && memberId != null,
    retry: false,
  });

  return (
    <section>
      <h2 className="mb-3 text-lg font-bold">즐겨찾기</h2>

      {!accessToken ? (
        <p>즐겨찾기를 보려면 로그인해 주세요.</p>
      ) : memberId == null ? (
        <p>회원 정보를 확인하고 있어요.</p>
      ) : favoritesQuery.isPending ? (
        <p>즐겨찾기를 불러오는 중이에요.</p>
      ) : favoritesQuery.isError ? (
        <button type="button" onClick={() => void favoritesQuery.refetch()}>
          즐겨찾기를 불러오지 못했어요. 다시 시도
        </button>
      ) : favoritesQuery.data.length === 0 ? (
        <p>아직 즐겨찾기한 영화가 없어요.</p>
      ) : (
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {favoritesQuery.data.map(({ favoriteId, movieId }) => (
            <li key={favoriteId}>
              <FavoriteMovieLink movieId={movieId} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
