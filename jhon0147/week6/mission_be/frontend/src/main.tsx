import { StrictMode, useState } from "react";
import type { FormEvent } from "react";
import { createRoot } from "react-dom/client";
import { deleteRating, getRatings, saveRating, signUp } from "./api";
import type { HttpResult, Rating } from "./api";
import "./style.css";

function App() {
  const [email, setEmail] = useState("moviefan@umc.com");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("영화친구");
  const [memberId, setMemberId] = useState("1");
  const [movieId, setMovieId] = useState("680");
  const [score, setScore] = useState("5");
  const [comment, setComment] = useState("다시 보고 싶은 영화");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [ratings, setRatings] = useState<Rating[] | null>(null);
  const [loadedMember, setLoadedMember] = useState("");
  const [response, setResponse] = useState<HttpResult<unknown> | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function run(work: () => Promise<void>) {
    setPending(true);
    setError("");
    try { await work(); }
    catch (e) { setError(e instanceof Error ? e.message : "요청 중 오류가 발생했어요."); }
    finally { setPending(false); }
  }
  async function loadRatings(id: number) {
    const result = await getRatings(id);
    if (result.body?.isSuccess) {
      setRatings(result.body.result);
      setLoadedMember(String(id));
    } else { setRatings(null); setResponse(result); }
    return result;
  }
  function cancelEdit() { setEditingId(null); setComment(""); }
  function submitSignUp(event: FormEvent) {
    event.preventDefault();
    void run(async () => {
      const result = await signUp(email, password, nickname);
      setResponse(result);
      if (result.body?.isSuccess) {
        setPassword("");
        setMemberId(String(result.body.result.memberId));
        setRatings([]);
        setLoadedMember(String(result.body.result.memberId));
        cancelEdit();
      }
    });
  }
  function submitRating(event: FormEvent) {
    event.preventDefault();
    void run(async () => {
      const id = Number(memberId);
      const result = await saveRating(id, editingId, Number(movieId), Number(score), comment);
      setResponse(result);
      if (result.body?.isSuccess) { cancelEdit(); await loadRatings(id); }
    });
  }

  return (
    <>
      <header><div className="header-content">
        <a className="brand" href="/"><span>▶</span> UMCine</a>
        <nav><span className="active">회원과 평점</span></nav>
        <span className="header-note">영화를 보고, 나만의 기록을 남기다</span>
      </div></header>
      <main>
        <div className="page-heading"><span className="eyebrow">MY UMCINE</span>
          <h1>오늘 본 영화, 기록해 볼까요?</h1><p>회원가입 후 영화에 별점과 짧은 후기를 남겨보세요.</p>
        </div>
        <div className="checks">
          <section className="card"><span className="eyebrow">JOIN UMCINE</span><h2>회원가입</h2>
            <p className="description">닉네임은 2~12자, 비밀번호는 대·소문자, 숫자, 특수문자를 포함한 8자 이상이에요.</p>
            <form onSubmit={submitSignUp} noValidate><fieldset disabled={pending}>
              <label htmlFor="email">이메일</label>
              <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" />
              <label htmlFor="nickname">닉네임</label>
              <input id="nickname" value={nickname} onChange={e => setNickname(e.target.value)} autoComplete="nickname" />
              <label htmlFor="password">비밀번호</label>
              <input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete="new-password" />
              <button type="submit" className="full-button">회원가입</button>
            </fieldset></form>
          </section>
          <section className="card"><span className="eyebrow">MY RATING</span>
            <h2>{editingId === null ? "평점 등록" : "평점 #" + editingId + " 수정"}</h2>
            <form onSubmit={submitRating} noValidate><fieldset disabled={pending}>
              <div className="field-pair">
                <div><label htmlFor="memberId">회원 번호</label>
                  <input id="memberId" type="number" min="1" value={memberId} onChange={e => { setMemberId(e.target.value); setRatings(null); cancelEdit(); }} /></div>
                <div><label htmlFor="movieId">영화 번호</label>
                  <input id="movieId" type="number" min="1" value={movieId} disabled={editingId !== null} onChange={e => setMovieId(e.target.value)} /></div>
              </div>
              <label htmlFor="score">별점 (1~5)</label>
              <input id="score" type="number" min="1" max="5" step="1" value={score} onChange={e => setScore(e.target.value)} />
              <label htmlFor="comment">한줄평</label>
              <textarea id="comment" rows={3} value={comment} onChange={e => setComment(e.target.value)} />
              <div className="actions"><button type="submit">{editingId === null ? "평점 등록" : "수정 저장"}</button>
                {editingId !== null && <button type="button" className="secondary" onClick={cancelEdit}>취소</button>}</div>
            </fieldset></form>
          </section>
        </div>
        <section className="card rating-section">
          <div className="section-heading"><div><span className="eyebrow">MY MOVIE LOG</span><h2>남긴 평점</h2>
            <p className="description">현재 입력한 회원 번호로 평점을 불러와요.</p></div>
            <button type="button" disabled={pending} onClick={() => void run(async () => {
              const result = await loadRatings(Number(memberId)); setResponse(result);
            })}>평점 조회</button></div>
          {ratings === null ? <div className="empty">회원 번호를 입력하고 평점을 조회해주세요.</div> : <>
            <p className="result-count">회원 {loadedMember}의 평점 <strong>{ratings.length}건</strong></p>
            {ratings.length === 0 ? <div className="empty">아직 등록한 평점이 없어요.</div> : <ul className="ratings">
              {ratings.map(rating => <li className="rating" key={rating.ratingId}>
                <div className="movie-mark" aria-hidden="true">▶</div>
                <div className="rating-content"><div className="rating-title"><h3>영화 #{rating.movieId}</h3><span className="score">★ {rating.score} / 5</span></div>
                  <p>{rating.comment || "작성한 후기가 없어요."}</p>
                  <div className="actions"><button type="button" className="secondary" disabled={pending} onClick={() => {
                    setEditingId(rating.ratingId); setMovieId(String(rating.movieId)); setScore(String(rating.score)); setComment(rating.comment ?? "");
                  }}>수정</button><button type="button" className="danger" disabled={pending} onClick={() => void run(async () => {
                    const result = await deleteRating(Number(memberId), rating.ratingId); setResponse(result);
                    if (result.status === 204) { cancelEdit(); await loadRatings(Number(memberId)); }
                  })}>삭제</button></div>
                </div>
              </li>)}
            </ul>}
          </>}
        </section>
        <section className="card response-section" aria-live="polite"><h2>요청 결과</h2>
          {pending && <p className="description">요청을 처리하고 있어요.</p>}
          {error && <p className="error" role="alert">{error}</p>}
          {response ? <>
            <p className="request-line"><code>{response.method} {response.path}</code><strong className={response.status < 400 ? "success" : "error"}>HTTP {response.status}</strong></p>
            <pre>{response.body === null ? "응답 본문 없음 (204 No Content)" : JSON.stringify(response.body, null, 2)}</pre>
          </> : <p className="description">요청을 보내면 상태 코드와 응답을 확인할 수 있어요.</p>}
        </section>
      </main>
      <footer>UMCine · 영화와 나의 취향을 잇는 공간</footer>
    </>
  );
}
createRoot(document.getElementById("root")!).render(<StrictMode><App /></StrictMode>);
