import { useState, type SubmitEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createRating,
  deleteRating,
  getMemberRatings,
  updateRating,
} from "../../api/ratings/ratings";
import type { Rating, UpdateRatingRequest } from "../../types/rating";

const starScores = [1, 2, 3, 4, 5];

function RatingStar({ filled }: { filled: boolean }) {
  return (
    <img
      src={filled ? "/icons/star.svg" : "/icons/star-outline.svg"}
      alt=""
      className={filled ? "size-5" : "size-5 opacity-50"}
    />
  );
}

interface RatingFormProps {
  movieId: number;
  memberId: number;
}

export function RatingForm({ movieId, memberId }: RatingFormProps) {
  const queryClient = useQueryClient();
  const queryKey = ["ratings", "member", memberId, "movie", movieId] as const;

  const [isEditing, setIsEditing] = useState(false);
  const [draftScore, setDraftScore] = useState<number | null>(null);
  const [draftComment, setDraftComment] = useState<string | null>(null);

  const ratingQuery = useQuery({
    queryKey,
    queryFn: async (): Promise<Rating | null> => {
      const size = 100;

      // 평점 목록에서 현재 영화의 평점을 찾을 때까지 페이지 조회
      for (let page = 0; ; page += 1) {
        const { content } = await getMemberRatings(memberId, page, size);
        const rating = content.find((item) => item.movieId === movieId);

        if (rating) return rating;
        if (content.length < size) return null;
      }
    },
  });

  const savedRating = ratingQuery.data;

  // 사용자가 수정하기 전에는 서버에서 조회한 값 표시
  const score = draftScore ?? savedRating?.score ?? 0;
  const comment = draftComment ?? savedRating?.comment ?? "";

  const saveMutation = useMutation({
    mutationFn: (body: UpdateRatingRequest) => {
      // 평점이 있으면 ratingId로 수정, 없으면 movieId로 등록
      return savedRating
        ? updateRating(savedRating.ratingId, body)
        : createRating({ movieId, ...body });
    },
    onSuccess: async (response) => {
      // 진행 중인 조회가 저장 전 값으로 덮어쓰지 않도록 취소
      await queryClient.cancelQueries({ queryKey, exact: true });
      queryClient.setQueryData(queryKey, response.result);

      setDraftScore(null);
      setDraftComment(null);

      setIsEditing(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteRating,
    onSuccess: async () => {
      await queryClient.cancelQueries({ queryKey, exact: true });
      queryClient.setQueryData(queryKey, null);

      setDraftScore(null);
      setDraftComment(null);
    },
  });

  const isBusy = saveMutation.isPending || deleteMutation.isPending;

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (savedRating === undefined || (savedRating && !isEditing) || score === 0 || isBusy) return;

    deleteMutation.reset();
    saveMutation.mutate({ score, comment: comment.trim() });
  };

  return (
    <section className="flex w-73.5 shrink-0 flex-col gap-2 border-l border-gray-200 pl-6">
      <h2 className="text-lg font-bold text-gray-900">
        {isEditing ? "내 평점 수정" : "내 평점"}
      </h2>

      {ratingQuery.isPending ? (
        <p className="text-xs text-gray-500">평점을 불러오는 중이에요.</p>
      ) : ratingQuery.isError && savedRating === undefined ? (
        <button
          type="button"
          onClick={() => void ratingQuery.refetch()}
          className="self-start text-sm text-gray-600 underline"
        >
          평점을 불러오지 못했어요. 다시 시도
        </button>
      ) : savedRating && !isEditing ? (
        <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4">
          <div className="flex items-center gap-2">
            <div aria-hidden="true" className="flex gap-1">
              {starScores.map((star) => (
                <RatingStar key={star} filled={star <= savedRating.score} />
              ))}
            </div>
            <span className="text-sm font-semibold text-gray-700">
              {savedRating.score}/5점
            </span>
          </div>

          {savedRating.comment && (
            <p className="rounded-lg bg-gray-50 p-3 text-sm wrap-break-word whitespace-pre-wrap text-gray-700">
              {savedRating.comment}
            </p>
          )}

          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={isBusy}
              onClick={() => {
                deleteMutation.reset();
                setDraftScore(savedRating.score);
                setDraftComment(savedRating.comment ?? "");
                setIsEditing(true);
              }}
              className="rounded-md border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-900 hover:bg-gray-50 disabled:opacity-50"
            >
              평점 수정
            </button>
            <button
              type="button"
              disabled={isBusy}
              onClick={() => deleteMutation.mutate(savedRating.ratingId)}
              className="text-xs text-red-600 hover:underline disabled:opacity-50"
            >
              {deleteMutation.isPending ? "삭제 중…" : "평점 삭제"}
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <p className="text-xs text-gray-500">별점은 필수, 후기는 선택이에요.</p>

          <div className="flex gap-1" role="group" aria-label="별점 선택">
            {starScores.map((star) => (
              <button
                key={star}
                type="button"
                aria-label={`${star}점`}
                aria-pressed={score === star}
                autoFocus={isEditing && star === savedRating?.score}
                onClick={() => setDraftScore(star)}
                disabled={isBusy}
                className={`flex h-8 w-8 items-center justify-center rounded-lg border focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-700 ${
                  star <= score
                    ? "border-gray-400 bg-gray-100"
                    : "border-gray-200 bg-white hover:bg-gray-100"
                }`}
              >
                <RatingStar filled={star <= score} />
              </button>
            ))}
          </div>

          <textarea
            aria-label="후기"
            value={comment}
            onChange={(event) => setDraftComment(event.target.value)}
            disabled={isBusy}
            maxLength={500}
            placeholder="영화를 보고 느낀 점을 남겨보세요."
            className="h-22 w-full resize-none rounded-lg border border-gray-200 bg-white p-3 text-xs placeholder:text-gray-400 focus-visible:outline-2 focus-visible:outline-gray-700"
          />

          <button
            type="submit"
            disabled={score === 0 || isBusy}
            className="w-full rounded-md bg-gray-900 py-2.5 text-xs font-bold text-white enabled:hover:bg-gray-700 disabled:cursor-not-allowed"
          >
            {saveMutation.isPending ? "저장 중…" : "평점 저장"}
          </button>

          {isEditing && (
            <button
              type="button"
              disabled={isBusy}
              onClick={() => {
                saveMutation.reset();
                setDraftScore(null);
                setDraftComment(null);
                setIsEditing(false);
              }}
              className="self-center px-3 py-1 text-xs text-gray-600 enabled:hover:underline disabled:opacity-50"
            >
              취소
            </button>
          )}
        </form>
      )}

      {(saveMutation.isError || deleteMutation.isError) && (
        <p role="alert" className="text-xs text-red-600">
          {deleteMutation.isError
            ? "평점 삭제에 실패했어요."
            : "평점 저장에 실패했어요."}
        </p>
      )}
    </section>
  );
}
