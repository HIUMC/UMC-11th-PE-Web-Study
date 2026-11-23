import { Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { checkEmailDuplicate } from "../../api/members/check-email-duplicate";
import { checkNicknameDuplicate } from "../../api/members/check-nickname-duplicate";
import { useSignupMutation } from "../../hooks/use-signup-mutation";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/;

export function SignupPage() {
  const [form, setForm] = useState({ email: "", nickname: "", password: "", passwordConfirm: "" });
  const [emailAvailable, setEmailAvailable] = useState(false);
  const [nicknameAvailable, setNicknameAvailable] = useState(false);
  const [notice, setNotice] = useState("");
  const signupMutation = useSignupMutation();
  const canSubmit = EMAIL_REGEX.test(form.email.trim()) && form.nickname.trim().length >= 2 && form.nickname.trim().length <= 12 && PASSWORD_REGEX.test(form.password) && form.password === form.passwordConfirm && emailAvailable && nicknameAvailable;

  const change = (key: keyof typeof form, value: string) => { setForm((previous) => ({ ...previous, [key]: value })); if (key === "email") setEmailAvailable(false); if (key === "nickname") setNicknameAvailable(false); };
  const checkEmail = async () => { if (!EMAIL_REGEX.test(form.email.trim())) return; try { const result = await checkEmailDuplicate(form.email.trim()); setEmailAvailable(result.available); setNotice(result.available ? "사용 가능한 이메일입니다." : "이미 사용 중인 이메일입니다."); } catch { setNotice("이메일 중복 확인에 실패했어요."); } };
  const checkNickname = async () => { const nickname = form.nickname.trim(); if (nickname.length < 2 || nickname.length > 12) return; try { const result = await checkNicknameDuplicate(nickname); setNicknameAvailable(result.available); setNotice(result.available ? "사용 가능한 닉네임입니다." : "이미 사용 중인 닉네임입니다."); } catch { setNotice("닉네임 중복 확인에 실패했어요."); } };
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); if (!canSubmit || signupMutation.isPending) return; signupMutation.mutate({ email: form.email.trim(), nickname: form.nickname.trim(), password: form.password }); };

  return <main className="mx-auto w-[min(520px,calc(100%-48px))] py-14 pb-24"><section className="rounded-2xl border border-zinc-200 bg-white p-7 shadow-sm sm:p-10"><p className="text-xs font-bold tracking-[0.16em] text-zinc-400">CREATE ACCOUNT</p><h1 className="mt-3 text-3xl font-bold tracking-[-1.2px] text-zinc-950">회원가입</h1><form className="mt-8 space-y-5" onSubmit={handleSubmit} noValidate><Field label="이메일" type="email" value={form.email} onChange={(value) => change("email", value)} action="중복 확인" onAction={checkEmail} /><Field label="닉네임" value={form.nickname} onChange={(value) => change("nickname", value)} action="중복 확인" onAction={checkNickname} /><Field label="비밀번호" type="password" value={form.password} onChange={(value) => change("password", value)} /><Field label="비밀번호 확인" type="password" value={form.passwordConfirm} onChange={(value) => change("passwordConfirm", value)} />{notice && <p className="rounded-lg bg-zinc-100 px-4 py-3 text-sm" role="status">{notice}</p>}<button type="submit" disabled={!canSubmit || signupMutation.isPending} className="h-12 w-full rounded-lg bg-zinc-950 text-sm font-bold text-white disabled:bg-zinc-300">{signupMutation.isPending ? "가입 중" : "가입하기"}</button></form><p className="mt-6 text-center text-sm text-zinc-500">이미 회원이신가요? <Link to="/login" className="font-bold text-zinc-900 underline">로그인</Link></p></section></main>;
}

function Field({ label, type = "text", value, onChange, action, onAction }: { label: string; type?: "text" | "email" | "password"; value: string; onChange: (value: string) => void; action?: string; onAction?: () => void }) {
  return <label className="block text-sm font-semibold text-zinc-800"><span>{label}</span><span className="mt-2 flex gap-2"><input type={type} value={value} onChange={(event) => onChange(event.target.value)} className="h-12 min-w-0 flex-1 rounded-lg border border-zinc-300 px-4 font-normal outline-none focus:border-zinc-900" />{action && <button type="button" onClick={onAction} className="rounded-lg border border-zinc-300 px-3 text-xs">{action}</button>}</span></label>;
}
