import { StrictMode, useState } from "react";
import type { FormEvent } from "react";
import { createRoot } from "react-dom/client";
import { checkEmail, checkNickname, getMemberRatings } from "./api";
import type { CheckResponse, RatingResponse } from "./api";
import "./style.css";

function CheckForm({ kind, initialValue, check }: {
  kind: "닉네임" | "이메일";
  initialValue: string;
  check: (value: string) => Promise<CheckResponse>;
}) {
  const [value, setValue] = useState(initialValue);
  const [available, setAvailable] = useState<boolean | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault();
    setAvailable(null);
    setError("");
    const query = value.trim();
    if (!query) {
      setError(kind + "을 입력해 주세요.");
      return;
    }
    setPending(true);
    try {
      const data = await check(query);
      setAvailable(data.available);
    } catch (e) {
      setError(e instanceof Error ? e.message : "확인 중 오류가 발생했어요.");
    } finally {
      setPending(false);
    }
  }

  const id = kind === "닉네임" ? "nickname" : "email";

  return (
    <section className="card">
      <span className="eyebrow">회원 정보</span>
      <h2>{kind} 중복 확인</h2>
      <p className="description">가입 전에 사용할 {kind}인지 확인해 보세요.</p>
      <form onSubmit={submit}>
        <label htmlFor={id}>{kind}</label>
        <div className="input-row">
          <input id={id} type={id === "email" ? "email" : "text"} value={value}
            disabled={pending} required autoComplete="off"
            onChange={(e) => { setValue(e.target.value); setAvailable(null); setError(""); }} />
          <button type="submit" disabled={pending}>
            {pending ? "확인 중…" : "중복 확인"}
          </button>
        </div>
      </form>
      <div className="feedback" aria-live="polite">
        {available !== null && (
          <p className={available ? "success" : "notice"}>
            {available ? "사용할 수 있는 " + kind + "입니다." : "이미 사용 중인 " + kind + "입니다."}
          </p>
        )}
        {error && <p className="error" role="alert">{error}</p>}
      </div>
    </section>
  );
}

function Ratings() {
  const [memberId, setMemberId] = useState("1");
  const [loadedMember, setLoadedMember] = useState("");
  const [ratings, setRatings] = useState<RatingResponse[] | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault();
    setRatings(null);
    setError("");
    const id = Number(memberId);
    if (!Number.isSafeInteger(id) || id <= 0) {
      setError("회원 번호는 1 이상의 정수로 입력해 주세요.");
      return;
    }
    setPending(true);
    try {
      const data = await getMemberRatings(id);
      setRatings(data);
      setLoadedMember(String(id));
    } catch (e) {
      setError(e instanceof Error ? e.message : "평점을 불러오지 못했어요.");
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="card rating-section">
      <div className="section-heading">
        <div>
          <span className="eyebrow">나의 영화 기록</span>
          <h2>회원별 평점 조회</h2>
          <p className="description">회원이 남긴 별점과 한줄평을 모아 보세요.</p>
        </div>
        <span className="badge">최근 등록 순</span>
      </div>
      <form className="member-form" onSubmit={submit}>
        <label htmlFor="memberId">회원 번호</label>
        <div className="input-row">
          <input id="memberId" type="number" min="1" step="1" value={memberId}
            disabled={pending} required
            onChange={(e) => { setMemberId(e.target.value); setRatings(null); setError(""); }} />
          <button type="submit" disabled={pending}>{pending ? "불러오는 중…" : "평점 조회"}</button>
        </div>
      </form>
      <div aria-live="polite">
        {error && <p className="error" role="alert">{error}</p>}
        {ratings === null && !error && !pending && (
          <div className="empty">회원 번호를 입력하면 영화 기록을 볼 수 있어요.</div>
        )}
        {ratings !== null && (
          <>
            <p className="result-count">회원 {loadedMember}의 평점 <strong>{ratings.length}건</strong></p>
            {ratings.length === 0 ? (
              <div className="empty">아직 등록한 평점이 없어요.</div>
            ) : (
              <ul className="ratings">
                {ratings.map((rating) => (
                  <li className="rating" key={rating.ratingId}>
                    <div className="movie-mark" aria-hidden="true">▸</div>
                    <div className="rating-content">
                      <div className="rating-title">
                        <h3>영화 #{rating.movieId}</h3>
                        <span className="score" aria-label={"5점 중 " + rating.score + "점"}>★ {rating.score} / 5</span>
                      </div>
                      <p>{rating.comment || "작성한 코멘트가 없습니다."}</p>
                      <time dateTime={rating.createdAt}>등록 {rating.createdAt.replace("T", " ").slice(0, 19)}</time>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </section>
  );
}

function App() {
  return (
    <>
      <header><div className="header-content">
        <a className="brand" href="/" aria-label="UMCine 홈"><span>▶</span> UMCine</a>
        <nav aria-label="현재 메뉴"><span className="active">회원과 평점</span></nav>
        <span className="header-note">영화를 보고, 나만의 기록을 남기다</span>
      </div></header>
      <main>
        <div className="page-heading">
          <span className="eyebrow">MY UMCINE</span>
          <h1>내 영화 기록의 시작</h1>
          <p>회원 정보를 확인하고, 남겨 둔 영화 평점을 찾아보세요.</p>
        </div>
        <div className="checks">
          <CheckForm kind="닉네임" initialValue="수현" check={checkNickname} />
          <CheckForm kind="이메일" initialValue="noco@umc.com" check={checkEmail} />
        </div>
        <Ratings />
      </main>
      <footer>UMCine · 영화와 나의 취향을 잇는 공간</footer>
    </>
  );
}

createRoot(document.getElementById("root")!).render(<StrictMode><App /></StrictMode>);
