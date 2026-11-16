import { useState } from "react";
import {
  checkEmail,
  checkNickname,
  getMemberRatings,
} from "../../api/backend/members";

interface ApiTesterProps {
  title: string;
  path: string;
  defaultValue: string;
  run: (value: string) => Promise<unknown>;
}

function ApiTester({ title, path, defaultValue, run }: ApiTesterProps) {
  const [value, setValue] = useState(defaultValue);
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleClick() {
    setIsLoading(true);
    setResult("");

    try {
      const data = await run(value);
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult(error instanceof Error ? error.message : "요청에 실패했어요.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="mt-8">
      <h2 className="text-xl font-bold text-ink">{title}</h2>
      <p className="mt-1 text-sm text-muted">{path}</p>

      <div className="mt-3 flex gap-3">
        <input
          aria-label={title}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          className="h-11 w-[320px] rounded-lg border border-line bg-white px-3 text-sm outline-none"
        />
        <button
          type="button"
          onClick={handleClick}
          disabled={isLoading}
          className="h-11 cursor-pointer rounded-lg bg-ink px-4 text-sm font-semibold text-white disabled:opacity-50"
        >
          {isLoading ? "요청 중..." : "호출"}
        </button>
      </div>

      <pre className="mt-3 min-h-[60px] overflow-x-auto rounded-lg border border-line bg-white p-3 text-sm">
        {result || "아직 호출하지 않았어요."}
      </pre>
    </section>
  );
}

export function BackendTestPage() {
  return (
    <main className="px-20 pb-10 pt-8 max-[560px]:px-5">
      <h1 className="text-[32px] font-bold text-ink">백엔드 API 테스트</h1>
      <p className="mt-2 text-muted">
        Spring 서버(localhost:8080)를 호출해 CORS 설정 후 응답을 확인해요.
      </p>

      <ApiTester
        title="닉네임 중복 체크"
        path="GET /members/nickname/{nickname}"
        defaultValue="수현"
        run={(value) => checkNickname(value)}
      />
      <ApiTester
        title="이메일 중복 체크"
        path="GET /members/email/{email}"
        defaultValue="noco@umc.com"
        run={(value) => checkEmail(value)}
      />
      <ApiTester
        title="유저별 평점 조회"
        path="GET /members/{memberId}/ratings"
        defaultValue="1"
        run={(value) => getMemberRatings(Number(value))}
      />
    </main>
  );
}