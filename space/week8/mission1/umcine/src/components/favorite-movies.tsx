import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useFavorites } from "../hooks/use-favorites";
import { getMovieDetail } from "../api/movies/get-movie-detail";
import { getTmdbPosterUrl } from "../utils/movies/tmdb-image";
import { BookmarkButton } from "./bookmark-button";
export function FavoriteMovies() {
  const query = useFavorites();
  if (query.isPending) return <p role="status">즐겨찾기를 불러오는 중</p>;
  if (query.isError) return <p role="alert">즐겨찾기를 불러오지 못했어요. <button onClick={() => void query.refetch()}>다시 시도</button></p>;
  if (!query.data.length) return <p className="py-10 text-center text-sm">즐겨찾기한 영화가 없습니다.</p>;
  return <ul className="grid max-w-[700px] grid-cols-2 gap-3 sm:grid-cols-3">{query.data.map((item) => <FavoriteMovie key={item.favoriteId} movieId={item.movieId} />)}</ul>;
}
function FavoriteMovie({ movieId }: { movieId: number }) {
  const query = useQuery({ queryKey: ["movie", movieId], queryFn: () => getMovieDetail(movieId) });
  const poster = getTmdbPosterUrl(query.data?.poster_path ?? null);
  return <li className="relative min-w-0 rounded-lg border border-border-default p-2">
    <Link to="/movies/$movieId" params={{ movieId: String(movieId) }}>
      {poster ? <img className="aspect-[2/3] w-full rounded object-cover" src={poster} alt={`${query.data?.title} 포스터`} /> : <div className="aspect-[2/3] bg-bg-page" />}
      <span className="block truncate text-sm font-bold">{query.data?.title ?? (query.isPending ? "영화 불러오는 중" : `영화 #${movieId}`)}</span>
    </Link>
    {query.isError ? <button onClick={() => void query.refetch()}>영화 정보 다시 시도</button> : null}
    <BookmarkButton movieId={movieId} />
  </li>;
}
