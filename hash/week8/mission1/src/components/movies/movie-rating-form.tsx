import { Link } from "@tanstack/react-router";
import { useState, type SubmitEvent } from "react";
import { readMemberId } from "../../api/account-session";
import { readMemberApiError } from "../../api/api-client";
import { useRatingMutation } from "../../hooks/use-account-mutations";
import { useMe, useMemberRatings } from "../../hooks/use-account-queries";
import { useAuthStore } from "../../stores/auth-store";
import { cn } from "../../utils/cn";
import { accountButtonClass, accountInputClass, accountLinkClass } from "../account/account-panel";

const scores = [1, 2, 3, 4, 5];

export default function MovieRatingForm({ movieId }: { movieId: number }) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const sessionId = useAuthStore((state) => state.sessionId);
  const memberId = readMemberId(accessToken);
  const me = useMe();

  return (
    <section
      aria-labelledby="rating-title"
      className="border-t border-[#e4e7ee] pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0"
    >
      <h2 id="rating-title" className="text-lg font-bold">내 평점</h2>
      {!accessToken ? (
        <Link to="/login" className={accountLinkClass + " mt-2 inline-block text-sm"}>로그인하고 평점 남기기</Link>
      ) : me.isError && !me.data ? (
        <p role="alert" className="mt-2 text-sm text-red-800">
          {readMemberApiError(me.error).message}{" "}
          <button type="button" onClick={() => void me.refetch()} className={accountLinkClass}>다시 시도</button>
        </p>
      ) : !me.data ? (
        <p role="status" className="mt-2 text-sm">{me.isPaused ? "네트워크 연결을 기다리는 중이에요." : "회원 정보를 확인하는 중이에요."}</p>
      ) : memberId === null ? (
        <p role="alert" className="mt-2 text-sm text-red-800">회원 번호를 확인할 수 없어요. 다시 로그인해 주세요.</p>
      ) : (
        <RatingEditor key={sessionId} sessionId={sessionId} memberId={memberId} movieId={movieId} />
      )}
    </section>
  );
}

function RatingEditor({ sessionId, memberId, movieId }: {
  sessionId: number;
  memberId: number;
  movieId: number;
}) {
  const ratings = useMemberRatings(sessionId, memberId);
  const mutation = useRatingMutation(sessionId, memberId, movieId);
  const saved = ratings.data?.find((rating) => rating.movieId === movieId);
  const [draftScore, setDraftScore] = useState<number>();
  const [draftComment, setDraftComment] = useState<string>();
  const score = draftScore ?? saved?.score ?? 0;
  const comment = draftComment ?? saved?.comment ?? "";
  const locked = !ratings.data || ratings.isError || mutation.isPending;

  function resetDraft() {
    setDraftScore(undefined);
    setDraftComment(undefined);
  }

  function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (locked || !score) return;

    mutation.mutate(
      { action: "save", score, comment: comment.trim(), ratingId: saved?.ratingId },
      { onSuccess: resetDraft },
    );
  }

  return (
    <form onSubmit={submit} aria-busy={mutation.isPending} className="mt-2 space-y-3">
      {ratings.isPending && (
        <p role="status" className="text-sm">{ratings.isPaused ? "네트워크 연결을 기다리는 중이에요." : "등록한 평점을 확인하는 중이에요."}</p>
      )}
      {ratings.isError && (
        <p role="alert" className="text-sm text-red-800">
          {readMemberApiError(ratings.error).message}{" "}
          <button type="button" onClick={() => void ratings.refetch()} className={accountLinkClass}>다시 시도</button>
        </p>
      )}
      <fieldset disabled={locked} className="space-y-3">
        <legend className="text-xs text-[#555d6d]">별점은 필수, 후기는 선택이에요.</legend>

        <div className="flex gap-2">
          {scores.map((value) => (
            <button
              key={value}
              type="button"
              aria-label={value + "점"}
              aria-pressed={score === value}
              onClick={() => {
                setDraftScore(value);
                mutation.reset();
              }}
              className={cn(
                "grid size-9 place-items-center rounded-lg border focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4765df] disabled:opacity-50",
                value <= score ? "border-[#4765df] bg-[#eef1ff]" : "border-[#e0e4ed] bg-white",
              )}
            >
              <img src={value <= score ? "/icons/star.svg" : "/icons/star-outline.svg"} alt="" className="size-5" />
            </button>
          ))}
        </div>

        <textarea
          aria-label="영화 후기"
          placeholder="영화를 보고 느낀 점을 남겨보세요."
          maxLength={500}
          value={comment}
          onChange={(event) => {
            setDraftComment(event.target.value);
            mutation.reset();
          }}
          className={accountInputClass + " min-h-24 resize-y"}
        />

        <button type="submit" disabled={!score} className={accountButtonClass + " w-full"}>
          {mutation.isPending ? "처리 중…" : saved ? "평점 수정" : "평점 등록"}
        </button>

        {saved && (
          <button
            type="button"
            onClick={() => {
              if (!locked) mutation.mutate({ action: "delete", ratingId: saved.ratingId }, { onSuccess: resetDraft });
            }}
            className="min-h-11 w-full rounded-lg border border-[#dce0e9] bg-white text-sm font-semibold text-red-800 hover:bg-red-50 disabled:opacity-50"
          >
            평점 삭제
          </button>
        )}
      </fieldset>

      {saved && <p className="text-xs text-[#555d6d]">서버에 등록된 평점: {saved.score}점</p>}
      {mutation.isSuccess && (
        <p role="status" className="text-sm text-emerald-800">
          {mutation.variables?.action === "delete" ? "평점을 삭제했어요." : "평점을 저장했어요."}
        </p>
      )}
      {mutation.isError && <p role="alert" className="text-sm text-red-800">{readMemberApiError(mutation.error).message}</p>}
    </form>
  );
}
