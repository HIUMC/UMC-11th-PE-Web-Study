import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAuthStore } from "../../stores/auth-store";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const iconBase = "/icons/movie-icons/movie-icons";

export function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const canSubmit = EMAIL_REGEX.test(email.trim()) && password.length > 0;

  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) return;
    login(email.trim());
    await navigate({ to: "/" });
  };

  return (
    <main className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-[#F7F8FA] px-5 py-16">
      <section className="w-full max-w-[400px]">
        <h1 className="mb-5 text-[30px] font-bold tracking-[-0.04em] text-[#191D23]">로그인</h1>
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <label htmlFor="login-email" className="mb-2 block text-sm font-semibold text-[#191D23]">이메일</label>
            <div className="flex h-12 items-center rounded-lg border border-[#DCE1E8] bg-white px-4 focus-within:border-[#2F6FED] focus-within:ring-1 focus-within:ring-[#2F6FED]">
              <img src={`${iconBase}/mail.svg`} alt="" className="mr-2 h-4 w-4 opacity-45" />
              <input id="login-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="name@example.com" autoComplete="email" className="min-w-0 flex-1 bg-transparent text-sm text-[#191D23] outline-none placeholder:text-[#A7ADB7]" />
            </div>
          </div>
          <div>
            <label htmlFor="login-password" className="mb-2 block text-sm font-semibold text-[#191D23]">비밀번호</label>
            <div className="flex h-12 items-center rounded-lg border border-[#DCE1E8] bg-white px-4 focus-within:border-[#2F6FED] focus-within:ring-1 focus-within:ring-[#2F6FED]">
              <img src={`${iconBase}/lock.svg`} alt="" className="mr-2 h-4 w-4 opacity-45" />
              <input id="login-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="비밀번호" autoComplete="current-password" className="min-w-0 flex-1 bg-transparent text-sm text-[#191D23] outline-none placeholder:text-[#A7ADB7]" />
            </div>
          </div>
          <button type="submit" disabled={!canSubmit} className="h-12 w-full rounded-lg bg-[#2F6FED] text-sm font-bold text-white transition hover:bg-[#245DCD] disabled:cursor-not-allowed disabled:opacity-50">로그인</button>
        </form>
        <p className="mt-5 text-center text-xs text-[#8A929E]">가입이 아직인가요?{" "}<Link to="/signup" className="font-bold text-[#2F6FED] hover:underline">회원가입</Link></p>
      </section>
    </main>
  );
}
