import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { isHTTPError } from "ky";
import { useEffect, useState, type FormEvent } from "react";
import { getMemberRatings } from "../../api/members/get-member-ratings";
import type { MemberRatingResponse } from "../../api/members/models";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import type { TmdbMovieDetail } from "../../api/movies/models";
import { MoviePoster } from "../../components/movies/movie-poster";

const DEFAULT_MEMBER_ID = 1;

export function MyPage() {
  const { memberId = DEFAULT_MEMBER_ID } = useSearch({ from: "/mypage" });
  const navigate = useNavigate({ from: "/mypage" });
  const [memberIdText, setMemberIdText] = useState(String(memberId));

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextMemberId = Number(memberIdText);
    if (!Number.isInteger(nextMemberId) || nextMemberId <= 0) return;
    navigate({ search: { memberId: nextMemberId } });
  }

  return (
    <main className="mx-auto max-w-[1200px] px-6 py-8">
      <h1 className="text-2xl font-bold">내 정보</h1>

      <section className="mt-6 border-t border-gray-200 pt-6">
        <h2 className="text-base font-bold">회원 선택</h2>
        <p className="mt-1 text-xs text-gray-500">
          로그인 기능(7주차) 전까지는 회원 번호로 평점을 조회해요.
        </p>
        <form onSubmit={handleSubmit} className="mt-3 flex max-w-[320px] gap-2">
          <input
            aria-label="회원 번호"
            type="number"
            min={1}
            value={memberIdText}
            onChange={(event) => setMemberIdText(event.target.value)}
            className="flex-1 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm outline-none"
          />
          <button
            type="submit"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white"
          >
            조회
          </button>
        </form>
      </section>

      <section className="mt-8 border-t border-gray-200 pt-6">
        <h2 className="text-base font-bold">내가 남긴 평점</h2>
        {/* 회원 번호가 바뀌면 key가 바뀌어 목록 상태가 새로 시작돼요. */}
        <MemberRatings key={memberId} memberId={memberId} />
      </section>
    </main>
  );
}

interface RatingItem {
  rating: MemberRatingResponse;
  movie: TmdbMovieDetail | null;
}

function MemberRatings({ memberId }: { memberId: number }) {
  const [items, setItems] = useState<RatingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    getMemberRatings(memberId)
      .then(async (ratings) => {
        // 평점에는 영화 ID만 있으므로, 제목과 포스터는 TMDB 상세 API로 채워요.
        const movies = await Promise.all(
          ratings.map((rating) =>
            getMovieDetail(rating.movieId).catch(() => null),
          ),
        );
        if (!ignore) {
          setItems(
            ratings.map((rating, index) => ({ rating, movie: movies[index] })),
          );
        }
      })
      .catch((error: unknown) => {
        if (ignore) return;
        setErrorMessage(
          isHTTPError(error) && error.response.status === 404
            ? "존재하지 않는 회원이에요."
            : "평점 목록을 불러오지 못했어요. 백엔드 서버가 켜져 있는지 확인해 주세요.",
        );
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [memberId]);

  if (isLoading) {
    return (
      <p aria-busy="true" className="mt-4 text-sm text-gray-500">
        평점 목록을 불러오는 중이에요.
      </p>
    );
  }

  if (errorMessage) {
    return (
      <p role="alert" className="mt-4 text-sm text-red-500">
        {errorMessage}
      </p>
    );
  }

  if (items.length === 0) {
    return (
      <p className="mt-4 text-sm text-gray-500">아직 남긴 평점이 없어요.</p>
    );
  }

  return (
    <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
      {items.map(({ rating, movie }) => {
        const title = movie?.title ?? `영화 #${rating.movieId}`;
        return (
          <li
            key={rating.ratingId}
            className="flex gap-4 rounded-lg border border-gray-200 bg-white p-4"
          >
            <Link
              to="/movies/$movieId"
              params={{ movieId: String(rating.movieId) }}
              className="block h-[120px] w-[80px] flex-shrink-0 overflow-hidden rounded-md"
            >
              <MoviePoster posterPath={movie?.poster_path ?? null} title={title} />
            </Link>
            <div className="flex flex-1 flex-col gap-1">
              <Link
                to="/movies/$movieId"
                params={{ movieId: String(rating.movieId) }}
                className="font-bold"
              >
                {title}
              </Link>
              <p className="text-yellow-400" aria-label={`${rating.score}점`}>
                {"★".repeat(rating.score)}
                <span className="text-gray-300">
                  {"★".repeat(5 - rating.score)}
                </span>
              </p>
              <p className="text-sm text-gray-600">
                {rating.comment || "코멘트가 없어요."}
              </p>
              <p className="mt-auto text-xs text-gray-400">
                {rating.createdAt.slice(0, 10).replaceAll("-", ".")}
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
