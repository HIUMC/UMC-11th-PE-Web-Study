import { useState } from "react";
import {
  checkEmail,
  checkNickname,
  getMemberRatings,
} from "../api/members";

export default function MemberApiPage() {
  const [nickname, setNickname] = useState("수현");
  const [email, setEmail] = useState("noco@umc.com");
  const [memberId, setMemberId] = useState("1");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  async function request(label: string, action: () => Promise<unknown>) {
    setLoading(true);
    setResult(`${label} 요청 중…`);

    try {
      const data = await action();
      setResult(`${label} 성공\n${JSON.stringify(data, null, 2)}`);
    } catch (error) {
      setResult(
        `${label} 실패\n${
          error instanceof Error ? error.message : "요청에 실패했어요."
        }`,
      );
    } finally {
      setLoading(false);
    }
  }

  const inputClass = "rounded border border-gray-300 bg-white p-2";
  const buttonClass =
    "rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50";

  return (
    <main className="mx-auto max-w-3xl space-y-6 px-4 py-10">
      <h1 className="text-2xl font-bold">회원 API 확인</h1>

      <section className="space-y-2">
        <h2 className="font-bold">닉네임 중복 체크</h2>
        <div className="flex flex-wrap gap-2">
          <input
            aria-label="닉네임"
            className={inputClass}
            value={nickname}
            onChange={(event) => setNickname(event.target.value)}
          />
          <button
            className={buttonClass}
            disabled={loading || !nickname.trim()}
            onClick={() =>
              request("닉네임 중복 체크", () => checkNickname(nickname.trim()))
            }
          >
            닉네임 확인
          </button>
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="font-bold">이메일 중복 체크</h2>
        <div className="flex flex-wrap gap-2">
          <input
            aria-label="이메일"
            type="email"
            className={inputClass}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <button
            className={buttonClass}
            disabled={loading || !email.trim()}
            onClick={() =>
              request("이메일 중복 체크", () => checkEmail(email.trim()))
            }
          >
            이메일 확인
          </button>
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="font-bold">회원별 평점 조회</h2>
        <div className="flex flex-wrap gap-2">
          <input
            aria-label="회원 ID"
            type="number"
            min="1"
            step="1"
            className={inputClass}
            value={memberId}
            onChange={(event) => setMemberId(event.target.value)}
          />
          <button
            className={buttonClass}
            disabled={
              loading ||
              !Number.isSafeInteger(Number(memberId)) ||
              Number(memberId) < 1
            }
            onClick={() =>
              request("회원별 평점 조회", () =>
                getMemberRatings(Number(memberId)),
              )
            }
          >
            평점 조회
          </button>
        </div>
      </section>

      <pre
        aria-live="polite"
        className="overflow-auto rounded bg-gray-100 p-4 whitespace-pre-wrap"
      >
        {result || "버튼을 눌러 API 응답을 확인하세요."}
      </pre>
    </main>
  );
}