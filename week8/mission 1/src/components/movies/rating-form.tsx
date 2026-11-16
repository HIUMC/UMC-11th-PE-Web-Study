import { useState, type SubmitEvent } from "react";
import { Link } from "@tanstack/react-router";
import { useRatings, useRatingMutation } from "@/hooks/use-ratings";
import type { Rating } from "@/api/ratings";
import { cn } from "@/utils/cn";

function RatingEditor({ movieId, existing }: { movieId: number; existing?: Rating }) {
  const [score, setScore] = useState(existing?.score ?? 0);
  const [comment, setComment] = useState(existing?.comment ?? "");
  const mutation = useRatingMutation();
  const valid = Number.isInteger(score) && score >= 1 && score <= 5 && comment.length <= 500;

  function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!valid || mutation.isPending) return;
    const input = { score, comment: comment.trim() };
    mutation.mutate(existing
      ? { type: "update", ratingId: existing.ratingId, input }
      : { type: "create", movieId, input });
  }

  return <form onSubmit={submit}>
    <p className="mt-2 text-xs text-gray-400">별점을 매긴 뒤, 후기를 남겨보세요.</p>
    <fieldset disabled={mutation.isPending} className="disabled:opacity-60">
      <legend className="sr-only">평점과 후기</legend>
      <div className="my-3 flex gap-1.5" role="group" aria-label="별점 선택">
        {[1, 2, 3, 4, 5].map((star) => <button type="button" key={star} aria-label={`${star}점`} aria-pressed={score === star} onClick={() => { setScore(star); mutation.reset(); }} className={cn("grid size-9 place-items-center rounded-md border border-gray-200 bg-white text-2xl", star <= score ? "text-[#4f60ee]" : "text-gray-500")}>★</button>)}
      </div>
      <textarea aria-label="영화 후기" aria-describedby="rating-comment-limit" placeholder="영화를 보고 느낀 점을 남겨보세요." maxLength={500} value={comment} onChange={(event) => { setComment(event.target.value); mutation.reset(); }} className="h-24 w-full resize-y rounded-lg border border-gray-200 bg-white p-3 text-xs placeholder:text-gray-400" />
      <p id="rating-comment-limit" className="text-right text-xs text-gray-400">{comment.length}/500</p>
      <div className="mt-2 flex gap-2">
        <button type="submit" disabled={!valid || mutation.isPending} className="flex-1 rounded-md bg-[#191b20] py-3 text-xs font-bold text-white disabled:opacity-40">{mutation.isPending && mutation.variables?.type !== "delete" ? "저장 중" : existing ? "평점 수정" : "평점 저장"}</button>
        {existing && <button type="button" disabled={mutation.isPending} onClick={() => mutation.mutate({ type: "delete", ratingId: existing.ratingId })} className="rounded-md border border-red-200 px-4 py-3 text-xs font-bold text-red-600 disabled:opacity-40">{mutation.isPending && mutation.variables?.type === "delete" ? "삭제 중" : "삭제"}</button>}
      </div>
    </fieldset>
    {mutation.isError && <p role="alert" className="mt-2 text-xs text-red-600">평점을 저장하거나 삭제하지 못했어요. 잠시 후 다시 시도해 주세요.</p>}
    {mutation.isSuccess && <p role="status" className="mt-2 text-xs text-[#4f60ee]">저장했어요.</p>}
  </form>;
}

export function RatingForm({ movieId }: { movieId: number }) {
  const ratings = useRatings();
  const existing = ratings.data?.find((rating) => rating.movieId === movieId);
  return <section className="border-t border-gray-200 pt-6 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8" aria-labelledby="my-rating-title">
    <h2 id="my-rating-title" className="text-lg font-bold">내 평점</h2>
    {!ratings.accessToken ? <p className="mt-4 text-sm text-gray-500"><Link to="/login" className="font-bold text-[#4f60ee]">로그인</Link> 후 평점을 남길 수 있어요.</p>
      : !ratings.memberId ? <p role="alert" className="mt-4 text-sm text-red-600">회원 번호를 확인할 수 없어요. 다시 로그인해 주세요.</p>
      : ratings.isPending ? <p role="status" className="mt-4 text-sm text-gray-500">내 평점을 불러오는 중이에요.</p>
      : ratings.isError ? <div role="alert" className="mt-4 text-sm text-gray-500"><p>내 평점을 불러오지 못했어요.</p><button type="button" onClick={() => void ratings.refetch()} className="mt-2 text-[#4f60ee]">다시 시도</button></div>
      : <RatingEditor key={`${ratings.memberId}:${movieId}:${existing?.ratingId ?? "new"}:${existing?.updatedAt ?? ""}`} movieId={movieId} existing={existing} />}
  </section>;
}
