import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "@tanstack/react-router";
import { useState } from "react";
import type { MemberRatingResponse } from "../../api/members/models";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import type { TmdbMovieDetail } from "../../api/movies/models";
import { FavoriteButton } from "../../components/movies/favorite-button";
import { MoviePoster } from "../../components/movies/movie-poster";
import { useFavoriteStatusQuery } from "../../hooks/use-favorites";
import { queryKeys } from "../../hooks/query-keys";
import {
  useMemberRatingsQuery,
  useMyMemberId,
  useRatingMutations,
} from "../../hooks/use-ratings";
import {
  formatReleaseDate,
  formatRuntime,
} from "../../utils/movies/format-movie";
import { getMovieDetailErrorMessage } from "../../utils/movies/get-movie-detail-error-message";
import { getTmdbBackdropUrl } from "../../utils/movies/tmdb-image";

const THIRTY_SECONDS = 30 * 1000;

export function MovieDetailPage() {
  const { movieId: movieIdParam } = useParams({ from: "/movies/$movieId" });
  const movieId = Number(movieIdParam);
  const isValidMovieId = Number.isInteger(movieId) && movieId > 0;

  const movieDetailQuery = useQuery({
    queryKey: queryKeys.movieDetail(movieId),
    queryFn: () => getMovieDetail(movieId),
    // 영화 번호가 양의 정수일 때만 요청함
    enabled: isValidMovieId,
    // 상세는 기본값(1분) 대신 30초만 fresh로 취급함
    staleTime: THIRTY_SECONDS,
  });

  // 요청을 안 해도 isPending이 true일 수 있어서 잘못된 번호 안내를 먼저 처리함
  if (!isValidMovieId) {
    return (
      <main className="p-16 text-center">올바르지 않은 영화 번호예요.</main>
    );
  }

  if (movieDetailQuery.isPending) {
    return (
      <main aria-busy="true" className="p-16 text-center text-gray-500">
        영화 정보를 불러오는 중이에요.
      </main>
    );
  }

  if (movieDetailQuery.isError) {
    return (
      <main role="alert" className="p-16 text-center">
        {getMovieDetailErrorMessage(movieDetailQuery.error)}
      </main>
    );
  }

  return <MovieDetailView key={movieId} movie={movieDetailQuery.data} />;
}

