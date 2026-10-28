import { Link, useParams } from "@tanstack/react-router";
import { useCallback } from "react";
import { movieService } from "../../api/tmdb";
import { BookmarkButton } from "../../components/movies/bookmark-button";
import { MovieImage } from "../../components/movies/movie-image";
import { RequestState } from "../../components/movies/request-state";
import { useMovieRequest } from "../../hooks/use-movie-request";

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const id = Number(movieId);
  const valid = /^\d+$/.test(movieId) && Number.isSafeInteger(id) && id > 0;
  const load = useCallback(
    (signal: AbortSignal) => movieService.getMovieDetails(id, signal), [id],
  );
  const request = useMovieRequest(`detail:${movieId}`, load, valid);
  const movie = request.data;

  if (!valid || request.status !== "success" || !movie) {
    return (
      <main className="flex-1 bg-[#f6f8fb] px-5 py-14">
        <section className="mx-auto max-w-3xl">
          {!valid ? (
            <RequestState message="올바른 영화 번호를 입력해 주세요." />
          ) : request.status === "loading" ? (
            <RequestState message="영화 상세 정보를 불러오는 중..." loading />
          ) : (
            <RequestState message={request.error || "영화를 찾을 수 없어요."} onRetry={request.retry} />
          )}
          <Link className="mt-6 inline-flex rounded-lg bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700" to="/">영화 목록으로 돌아가기</Link>
        </section>
      </main>
    );
  }

  return (
    <main className="flex-1 bg-white">
      <section className="relative isolate min-h-80 overflow-hidden sm:min-h-96">
        <MovieImage className="absolute inset-0 -z-20 size-full object-cover object-center" src={movie.backdropPath} alt="" decorative />
        <div className="absolute inset-0 -z-10 bg-linear-to-t from-slate-950 via-slate-950/55 to-slate-950/25" />
        <div className="mx-auto flex min-h-80 max-w-320 flex-col justify-end px-5 py-10 text-center text-white sm:min-h-96 sm:px-8 sm:py-14">
          <h1 className="text-3xl font-black tracking-[-0.045em] drop-shadow-lg sm:text-5xl">{movie.title}</h1>
          <p className="mt-3 text-sm font-medium text-white/75">{movie.originalTitle}</p>
          <p className="mt-2 text-xs font-semibold text-white/70 sm:text-sm">{movie.releaseDate} · {movie.genres.join(" · ") || "장르 정보 없음"} · {movie.runtime}</p>
        </div>
      </section>
      <section className="mx-auto grid max-w-5xl gap-8 px-5 py-10 sm:px-8 md:grid-cols-[260px_1fr] md:gap-12 md:py-14">
        <MovieImage className="mx-auto aspect-[4/5] w-full max-w-65 rounded-2xl object-cover shadow-xl shadow-slate-900/15 md:mx-0" src={movie.posterPath} alt={`${movie.title} 포스터`} />
        <div className="self-center">
          <Link className="inline-flex items-center gap-1 text-sm font-bold text-slate-500 hover:text-blue-600" to="/">
            <img className="size-4 rotate-180 opacity-60" src="/icons/arrow-right.svg" alt="" />영화 목록
          </Link>
          <h2 className="mt-6 text-2xl font-extrabold tracking-[-0.035em] text-slate-900 sm:text-3xl">{movie.tagline}</h2>
          <p className="mt-5 text-[15px] leading-7 text-slate-600">{movie.overview}</p>
          <dl className="mt-7 grid grid-cols-2 gap-4 rounded-2xl bg-slate-50 p-5 text-sm sm:grid-cols-3">
            <div><dt className="font-semibold text-slate-400">개봉일</dt><dd className="mt-1 font-bold text-slate-800">{movie.releaseDate}</dd></div>
            <div><dt className="font-semibold text-slate-400">장르</dt><dd className="mt-1 font-bold text-slate-800">{movie.genres.join(", ") || "정보 없음"}</dd></div>
            <div><dt className="font-semibold text-slate-400">상영 시간</dt><dd className="mt-1 font-bold text-slate-800">{movie.runtime}</dd></div>
            <div><dt className="font-semibold text-slate-400">TMDB 평점</dt><dd className="mt-1 font-bold text-slate-800">{movie.voteAverage.toFixed(1)} / 10</dd></div>
          </dl>
          <BookmarkButton className="mt-7" movieId={movie.id} movieTitle={movie.title} />
        </div>
      </section>
    </main>
  );
}
