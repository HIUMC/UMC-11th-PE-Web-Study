"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { getMemberRatings } from "../../api/ratings/ratings";
import { useAuthStore } from "../../stores/auth-store";
import { useHydrated } from "../../hooks/use-hydrated";
import { getMemberIdFromToken } from "../../utils/get-member-id-from-token";
import { RatingForm } from "./rating-form";

export function MemberRatingPanel({
  movieId,
}: {
  movieId: number;
}) {
  const hydrated = useHydrated();

  const storedAccessToken = useAuthStore(
    (state) => state.accessToken,
  );

  const accessToken = hydrated ? storedAccessToken : null;
  const memberId = getMemberIdFromToken(accessToken);

  const ratingsQuery = useQuery({
    queryKey: ["ratings", "member", memberId, accessToken],
    queryFn: () => {
      if (memberId === null) {
        throw new Error("회원 번호를 확인할 수 없어요.");
      }

      return getMemberRatings(memberId);
    },
    enabled: Boolean(accessToken) && memberId !== null,
  });

  const myRating = ratingsQuery.data?.find(
    (rating) => rating.movieId === movieId,
  );

  return (
    <section className="h-fit min-w-0 border-t border-gray-200 pt-5 sm:col-span-2 lg:col-span-1 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
      <h2 className="mb-2 font-bold text-gray-900">
        내 평점
      </h2>

      {!hydrated ? (
        <p role="status" className="text-xs text-gray-500">
          로그인 상태를 확인하는 중이에요.
        </p>
      ) : !accessToken ? (
        <p className="text-xs text-gray-500">
          평점을 남기려면{" "}
          <Link
            href="/login"
            className="font-semibold text-blue-600"
          >
            로그인
          </Link>
          해 주세요.
        </p>
      ) : memberId === null ? (
        <p role="alert" className="text-xs text-red-600">
          회원 정보를 확인할 수 없어요. 다시 로그인해 주세요.
        </p>
      ) : ratingsQuery.isPending ? (
        <p role="status" className="text-xs text-gray-500">
          내 평점을 불러오는 중이에요.
        </p>
      ) : ratingsQuery.isError ? (
        <div role="alert" className="text-xs text-red-600">
          <p>평점을 불러오지 못했어요.</p>

          <button
            type="button"
            onClick={() => void ratingsQuery.refetch()}
            disabled={ratingsQuery.isFetching}
            className="mt-2 underline disabled:opacity-50"
          >
            {ratingsQuery.isFetching
              ? "불러오는 중…"
              : "다시 시도"}
          </button>
        </div>
      ) : (
        <RatingForm
          key={`${memberId}:${movieId}:${myRating?.ratingId ?? "new"}:${myRating?.updatedAt ?? ""}`}
          movieId={movieId}
          memberId={memberId}
          myRating={myRating}
        />
      )}
    </section>
  );
}