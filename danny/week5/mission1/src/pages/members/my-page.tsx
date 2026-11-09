import { useState, type ReactNode, type SubmitEvent } from "react";
import {
  checkEmail,
  checkNickname,
  getMemberRatings,
} from "../../api/members-api";
import { getServerErrorMessage } from "../../api/request-error";
import { LoadingState } from "../../components/feedback/request-status";
import { Pagination } from "../../components/movies/pagination";
import { useAsync } from "../../hooks/use-async";
import type { AvailabilityResponse } from "../../types/member";
import { cn } from "../../utils/cn";

const RATING_PAGE_SIZE = 5;

export function MyPage() {
  return (
    <main className="mx-auto flex max-w-[860px] flex-col gap-6 px-4 pt-6 pb-16">
      <h1 className="text-4xl font-bold text-ink">내 정보</h1>

      <AvailabilityCheck
        title="닉네임 중복 확인"
        label="닉네임"
        placeholder="2~12자 (예: 수현)"
        endpoint="GET /members/nickname/{nickname}"
        request={checkNickname}
      />
      <AvailabilityCheck
        title="이메일 중복 확인"
        label="이메일"
        placeholder="예: suhyun@test.com"
        endpoint="GET /members/email/{email}"
        request={checkEmail}
      />
      <MemberRatings />
    </main>
  );
}

type CheckResult =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; value: string; data: AvailabilityResponse }
  | { status: "error"; error: unknown };

interface AvailabilityCheckProps {
  title: string;
  label: string;
  placeholder: string;
  endpoint: string;
  request: (value: string) => Promise<AvailabilityResponse>;
}

function AvailabilityCheck({
  title,
  label,
  placeholder,
  endpoint,
  request,
}: AvailabilityCheckProps) {
  const [value, setValue] = useState("");
  const [result, setResult] = useState<CheckResult>({ status: "idle" });

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) {
      return;
    }

    // 형식 검사는 일부러 서버(400 응답)에 맡깁니다.
    setResult({ status: "loading" });
    try {
      const data = await request(trimmed);
      setResult({ status: "success", value: trimmed, data });
    } catch (error) {
      setResult({ status: "error", error });
    }
  }

  return (
    <Section title={title} endpoint={endpoint}>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          aria-label={label}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder={placeholder}
          className="h-11 min-w-0 flex-1 rounded-md border border-border bg-surface px-3 text-sm text-ink placeholder:text-ink-subtle focus:border-ink focus:outline-none"
        />
        <button
          type="submit"
          disabled={result.status === "loading" || !value.trim()}
          className="h-11 shrink-0 rounded-md bg-brand px-4 text-sm font-bold text-surface transition-colors hover:bg-brand-hover disabled:bg-brand-disabled"
        >
          {result.status === "loading" ? "확인 중…" : "중복 확인"}
        </button>
      </form>

      {result.status === "success" && (
        <p
          role="status"
          className={cn(
            "mt-3 text-sm font-medium",
            result.data.available ? "text-brand" : "text-danger",
          )}
        >
          ‘{result.value}’은(는){" "}
          {result.data.available ? "사용할 수 있어요." : "이미 사용 중이에요."}
          <ResponseJson data={result.data} />
        </p>
      )}
      {result.status === "error" && (
        <p role="alert" className="mt-3 text-sm font-medium text-danger">
          {getServerErrorMessage(result.error)}
        </p>
      )}
    </Section>
  );
}

function MemberRatings() {
  const [memberIdText, setMemberIdText] = useState("1");
  const [query, setQuery] = useState<{ memberId: number; page: number } | null>(
    null,
  );

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const memberId = Number(memberIdText);
    if (Number.isInteger(memberId) && memberId > 0) {
      setQuery({ memberId, page: 0 });
    }
  }

  return (
    <Section
      title="내 평점 목록"
      endpoint={`GET /members/{memberId}/ratings?page=0&size=${RATING_PAGE_SIZE}`}
    >
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          aria-label="회원 ID"
          type="number"
          min={1}
          value={memberIdText}
          onChange={(event) => setMemberIdText(event.target.value)}
          className="h-11 w-32 rounded-md border border-border bg-surface px-3 text-sm text-ink focus:border-ink focus:outline-none"
        />
        <button
          type="submit"
          className="h-11 shrink-0 rounded-md bg-ink px-4 text-sm font-bold text-surface"
        >
          평점 불러오기
        </button>
      </form>

      {query && (
        <RatingList
          key={query.memberId}
          memberId={query.memberId}
          page={query.page}
          onPageChange={(page) => setQuery({ ...query, page })}
        />
      )}
    </Section>
  );
}

interface RatingListProps {
  memberId: number;
  page: number;
  onPageChange: (page: number) => void;
}

function RatingList({ memberId, page, onPageChange }: RatingListProps) {
  const { state, retry } = useAsync(`ratings:${memberId}:${page}`, (signal) =>
    getMemberRatings(memberId, page, RATING_PAGE_SIZE, signal),
  );

  if (state.status === "loading") {
    return <LoadingState label="평점을 불러오는 중이에요." />;
  }

  if (state.status === "error") {
    return (
      <div role="alert" className="mt-4 flex items-center gap-3">
        <p className="text-sm font-medium text-danger">
          {getServerErrorMessage(state.error)}
        </p>
        <button
          type="button"
          onClick={retry}
          className="text-sm font-bold text-ink underline"
        >
          다시 시도
        </button>
      </div>
    );
  }

  const { ratings, totalElements, totalPages } = state.data;

  return (
    <div className="mt-4">
      <p className="mb-3 text-xs text-ink-subtle">
        회원 #{memberId} · 평점 {totalElements}개 · {page + 1}/
        {Math.max(totalPages, 1)}페이지
      </p>

      {ratings.length === 0 ? (
        <p className="py-6 text-center text-sm text-ink-muted">
          아직 남긴 평점이 없어요.
        </p>
      ) : (
        <ul className="divide-y divide-border rounded-lg border border-border">
          {ratings.map((rating) => (
            <li key={rating.ratingId} className="flex gap-4 px-4 py-3">
              <span className="flex shrink-0 items-center gap-1 text-sm font-bold text-ink">
                <img src="/icons/star.svg" alt="" className="h-4 w-4" />
                {rating.score}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-ink">
                  {rating.comment || "코멘트 없음"}
                </p>
                <p className="mt-1 text-xs text-ink-subtle">
                  영화 ID {rating.movieId} ·{" "}
                  {new Date(rating.createdAt).toLocaleDateString("ko-KR")}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Pagination 컴포넌트는 1부터, 서버는 0부터 셉니다. */}
      <Pagination
        currentPage={page + 1}
        totalPages={totalPages}
        onPageChange={(nextPage) => onPageChange(nextPage - 1)}
      />
    </div>
  );
}

interface SectionProps {
  title: string;
  endpoint: string;
  children: ReactNode;
}

function Section({ title, endpoint, children }: SectionProps) {
  return (
    <section className="rounded-xl border border-border bg-surface p-6">
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-lg font-bold text-ink">{title}</h2>
        <code className="text-xs text-ink-subtle">{endpoint}</code>
      </div>
      {children}
    </section>
  );
}

function ResponseJson({ data }: { data: unknown }) {
  return (
    <code className="ml-2 rounded bg-page px-1.5 py-0.5 text-xs font-normal text-ink-muted">
      {JSON.stringify(data)}
    </code>
  );
}
