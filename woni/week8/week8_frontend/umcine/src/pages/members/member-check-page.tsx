import { useState } from "react";
import { HTTPError } from "ky";
import {
  checkEmail,
  checkNickname,
  getMemberRatings,
} from "../../api/members/member-api";
import type {
  AvailabilityResponse,
  RatingResponse,
} from "../../api/members/models";

type AvailabilityCheckProps = {
  title: string;
  placeholder: string;
  onCheck: (value: string) => Promise<AvailabilityResponse>;
};

function AvailabilityCheck({
  title,
  placeholder,
  onCheck,
}: AvailabilityCheckProps) {
  const [value, setValue] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const handleCheck = async () => {
    const trimmed = value.trim();
    if (!trimmed) {
      setMessage("값을 입력해 주세요.");
      return;
    }
    try {
      const { available } = await onCheck(trimmed);
      setMessage(
        available
          ? "사용 가능합니다. (available: true)"
          : "이미 사용 중입니다. (available: false)",
      );
    } catch {
      setMessage(
        "요청에 실패했습니다. 서버 실행 여부와 CORS 설정을 확인해 주세요.",
      );
    }
  };

  return (
    <section className="space-y-2">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="flex gap-2">
        <input
          aria-label={title}
          className="flex-1 rounded border px-3 py-2"
          placeholder={placeholder}
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
        <button
          type="button"
          className="rounded border px-4 py-2"
          onClick={handleCheck}
        >
          중복 확인
        </button>
      </div>
      {message && <p>{message}</p>}
    </section>
  );
}

export function MemberCheckPage() {
  const [memberId, setMemberId] = useState("");
  const [ratings, setRatings] = useState<RatingResponse[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFetchRatings = async () => {
    const id = Number(memberId);
    if (!Number.isInteger(id) || id <= 0) {
      setRatings(null);
      setError("회원 ID를 숫자로 입력해 주세요.");
      return;
    }
    try {
      setRatings(await getMemberRatings(id));
      setError(null);
    } catch (e) {
      setRatings(null);
      setError(
        e instanceof HTTPError && e.response.status === 404
          ? "존재하지 않는 유저입니다. (404)"
          : "요청에 실패했습니다. 서버 실행 여부와 CORS 설정을 확인해 주세요.",
      );
    }
  };

  return (
    <main className="mx-auto max-w-xl space-y-8 p-6">
      <h1 className="text-2xl font-bold">백엔드 API 연동 확인</h1>

      <AvailabilityCheck
        title="닉네임 중복 체크"
        placeholder="닉네임"
        onCheck={checkNickname}
      />
      <AvailabilityCheck
        title="이메일 중복 체크"
        placeholder="이메일"
        onCheck={checkEmail}
      />

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">유저별 평점 조회</h2>
        <div className="flex gap-2">
          <input
            aria-label="회원 ID"
            className="flex-1 rounded border px-3 py-2"
            placeholder="회원 ID"
            value={memberId}
            onChange={(event) => setMemberId(event.target.value)}
          />
          <button
            type="button"
            className="rounded border px-4 py-2"
            onClick={handleFetchRatings}
          >
            조회
          </button>
        </div>
        {error && <p>{error}</p>}
        {ratings && (
          <ul className="space-y-1">
            {ratings.map((rating) => (
              <li key={rating.ratingId}>
                영화 {rating.movieId} / {rating.score}점 / {rating.comment}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
