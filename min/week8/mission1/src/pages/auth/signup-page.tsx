import { useState, type FormEvent } from "react";
import { checkEmailDuplicate } from "../../api/members/check-email-duplicate";
import { checkNicknameDuplicate } from "../../api/members/check-nickname-duplicate";
import { signup } from "../../api/members/signup";
import { apiErrorMessage } from "../../api/api-client";

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/;
type CheckKey = "email" | "nickname";
const emptyCheck = { checking: false, available: false, message: "" };

export function SignupPage() {
  const [form, setForm] = useState({ email: "", nickname: "", password: "", passwordConfirm: "" });
  const [checks, setChecks] = useState({ email: emptyCheck, nickname: emptyCheck });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const valid = {
    email: EMAIL_REGEX.test(form.email.trim()),
    nickname: form.nickname.trim().length >= 2 && form.nickname.trim().length <= 12,
    password: PASSWORD_REGEX.test(form.password),
    passwordConfirm: !!form.passwordConfirm && form.password === form.passwordConfirm,
  };
  const canSubmit = Object.values(valid).every(Boolean) && checks.email.available && checks.nickname.available;
  function change(key: keyof typeof form, value: string) {
    setForm(prev => ({ ...prev, [key]: value }));
    setError("");
    if (key === "email" || key === "nickname") setChecks(prev => ({ ...prev, [key]: emptyCheck }));
  }
  async function check(key: CheckKey) {
    if (!valid[key] || checks[key].checking || submitting) return;
    setChecks(prev => ({ ...prev, [key]: { ...emptyCheck, checking: true } }));
    const label = key === "email" ? "이메일" : "닉네임";
    try {
      const response = await (key === "email" ? checkEmailDuplicate(form.email.trim()) : checkNicknameDuplicate(form.nickname.trim()));
      const message = response.available ? `사용할 수 있는 ${label}이에요.` : `이미 사용 중인 ${label}이에요.`;
      setChecks(prev => ({ ...prev, [key]: { checking: false, available: response.available, message } }));
      window.alert(message);
    } catch {
      const message = "중복 확인에 실패했어요. 회원 서버 연결을 확인하고 다시 시도해 주세요.";
      setChecks(prev => ({ ...prev, [key]: { ...emptyCheck, message } }));
      window.alert(message);
    }
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    try {
      const response = await signup({ email: form.email.trim(), nickname: form.nickname.trim(), password: form.password });
      if (!response.isSuccess) { setError(response.message || "회원가입에 실패했어요."); return; }
      window.alert(response.message || "회원가입이 완료되었어요.");
      location.assign("/login");
    } catch (error) { setError(await apiErrorMessage(error)); }
    finally { setSubmitting(false); }
  }
  return <main className="auth-layout"><section className="auth-panel"><h1>회원가입</h1>
    <form onSubmit={submit} noValidate>
      {(["email", "nickname"] as const).map(key => <div className="form-field" key={key}>
        <label htmlFor={key}>{key === "email" ? "이메일" : "닉네임"}</label>
        <div className={`input-shell ${form[key] && !valid[key] ? "invalid" : ""}`}>
          <input id={key} type={key === "email" ? "email" : "text"} autoComplete={key === "email" ? "email" : "nickname"} value={form[key]} placeholder={key === "email" ? "name@example.com" : "2–12자"} disabled={checks[key].checking || submitting} onChange={e => change(key, e.target.value)} aria-invalid={!!form[key] && !valid[key]} aria-describedby={`${key}-message`} />
          <button type="button" className="check-button" disabled={!valid[key] || checks[key].checking || submitting} onClick={() => check(key)}>{checks[key].checking ? "확인 중" : "중복 확인"}</button>
        </div>
        <p id={`${key}-message`} className={`field-message ${checks[key].available ? "success" : "error"}`} aria-live="polite">{form[key] && !valid[key] ? key === "email" ? "올바른 이메일 형식으로 입력해 주세요." : "닉네임은 2–12자로 입력해 주세요." : checks[key].message}</p>
      </div>)}
      <div className="form-field"><label htmlFor="password">비밀번호</label><div className={`input-shell ${form.password && !valid.password ? "invalid" : ""}`}><input id="password" type="password" autoComplete="new-password" placeholder="8자 이상" value={form.password} disabled={submitting} onChange={e => change("password", e.target.value)} aria-describedby="password-help" aria-invalid={!!form.password && !valid.password} /></div><p id="password-help" className={`field-message ${form.password && !valid.password ? "error" : ""}`}>영문 대·소문자, 숫자, 특수문자(!@#$%^&*)를 모두 포함해 8자 이상 입력해 주세요.</p></div>
      <div className="form-field"><label htmlFor="passwordConfirm">비밀번호 확인</label><div className={`input-shell ${form.passwordConfirm && !valid.passwordConfirm ? "invalid" : ""}`}><input id="passwordConfirm" type="password" autoComplete="new-password" placeholder="다시 입력" value={form.passwordConfirm} disabled={submitting} onChange={e => change("passwordConfirm", e.target.value)} aria-invalid={!!form.passwordConfirm && !valid.passwordConfirm} aria-describedby="confirm-message" /></div><p id="confirm-message" className="field-message error">{form.passwordConfirm && !valid.passwordConfirm ? "비밀번호가 일치하지 않아요." : ""}</p></div>
      {error && <p className="form-error" role="alert">{error}</p>}
      <button className="primary-button full-width" disabled={!canSubmit || submitting}>{submitting ? "가입 중" : "가입하기"}</button>
    </form><p className="auth-switch">이미 계정이 있나요? <a href="/login">로그인</a></p>
  </section></main>;
}
