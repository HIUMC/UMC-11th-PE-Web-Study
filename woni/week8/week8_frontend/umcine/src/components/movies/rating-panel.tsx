import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { memberQueries } from "../../api/members/member-queries";
import type { Rating } from "../../api/ratings/models";
import { ratingQueries } from "../../api/ratings/rating-queries";
import { useCreateRatingMutation } from "../../hooks/use-create-rating-mutation";
import { useDeleteRatingMutation } from "../../hooks/use-delete-rating-mutation";
import { useUpdateRatingMutation } from "../../hooks/use-update-rating-mutation";
import { useAuthStore } from "../../stores/auth-store";

const RATING_SCORES = [1, 2, 3, 4, 5];
const COMMENT_MAX_LENGTH = 500;

interface RatingPanelProps {
  movieId: number;
}

// 영화 상세의 내 평점 영역
export function RatingPanel({ movieId }: RatingPanelProps) {
  const navigate = useNavigate();
  const accessToken = useAuthStore((state) => state.accessToken);
  const isLoggedIn = Boolean(accessToken);

  const meQuery = useQuery({ ...memberQueries.me(), enabled: isLoggedIn });
  const memberId = meQuery.data?.memberId;
  const ratingsQuery = useQuery({
    ...ratingQueries.byMember(memberId ?? 0),
    enabled: isLoggedIn && memberId !== undefined,
  });

  let content;
  if (!isLoggedIn) {
    // 로그인하지 않았으면 저장을 누를 때 로그인 페이지로 이동
    content = <RatingForm onSave={() => navigate({ to: "/login" })} />;
  } else if (memberId === undefined || ratingsQuery.isPending) {
    content = <RatingForm isDisabled onSave={() => {}} />;
  } else if (ratingsQuery.isError) {
    content = (
      <p className="text-xs text-[#e5484d]">
        내 평점을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.
      </p>
    );
  } else {
    const myRating = ratingsQuery.data.find(
      (rating) => rating.movieId === movieId,
    );
    content = (
      <MemberRatingForm
        // 평점이 생기거나 지워지면 입력 상태를 새 값으로 다시 시작
        key={myRating?.ratingId ?? "new"}
        memberId={memberId}
        movieId={movieId}
        rating={myRating}
      />
    );
  }

  return (
    <aside className="flex w-[360px] shrink-0 flex-col gap-2 border-l border-[#e3e6eb] pb-10 pl-[30px]">
      <h2 className="text-[21px] font-bold tracking-[-0.63px] text-[#17191e]">
        내 평점
      </h2>
      <p className="text-xs text-[#969da8]">별점은 필수, 후기는 선택이에요.</p>
      {content}
    </aside>
  );
}

interface MemberRatingFormProps {
  memberId: number;
  movieId: number;
  rating: Rating | undefined;
}

// 로그인한 회원의 평점 등록, 수정, 삭제를 연결
function MemberRatingForm({ memberId, movieId, rating }: MemberRatingFormProps) {
  const createRatingMutation = useCreateRatingMutation(memberId);
  const updateRatingMutation = useUpdateRatingMutation(memberId);
  const deleteRatingMutation = useDeleteRatingMutation(memberId);

  const isPending =
    createRatingMutation.isPending ||
    updateRatingMutation.isPending ||
    deleteRatingMutation.isPending;

  const handleSave = (score: number, comment: string | null) => {
    if (rating) {
      updateRatingMutation.mutate({ ratingId: rating.ratingId, score, comment });
    } else {
      createRatingMutation.mutate({ movieId, score, comment });
    }
  };

  const handleDelete = () => {
    if (!rating) return;
    if (!confirm("평점을 삭제할까요?")) return;
    deleteRatingMutation.mutate(rating.ratingId);
  };

  return (
    <RatingForm
      rating={rating}
      isPending={isPending}
      onSave={handleSave}
      onDelete={rating ? handleDelete : undefined}
    />
  );
}

interface RatingFormProps {
  rating?: Rating;
  isDisabled?: boolean;
  isPending?: boolean;
  onSave: (score: number, comment: string | null) => void;
  onDelete?: () => void;
}

// 별점과 후기 입력 화면 (요청은 onSave, onDelete로 위임)
function RatingForm({
  rating,
  isDisabled = false,
  isPending = false,
  onSave,
  onDelete,
}: RatingFormProps) {
  const [score, setScore] = useState(rating?.score ?? 0);
  const [comment, setComment] = useState(rating?.comment ?? "");

  const isLocked = isDisabled || isPending;
  const canSave = score > 0 && !isLocked;

  const handleSave = () => {
    if (!canSave) return;
    const trimmedComment = comment.trim();
    onSave(score, trimmedComment.length > 0 ? trimmedComment : null);
  };

  return (
    <>
      <div className="flex gap-1">
        {RATING_SCORES.map((value) => (
          <button
            key={value}
            type="button"
            aria-label={`${value}점`}
            aria-pressed={value === score}
            disabled={isLocked}
            onClick={() => setScore(value)}
            className="flex size-[38px] items-center justify-center rounded-lg border border-[#e3e6eb] bg-white disabled:cursor-not-allowed"
          >
            <img
              src={value <= score ? "/icons/star.svg" : "/icons/star-outline.svg"}
              alt=""
              className="size-6"
            />
          </button>
        ))}
      </div>
      <textarea
        aria-label="후기"
        placeholder="영화를 보고 느낀 점을 남겨보세요."
        value={comment}
        maxLength={COMMENT_MAX_LENGTH}
        disabled={isLocked}
        onChange={(e) => setComment(e.target.value)}
        className="h-[102px] w-full resize-none rounded-lg border border-[#e3e6eb] bg-white px-3 pb-[18px] pt-4 text-[13px] leading-[19.5px] placeholder:text-[#969da8]"
      />
      <button
        type="button"
        disabled={score === 0 || isLocked}
        onClick={handleSave}
        className="h-[42px] w-full rounded-lg bg-[#17191e] text-sm font-extrabold text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? "저장 중" : rating ? "평점 수정" : "평점 저장"}
      </button>
      {onDelete && (
        <button
          type="button"
          disabled={isLocked}
          onClick={onDelete}
          className="h-[42px] w-full rounded-lg border border-[#d92d20] bg-white text-sm font-extrabold text-[#d92d20] disabled:cursor-not-allowed disabled:opacity-50"
        >
          평점 삭제
        </button>
      )}
    </>
  );
}
