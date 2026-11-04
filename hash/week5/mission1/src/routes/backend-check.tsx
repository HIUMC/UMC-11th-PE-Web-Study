import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/backend-check")({
    component: BackendCheckPage,
});

const API_BASE_URL = "http://localhost:8080";

function BackendCheckPage() {
    return (
        <main className="mx-auto w-full max-w-4xl flex-1 space-y-6 px-6 py-10">
            <div>
                <h1 className="text-2xl font-bold">회원 API 연동 확인</h1>
                <p className="mt-2 text-sm text-gray-600">
                    닉네임·이메일 사용 가능 여부와 회원별 평점을 확인합니다.
                </p>
            </div>

            <ApiCheckForm
                kind="nickname"
                title="닉네임 중복 확인"
                initialValue="수현"
            />

            <ApiCheckForm
                kind="email"
                title="이메일 중복 확인"
                initialValue="noco@umc.com"
            />

            <ApiCheckForm
                kind="ratings"
                title="회원별 평점 조회"
                initialValue="1"
            />
        </main>
    );
}

type ApiCheckFormProps = {
    kind: "nickname" | "email" | "ratings";
    title: string;
    initialValue: string;
};

function ApiCheckForm({
                          kind,
                          title,
                          initialValue,
                      }: ApiCheckFormProps) {
    const [value, setValue] = useState(initialValue);
    const [pending, setPending] = useState(false);
    const [result, setResult] = useState("");
    const [requestUrl, setRequestUrl] = useState("");
    const [failed, setFailed] = useState(false);

    async function request() {
        const encodedValue = encodeURIComponent(value.trim());

        const path =
            kind === "ratings"
                ? `/members/${encodedValue}/ratings`
                : `/members/${kind}/${encodedValue}`;

        const url = `${API_BASE_URL}${path}`;

        setPending(true);
        setFailed(false);
        setResult("");
        setRequestUrl(url);

        try {
            const response = await fetch(url);
            const data: unknown = await response.json();

            setFailed(!response.ok);
            setResult(
                `HTTP ${response.status}\n${JSON.stringify(data, null, 2)}`,
            );
        } catch {
            setFailed(true);
            setResult(
                "응답을 받지 못했습니다. 서버 실행 상태와 브라우저 Console의 CORS 오류를 확인해 주세요.",
            );
        } finally {
            setPending(false);
        }
    }

    return (
        <section className="rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="mb-3 text-lg font-semibold">{title}</h2>

            <form
                className="flex flex-wrap gap-3"
                onSubmit={(event) => {
                    event.preventDefault();
                    void request();
                }}
            >
                <label className="sr-only" htmlFor={`check-${kind}`}>
                    {title}
                </label>

                <input
                    id={`check-${kind}`}
                    type={
                        kind === "ratings"
                            ? "number"
                            : kind === "email"
                                ? "email"
                                : "text"
                    }
                    value={value}
                    onChange={(event) => setValue(event.target.value)}
                    required
                    disabled={pending}
                    min={kind === "ratings" ? 1 : undefined}
                    step={kind === "ratings" ? 1 : undefined}
                    className="min-w-0 flex-1 rounded-lg border border-gray-300 px-3 py-2"
                />

                <button
                    type="submit"
                    disabled={pending || !value.trim()}
                    className="rounded-lg bg-[#4765df] px-4 py-2 font-semibold text-white disabled:opacity-50"
                >
                    {pending ? "조회 중…" : "조회"}
                </button>
            </form>

            {requestUrl && (
                <p className="mt-3 break-all text-xs text-gray-600">
                    GET {requestUrl}
                </p>
            )}

            <pre
                role={failed ? "alert" : "status"}
                className="mt-3 max-h-80 overflow-auto whitespace-pre-wrap break-words rounded-lg bg-gray-50 p-4 text-sm"
            >
        {pending
            ? "불러오는 중…"
            : result || "조회 버튼을 눌러 주세요."}
      </pre>
        </section>
    );
}