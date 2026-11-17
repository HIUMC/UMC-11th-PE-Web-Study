import { useMutation, useQuery } from "@tanstack/react-query";
import { Link, useParams, useRouterState } from "@tanstack/react-router";
import { useState, type ReactNode, type SubmitEvent } from "react";
import { movieDetailQueryOptions } from "../../api/movie-queries";
import {
  createRatingMutationOptions,
  deleteRatingMutationOptions,
  memberRatingsQueryOptions,
  updateRatingMutationOptions,
} from "../../api/rating-queries";
import {
  getServerErrorMessage,
  isNotFoundError,
} from "../../api/request-error";
import {
  ErrorState,
  LoadingState,
} from "../../components/feedback/request-status";
import { useFavoriteToggle } from "../../hooks/use-favorite-toggle";
import { useMemberId } from "../../stores/auth-store";
import type { Rating } from "../../types/member";
import type { Movie } from "../../types/movie";
import { cn } from "../../utils/cn";

const STAR_VALUES = [1, 2, 3, 4, 5];

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const id = Number(movieId);

  if (!Number.isInteger(id) || id <= 0) {
    return <MovieNotFound />;
  }

  return <MovieDetailLoader movieId={id} />;
}

function MovieNotFound() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-24 text-center">
      <p className="text-ink-muted">영화를 찾을 수 없어요.</p>
      <Link to="/" className="mt-4 inline-block text-sm font-bold text-brand">
        영화 목록
      </Link>
    </main>
  );
}

