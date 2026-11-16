import { useState } from "react";
import { checkNickname, checkEmail, getMemberRatings } from "../api/member-api";
import type { Rating } from "../api/member-api";

export function AccountPage() {
  const [nickname, setNickname] = useState("수현");
  const [email, setEmail] = useState("noco@umc.com");
  const [nicknameResult, setNicknameResult] = useState("");
  const [emailResult, setEmailResult] = useState("");
  const [ratings, setRatings] = useState<Rating[] | null>(null);
  const [ratingError, setRatingError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleNicknameCheck() {
    setBusy(true);
    setNicknameResult("");
    try {
      const data = await checkNickname(nickname.trim());
      setNicknameResult(
        data.available ? "사용 가능한 닉네임이에요." : "이미 사용 중이에요.",
      );
    } catch {
      setNicknameResult("요청에 실패했어요. 서버 연결을 확인해주세요.");
    } finally {
      setBusy(false);
    }
  }

  async function handleEmailCheck() {
    setBusy(true);
    setEmailResult("");
    try {
      const data = await checkEmail(email.trim());
      setEmailResult(
        data.available ? "사용 가능한 이메일이에요." : "이미 사용 중이에요.",
      );
    } catch {
      setEmailResult("요청에 실패했어요. 서버 연결을 확인해주세요.");
    } finally {
      setBusy(false);
    }
  }

  async function handleRatings() {
    setBusy(true);
    setRatings(null);
    setRatingError("");
    try {
      setRatings(await getMemberRatings(1));
    } catch (error) {
      setRatingError(
        error instanceof Error ? error.message : "조회에 실패했어요.",
      );
    } finally {
      setBusy(false);
    }
  }

  const inputClass = "min-w-0 flex-1 rounded border px-3 py-2";
  const buttonClass =
    "rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50";

  return (
    <main className="mx-auto max-w-2xl space-y-8 px-6 py-10">
      <h1 className="text-3xl font-bold">내 정보</h1>

      <section className="space-y-3">
        <label htmlFor="nickname" className="block font-semibold">
          닉네임
        </label>
        <div className="flex gap-2">
          <input
            id="nickname"
            className={inputClass}
            value={nickname}
            disabled={busy}
            onChange={(event) => {
              setNickname(event.target.value);
              setNicknameResult("");
            }}
          />
          <button
            className={buttonClass}
            disabled={busy || !nickname.trim()}
            onClick={handleNicknameCheck}
          >
            중복 확인
          </button>
        </div>
        <p role="status">{nicknameResult}</p>
      </section>

      <section className="space-y-3">
        <label htmlFor="email" className="block font-semibold">
          이메일
        </label>
        <div className="flex gap-2">
          <input
            id="email"
            type="email"
            className={inputClass}
            value={email}
            disabled={busy}
            onChange={(event) => {
              setEmail(event.target.value);
              setEmailResult("");
            }}
          />
          <button
            className={buttonClass}
            disabled={busy || !email.trim()}
            onClick={handleEmailCheck}
          >
            중복 확인
          </button>
        </div>
        <p role="status">{emailResult}</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold">회원별 평점</h2>
        <p className="text-sm text-gray-500">
          로그인 기능 구현 전이라 1번 회원의 평점을 조회해요.
        </p>
        <button className={buttonClass} disabled={busy} onClick={handleRatings}>
          평점 조회
        </button>

        {ratingError && <p role="alert">{ratingError}</p>}
        {ratings?.length === 0 && <p>등록된 평점이 없어요.</p>}

        {ratings?.map((rating) => (
          <article
            key={rating.ratingId}
            className="space-y-2 rounded-lg border p-4"
          >
            <h3 className="font-semibold">영화 ID: {rating.movieId}</h3>
            <p>⭐ {rating.score} / 5</p>
            <p>{rating.comment || "코멘트가 없어요."}</p>
            <p className="text-sm text-gray-500">
              작성일: {rating.createdAt.replace("T", " ")}
            </p>
          </article>
        ))}
      </section>
    </main>
  );
}
