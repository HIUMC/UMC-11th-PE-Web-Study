"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useState, type SubmitEvent } from "react";
import { getMemberErrorMessage } from "../../api/api-client";
import { useRatingMutations } from "../../hooks/use-rating-mutations";
import { ratingsOptions } from "../../queries/account-queries";
import { useAuthStore } from "../../stores/auth-store";
import type { Rating } from "../../types/account";
import { getMemberId } from "../../utils/member-id";
import { RequestState } from "./request-state";

export function RatingPanel({ movieId }: { movieId: number }) {
  const accessToken = useAuthStore(state => state.accessToken);
  const memberId = getMemberId(accessToken);
  const ratings = useQuery(ratingsOptions(memberId));
  const rating = ratings.data?.find(item => item.movieId === movieId);

  return <section className="mx-auto max-w-5xl border-t border-slate-200 px-5 py-10 sm:px-8" aria-labelledby="rating-title">
    <h2 id="rating-title" className="mb-5 text-2xl font-extrabold">내 평점</h2>
    {!accessToken ? <p className="text-sm text-slate-600"><Link href="/login" className="font-bold text-blue-600 underline">로그인</Link>하고 평점을 남겨 보세요.</p> :
      memberId === null ? <RequestState message="회원 번호를 확인할 수 없어요. 다시 로그인해 주세요." /> :
      ratings.isLoading ? <RequestState loading message="내 평점을 불러오는 중..." /> : ratings.isError ?
      <RequestState message={getMemberErrorMessage(ratings.error, "평점을 불러오지 못했어요.")} onRetry={() => { void ratings.refetch(); }} /> :
      <RatingForm key={`${movieId}-${rating?.ratingId ?? "new"}-${rating?.updatedAt ?? ""}`} movieId={movieId} memberId={memberId} rating={rating} />}
  </section>;
}

function RatingForm({ movieId, memberId, rating }: { movieId: number; memberId: number; rating?: Rating }) {
  const [score, setScore] = useState(rating?.score ?? 5);
  const [comment, setComment] = useState(rating?.comment ?? "");
  const mutations = useRatingMutations(memberId);
  const pending = mutations.create.isPending || mutations.update.isPending || mutations.remove.isPending;
  const error = mutations.create.error || mutations.update.error || mutations.remove.error;
  const valid = Number.isInteger(score) && score >= 1 && score <= 5 && comment.trim().length <= 500;

  function resetError() { mutations.create.reset(); mutations.update.reset(); mutations.remove.reset(); }

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!valid || pending) return;
    resetError();
    const body = { score, comment: comment.trim() };
    if (rating) mutations.update.mutate({ ratingId: rating.ratingId, ...body });
    else mutations.create.mutate({ movieId, ...body });
  }

  return <form onSubmit={handleSubmit} aria-busy={pending} className="max-w-xl">
    <p role="status" className="mb-4 text-sm text-slate-500">{rating ? `등록한 평점: ${rating.score} / 5` : "아직 등록한 평점이 없어요."}</p>
    <fieldset disabled={pending} className="space-y-4">
      <legend className="sr-only">평점과 후기</legend>
      <div>
        <label htmlFor="rating-score" className="block text-sm font-bold">별점</label>
        <select id="rating-score" value={score} onChange={event => { setScore(Number(event.target.value)); resetError(); }} className="mt-2 rounded-lg border border-slate-300 bg-white px-4 py-3">
          {[5, 4, 3, 2, 1].map(value => <option key={value} value={value}>{"★".repeat(value)} ({value}점)</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="rating-comment" className="block text-sm font-bold">후기 <span className="font-normal text-slate-400">(선택)</span></label>
        <textarea id="rating-comment" rows={4} maxLength={500} value={comment} onChange={event => { setComment(event.target.value); resetError(); }}
          className="mt-2 w-full rounded-lg border border-slate-300 p-3 text-sm leading-6 focus:outline-blue-500" placeholder="이 영화는 어땠나요?" />
        <p className="mt-1 text-right text-xs text-slate-400">{comment.length} / 500</p>
      </div>
      <div className="flex gap-3">
        <button type="submit" disabled={!valid || pending} className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-50">{mutations.create.isPending || mutations.update.isPending ? "저장 중" : rating ? "평점 수정" : "평점 등록"}</button>
        {rating && <button type="button" onClick={() => { if (!pending) { resetError(); mutations.remove.mutate(rating.ratingId); } }} disabled={pending} className="rounded-lg border border-slate-300 px-5 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50">{mutations.remove.isPending ? "삭제 중" : "평점 삭제"}</button>}
      </div>
    </fieldset>
    {error && <p role="alert" className="mt-4 text-sm text-red-700">{getMemberErrorMessage(error, "평점을 저장하지 못했어요.")}</p>}
  </form>;
}
