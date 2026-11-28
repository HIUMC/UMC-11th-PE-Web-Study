import { useState } from "react";
import type { FormEvent } from "react";
import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createRating,
  updateRating,
  deleteRating,
} from "../../api/ratings/ratings";
import type { MemberRating } from "../../api/members/models";

interface RatingFormProps {
  movieId: number;
  memberId: number;
  myRating: MemberRating | undefined;
}

export function RatingForm({
  movieId,
  memberId,
  myRating,
}: RatingFormProps) {
  const queryClient = useQueryClient();

  const [score, setScore] = useState(myRating?.score ?? 0);
  const [comment, setComment] = useState(
    myRating?.comment ?? "",
  );

  async function refreshRatings() {
    await queryClient.invalidateQueries({
      queryKey: ["ratings", "member", memberId],
    });
  }

  const saveMutation = useMutation({
    mutationFn: () => {
      const body = {
        score,
        comment: comment.trim(),
      };

      if (myRating) {
        return updateRating(myRating.ratingId, body);
      }

      return createRating({
        movieId,
        ...body,
      });
    },
    onSuccess: refreshRatings,
  });

  const deleteMutation = useMutation({
    mutationFn: (ratingId: number) => deleteRating(ratingId),
    onSuccess: refreshRatings,
  });

  const isBusy =
    saveMutation.isPending || deleteMutation.isPending;

  const canSubmit =
    score >= 1 &&
    score <= 5 &&
    comment.length <= 500 &&
    !isBusy;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canSubmit) return;

    deleteMutation.reset();
    saveMutation.mutate();
  }

  function handleDelete() {
    if (!myRating || isBusy) return;
    if (!window.confirm("작성한 평점을 삭제할까요?")) return;

    saveMutation.reset();
    deleteMutation.mutate(myRating.ratingId);
  }

  return (
    <form onSubmit={handleSubmit}>
      <p className="mb-2 text-[10px] text-gray-400">
        별점은 필수, 후기는 선택이에요.
      </p>

      <div
        role="group"
        aria-label="별점 선택"
        className="mb-3 flex gap-1"
      >
        {Array.from({ length: 5 }, (_, index) => {
          const value = index + 1;

          return (
            <button
              key={value}
              type="button"
              aria-label={`${value}점`}
              aria-pressed={score === value}
              onClick={() => setScore(value)}
              disabled={isBusy}
              className="rounded border border-gray-200 bg-white p-1 focus-visible:outline-2 focus-visible:outline-blue-600 disabled:opacity-50"
            >
              <img
                src={
                  value <= score
                    ? "/icons/star.svg"
                    : "/icons/star-outline.svg"
                }
                alt=""
                className="h-5 w-5"
              />
            </button>
          );
        })}
      </div>

      <textarea
        aria-label="이 영화에 남길 후기"
        value={comment}
        onChange={(event) => setComment(event.target.value)}
        maxLength={500}
        disabled={isBusy}
        placeholder="영화를 보고 느낀 점을 남겨보세요."
        className="h-24 w-full resize-y rounded-md border border-gray-200 bg-white p-3 text-xs outline-none focus:border-black disabled:opacity-50"
      />

      <p className="mb-3 mt-1 text-right text-[10px] text-gray-400">
        {comment.length}/500
      </p>

      <button
        type="submit"
        disabled={!canSubmit}
        className="w-full rounded bg-black py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        {saveMutation.isPending
          ? "저장 중…"
          : myRating
            ? "평점 수정"
            : "평점 저장"}
      </button>

      {myRating && (
        <button
          type="button"
          onClick={handleDelete}
          disabled={isBusy}
          className="mt-2 w-full rounded border border-red-300 py-2 text-xs font-semibold text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {deleteMutation.isPending ? "삭제 중…" : "평점 삭제"}
        </button>
      )}

      {saveMutation.isError && (
        <p role="alert" className="mt-2 text-xs text-red-600">
          평점을 저장하지 못했어요. 잠시 후 다시 시도해 주세요.
        </p>
      )}

      {deleteMutation.isError && (
        <p role="alert" className="mt-2 text-xs text-red-600">
          평점을 삭제하지 못했어요. 잠시 후 다시 시도해 주세요.
        </p>
      )}

      {!myRating && (
        <p className="mt-2 text-xs text-gray-500">
          아직 이 영화에 남긴 평점이 없어요.
        </p>
      )}
    </form>
  );
}