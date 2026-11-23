import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getMe } from "../../api/members/me";
import { getMemberRatings } from "../../api/ratings";
import { useRatingMutation } from "../../hooks/use-rating-mutation";
import { useAuthStore } from "../../stores/auth-store";

export function RatingPanel({ movieId }: { movieId: number }) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const meQuery = useQuery({ queryKey: ["members", "me"], queryFn: getMe, enabled: Boolean(accessToken), staleTime: 5 * 60 * 1000 });
  const memberId = meQuery.data?.memberId ?? meQuery.data?.id;
  const ratingsQuery = useQuery({ queryKey: ["ratings", memberId], queryFn: () => getMemberRatings(memberId!), enabled: Boolean(memberId) });
  const [score, setScore] = useState(5);
  const mutation = useRatingMutation(memberId, movieId);
  if (!accessToken || !memberId) return null;
  const rating = ratingsQuery.data?.find((item) => item.movieId === movieId);
  const save = () => rating ? mutation.update.mutate({ ratingId: rating.ratingId, score }) : mutation.create.mutate({ movieId, score });
  return <section className="mt-8 rounded-xl bg-zinc-50 p-4"><h2 className="font-bold text-zinc-900">내 평점</h2><div className="mt-3 flex items-center gap-3"><input aria-label="평점" type="number" min="1" max="10" value={score} onChange={(event) => setScore(Number(event.target.value))} className="h-10 w-20 rounded-lg border border-zinc-300 px-3" /><button type="button" disabled={mutation.create.isPending || mutation.update.isPending} onClick={save} className="rounded-lg bg-zinc-900 px-3 py-2 text-sm font-bold text-white">{rating ? "평점 수정" : "평점 등록"}</button>{rating && <button type="button" disabled={mutation.remove.isPending} onClick={() => mutation.remove.mutate(rating.ratingId)} className="text-sm font-bold text-zinc-600 underline">삭제</button>}</div></section>;
}
