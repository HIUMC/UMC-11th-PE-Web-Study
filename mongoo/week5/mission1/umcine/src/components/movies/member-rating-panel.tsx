import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { isHTTPError } from "ky";
import {
  checkEmail,
  checkNickname,
  getMemberRatings,
} from "../../api/members/get-member-data";
import type { MemberRating } from "../../api/members/models";

const inputClass =
  "min-w-0 flex-1 rounded border border-gray-200 bg-white px-2 py-2 text-xs outline-none focus:border-blue-600 disabled:bg-gray-100";
const buttonClass =
  "shrink-0 cursor-pointer rounded bg-[#2563eb] px-3 py-2 text-xs font-semibold text-white disabled:cursor-wait disabled:opacity-50";

type CheckState = {
  loading: boolean;
  message: string;
  available?: boolean;
};
const idleCheck: CheckState = { loading: false, message: "" };

function getErrorMessage(error: unknown) {
  if (isHTTPError(error)) {
    if (error.response.status === 404) return "존재하지 않는 회원이에요. 회원 번호를 확인해 주세요.";
    if (error.response.status === 400) return "입력한 값을 확인해 주세요.";
    return `요청을 처리하지 못했어요. (${error.response.status})`;
  }
  return "서버에 연결하지 못했어요. 백엔드 실행 상태와 CORS 설정을 확인해 주세요.";
}

function AvailabilityField({ kind }: { kind: "nickname" | "email" }) {
  const [value, setValue] = useState("");
  const [state, setState] = useState<CheckState>(idleCheck);
  const label = kind === "nickname" ? "닉네임" : "이메일";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const checkedValue = value.trim();
    if (!checkedValue || state.loading) return;
    setState({ loading: true, message: "확인 중이에요." });
    try {
      const result = await (kind === "nickname" ? checkNickname(checkedValue) : checkEmail(checkedValue));
      setState({
        loading: false,
        available: result.available,
        message: result.available
          ? `사용할 수 있는 ${label}이에요.`
          : `이미 사용 중인 ${label}이에요.`,
      });
    } catch (error) {
      setState({ loading: false, message: getErrorMessage(error) });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3">
      <label htmlFor={`member-${kind}`} className="mb-1 block text-xs font-semibold text-gray-700">
        {label}
      </label>
      <div className="flex gap-2">
        <input
          id={`member-${kind}`}
          type={kind === "email" ? "email" : "text"}
          value={value}
          onChange={(event) => { setValue(event.target.value); setState(idleCheck); }}
          disabled={state.loading}
          placeholder={kind === "email" ? "noco@umc.com" : "수현"}
          required
          className={inputClass}
        />
        <button type="submit" disabled={state.loading} className={buttonClass}>
          중복 확인
        </button>
      </div>
      {state.message && (
        <p role="status" className={`mt-1 text-xs ${state.available ? "text-green-700" : "text-gray-600"}`}>
          {state.message}
        </p>
      )}
    </form>
  );
}

export function MemberRatingPanel({ movieId }: { movieId: number }) {
  const [memberId, setMemberId] = useState("1");
  const [ratings, setRatings] = useState<MemberRating[] | null>(null);
  const [loadedMemberId, setLoadedMemberId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const myRating = ratings?.find((rating) => rating.movieId === movieId);

  async function handleLoadRatings(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const id = memberId.trim();
    if (isLoading) return;
    setRatings(null);
    setLoadedMemberId("");
    setErrorMessage("");
    if (!/^[1-9]\d*$/.test(id)) {
      setErrorMessage("회원 번호는 1 이상의 정수로 입력해 주세요.");
      return;
    }
    setIsLoading(true);
    try {
      setRatings(await getMemberRatings(id));
      setLoadedMemberId(id);
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="h-fit rounded-lg border p-4">
      <h2 className="mb-2 font-bold text-gray-900">내 평점</h2>
      <p className="mb-2 text-sm text-gray-500">별점은 필수, 후기는 선택이에요.</p>
      <div className="mb-3 flex gap-1" aria-label={myRating ? `별점 ${myRating.score}점` : "아직 조회한 평점이 없어요."}>
        {Array.from({ length: 5 }).map((_, index) => (
          <img
            key={index}
            src={myRating && index < myRating.score ? "/icons/star.svg" : "/icons/star-outline.svg"}
            alt=""
            className="h-6 w-6"
          />
        ))}
      </div>
      <textarea
        aria-label="이 영화에 남긴 후기"
        value={myRating?.comment ?? ""}
        readOnly
        placeholder="영화를 보고 느낀 점을 남겨보세요."
        className="mb-3 h-24 w-full rounded border p-2 text-sm outline-none focus:border-black"
      />
      <button
        type="button"
        disabled
        title="평점 저장은 6주차에 연결합니다."
        className="w-full cursor-not-allowed rounded bg-black py-2 text-sm font-semibold text-white"
      >
        평점 저장
      </button>
      <p className="mt-2 text-xs text-gray-500">이번 주는 조회만 가능해요. 아래에서 회원 평점을 불러올 수 있어요.</p>
      {ratings !== null && (
        <p role="status" className="mt-2 text-xs text-gray-600">
          {myRating ? `${loadedMemberId}번 회원이 이 영화에 남긴 평점이에요.` : `${loadedMemberId}번 회원이 이 영화에 남긴 평점이 없어요.`}
        </p>
      )}

      <details className="mt-4 border-t border-gray-200 pt-3">
        <summary className="cursor-pointer text-sm font-semibold text-gray-800">회원 정보 확인 · 평점 불러오기</summary>
        <AvailabilityField kind="nickname" />
        <AvailabilityField kind="email" />
        <form onSubmit={handleLoadRatings} className="mt-4">
          <label htmlFor="rating-member-id" className="mb-1 block text-xs font-semibold text-gray-700">조회할 회원 번호</label>
          <div className="flex gap-2">
            <input
              id="rating-member-id"
              type="number"
              min="1"
              step="1"
              value={memberId}
              onChange={(event) => setMemberId(event.target.value)}
              disabled={isLoading}
              required
              className={inputClass}
            />
            <button type="submit" disabled={isLoading} className={buttonClass}>
              {isLoading ? "불러오는 중" : "평점 조회"}
            </button>
          </div>
          <p className="mt-1 text-xs text-gray-500">로그인 연결 전이므로 조회할 회원 번호를 직접 입력해요.</p>
        </form>
        {errorMessage && <p role="alert" className="mt-2 text-xs text-red-700">{errorMessage}</p>}
        {ratings !== null && (
          <div className="mt-4 border-t border-gray-100 pt-3">
            <h3 className="text-xs font-semibold text-gray-700">{loadedMemberId}번 회원의 평점 {ratings.length}개</h3>
            {ratings.length === 0 ? (
              <p className="mt-2 text-xs text-gray-500">아직 남긴 평점이 없어요.</p>
            ) : (
              <ul className="mt-2 space-y-3">
                {ratings.map((rating) => (
                  <li key={rating.ratingId} className="border-b border-gray-100 pb-2 text-xs text-gray-600">
                    <Link to="/movies/$movieId" params={{ movieId: String(rating.movieId) }} className="font-semibold text-blue-600 hover:underline">
                      영화 #{rating.movieId}
                    </Link>
                    <span className="ml-2">★ {rating.score}/5</span>
                    <p className="mt-1 whitespace-pre-wrap break-words">{rating.comment || "남긴 후기가 없어요."}</p>
                    <time dateTime={rating.createdAt} className="mt-1 block text-[10px] text-gray-400">
                      {rating.createdAt.replace("T", " ")}
                    </time>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </details>
    </div>
  );
}