function MovieDetailView({ movie }: { movie: TmdbMovieDetail }) {
  const favoriteStatusQuery = useFavoriteStatusQuery(movie.id);

  const backdropUrl = getTmdbBackdropUrl(movie.backdrop_path);
  const genreText = movie.genres.map((genre) => genre.name).join(", ");

  return (
    <main>
      <div className="relative h-[360px] w-full overflow-hidden bg-gray-300">
        {backdropUrl ? (
          <img
            src={backdropUrl}
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-gray-500">
            이미지 없음
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <Link
          to="/"
          className="absolute left-6 top-6 flex items-center gap-1 text-sm text-white no-underline"
        >
          ← 영화 목록
        </Link>
        <div className="absolute bottom-6 left-6 right-6 text-white">
          <h1 className="text-3xl font-bold">{movie.title}</h1>
          <p className="mt-1 text-sm text-white/80">{movie.original_title}</p>
          <p className="mt-2 text-sm font-medium">
            {formatReleaseDate(movie.release_date)}
            {genreText && ` · ${genreText}`} · {formatRuntime(movie.runtime)}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-[1200px] px-6 pb-16 pt-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[240px_1fr_280px]">
          <div className="aspect-[2/3] w-full max-w-[240px] overflow-hidden rounded-lg shadow-md">
            <MoviePoster posterPath={movie.poster_path} title={movie.title} />
          </div>

          <div>
            {movie.tagline && (
              <h2 className="text-xl font-bold">{movie.tagline}</h2>
            )}
            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              {movie.overview || "줄거리 정보가 없어요."}
            </p>
            <FavoriteButton
              movieId={movie.id}
              movieTitle={movie.title}
              isFavorite={favoriteStatusQuery.data?.isFavorite ?? false}
              variant="label"
              disabled={favoriteStatusQuery.isLoading}
              className="mt-6"
            />
          </div>

          <MyRatingSection movieId={movie.id} />
        </div>
      </div>
    </main>
  );
}

const COMMENT_MAX_LENGTH = 500;

function MyRatingSection({ movieId }: { movieId: number }) {
  const memberId = useMyMemberId();

  return (
    <section>
      <h2 className="text-base font-bold">내 평점</h2>
      {memberId === null ? (
        <p className="mt-3 text-sm text-gray-500">
          <Link
            to="/login"
            search={{ redirect: `/movies/${movieId}` }}
            className="font-bold text-blue-600"
          >
            로그인
          </Link>
          하고 평점을 남겨 보세요.
        </p>
      ) : (
        <MyRating memberId={memberId} movieId={movieId} />
      )}
    </section>
  );
}

// 영화별 내 평점 조회 API가 없어서 내 평점 목록(GET /members/{memberId}/ratings)에서 이 영화 것을 찾음
function MyRating({ memberId, movieId }: { memberId: number; movieId: number }) {
  const ratingsQuery = useMemberRatingsQuery(memberId);

  if (ratingsQuery.isPending) {
    return <p className="mt-3 text-sm text-gray-500">내 평점을 불러오는 중이에요.</p>;
  }

  if (ratingsQuery.isError) {
    return (
      <p role="alert" className="mt-3 text-sm text-red-500">
        내 평점을 불러오지 못했어요.
      </p>
    );
  }

  const myRating = ratingsQuery.data.find((rating) => rating.movieId === movieId);

  // 저장한 평점이 바뀌면 key가 바뀌어서 입력칸이 서버에 저장된 값으로 다시 시작됨
  return (
    <MyRatingForm
      key={myRating ? `${myRating.ratingId}-${myRating.updatedAt}` : "new"}
      memberId={memberId}
      movieId={movieId}
      myRating={myRating}
    />
  );
}

interface MyRatingFormProps {
  memberId: number;
  movieId: number;
  myRating?: MemberRatingResponse;
}

function MyRatingForm({ memberId, movieId, myRating }: MyRatingFormProps) {
  const [score, setScore] = useState(myRating?.score ?? 0);
  const [comment, setComment] = useState(myRating?.comment ?? "");
  const { create, update, remove } = useRatingMutations(memberId);

  const isPending = create.isPending || update.isPending || remove.isPending;
  const isChanged =
    !myRating || score !== myRating.score || comment.trim() !== (myRating.comment ?? "");
  const canSubmit = score >= 1 && comment.length <= COMMENT_MAX_LENGTH && isChanged;

  const handleSave = () => {
    if (!canSubmit || isPending) return;
    // 후기는 선택 입력이라 비어 있으면 null로 보냄
    const body = { score, comment: comment.trim() || null };

    if (myRating) {
      update.mutate({ ratingId: myRating.ratingId, ...body });
    } else {
      create.mutate({ movieId, ...body });
    }
  };

  const handleDelete = () => {
    if (!myRating || isPending) return;
    if (!confirm("평점을 삭제할까요?")) return;
    remove.mutate(myRating.ratingId);
  };

  return (
    <>
      <div className="mt-3 flex gap-1">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setScore(value)}
            aria-label={`${value}점`}
            aria-pressed={value === score}
            className="text-2xl leading-none"
          >
            <span className={value <= score ? "text-yellow-400" : "text-gray-300"}>
              ★
            </span>
          </button>
        ))}
      </div>
      <textarea
        value={comment}
        onChange={(event) => setComment(event.target.value)}
        placeholder="영화를 보고 느낀 점을 남겨보세요."
        aria-label="후기"
        className="mt-3 h-24 w-full resize-none rounded-md border border-gray-300 bg-white p-3 text-sm outline-none"
      />
      <p
        className={
          comment.length > COMMENT_MAX_LENGTH
            ? "text-right text-xs text-red-500"
            : "text-right text-xs text-gray-400"
        }
      >
        {comment.length}/{COMMENT_MAX_LENGTH}
      </p>
      <div className="mt-2 flex gap-2">
        {myRating && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={isPending}
            className="flex-1 rounded-md border border-gray-300 bg-white py-2 text-sm text-gray-600 disabled:opacity-60"
          >
            {remove.isPending ? "삭제 중" : "삭제"}
          </button>
        )}
        <button
          type="button"
          onClick={handleSave}
          disabled={!canSubmit || isPending}
          className="flex-1 rounded-md bg-black py-2 text-sm text-white disabled:bg-gray-400"
        >
          {create.isPending || update.isPending
            ? "저장 중"
            : myRating
              ? "평점 수정"
              : "평점 저장"}
        </button>
      </div>
    </>
  );
}
