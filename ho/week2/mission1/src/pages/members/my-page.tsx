import { Link } from "@tanstack/react-router";
import { useState, type SubmitEvent } from "react";
import { checkAvailability, getMemberErrorMessage, getMemberRatings, type MemberRating } from "../../api/members/member-api";

const inputClass = "min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-600 disabled:bg-slate-100";
const buttonClass = "shrink-0 rounded-lg bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700 disabled:cursor-wait disabled:opacity-50";

function AvailabilityForm({ field, label }: { field: "nickname" | "email"; label: string }) {
  const [value, setValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [available, setAvailable] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isLoading) return;
    const normalizedValue = value.trim();
    setAvailable(null);
    setError(null);
    if (!normalizedValue) {
      setError(`${label}을 입력해 주세요.`);
      return;
    }
    setIsLoading(true);
    try {
      const response = await checkAvailability(field, normalizedValue);
      setAvailable(response.available);
    } catch (error) {
      setError(getMemberErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6">
      <h2 className="text-xl font-bold">{label} 중복 확인</h2>
      <form onSubmit={handleSubmit} className="mt-5">
        <label htmlFor={field} className="mb-2 block text-sm font-semibold">{label}</label>
        <div className="flex gap-3">
          <input id={field} value={value} type="text" inputMode={field === "email" ? "email" : "text"}
            placeholder={field === "email" ? "예: user@example.com" : "닉네임을 입력해 주세요"}
            disabled={isLoading} className={inputClass}
            onChange={(event) => { setValue(event.target.value); setAvailable(null); setError(null); }} />
          <button type="submit" disabled={isLoading} className={buttonClass}>{isLoading ? "확인 중…" : "중복 확인"}</button>
        </div>
      </form>
      <div className="mt-4 min-h-6 text-sm" aria-live="polite">
        {isLoading ? <p role="status" className="text-slate-500">확인하고 있어요.</p>
          : error ? <p role="alert" className="text-red-600">{error}</p>
          : available !== null ? <p className={available ? "font-semibold text-green-700" : "font-semibold text-red-600"}>
            {available ? `사용 가능한 ${label}입니다.` : `이미 사용 중인 ${label}입니다.`}
          </p> : <p className="text-slate-500">{label}을 입력하고 중복 확인을 눌러 주세요.</p>}
      </div>
    </section>
  );
}

export function MyPage() {
  const [memberId, setMemberId] = useState("1");
  const [ratings, setRatings] = useState<MemberRating[]>([]);
  const [loadedMemberId, setLoadedMemberId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isLoading) return;
    setRatings([]);
    setLoadedMemberId(null);
    setError(null);
    const parsedId = Number(memberId);
    if (!Number.isSafeInteger(parsedId) || parsedId <= 0) {
      setError("회원 번호는 1 이상의 정수로 입력해 주세요.");
      return;
    }
    setIsLoading(true);
    try {
      const response = await getMemberRatings(parsedId);
      setRatings(response);
      setLoadedMemberId(parsedId);
    } catch (error) {
      setError(getMemberErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-9 lg:px-12">
      <h1 className="text-4xl font-bold tracking-[-0.04em]">내 정보</h1>
      <p className="mt-3 text-sm text-slate-500">닉네임과 이메일 사용 여부를 확인하고, 회원이 남긴 영화 평점을 조회해 보세요.</p>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <AvailabilityForm field="nickname" label="닉네임" />
        <AvailabilityForm field="email" label="이메일" />
      </div>
      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-xl font-bold">회원 평점 목록</h2>
        <p className="mt-2 text-sm text-slate-500">조회할 회원 번호를 입력해 주세요.</p>
        <form onSubmit={handleSubmit} className="mt-5 max-w-lg">
          <label htmlFor="member-id" className="mb-2 block text-sm font-semibold">회원 번호</label>
          <div className="flex gap-3">
            <input id="member-id" type="text" inputMode="numeric" value={memberId} disabled={isLoading} className={inputClass}
              onChange={(event) => { setMemberId(event.target.value); setRatings([]); setLoadedMemberId(null); setError(null); }} />
            <button type="submit" disabled={isLoading} className={buttonClass}>{isLoading ? "조회 중…" : "평점 조회"}</button>
          </div>
        </form>
        <div className="mt-6" aria-live="polite">
          {isLoading ? <p role="status" className="py-8 text-center text-slate-500">평점을 불러오고 있어요.</p>
            : error ? <p role="alert" className="py-8 text-center text-red-600">{error}</p>
            : loadedMemberId === null ? <p className="py-8 text-center text-slate-500">회원 번호로 평점을 조회해 주세요.</p>
            : <>
              <p className="mb-4 text-sm font-semibold">회원 {loadedMemberId} · 평점 {ratings.length}개</p>
              {ratings.length === 0 ? <p className="py-8 text-center text-slate-500">아직 남긴 평점이 없어요.</p>
                : <ul className="grid gap-4 md:grid-cols-2">{ratings.map((rating) => (
                  <li key={rating.ratingId} className="rounded-xl border border-slate-200 p-5">
                    <div className="flex items-center justify-between gap-3">
                      <Link to="/movies/$movieId" params={{ movieId: String(rating.movieId) }} className="font-bold hover:text-blue-600">영화 #{rating.movieId} <span aria-hidden="true">→</span></Link>
                      <span className="font-bold text-blue-600">★ {rating.score} / 5</span>
                    </div>
                    <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-6 text-slate-600">{rating.comment || "남긴 코멘트가 없어요."}</p>
                    <p className="mt-4 text-xs text-slate-400">작성: {rating.createdAt.replace("T", " ")}</p>
                    <p className="mt-1 text-xs text-slate-400">수정: {rating.updatedAt.replace("T", " ")}</p>
                  </li>
                ))}</ul>}
            </>}
        </div>
      </section>
    </main>
  );
}
