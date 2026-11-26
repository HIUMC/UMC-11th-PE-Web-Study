"use client";

import { useState, type SubmitEvent } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createRating, deleteRating, getRatings, updateRating, type Rating, type RatingInput } from "../api/ratings";
import { useAuthStore } from "../stores/auth-store";
import { getTokenMemberId } from "../utils/token-member-id";
import { getApiErrorMessage } from "../utils/api-error-message";
export function MovieRating({ movieId }: { movieId: number }) {
  const token = useAuthStore((s) => s.accessToken);
  const memberId = getTokenMemberId(token);
  const query = useQuery({ queryKey: ["ratings", memberId], queryFn: ({ signal }) => getRatings(memberId!, signal), enabled: Boolean(token && memberId), retry: false });
  if (!token) return <Link href="/login" className="text-sm underline">로그인하고 평점 남기기</Link>;
  if (!memberId) return <p role="alert">회원 식별 정보를 읽지 못했어요. 로그아웃 후 다시 로그인해 주세요.</p>;
  if (query.isPending) return <p role="status">평점을 불러오는 중</p>;
  if (query.isError) return <p role="alert">평점 조회에 실패했어요. <button onClick={() => void query.refetch()}>다시 시도</button></p>;
  const rating = query.data.find((item) => item.movieId === movieId);
  return <RatingForm key={`${memberId}:${movieId}:${rating?.ratingId ?? "new"}:${rating?.updatedAt ?? ""}`} movieId={movieId} memberId={memberId} rating={rating} />;
}
function RatingForm({ movieId, memberId, rating }: { movieId: number; memberId: number; rating?: Rating }) {
  const client = useQueryClient();
  const token = useAuthStore((s) => s.accessToken);
  const [score, setScore] = useState(rating?.score ?? 0);
  const [comment, setComment] = useState(rating?.comment ?? "");
  const [message, setMessage] = useState("");
  const mutation = useMutation({
    mutationFn: async (action: { kind: "save"; body: RatingInput } | { kind: "delete" }) => action.kind === "delete" ? deleteRating(rating!.ratingId) : rating ? updateRating(rating.ratingId, action.body) : createRating(movieId, action.body),
    onSuccess: async () => {
      if (token !== useAuthStore.getState().accessToken) return;
      await client.invalidateQueries({ queryKey: ["ratings", memberId] });
      setMessage("평점을 저장했어요.");
    },
  });
  function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (score < 1 || score > 5 || comment.length > 500 || mutation.isPending) return;
    setMessage("");
    mutation.mutate({ kind: "save", body: { score, comment } });
  }
  return <form onSubmit={submit} className="flex w-full flex-col gap-3">
    <h2 className="text-xl font-bold">내 평점</h2>
    <p className="text-xs text-text-tertiary">별점은 필수, 후기는 선택이에요. (최대 500자)</p>
    <fieldset disabled={mutation.isPending} className="flex gap-1"><legend className="sr-only">별점</legend>
      {[1,2,3,4,5].map((value) => <button key={value} type="button" aria-label={`${value}점`} aria-pressed={score === value} onClick={() => setScore(value)} className="rounded border border-border-default p-2"><img className="size-5" src={`/icons/${value <= score ? "star" : "star-outline"}.svg`} alt="" /></button>)}
    </fieldset>
    <label className="text-sm" htmlFor="rating-comment">후기</label>
    <textarea id="rating-comment" className="min-h-24 rounded border border-border-default p-3 text-sm" value={comment} maxLength={500} disabled={mutation.isPending} onChange={(event) => setComment(event.target.value)} placeholder="영화를 보고 느낀 점을 남겨보세요." />
    <button type="submit" disabled={!score || mutation.isPending} className="h-10 rounded bg-action-primary text-bg-surface disabled:opacity-50">{mutation.isPending ? "처리 중" : rating ? "평점 수정" : "평점 저장"}</button>
    {rating ? <button type="button" disabled={mutation.isPending} onClick={() => mutation.mutate({ kind: "delete" })}>평점 삭제</button> : null}
    {mutation.isError ? <p role="alert" className="text-sm text-text-danger">{getApiErrorMessage(mutation.error, "평점 변경에 실패했어요. 다시 시도해 주세요.")}</p> : null}
    {message ? <p role="status">{message}</p> : null}
  </form>;
}