function MovieDetailLoader({ movieId }: { movieId: number }) {
  const movieQuery = useQuery(movieDetailQueryOptions(movieId));

  if (movieQuery.data) {
    return <MovieDetail key={movieQuery.data.id} movie={movieQuery.data} />;
  }

  if (movieQuery.isError && !movieQuery.isFetching) {
    if (isNotFoundError(movieQuery.error)) {
      return <MovieNotFound />;
    }
    return (
      <main className="mx-auto max-w-[1312px] px-4">
        <ErrorState
          error={movieQuery.error}
          onRetry={() => movieQuery.refetch()}
        />
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-[1312px] px-4">
      <LoadingState />
    </main>
  );
}

function MovieDetail({ movie }: { movie: Movie }) {
  const favorite = useFavoriteToggle(movie.id, "status");

  return (
    <main>
      <section className="relative h-[360px] overflow-hidden bg-ink">
        {movie.backdropPath && (
          <img
            src={movie.backdropPath}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-ink/70 via-ink/30 to-transparent" />
        <div className="relative mx-auto flex h-full max-w-[1312px] flex-col justify-between px-4 pt-7 pb-6 text-surface">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 self-start text-sm font-bold"
          >
            <img
              src="/icons/chevron-left.svg"
              alt=""
              className="h-6 w-6 invert"
            />
            영화 목록
          </Link>
          <div>
            <h1 className="text-5xl font-bold tracking-tight">
              {movie.title}
            </h1>
            <p className="mt-4 text-sm">{movie.originalTitle}</p>
            <p className="mt-1.5 flex flex-wrap gap-2 text-sm font-bold">
              <span>{movie.releaseDate}</span>
              {movie.genres.length > 0 && (
                <span>{movie.genres.join(" · ")}</span>
              )}
              {movie.runtime && <span>{movie.runtime}</span>}
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-[1312px] grid-cols-1 gap-8 px-4 py-6 lg:grid-cols-[1fr_360px]">
        <div className="flex flex-col gap-8 sm:flex-row">
          {movie.posterPath ? (
            <img
              src={movie.posterPath}
              alt={`${movie.title} 포스터`}
              className="h-[286px] w-[200px] shrink-0 self-start rounded-lg object-cover shadow-xl shadow-ink/20"
            />
          ) : (
            <div className="flex h-[286px] w-[200px] shrink-0 items-center justify-center rounded-lg bg-border text-sm text-ink-subtle">
              이미지 없음
            </div>
          )}
          <div className="flex flex-col items-start">
            {movie.tagline && (
              <h2 className="mb-4 text-xl font-bold text-ink">
                {movie.tagline}
              </h2>
            )}
            <p className="text-sm leading-relaxed text-ink-muted">
              {movie.overview || "줄거리 정보가 없어요."}
            </p>
            <button
              type="button"
              aria-pressed={favorite.isFavorite}
              aria-busy={favorite.isPending}
              onClick={favorite.toggle}
              disabled={favorite.isPending}
              className={cn(
                "mt-4 inline-flex h-10 items-center gap-2 rounded-md bg-brand px-4 text-sm font-bold text-surface transition-colors hover:bg-brand-hover active:bg-brand-pressed disabled:opacity-60",
                favorite.isFavorite && "bg-brand-pressed",
              )}
            >
              <img
                src={
                  favorite.isFavorite
                    ? "/icons/bookmark.svg"
                    : "/icons/bookmark-outline.svg"
                }
                alt=""
                className="h-5 w-5 invert"
              />
              즐겨찾기
            </button>
            {favorite.error && (
              <p role="alert" className="mt-2 text-xs font-medium text-danger">
                {getServerErrorMessage(favorite.error)}
              </p>
            )}
          </div>
        </div>

        <RatingSection movieId={movie.id} />
      </div>
    </main>
  );
}

function RatingPanel({ children }: { children: ReactNode }) {
  return (
    <section className="border-border lg:border-l lg:pl-8">
      <h2 className="text-xl font-bold text-ink">내 평점</h2>
      <p className="mt-1 text-xs text-ink-subtle">
        별점은 필수, 후기는 선택이에요.
      </p>
      {children}
    </section>
  );
}

function RatingSection({ movieId }: { movieId: number }) {
  const memberId = useMemberId();
  const currentHref = useRouterState({ select: (state) => state.location.href });

  if (!memberId) {
    return (
      <RatingPanel>
        <div className="mt-2.5 rounded-lg border border-border bg-surface p-4 text-sm text-ink-muted">
          로그인하면 평점과 후기를 남길 수 있어요.
          <Link
            to="/login"
            search={{ redirect: currentHref }}
            className="mt-3 flex h-10 items-center justify-center rounded-md bg-ink text-sm font-bold text-surface"
          >
            로그인하기
          </Link>
        </div>
      </RatingPanel>
    );
  }

  return <MyRating memberId={memberId} movieId={movieId} />;
}

function MyRating({ memberId, movieId }: { memberId: number; movieId: number }) {
  const ratingsQuery = useQuery(memberRatingsQueryOptions(memberId));

  if (ratingsQuery.data) {
    const myRating =
      ratingsQuery.data.find((rating) => rating.movieId === movieId) ?? null;
    return (
      <RatingForm
        key={movieId}
        memberId={memberId}
        movieId={movieId}
        rating={myRating}
      />
    );
  }

  return (
    <RatingPanel>
      {ratingsQuery.isError && !ratingsQuery.isFetching ? (
        <div role="alert" className="mt-2.5 text-sm text-danger">
          {getServerErrorMessage(ratingsQuery.error)}
          <button
            type="button"
            onClick={() => ratingsQuery.refetch()}
            className="ml-2 font-bold text-ink underline"
          >
            다시 시도
          </button>
        </div>
      ) : (
        <p role="status" className="mt-2.5 text-sm text-ink-muted">
          내 평점을 불러오는 중이에요.
        </p>
      )}
    </RatingPanel>
  );
}

interface RatingFormProps {
  memberId: number;
  movieId: number;
  rating: Rating | null;
}

type FormMessage = { type: "success" | "error"; text: string } | null;

function RatingForm({ memberId, movieId, rating }: RatingFormProps) {
  const [score, setScore] = useState(rating?.score ?? 0);
  const [comment, setComment] = useState(rating?.comment ?? "");
  const [message, setMessage] = useState<FormMessage>(null);
  const createMutation = useMutation(createRatingMutationOptions(memberId));
  const updateMutation = useMutation(updateRatingMutationOptions(memberId));
  const deleteMutation = useMutation(deleteRatingMutationOptions(memberId));
  const isPending =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  const callbacks = (successText: string) => ({
    onSuccess: () => setMessage({ type: "success", text: successText }),
    onError: (error: Error) =>
      setMessage({ type: "error", text: getServerErrorMessage(error) }),
  });

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (score === 0) {
      setMessage({ type: "error", text: "별점을 선택해 주세요." });
      return;
    }
    if (comment.trim().length > 500) {
      setMessage({ type: "error", text: "후기는 500자 이하로 입력해 주세요." });
      return;
    }
    if (rating) {
      updateMutation.mutate(
        { ratingId: rating.ratingId, score, comment },
        callbacks("평점을 수정했어요."),
      );
    } else {
      createMutation.mutate(
        { movieId, score, comment },
        callbacks("평점을 저장했어요."),
      );
    }
  }

  function handleDelete() {
    if (!rating || !window.confirm("내 평점을 삭제할까요?")) {
      return;
    }
    deleteMutation.mutate(rating.ratingId, {
      onSuccess: () => {
        setScore(0);
        setComment("");
        setMessage({ type: "success", text: "평점을 삭제했어요." });
      },
      onError: (error) =>
        setMessage({ type: "error", text: getServerErrorMessage(error) }),
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border-border lg:border-l lg:pl-8"
    >
      <h2 className="text-xl font-bold text-ink">내 평점</h2>
      <p className="mt-1 text-xs text-ink-subtle">
        별점은 필수, 후기는 선택이에요.
      </p>
      <div className="mt-2.5 flex gap-1.5">
        {STAR_VALUES.map((value) => (
          <button
            key={value}
            type="button"
            aria-label={`${value}점`}
            aria-pressed={value <= score}
            onClick={() => {
              setScore(value);
              setMessage(null);
            }}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-md border border-border bg-surface",
              value <= score && "border-ink bg-ink",
            )}
          >
            <img
              src="/icons/star.svg"
              alt=""
              className={cn(
                "h-5 w-5 opacity-70",
                value <= score && "opacity-100 invert",
              )}
            />
          </button>
        ))}
      </div>
      <textarea
        aria-label="후기"
        value={comment}
        maxLength={500}
        onChange={(event) => {
          setComment(event.target.value);
          setMessage(null);
        }}
        placeholder="영화를 보고 느낀 점을 남겨보세요."
        className="mt-2 block h-[100px] w-full resize-none rounded-lg border border-border bg-surface p-3 text-sm text-ink placeholder:text-ink-subtle focus:border-ink focus:outline-none"
      />
      <button
        type="submit"
        disabled={isPending}
        className="mt-2.5 h-10 w-full rounded-md bg-ink text-sm font-bold text-surface disabled:opacity-60"
      >
        {createMutation.isPending || updateMutation.isPending
          ? "저장 중…"
          : "평점 저장"}
      </button>
      {rating && (
        <button
          type="button"
          onClick={handleDelete}
          disabled={isPending}
          className="mt-2 text-xs font-bold text-danger disabled:opacity-60"
        >
          {deleteMutation.isPending ? "삭제 중…" : "평점 삭제"}
        </button>
      )}
      {message && (
        <p
          role={message.type === "error" ? "alert" : "status"}
          className={cn(
            "mt-2 text-xs font-medium",
            message.type === "error" ? "text-danger" : "text-brand",
          )}
        >
          {message.text}
        </p>
      )}
    </form>
  );
}
