import { Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent, type ReactNode } from "react";
import { checkEmailDuplicate } from "../../api/members/check-email-duplicate";
import { checkNicknameDuplicate } from "../../api/members/check-nickname-duplicate";
import { signup } from "../../api/members/signup";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/;
const DEFAULT_FORM = { email: "", nickname: "", password: "", passwordConfirm: "" };
const DEFAULT_DUPLICATE_CHECK = { isChecking: false, isAvailable: false };

type FormKey = keyof typeof DEFAULT_FORM;
type DuplicateCheckKey = "email" | "nickname";

export function SignupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(DEFAULT_FORM);
  const [duplicateCheck, setDuplicateCheck] = useState({ email: DEFAULT_DUPLICATE_CHECK, nickname: DEFAULT_DUPLICATE_CHECK });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notice, setNotice] = useState("");

  const isEmailValid = EMAIL_REGEX.test(form.email.trim());
  const isNicknameValid = form.nickname.trim().length >= 2 && form.nickname.trim().length <= 12;
  const isPasswordValid = PASSWORD_REGEX.test(form.password);
  const isPasswordConfirmValid = form.passwordConfirm.length > 0 && form.password === form.passwordConfirm;
  const isFormValid = isEmailValid && isNicknameValid && isPasswordValid && isPasswordConfirmValid;
  const canSubmit = isFormValid && duplicateCheck.email.isAvailable && duplicateCheck.nickname.isAvailable;

  const handleChangeField = (key: FormKey, value: string) => {
    if ((key === "email" || key === "nickname") && !duplicateCheck[key].isChecking) {
      setDuplicateCheck((previous) => ({ ...previous, [key]: DEFAULT_DUPLICATE_CHECK }));
    }
    setForm((previous) => ({ ...previous, [key]: value }));
    setNotice("");
  };

  const handleCheckDuplicate = async (key: DuplicateCheckKey) => {
    const isValid = key === "email" ? isEmailValid : isNicknameValid;
    if (!isValid || duplicateCheck[key].isChecking) return;
    const label = key === "email" ? "이메일" : "닉네임";
    setNotice("");
    setDuplicateCheck((previous) => ({ ...previous, [key]: { isChecking: true, isAvailable: false } }));
    try {
      const response = key === "email" ? await checkEmailDuplicate(form.email.trim()) : await checkNicknameDuplicate(form.nickname.trim());
      setDuplicateCheck((previous) => ({ ...previous, [key]: { ...previous[key], isAvailable: response.available } }));
      setNotice(response.available ? `사용할 수 있는 ${label}이에요.` : `이미 사용 중인 ${label}이에요.`);
    } catch {
      setNotice("중복 확인에 실패했어요. 서버가 실행 중인지 확인해 주세요.");
    } finally {
      setDuplicateCheck((previous) => ({ ...previous, [key]: { ...previous[key], isChecking: false } }));
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit || isSubmitting) return;
    setIsSubmitting(true);
    setNotice("");
    try {
      const response = await signup({ email: form.email.trim(), nickname: form.nickname.trim(), password: form.password });
      setNotice(response.message);
      if (response.isSuccess) window.setTimeout(() => navigate({ to: "/login" }), 800);
    } catch {
      setNotice("회원가입에 실패했어요. 다시 시도해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return <main className="mx-auto w-[min(520px,calc(100%-48px))] py-14 pb-24"><section className="rounded-2xl border border-zinc-200 bg-white p-7 shadow-sm sm:p-10"><p className="text-xs font-bold tracking-[0.16em] text-zinc-400">CREATE ACCOUNT</p><h1 className="mt-3 text-3xl font-bold tracking-[-1.2px] text-zinc-950">회원가입</h1><p className="mt-2 text-sm text-zinc-500">UMCine의 새로운 회원이 되어 보세요.</p><form className="mt-8 space-y-5" onSubmit={handleSubmit} noValidate><Field label="이메일" type="email" value={form.email} placeholder="umc@example.com" error={form.email.length > 0 && !isEmailValid ? "올바른 이메일 형식을 입력해 주세요." : ""} disabled={duplicateCheck.email.isChecking} onChange={(value) => handleChangeField("email", value)} action={<DuplicateButton field="email" valid={isEmailValid} checking={duplicateCheck.email.isChecking} available={duplicateCheck.email.isAvailable} onClick={handleCheckDuplicate} />} /><Field label="닉네임" value={form.nickname} placeholder="2~12자로 입력해 주세요" error={form.nickname.length > 0 && !isNicknameValid ? "닉네임은 2~12자로 입력해 주세요." : ""} disabled={duplicateCheck.nickname.isChecking} onChange={(value) => handleChangeField("nickname", value)} action={<DuplicateButton field="nickname" valid={isNicknameValid} checking={duplicateCheck.nickname.isChecking} available={duplicateCheck.nickname.isAvailable} onClick={handleCheckDuplicate} />} /><Field label="비밀번호" type="password" value={form.password} placeholder="영문 대·소문자, 숫자, 특수문자 포함 8자 이상" error={form.password.length > 0 && !isPasswordValid ? "영문 대·소문자, 숫자, 특수문자를 모두 포함해 주세요." : ""} onChange={(value) => handleChangeField("password", value)} /><Field label="비밀번호 확인" type="password" value={form.passwordConfirm} placeholder="비밀번호를 한 번 더 입력해 주세요" error={form.passwordConfirm.length > 0 && !isPasswordConfirmValid ? "비밀번호가 일치하지 않아요." : ""} onChange={(value) => handleChangeField("passwordConfirm", value)} />{notice && <p className="rounded-lg bg-zinc-100 px-4 py-3 text-sm text-zinc-700" role="status">{notice}</p>}<button type="submit" disabled={!canSubmit || isSubmitting} className="h-12 w-full rounded-lg bg-zinc-950 text-sm font-bold text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:bg-zinc-300">{isSubmitting ? "가입 중" : "가입하기"}</button></form><p className="mt-6 text-center text-sm text-zinc-500">이미 회원이신가요? <Link to="/login" className="font-bold text-zinc-900 underline underline-offset-4">로그인</Link></p></section></main>;
}

interface FieldProps { label: string; type?: "email" | "password" | "text"; value: string; placeholder: string; error?: string; disabled?: boolean; onChange: (value: string) => void; action?: ReactNode; }
function Field({ label, type = "text", value, placeholder, error, disabled, onChange, action }: FieldProps) { return <label className="block text-sm font-semibold text-zinc-800"><span>{label}</span><span className="mt-2 flex gap-2"><input type={type} value={value} placeholder={placeholder} disabled={disabled} onChange={(event) => onChange(event.target.value)} className="h-12 min-w-0 flex-1 rounded-lg border border-zinc-300 px-4 text-sm font-normal outline-none transition focus:border-zinc-900 disabled:bg-zinc-100" />{action}</span>{error && <span className="mt-1.5 block text-xs font-medium text-red-600">{error}</span>}</label>; }

function DuplicateButton({ field, valid, checking, available, onClick }: { field: DuplicateCheckKey; valid: boolean; checking: boolean; available: boolean; onClick: (key: DuplicateCheckKey) => void }) { return <button type="button" disabled={!valid || checking} onClick={() => onClick(field)} className="shrink-0 rounded-lg border border-zinc-300 px-3 text-xs font-bold text-zinc-700 hover:bg-zinc-100 disabled:cursor-not-allowed disabled:text-zinc-400">{checking ? "확인 중" : available ? "확인 완료" : "중복 확인"}</button>; }
