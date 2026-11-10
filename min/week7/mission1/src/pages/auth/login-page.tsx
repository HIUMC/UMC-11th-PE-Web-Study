import { useState, type FormEvent } from "react";
import { EMAIL_REGEX } from "./signup-page";
import { login } from "../../api/login";
import { apiErrorMessage } from "../../api/api-client";
import { useAuthStore } from "../../store/auth-store";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(new URLSearchParams(location.search).has("expired") ? "인증이 만료되었어요. 다시 로그인해 주세요." : "");
  const [submitting, setSubmitting] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting || !EMAIL_REGEX.test(email.trim()) || !password.trim()) return;
    setSubmitting(true);
    setMessage("");
    try {
      const response = await login(email.trim(), password);
      if (!response.isSuccess) throw new Error(response.message);
      if (!response.result.accessToken) throw new Error("서버에서 인증 토큰을 받지 못했어요.");
      useAuthStore.getState().setToken(response.result.accessToken);
      location.assign("/mypage");
    } catch (error) { setMessage(await apiErrorMessage(error)); }
    finally { setSubmitting(false); }
  }
  return <main className="auth-layout"><section className="auth-panel"><h1>로그인</h1><form onSubmit={submit} noValidate>
    <div className="form-field"><label htmlFor="login-email">이메일</label><div className="input-shell"><img src="/icons/movie-icons/mail.svg" alt="" /><input id="login-email" type="email" autoComplete="email" placeholder="name@example.com" value={email} onChange={e => setEmail(e.target.value)} /></div>{email && !EMAIL_REGEX.test(email.trim()) && <p className="field-message error">올바른 이메일 형식으로 입력해 주세요.</p>}</div>
    <div className="form-field"><label htmlFor="login-password">비밀번호</label><div className="input-shell"><img src="/icons/movie-icons/lock.svg" alt="" /><input id="login-password" type="password" autoComplete="current-password" placeholder="비밀번호" value={password} onChange={e => setPassword(e.target.value)} /></div></div>
    <button className="primary-button full-width" disabled={submitting || !EMAIL_REGEX.test(email.trim()) || !password.trim()}>{submitting ? "로그인 중…" : "로그인"}</button>
    {message && <p className="field-message error" role="alert">{message}</p>}
  </form><p className="auth-switch">처음이신가요? <a href="/signup">회원가입</a></p></section></main>;
}
