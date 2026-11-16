import { useState, type SubmitEvent } from "react";
import { cn } from "../../utils/cn";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface LoginForm {
  email: string;
  password: string;
}

export function LoginPage() {
  const [form, setForm] = useState<LoginForm>({ email: "", password: "" });
  const [touched, setTouched] = useState({ email: false, password: false });
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);

  const isEmailValid = EMAIL_REGEX.test(form.email);
  const isPasswordValid = form.password.length >= 8;
  const isFormValid = isEmailValid && isPasswordValid;

  const showEmailError = touched.email && !isEmailValid;
  const showPasswordError = touched.password && !isPasswordValid;

  const handleChangeField = (field: keyof LoginForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setSubmittedEmail(null);
  };

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setTouched({ email: true, password: true });
    if (!isFormValid) return;

    // 퍼블리싱 단계라 API 대신 입력값이 반영되는지만 보여줘요.
    setSubmittedEmail(form.email);
  };

  return (
    <main className="auth-page">
      <section className="auth-card" aria-labelledby="login-title">
        <p className="eyebrow">UMCINE ACCOUNT</p>
        <h1 id="login-title">로그인</h1>
        <p className="page-description">이메일과 비밀번호로 UMCine에 로그인하세요.</p>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="form-field">
            <label htmlFor="login-email">이메일</label>
            <div className={cn("input-box", showEmailError && "invalid")}>
              <img src="/icons/mail.svg" alt="" />
              <input
                id="login-email"
                type="email"
                value={form.email}
                onChange={(event) => handleChangeField("email", event.target.value)}
                onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
                placeholder="example@umc.com"
                autoComplete="email"
              />
            </div>
            {showEmailError && <p className="field-error">올바른 이메일 형식이 아니에요.</p>}
          </div>

          <div className="form-field">
            <label htmlFor="login-password">비밀번호</label>
            <div className={cn("input-box", showPasswordError && "invalid")}>
              <img src="/icons/lock.svg" alt="" />
              <input
                id="login-password"
                type={isPasswordVisible ? "text" : "password"}
                value={form.password}
                onChange={(event) => handleChangeField("password", event.target.value)}
                onBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
                placeholder="비밀번호를 입력하세요"
                autoComplete="current-password"
              />
              <button
                type="button"
                className="input-text-button"
                onClick={() => setIsPasswordVisible((prev) => !prev)}
              >
                {isPasswordVisible ? "숨기기" : "보기"}
              </button>
            </div>
            {showPasswordError && <p className="field-error">비밀번호는 8자 이상이에요.</p>}
          </div>

          <button className="primary-button" type="submit" disabled={!isFormValid}>
            로그인
          </button>
        </form>

        {submittedEmail && (
          <p className="form-result" role="status">
            <strong>{submittedEmail}</strong> 계정으로 로그인 요청을 보냈어요.
          </p>
        )}

        <p className="auth-footer">
          아직 회원이 아니신가요? <a href="/signup">회원가입</a>
        </p>
      </section>
    </main>
  );
}

export default LoginPage;
