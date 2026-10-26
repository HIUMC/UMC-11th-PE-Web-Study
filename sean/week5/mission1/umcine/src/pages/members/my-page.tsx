import { useState, type SubmitEvent } from "react";
import { HTTPError } from "ky";
import { checkNickname } from "../../api/members/check-nickname";
import { checkEmail } from "../../api/members/check-email";
import { getMemberRatings, type MemberRating } from "../../api/members/get-member-ratings";

export function MyPage() {
  const [nickname, setNickname] = useState("수현");
  const [nicknameResult, setNicknameResult] = useState<string | null>(null);

  const [email, setEmail] = useState("noco@umc.com");
  const [emailResult, setEmailResult] = useState<string | null>(null);

  const [memberId, setMemberId] = useState("1");
  const [ratings, setRatings] = useState<MemberRating[] | null>(null);
  const [ratingsError, setRatingsError] = useState<string | null>(null);
  const [isRatingsLoading, setIsRatingsLoading] = useState(false);

  async function handleNicknameSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setNicknameResult(null);
    try {
      const response = await checkNickname(nickname.trim());
      setNicknameResult(
        response.available ? "사용할 수 있는 닉네임이에요." : "이미 사용 중인 닉네임이에요.",
      );
    } catch {
      setNicknameResult("확인하지 못했어요.");
    }
  }

  async function handleEmailSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setEmailResult(null);
    try {
      const response = await checkEmail(email.trim());
      setEmailResult(
        response.available ? "사용할 수 있는 이메일이에요." : "이미 가입된 이메일이에요.",
      );
    } catch {
      setEmailResult("확인하지 못했어요.");
    }
  }

  async function handleRatingsSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setRatings(null);
    setRatingsError(null);
    setIsRatingsLoading(true);

    try {
      const response = await getMemberRatings(Number(memberId));
      setRatings(response);
    } catch (error) {
      if (error instanceof HTTPError && error.response.status === 404) {
        setRatingsError("존재하지 않는 유저예요.");
      } else {
        setRatingsError("평점을 불러오지 못했어요.");
      }
    } finally {
      setIsRatingsLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-[1200px] px-6 pb-16">
      <h1 className="mt-8 mb-6 text-[28px] font-semibold text-neutral-900">내 정보</h1>

      <section className="border-t border-neutral-200 py-6">
        <h2 className="text-lg font-bold text-neutral-900">닉네임 중복 확인</h2>
        <form onSubmit={handleNicknameSubmit} className="mt-3 flex max-w-[480px] gap-2">
          <input
            aria-label="닉네임"
            value={nickname}
            onChange={(event) => setNickname(event.target.value)}
            className="flex-1 rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none"
          />
          <button
            type="submit"
            className="cursor-pointer rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white"
          >
            확인
          </button>
        </form>
        {nicknameResult && <p className="mt-2 text-sm text-neutral-600">{nicknameResult}</p>}
      </section>

      <section className="border-t border-neutral-200 py-6">
        <h2 className="text-lg font-bold text-neutral-900">이메일 중복 확인</h2>
        <form onSubmit={handleEmailSubmit} className="mt-3 flex max-w-[480px] gap-2">
          <input
            aria-label="이메일"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="flex-1 rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none"
          />
          <button
            type="submit"
            className="cursor-pointer rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white"
          >
            확인
          </button>
        </form>
        {emailResult && <p className="mt-2 text-sm text-neutral-600">{emailResult}</p>}
      </section>

      <section className="border-t border-neutral-200 py-6">
        <h2 className="text-lg font-bold text-neutral-900">내가 남긴 평점</h2>
        <form onSubmit={handleRatingsSubmit} className="mt-3 flex max-w-[480px] gap-2">
          <input
            aria-label="회원 번호"
            value={memberId}
            onChange={(event) => setMemberId(event.target.value)}
            className="flex-1 rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none"
          />
          <button
            type="submit"
            className="cursor-pointer rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white"
          >
            조회
          </button>
        </form>

        {isRatingsLoading ? (
          <p className="mt-4 text-sm text-neutral-500">평점을 불러오는 중이에요.</p>
        ) : ratingsError ? (
          <p className="mt-4 text-sm text-red-600">{ratingsError}</p>
        ) : ratings === null ? null : ratings.length === 0 ? (
          <p className="mt-4 text-sm text-neutral-500">남긴 평점이 없어요.</p>
        ) : (
          <ul className="mt-4 divide-y divide-neutral-200 border-t border-neutral-200">
            {ratings.map((rating) => (
              <li key={rating.ratingId} className="flex items-start gap-4 py-4">
                <span className="w-16 shrink-0 text-sm font-medium text-neutral-900">
                  ★ {rating.score}
                </span>
                <div className="flex-1">
                  <p className="text-sm text-neutral-900">영화 ID {rating.movieId}</p>
                  <p className="mt-1 text-sm text-neutral-600">
                    {rating.comment ?? "코멘트가 없어요."}
                  </p>
                </div>
                <span className="shrink-0 text-xs text-neutral-400">
                  {rating.createdAt.slice(0, 10)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}