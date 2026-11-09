import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { isHTTPError } from "ky";
import { useEffect, useState, type FormEvent } from "react";
import { getMemberRatings } from "../../api/members/get-member-ratings";
import type { MemberRatingResponse } from "../../api/members/models";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import type { TmdbMovieDetail } from "../../api/movies/models";
import { MoviePoster } from "../../components/movies/movie-poster";
import { useProfileStore } from "../../stores/profile-store";

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

      <ProfileSection />

      <section className="mt-8 border-t border-gray-200 pt-6">
        <h2 className="text-base font-bold">회원 선택</h2>
        <p className="mt-1 text-xs text-gray-500">
          로그인 API(8주차)를 연결하기 전까지는 회원 번호로 평점을 조회해요.
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
        {/* 회원 번호가 바뀌면 key가 바뀌어서 목록 상태가 초기화됨 */}
        <MemberRatings key={memberId} memberId={memberId} />
      </section>
    </main>
  );
}

function ProfileSection() {
  const profile = useProfileStore((state) => state.profile);

  return (
    <section className="mt-6 flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-6 sm:flex-row sm:items-center">
      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gray-100">
        <img src="/icons/person.svg" alt="" className="h-8 w-8 opacity-60" />
      </div>
      <dl className="flex flex-1 flex-col gap-1">
        <dt className="sr-only">닉네임</dt>
        <dd className="text-lg font-bold">{profile.nickname}</dd>
        <dt className="sr-only">이메일</dt>
        <dd className="text-sm text-gray-500">{profile.email}</dd>
        <dt className="sr-only">한 줄 소개</dt>
        <dd className="mt-1 text-sm text-gray-600">
          {profile.introduction || "아직 한 줄 소개가 없어요."}
        </dd>
      </dl>
      <Link
        to="/mypage/edit"
        className="flex items-center justify-center gap-1.5 self-start rounded-md border border-gray-300 px-4 py-2 text-sm font-bold text-gray-700 sm:self-center"
      >
        <img src="/icons/edit.svg" alt="" className="h-4 w-4" />
        수정하기
      </Link>
    </section>
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
        // 평점에는 영화 ID만 있어서 제목이랑 포스터는 TMDB 상세 API로 채움
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
