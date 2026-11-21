import { Link } from '@tanstack/react-router'
import { FormField } from '../../components/form-field'
import { useSignup } from '../../hooks/use-signup'

export function SignupPage() {
  const state = useSignup()
  const errors = {
    email: '이메일 형식을 확인해 주세요.', nickname: '닉네임은 2–12자로 입력해 주세요.',
    password: '대문자·소문자·숫자·특수문자(!@#$%^&*)를 포함한 8–72자만 사용할 수 있어요.', passwordConfirm: '비밀번호가 일치하지 않아요.',
  }
  const error = (field: keyof typeof errors) => state.touched[field] && !state.validity[field] ? errors[field] : undefined
  const duplicateButton = (field: 'email' | 'nickname') => <button className="whitespace-nowrap text-xs font-extrabold text-[#2563eb] disabled:cursor-not-allowed disabled:opacity-40" type="button" disabled={!state.validity[field] || state.duplicates[field].isChecking || state.isSubmitting} onClick={() => void state.check(field)}>{state.duplicates[field].isChecking ? '확인 중' : state.duplicates[field].isAvailable ? '확인 완료' : '중복 확인'}</button>
  return <main className="flex flex-1 items-center justify-center px-6 py-12" id="main-content"><form noValidate className="flex w-[430px] max-w-full flex-col gap-4" onSubmit={state.submit} aria-busy={state.isSubmitting}>
    <h1 className="text-[34px] leading-[41px] font-bold tracking-[-1.53px]">회원가입</h1>
    <FormField id="signup-email" label="이메일" type="email" autoComplete="email" placeholder="name@example.com" required value={state.form.email} onChange={event => state.change('email', event.target.value)} disabled={state.isSubmitting || state.duplicates.email.isChecking} error={error('email')} action={duplicateButton('email')} />
    <FormField id="signup-nickname" label="닉네임" autoComplete="nickname" placeholder="2–12자" required value={state.form.nickname} onChange={event => state.change('nickname', event.target.value)} disabled={state.isSubmitting || state.duplicates.nickname.isChecking} error={error('nickname')} action={duplicateButton('nickname')} />
    <FormField id="signup-password" label="비밀번호" type="password" autoComplete="new-password" placeholder="8자 이상" required value={state.form.password} onChange={event => state.change('password', event.target.value)} disabled={state.isSubmitting} error={error('password')} hint="영문 대·소문자, 숫자, 특수문자(!@#$%^&*)를 모두 포함해 8–72자로 입력해 주세요" />
    <FormField id="signup-password-confirm" label="비밀번호 확인" type="password" autoComplete="new-password" placeholder="다시 입력" required value={state.form.passwordConfirm} onChange={event => state.change('passwordConfirm', event.target.value)} disabled={state.isSubmitting} error={error('passwordConfirm')} />
    {state.message && <p className="text-[13px] leading-5 text-[#2563eb]" role="status">{state.message}</p>}
    <button className="inline-flex h-12 items-center justify-center rounded-lg bg-[#2563eb] px-4 text-sm font-extrabold text-white disabled:cursor-not-allowed disabled:opacity-40" type="submit" disabled={!state.canSubmit || state.isSubmitting}>{state.isSubmitting ? '가입 중' : '가입하기'}</button>
    <p className="pt-1 text-center text-[13px] text-[#606774]">이미 계정이 있나요? <Link className="text-xs font-extrabold text-[#2563eb]" to="/login">로그인</Link></p>
  </form></main>
}
