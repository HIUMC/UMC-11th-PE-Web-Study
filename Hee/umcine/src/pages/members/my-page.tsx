import { useQueries, useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { getMe } from "../../api/members/me";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import MovieCard from "../../components/movies/movie-card";
import { useFavorites } from "../../hooks/use-favorites";
import type { Movie } from "../../types/movie";
import { getTmdbBackdropUrl, getTmdbPosterUrl } from "../../utils/movies/tmdb-image";

const iconBase = "/icons/movie-icons/movie-icons";

export function MyPage() {
  const meQuery = useQuery({
    queryKey: ["members", "me"],
    queryFn: getMe,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
  const favoritesQuery = useFavorites();
  const favoriteMovieQueries = useQueries({
    queries: (favoritesQuery.data ?? []).map((movieId) => ({
      queryKey: ["movies", "detail", movieId],
      queryFn: () => getMovieDetail(movieId),
    })),
  });
  const favoriteMovies = favoriteMovieQueries.flatMap<Movie>((query) => {
    if (!query.data) return [];
    const movie = query.data;
    return [{
      id: movie.id,
      title: movie.title,
      originalTitle: movie.original_title,
      releaseDate: movie.release_date,
      posterPath: getTmdbPosterUrl(movie.poster_path) ?? "",
      backdropPath: getTmdbBackdropUrl(movie.backdrop_path) ?? "",
      genres: movie.genres.map((genre) => genre.name),
      runtime: movie.runtime ? `${movie.runtime}분` : "",
      tagline: movie.tagline,
      overview: movie.overview,
      isBookmarked: true,
    }];
  });
  const isFavoritesPending =
    favoritesQuery.isPending || favoriteMovieQueries.some((query) => query.isPending);

  return (
    <main className="min-h-[calc(100vh-64px)] bg-[#F7F8FA]">
      <div className="mx-auto max-w-[1100px] px-5 py-7 sm:py-9">
        <div className="flex items-center justify-between">
          <h1 className="text-[28px] font-bold tracking-[-0.03em] text-[#191D23]">내 정보</h1>
          <Link to="/my/edit" className="rounded-lg bg-[#2F6FED] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#245DCD]">
            정보 수정
          </Link>
        </div>

        <section className="mt-6 border-t border-[#E1E5EA] pt-6">
          <h2 className="text-sm font-bold text-[#191D23]">기본 정보</h2>
          <div className="mt-5 grid gap-6 rounded-xl bg-white p-6 sm:grid-cols-[80px_1fr_1fr] sm:items-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#EDF0F4]">
              <img src={`${iconBase}/person.svg`} alt="" className="h-8 w-8" />
            </div>
            <div>
              <p className="text-[11px] text-[#9CA3AF]">닉네임</p>
              <p className="mt-1 text-sm font-semibold text-[#191D23]">
                {meQuery.data?.nickname ?? "불러오는 중"}
              </p>
            </div>
            <div>
              <p className="text-[11px] text-[#9CA3AF]">이메일</p>
              <p className="mt-1 text-sm font-semibold text-[#191D23]">
                {meQuery.data?.email ?? "불러오는 중"}
              </p>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="mb-4 text-sm font-bold text-[#191D23]">내 즐겨찾기</h2>
          {isFavoritesPending ? (
            <p className="py-16 text-center text-sm text-[#68707C]">즐겨찾기를 불러오는 중이에요.</p>
          ) : favoritesQuery.isError ? (
            <p className="py-16 text-center text-sm text-[#D14343]">즐겨찾기를 불러오지 못했어요.</p>
          ) : favoriteMovies.length > 0 ? (
            <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {favoriteMovies.map((movie) => <MovieCard key={movie.id} movie={movie} />)}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-[#DCE1E8] bg-white py-16 text-center">
              <p className="text-sm text-[#68707C]">아직 즐겨찾기한 영화가 없어요.</p>
              <Link to="/" className="mt-3 inline-block text-xs font-bold text-[#2F6FED] hover:underline">
                영화 보러가기
              </Link>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
