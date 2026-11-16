import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "@tanstack/react-router";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import BookmarkButton from "../../components/movies/bookmark-button";
import { RatingPanel } from "../../components/movies/rating-panel";
import { getTmdbBackdropUrl, getTmdbPosterUrl } from "../../utils/movies/tmdb-image";

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const id = Number(movieId);
  const query = useQuery({ queryKey: ["movies", "detail", id], queryFn: () => getMovieDetail(id), enabled: Number.isInteger(id) && id > 0 });
  if (!Number.isInteger(id) || id <= 0) return <main className="mx-auto w-[min(1180px,calc(100%-48px))] py-16">올바르지 않은 영화 번호입니다.</main>;
  if (query.isLoading) return <main className="mx-auto w-[min(1180px,calc(100%-48px))] py-16">영화 정보를 불러오는 중입니다.</main>;
  if (query.isError || !query.data) return <main className="mx-auto w-[min(1180px,calc(100%-48px))] py-16 text-red-600">영화 정보를 불러오지 못했습니다.</main>;
  const movie = query.data;
  const backdrop = getTmdbBackdropUrl(movie.backdrop_path);
  const poster = getTmdbPosterUrl(movie.poster_path);
  return <main className="pb-20"><section className="relative isolate h-[min(52vw,560px)] min-h-80 overflow-hidden bg-zinc-900 text-white">{backdrop && <img src={backdrop} alt="" className="absolute inset-0 size-full object-cover opacity-50" />}<div className="absolute inset-0 bg-linear-to-t from-zinc-950 to-transparent" /><div className="relative mx-auto flex h-full w-[min(1180px,calc(100%-48px))] items-end pb-12"><div><p className="text-sm">{movie.release_date || "개봉일 정보 없음"}</p><h1 className="mt-3 text-4xl font-bold sm:text-5xl">{movie.title}</h1><p className="mt-2 text-zinc-300">{movie.original_title}</p></div></div></section><section className="mx-auto grid w-[min(1180px,calc(100%-48px))] gap-10 pt-12 md:grid-cols-[240px_1fr]">{poster ? <img src={poster} alt={`${movie.title} 포스터`} className="w-full rounded-xl shadow-xl" /> : <div className="aspect-[2/3] rounded-xl bg-zinc-200" />}<div><Link to="/" className="text-sm font-semibold underline">영화 목록으로</Link><BookmarkButton movieId={movie.id} movieTitle={movie.title} className="ml-4" /><RatingPanel movieId={movie.id} /><h2 className="mt-8 text-lg font-bold">줄거리</h2><p className="mt-3 max-w-2xl leading-8 text-zinc-600">{movie.overview || "줄거리 정보가 없습니다."}</p></div></section></main>;
}
