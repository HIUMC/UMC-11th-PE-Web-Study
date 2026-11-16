import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMe } from "@/api/members/me";
import type { Rating } from "@/api/ratings/models";
import {
  useCreateRatingMutation,
  useDeleteRatingMutation,
  useMyRatingsQuery,
  useUpdateRatingMutation,
} from "@/hooks/use-ratings";
import { useAuthStore } from "@/stores/auth-store";
import { cn } from "@/utils/cn";

export function MyRatingPanel({ movieId }: { movieId: number }) {
  const accessToken = useAuthStore((state) => state.accessToken);

  const meQuery = useQuery({
    queryKey: ["members", "me"],
    queryFn: getMe,
    enabled: Boolean(accessToken),
    staleTime: 5 * 60 * 1000,
  });

  const ratingsQuery = useMyRatingsQuery(meQuery.data?.memberId);

  if (!accessToken) {
    return <p className="mt-3 text-sm text-neutral-500">로그인하면 평점을 남길 수 있어요.</p>;
  }

  if (ratingsQuery.isPending) {
    return <p className="mt-3 text-sm text-neutral-500">불러오는 중이에요.</p>;
  }

  const myRating = ratingsQuery.data?.find((rating) => rating.movieId === movieId) ?? null;

  return (
    <RatingForm
      key={myRating?.ratingId ?? "new"}
      movieId={movieId}
      rating={myRating}
    />
  );
}

function RatingForm({ movieId, rating }: { movieId: number; rating: Rating | null }) {
  const [score, setScore] = useState(rating?.score ?? 0);
  const [comment, setComment] = useState(rating?.comment ?? "");

  const createMutation = useCreateRatingMutation();
  const updateMutation = useUpdateRatingMutation();
  const deleteMutation = useDeleteRatingMutation();

  const isPending =
    createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;
  const canSubmit = score >= 1 && score <= 5;

  const trimmedComment = comment.trim();
  const commentToSend = trimmedComment.length > 0 ? trimmedComment : null;

  function handleSave() {
    if (!canSubmit || isPending) return;

    if (rating) {
      updateMutation.mutate({
        ratingId: rating.ratingId,
        score,
        comment: commentToSend,
      });
    } else {
      createMutation.mutate({ movieId, score, comment: commentToSend });
    }
  }

  function handleDelete() {
    if (!rating || isPending) return;
    if (!confirm("평점을 삭제할까요?")) return;

    deleteMutation.mutate(rating.ratingId);
  }

  return (
    <>
      <div className="mt-3 flex gap-1">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            type="button"
            aria-label={`${value}점`}
            aria-pressed={score >= value}
            onClick={() => setScore(value)}
            className="cursor-pointer"
          >
            <img
              className={cn("h-7 w-7", score >= value ? "opacity-100" : "opacity-25")}
              src="/icons/star.svg"
              alt=""
            />
          </button>
        ))}
      </div>

      <textarea
        value={comment}
        onChange={(event) => setComment(event.target.value)}
        className="mt-4 h-28 w-full resize-none rounded-md border border-neutral-200 p-3 text-sm"
        placeholder="영화를 보고 느낀 점을 남겨보세요."
      />

      <button
        type="button"
        onClick={handleSave}
        disabled={!canSubmit || isPending}
        className="mt-3 w-full cursor-pointer rounded-md bg-neutral-900 py-3 text-sm font-medium text-white disabled:cursor-default disabled:bg-neutral-300"
      >
        {isPending ? "처리 중" : rating ? "평점 수정" : "평점 저장"}
      </button>

      {rating && (
        <button
          type="button"
          onClick={handleDelete}
          disabled={isPending}
          className="mt-2 w-full cursor-pointer rounded-md border border-neutral-300 bg-white py-3 text-sm font-medium text-neutral-700 disabled:cursor-default disabled:opacity-60"
        >
          평점 삭제
        </button>
      )}
    </>
  );
}