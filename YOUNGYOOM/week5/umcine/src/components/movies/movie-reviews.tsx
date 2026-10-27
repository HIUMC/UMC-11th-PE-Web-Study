import { useEffect, useState } from "react";
import { getMemberRatings } from "../../api/members";
import type { RatingResponse } from "../../api/members";

export function MovieReviews({ movieId }: { movieId: number }) {
  const [reviews, setReviews] = useState<RatingResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadReviews() {
      try {
        const ratings = await getMemberRatings(1);
        if (!ignore) {
          const movieReviews = ratings.filter((review) => review.movieId === movieId);
          console.log("내 리뷰", { movieId, reviews: movieReviews });
          setReviews(movieReviews);
        }
      } catch {
        if (!ignore) setErrorMessage("리뷰를 불러오지 못했어요.");
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    loadReviews();
    return () => {
      ignore = true;
    };
  }, [movieId]);

  return (
    <section className="px-20 pb-8">
      <h2 className="mb-4 text-lg font-bold">내 리뷰</h2>
      {isLoading ? (
        <p className="text-sm text-gray-500">리뷰를 불러오는 중이에요.</p>
      ) : errorMessage ? (
        <p role="status" className="text-sm text-gray-500">{errorMessage}</p>
      ) : reviews.length === 0 ? (
        <p className="text-sm text-gray-500">아직 작성한 리뷰가 없어요.</p>
      ) : (
        <div className="space-y-3">
          {reviews.map((review) => (
            <article key={review.ratingId} className="rounded-lg border border-gray-200 bg-white p-4">
              <p className="text-sm font-semibold">평점 {review.score}점</p>
              {review.comment && (
                <p className="mt-2 whitespace-pre-wrap break-words text-sm text-gray-700">{review.comment}</p>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
