import { useState, type SubmitEvent } from "react";
import { cn } from "../../utils/cn";

interface SavedReview {
  rating: number;
  content: string;
}

const scores = [1, 2, 3, 4, 5];

export default function MovieRatingForm() {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [savedReview, setSavedReview] = useState<SavedReview | null>(null);

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    if (rating === 0) return;

    setSavedReview({
      rating,
      content: review.trim(),
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t border-[#e4e7ee] pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0"
    >
      <fieldset>
        <legend className="text-lg font-bold">내 평점</legend>

        <p className="mt-2 text-xs text-[#8a909b]">
          별점은 필수, 후기는 선택이에요.
        </p>

        <div className="mt-3 flex gap-2">
          {scores.map((score) => (
            <button
              key={score}
              type="button"
              aria-label={`${score}점`}
              aria-pressed={rating === score}
              onClick={() => {
                setRating(score);
                setSavedReview(null);
              }}
              className={cn(
                "grid h-9 w-9 cursor-pointer place-items-center rounded-lg border",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4765df]",
                score <= rating
                  ? "border-[#4765df] bg-[#eef1ff]"
                  : "border-[#e0e4ed] bg-white",
              )}
            >
              <img
                src={
                  score <= rating
                    ? "/icons/star.svg"
                    : "/icons/star-outline.svg"
                }
                alt=""
                className="h-5 w-5"
              />
            </button>
          ))}
        </div>
      </fieldset>

      <textarea
        aria-label="영화 후기"
        placeholder="영화를 보고 느낀 점을 남겨보세요."
        maxLength={500}
        value={review}
        onChange={(event) => {
          setReview(event.target.value);
          setSavedReview(null);
        }}
        className="mt-3 min-h-[100px] w-full resize-y rounded-lg border border-[#e0e4ed] bg-white p-3 text-sm leading-relaxed placeholder:text-[#9ca3af] focus:border-[#4765df] focus:outline-none"
      />

      <button
        type="submit"
        disabled={rating === 0}
        className="mt-2 w-full cursor-pointer rounded-lg bg-[#191c23] py-3 text-sm font-bold text-white hover:bg-[#353a45] disabled:cursor-not-allowed disabled:opacity-50"
      >
        평점 저장
      </button>

      {savedReview && (
        <div
          role="status"
          className="mt-3 rounded-lg bg-white p-3 text-sm text-[#4765df]"
        >
          <p>{savedReview.rating}점으로 기록했어요.</p>
          {savedReview.content && (
            <p className="mt-2 break-words text-[#6b7280]">
              {savedReview.content}
            </p>
          )}
        </div>
      )}
    </form>
  );
}